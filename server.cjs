// server.cjs - CZĘŚĆ 1
require("dotenv").config({ path: ".env.local" });
const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");
const { Resend } = require("resend");
const http = require("http");
const https = require("https");
const fs = require("fs");
const path = require("path");
const { Pool } = require("pg");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const crypto = require("crypto"); // Potrzebne do generowania haseł i tokenów

const app = express();
app.use(cors());
app.use(express.json());

// --- KONFIGURACJA MULTER (UPLOAD PLIKÓW) ---
const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); 
  },
  filename: (req, file, cb) => {
    // Unikalna nazwa pliku: DATA-LOSOWE-OryginalnaNazwa
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage });

// Konfiguracja OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Konfiguracja Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// Konfiguracja Bazy Danych (PostgreSQL)
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: false 
});

// Funkcja inicjalizująca bazę danych
async function initDB() {
  try {
    const client = await pool.connect();
    console.log("✅ Połączono z bazą danych PostgreSQL!");
    
    // Tabela leads
    await client.query(`
      CREATE TABLE IF NOT EXISTS leads (
        id SERIAL PRIMARY KEY,
        name TEXT,
        company TEXT,
        email TEXT,
        phone TEXT,
        need TEXT,
        summary TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    // Tabela users (z NIP, Adminem i Reset Tokenem)
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        company_name TEXT,
        nip TEXT,
        is_admin BOOLEAN DEFAULT FALSE,
        reset_token TEXT,
        reset_token_expires BIGINT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Tabela documents
    await client.query(`
      CREATE TABLE IF NOT EXISTS documents (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        type TEXT NOT NULL, 
        title TEXT NOT NULL,
        filename TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Tabela services (NOWOŚĆ - Dodana w tym kroku)
    await client.query(`
      CREATE TABLE IF NOT EXISTS services (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        name TEXT NOT NULL,
        description TEXT,
        status TEXT DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log("✅ Wszystkie tabele (leads, users, documents, services) zweryfikowane.");
    client.release();
  } catch (err) {
    console.error("❌ Błąd połączenia z bazą danych:", err.message);
  }
}

initDB();

// --- MIDDLEWARE: Weryfikacja Tokena ---
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: "Brak dostępu (brak tokena)" });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Brak dostępu (nieprawidłowy token)" });
    req.user = user;
    next();
  });
};

// ==========================================
// PROMPT SYSTEMOWY (PEŁNY)
// ==========================================
const SYSTEM_PROMPT = `
Jesteś spokojnym, konkretnym konsultantem na stronie Inteli-IT (Business Automation & AI), a nie trenerem ani blogerem technicznym.

Główna rola:
- Pokazujesz, CO Inteli-IT może zrobić za klienta i DLACZEGO to ma sens.
- Nie uczysz klienta krok po kroku, jak sam ma wdrożyć automatyzację – raczej sugerujesz, że to Inteli-IT może to zrealizować.
- Dążysz do tego, żeby klient zostawił dane kontaktowe i krótki opis potrzeby.

Styl:
- Krótkie wiadomości: zwykle 2–4 zdania.
- Język prosty, ludzki, bez korpo-bełkotu i marketingowych sloganów.
- Zero metafor typu „zamiast tego…”, zero żartów z dat, zegarków itp.
- Nie wymyślaj rzeczy, co do których nie masz pewności (np. aktualnej daty, godzin, bieżącego roku). Jeśli ktoś pyta o bieżący dzień, godzinę albo rok – powiedz wprost, że nie masz dostępu do aktualnego czasu i żeby sprawdził na swoim urządzeniu.

Pytania o automatyzację / narzędzia:
- Najpierw krótko dopytaj o kontekst: branża, z jakich systemów korzysta (np. sklep, Fakturownia, Excel, Allegro, BaseLinker itp.), co najbardziej go boli.
- Potem opisz 1–2 konkretne kierunki rozwiązania na poziomie biznesowym (co można zautomatyzować, jakie będą efekty), bez wchodzenia w szczegółowy kod czy konfigurację.
- Jeśli użytkownik prosi „jak to zrobić samemu”, możesz w 1–2 zdaniach ogólnie opisać podejście, ale wyraź, że Inteli-IT specjalizuje się w tym, żeby wdrożyć to za klienta.

Lead / oferta:
- Gdy ktoś pisze „chcę ofertę”, „zróbcie to za mnie”, „potrzebuję takiej automatyzacji”, „chcę z Wami pogadać”, przełącz się w tryb zbierania danych.
- Twoim celem jest delikatnie, ale konkretnie poprosić maksymalnie o cztery rzeczy:
  1) imię (lub imię i nazwisko),
  2) nazwa firmy,
  3) adres e-mail,
  4) nr tel.,
  5) 1–3 zdania, co dokładnie chce zautomatyzować.
- Jeśli brakuje któregoś elementu, możesz poprosić o doprecyzowanie, ale bez męczenia użytkownika tym samym pytaniem wiele razy.
- Kiedy masz już imię, firmę, e-mail i opis potrzeby, nie dopytuj o więcej danych technicznych. Zrób krótkie podsumowanie i powiedz, że:
  - zespół Inteli-IT może przygotować propozycję,
  - rozmowa może zostać przekazana do zespołu (co dzieje się po stronie systemu).

Pytania niezwiązane z automatyzacją (np. „która jest godzina”, „jaki jest dziś dzień”, „jaki jest teraz rok”):
- Odpowiadasz krótko, że nie masz dostępu do aktualnych danych czasu/kalendarza i nie zgadujesz.
- Możesz dodać jedno zdanie: że Twoją główną rolą jest pomoc w tematach automatyzacji i AI w biznesie.

Granice:
- Nie udawaj, że masz dostęp do internetu lub aktualnych danych zewnętrznych – nie podawaj „na oko” dat ani bieżących informacji.
- Nie wymyślaj szczegółowych integracji, których Inteli-IT nie byłoby w stanie realnie zrobić – opisuj typowe, zdroworozsądkowe automatyzacje (faktury, zamówienia, raporty, obieg dokumentów, integracje sklepu z systemem fakturowym itp.).
- Zawsze staraj się być po stronie klienta: ma czuć, że ktoś kompetentny rozumie jego problem i może się nim zająć.
`;

// ---------- ENDPOINT 1: CZAT (Z PEŁNYM PROMPTEM) ----------

app.post("/api/inteli-chat", async (req, res) => {
  try {
    const { messages } = req.body;

    if (!Array.isArray(messages)) {
      return res
        .status(400)
        .json({ error: "Brak poprawnego pola 'messages'." });
    }

    const chatMessages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...messages.map((m) => ({
        role: m.role, // "user" lub "assistant"
        content: m.text,
      })),
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-5.1-chat-latest",
      messages: chatMessages,
    });

    const reply =
      completion.choices?.[0]?.message?.content ||
      "Przepraszam, coś poszło nie tak.";

    res.json({ reply });
  } catch (err) {
    console.error("Chat API error:", err);
    res.status(500).json({ error: "Błąd po stronie serwera czatu" });
  }
});

// ---------- ENDPOINT 2: LEAD + MAIL + DB SAVE (PEŁNA LOGIKA) ----------

app.post("/api/inteli-chat/lead", async (req, res) => {
  try {
    const { messages } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return res
        .status(400)
        .json({ error: "Brak wiadomości do przetworzenia" });
    }

    const transcript = messages
      .map((m) => `${m.role === "user" ? "Klient" : "Bot"}: ${m.text}`)
      .join("\n\n");

    const summaryPrompt = `
Jesteś asystentem Inteli-IT. Otrzymasz pełny transkrypt rozmowy czatowej między klientem a botem.
Zadania:
1. Napisz krótkie podsumowanie rozmowy (max 6 zdań) po polsku.
2. Spróbuj wyciągnąć dane kontaktowe klienta, jeśli są obecne:
   - imię i nazwisko (lub chociaż imię),
   - nazwa firmy,
   - adres e-mail,
   - numer telefonu,
   - w 1–3 zdaniach: czego dotyczyła potrzeba automatyzacji.
3. Zaproponuj 2–4 konkretne "next steps" dla Inteli-IT wobec tego klienta.

Zwróć wynik w FORMIE JSON:
{
  "summary": "krótkie podsumowanie",
  "client_data": {
    "name": "...",
    "company": "...",
    "email": "...",
    "phone": "...",
    "need": "opis potrzeby"
  },
  "next_steps": []
}

Transkrypt:
"""${transcript}"""
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content: "Jesteś asystentem generującym czysty JSON.",
        },
        { role: "user", content: summaryPrompt },
      ],
      temperature: 0.2,
    });

    const raw = completion.choices?.[0]?.message?.content || "{}";
    let parsed = {};
    try {
      parsed = JSON.parse(raw);
    } catch (e) {
      console.warn("JSON parse error, surowa odpowiedź:", raw);
      parsed = { summary: raw };
    }

    const summaryText = parsed.summary || "Brak podsumowania.";
    const clientData = parsed.client_data || {};
    const nextSteps = parsed.next_steps || [];

    // --- ZAPIS DO BAZY DANYCH ---
    try {
      await pool.query(
        `INSERT INTO leads (name, company, email, phone, need, summary) VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          clientData.name || null,
          clientData.company || null,
          clientData.email || null,
          clientData.phone || null,
          clientData.need || null,
          summaryText
        ]
      );
    } catch (dbError) {
      console.error("❌ Błąd zapisu leada do bazy:", dbError);
    }

    const clientBlock = `
Imię i nazwisko: ${clientData.name || "-"}
Firma: ${clientData.company || "-"}
E-mail: ${clientData.email || "-"}
Telefon: ${clientData.phone || "-"}
Potrzeba / temat automatyzacji: ${clientData.need || "-"}
`.trim();

    const nextStepsBlock = nextSteps.length > 0
        ? nextSteps.map((s, i) => `${i + 1}. ${s}`).join("\n")
        : "-";

    if (process.env.RESEND_API_KEY && process.env.LEAD_EMAIL_TO) {
        const emailText = `
Nowy lead z chatbota Inteli-IT

=== PODSUMOWANIE ROZMOWY ===
${summaryText}

=== DANE KLIENTA ===
${clientBlock}

=== SUGEROWANE NEXT STEPS ===
${nextStepsBlock}

=== PEŁNY TRANSKRYPT ===
${transcript}
        `.trim();

        await resend.emails.send({
            from: process.env.LEAD_EMAIL_FROM || "Inteli-IT Chatbot <onboarding@resend.dev>",
            to: process.env.LEAD_EMAIL_TO,
            subject: "Nowy lead z chatbota Inteli-IT",
            text: emailText,
        });
        console.log("Resend email sent ok");
    }

    return res.json({ ok: true });
  } catch (err) {
    console.error("Lead API error:", err);
    res.status(500).json({ error: "Błąd serwera" });
  }
});
// server.cjs - CZĘŚĆ 2

// ==========================================
// FUNKCJE LOGOWANIA I BEZPIECZEŃSTWA
// ==========================================

// 1. ZMIANA HASŁA (Dla zalogowanego)
app.post("/api/change-password", authenticateToken, async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) return res.status(400).json({ error: "Podaj stare i nowe hasło" });

    try {
        const result = await pool.query("SELECT password_hash FROM users WHERE id = $1", [req.user.id]);
        const user = result.rows[0];

        const valid = await bcrypt.compare(oldPassword, user.password_hash);
        if (!valid) return res.status(401).json({ error: "Stare hasło jest nieprawidłowe" });

        const newHash = await bcrypt.hash(newPassword, 10);
        await pool.query("UPDATE users SET password_hash = $1 WHERE id = $2", [newHash, req.user.id]);

        res.json({ message: "Hasło zostało zmienione" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Błąd serwera" });
    }
});

// 2. ZAPOMNIAŁEM HASŁA (Generowanie linku)
app.post("/api/forgot-password", async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Podaj email" });

    try {
        const result = await pool.query("SELECT id FROM users WHERE email = $1", [email]);
        if (result.rows.length === 0) {
            return res.json({ message: "Jeśli konto istnieje, wysłaliśmy link." });
        }
        const userId = result.rows[0].id;

        // Generuj token
        const token = crypto.randomBytes(32).toString("hex");
        const expires = Date.now() + 3600000; // 1 godzina

        // Zapisz w bazie
        await pool.query("UPDATE users SET reset_token = $1, reset_token_expires = $2 WHERE id = $3", [token, expires, userId]);

        // Wyślij maila
        if (process.env.RESEND_API_KEY) {
            // Zakładamy, że frontend obsługuje parametr ?view=reset&token=...
            const link = `https://inteli-it.com?view=reset&token=${token}`;
            
            await resend.emails.send({
                from: process.env.LEAD_EMAIL_FROM || "Inteli-IT <onboarding@resend.dev>",
                to: email,
                subject: "Reset hasła - Inteli-IT",
                text: `Kliknij w link, aby zresetować hasło: ${link}\nLink jest ważny przez 1 godzinę.`
            });
        }
        res.json({ message: "Jeśli konto istnieje, wysłaliśmy link." });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Błąd serwera" });
    }
});

// 3. RESET HASŁA (Użycie tokena)
app.post("/api/reset-password", async (req, res) => {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) return res.status(400).json({ error: "Brak danych" });

    try {
        // Znajdź usera z tym tokenem i ważnym czasem
        const result = await pool.query(
            "SELECT id FROM users WHERE reset_token = $1 AND reset_token_expires > $2",
            [token, Date.now()]
        );

        if (result.rows.length === 0) {
            return res.status(400).json({ error: "Link jest nieważny lub wygasł." });
        }

        const userId = result.rows[0].id;
        const newHash = await bcrypt.hash(newPassword, 10);

        // Zaktualizuj hasło i wyczyść token
        await pool.query(
            "UPDATE users SET password_hash = $1, reset_token = NULL, reset_token_expires = NULL WHERE id = $2",
            [newHash, userId]
        );

        res.json({ message: "Hasło zostało zresetowane. Możesz się zalogować." });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Błąd serwera" });
    }
});

// 4. LOGOWANIE
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: "Podaj email i hasło" });

  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (result.rows.length === 0) return res.status(401).json({ error: "Błędny email lub hasło" });

    const user = result.rows[0];
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) return res.status(401).json({ error: "Błędny email lub hasło" });

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({
      message: "Zalogowano pomyślnie",
      token,
      user: {
        email: user.email,
        company: user.company_name,
        isAdmin: user.is_admin || false
      }
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Błąd serwera podczas logowania" });
  }
});

// ==========================================
// FUNKCJE ADMINA
// ==========================================

// 1. ADMIN: Lista użytkowników
app.get("/api/admin/users", authenticateToken, async (req, res) => {
  try {
    const adminCheck = await pool.query("SELECT is_admin FROM users WHERE id = $1", [req.user.id]);
    if (!adminCheck.rows[0]?.is_admin) return res.status(403).json({ error: "Tylko dla admina" });
    const result = await pool.query("SELECT id, email, company_name, nip FROM users ORDER BY created_at DESC");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Błąd serwera" });
  }
});

// 2. ADMIN: Upload pliku z POWIADOMIENIEM MAILOWYM
app.post("/api/admin/upload", authenticateToken, upload.single("file"), async (req, res) => {
  try {
    // Sprawdź czy admin
    const adminCheck = await pool.query("SELECT is_admin FROM users WHERE id = $1", [req.user.id]);
    if (!adminCheck.rows[0]?.is_admin) return res.status(403).json({ error: "Tylko dla admina" });

    if (!req.file) return res.status(400).json({ error: "Brak pliku" });
    const { userId, title, type } = req.body;
    const filename = req.file.filename;

    if (!userId || !title || !type) return res.status(400).json({ error: "Brak danych" });

    // Zapisz w bazie
    await pool.query(
      `INSERT INTO documents (user_id, type, title, filename) VALUES ($1, $2, $3, $4)`,
      [userId, type, title, filename]
    );

    // Wyślij maila
    const userResult = await pool.query("SELECT email, company_name FROM users WHERE id = $1", [userId]);
    const clientUser = userResult.rows[0];

    if (clientUser && process.env.RESEND_API_KEY) {
       const isInvoice = type === 'invoice';
       const emailSubject = isInvoice ? `Nowa Faktura: ${title}` : `Nowy Dokument: ${title}`;
       const emailBody = `
Dzień dobry ${clientUser.company_name || ""},

W Twoim Panelu Klienta Inteli-IT pojawił się nowy dokument.
Typ: ${isInvoice ? 'Faktura VAT' : 'Umowa/Dokument'}
Tytuł: ${title}

Zaloguj się, aby pobrać: https://inteli-it.com

Pozdrawiamy,
Zespół Inteli-IT
       `.trim();

       try {
         await resend.emails.send({
           from: process.env.LEAD_EMAIL_FROM || "Inteli-IT <onboarding@resend.dev>",
           to: clientUser.email,
           subject: emailSubject,
           text: emailBody
         });
         console.log(`📧 Powiadomienie wysłane do ${clientUser.email}`);
       } catch (mailErr) {
         console.error("❌ Błąd maila:", mailErr);
       }
    }

    res.json({ message: "Plik wgrany i powiadomienie wysłane" });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: "Błąd serwera przy uploadzie" });
  }
});

// 3. ADMIN: Tworzenie użytkownika z AUTO-HASŁEM i MAILEM
app.post("/api/admin/create-user", authenticateToken, async (req, res) => {
  try {
    const adminCheck = await pool.query("SELECT is_admin FROM users WHERE id = $1", [req.user.id]);
    if (adminCheck.rows.length === 0 || !adminCheck.rows[0].is_admin) {
      return res.status(403).json({ error: "Brak uprawnień administratora" });
    }

    const { email, company, nip } = req.body;
    // Nie pobieramy password z body, generujemy je sami

    if (!email || !company) return res.status(400).json({ error: "Wymagane: email, firma" });

    // Generuj hasło
    const generatedPassword = crypto.randomBytes(4).toString('hex'); // 8 znaków
    const hash = await bcrypt.hash(generatedPassword, 10);
    
    await pool.query(
      `INSERT INTO users (email, password_hash, company_name, nip) VALUES ($1, $2, $3, $4)`,
      [email, hash, company, nip || null]
    );

    // Wyślij maila powitalnego
    if (process.env.RESEND_API_KEY) {
        await resend.emails.send({
            from: process.env.LEAD_EMAIL_FROM || "Inteli-IT <onboarding@resend.dev>",
            to: email,
            subject: "Witaj w Inteli-IT - Dane logowania",
            text: `
Dzień dobry,

Utworzyliśmy dla Ciebie konto w Panelu Klienta Inteli-IT.

Oto Twoje dane logowania:
Login: ${email}
Hasło: ${generatedPassword}

Zaloguj się tutaj: https://inteli-it.com

Zalecamy zmianę hasła po pierwszym logowaniu.

Pozdrawiamy,
Zespół Inteli-IT
            `.trim()
        });
    }

    res.json({ message: "Utworzono klienta i wysłano hasło mailem!", email, company });

  } catch (err) {
    if (err.code === '23505') return res.status(400).json({ error: "Ten email jest już zajęty." });
    console.error(err);
    res.status(500).json({ error: "Błąd serwera" });
  }
});

// 4. ADMIN: Dodawanie usługi (NOWOŚĆ - TEGO BRAKOWAŁO)
app.post("/api/admin/add-service", authenticateToken, async (req, res) => {
  try {
    // Sprawdź czy admin
    const check = await pool.query("SELECT is_admin FROM users WHERE id = $1", [req.user.id]);
    if (!check.rows[0]?.is_admin) return res.status(403).json({ error: "Admin only" });

    const { userId, name, description } = req.body;
    if (!userId || !name) return res.status(400).json({ error: "Brak danych" });

    await pool.query(
      `INSERT INTO services (user_id, name, description) VALUES ($1, $2, $3)`,
      [userId, name, description || '']
    );
    
    res.json({ message: "Usługa dodana" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Błąd serwera" });
  }
});

// ==========================================
// FUNKCJE KLIENTA (DOKUMENTY I USŁUGI)
// ==========================================

// Pobieranie dokumentów
app.get("/api/documents", authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, type, title, created_at FROM documents WHERE user_id = $1 ORDER BY created_at DESC",
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Błąd serwera" });
  }
});

// Pobieranie usług (NOWOŚĆ - TEGO BRAKOWAŁO)
app.get("/api/services", authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, name, description, status, created_at FROM services WHERE user_id = $1 ORDER BY created_at DESC",
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Błąd" });
  }
});

app.get("/api/documents/:id/download", authenticateToken, async (req, res) => {
  try {
    const docId = req.params.id;
    const result = await pool.query("SELECT * FROM documents WHERE id = $1", [docId]);
    
    if (result.rows.length === 0) return res.status(404).json({ error: "Plik nie istnieje" });
    
    const doc = result.rows[0];
    const adminCheck = await pool.query("SELECT is_admin FROM users WHERE id = $1", [req.user.id]);
    const isAdmin = adminCheck.rows[0]?.is_admin;

    if (doc.user_id !== req.user.id && !isAdmin) {
      return res.status(403).json({ error: "Brak dostępu do tego pliku" });
    }

    const filePath = path.join(__dirname, "uploads", doc.filename);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: "Plik fizycznie nie istnieje na serwerze" });
    }

    res.download(filePath, doc.title + ".pdf"); 

  } catch (err) {
    console.error("Download error:", err);
    res.status(500).json({ error: "Błąd serwera przy pobieraniu" });
  }
});

// =======================================================
// NOWE FUNKCJE: ZARZĄDZANIE USŁUGAMI (ADMIN)
// =klej to przed sekcją START SERWERA
// =======================================================

// 1. Pobierz WSZYSTKIE usługi wszystkich klientów (do tabeli w panelu admina)
app.get("/api/admin/all-services", authenticateToken, async (req, res) => {
  try {
    // Sprawdzenie admina
    const check = await pool.query("SELECT is_admin FROM users WHERE id = $1", [req.user.id]);
    if (!check.rows[0]?.is_admin) return res.status(403).json({ error: "Admin only" });

    // Pobieramy usługi + nazwę firmy właściciela
    const result = await pool.query(`
      SELECT s.id, s.name, s.description, s.status, s.created_at, u.company_name, u.email 
      FROM services s 
      JOIN users u ON s.user_id = u.id 
      ORDER BY s.created_at DESC
    `);
    res.json(result.rows);
  } catch (err) { 
    console.error(err);
    res.status(500).json({ error: "Błąd pobierania usług" }); 
  }
});

// 2. Edytuj usługę (np. zmiana statusu na 'inactive' lub zmiana opisu)
app.put("/api/admin/services/:id", authenticateToken, async (req, res) => {
  try {
    const check = await pool.query("SELECT is_admin FROM users WHERE id = $1", [req.user.id]);
    if (!check.rows[0]?.is_admin) return res.status(403).json({ error: "Admin only" });

    const { status, description } = req.body;
    const serviceId = req.params.id;

    if (status) {
        await pool.query("UPDATE services SET status = $1 WHERE id = $2", [status, serviceId]);
    }
    if (description) {
        await pool.query("UPDATE services SET description = $1 WHERE id = $2", [description, serviceId]);
    }

    res.json({ message: "Zaktualizowano usługę" });
  } catch (err) { 
    console.error(err);
    res.status(500).json({ error: "Błąd edycji" }); 
  }
});

// 3. Usuń usługę
app.delete("/api/admin/services/:id", authenticateToken, async (req, res) => {
  try {
    const check = await pool.query("SELECT is_admin FROM users WHERE id = $1", [req.user.id]);
    if (!check.rows[0]?.is_admin) return res.status(403).json({ error: "Admin only" });

    await pool.query("DELETE FROM services WHERE id = $1", [req.params.id]);
    res.json({ message: "Usunięto usługę" });
  } catch (err) { 
    console.error(err);
    res.status(500).json({ error: "Błąd usuwania" }); 
  }
});

// START SERWERA
const HTTP_PORT = 4000;
const HTTPS_PORT = 4443;

const httpServer = http.createServer(app);
httpServer.listen(HTTP_PORT, () => {
  console.log(`Inteli-IT backend (HTTP) działa na http://localhost:${HTTP_PORT}`);
});

try {
    const httpsOptions = {
        key: fs.readFileSync("/etc/letsencrypt/live/api.inteli-it.com/privkey.pem"),
        cert: fs.readFileSync("/etc/letsencrypt/live/api.inteli-it.com/fullchain.pem"),
    };
    const httpsServer = https.createServer(httpsOptions, app);
    httpsServer.listen(HTTPS_PORT, () => {
        console.log(`Inteli-IT backend (HTTPS) działa na https://api.inteli-it.com:${HTTPS_PORT}`);
    });
} catch (e) {
    console.warn("⚠️ Nie udało się uruchomić HTTPS (brak certyfikatów?). Serwer działa tylko na HTTP.", e.message);
}
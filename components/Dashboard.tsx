// components/Dashboard.tsx - CZĘŚĆ 1
import React, { useState, useEffect } from 'react';
import { Language } from '../types';
import { 
  LayoutDashboard, FileText, LogOut, CreditCard, Server, Shield, Users, 
  Plus, Building, Mail, Lock, Loader2, CheckCircle, AlertCircle, Upload, Download, Settings, Zap, Trash2, RefreshCw
} from 'lucide-react'; // Dodałem Trash2 i RefreshCw do ikon
import { motion } from 'framer-motion';

export interface UserData {
  email: string;
  company: string | null;
  isAdmin?: boolean;
}

interface DashboardProps {
  lang: Language;
  onLogout: () => void;
  userData: UserData;
}

// Typy
interface ApiUser { id: number; email: string; company_name: string; nip?: string; }
interface ApiDoc { id: number; type: string; title: string; created_at: string; }
interface ApiService { id: number; name: string; description: string; status: string; }

const Dashboard: React.FC<DashboardProps> = ({ lang, onLogout, userData }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'services' | 'invoices' | 'documents' | 'settings' | 'admin'>('overview');

  // --- DANE ---
  const [documents, setDocuments] = useState<ApiDoc[]>([]);
  const [services, setServices] = useState<ApiService[]>([]);
  const [loadingDocs, setLoadingDocs] = useState(false);
  const [loadingServices, setLoadingServices] = useState(false);

  // --- ADMIN: Create User ---
  const [newEmail, setNewEmail] = useState('');
  const [newCompany, setNewCompany] = useState('');
  const [newNip, setNewNip] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [createStatus, setCreateStatus] = useState<{type: 'success'|'error', msg: string} | null>(null);

  // --- ADMIN: Upload ---
  const [usersList, setUsersList] = useState<ApiUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [docTitle, setDocTitle] = useState('');
  const [docType, setDocType] = useState('invoice');
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<{type: 'success'|'error', msg: string} | null>(null);

  // --- ADMIN: Add Service ---
  const [srvUser, setSrvUser] = useState('');
  const [srvName, setSrvName] = useState('');
  const [srvDesc, setSrvDesc] = useState('');
  const [isAddingSrv, setIsAddingSrv] = useState(false);
  const [srvStatus, setSrvStatus] = useState<{type: 'success'|'error', msg: string} | null>(null);

  // --- ADMIN: Zarządzanie Usługami (NOWE) ---
  const [adminServices, setAdminServices] = useState<any[]>([]);

  // --- SETTINGS ---
  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [passStatus, setPassStatus] = useState<{type: 'success'|'error', msg: string} | null>(null);
  const [isChangingPass, setIsChangingPass] = useState(false);

  // --- EFEKTY ---
  useEffect(() => {
    if (activeTab === 'admin' && userData.isAdmin) {
      fetchUsers();
      fetchAdminServices(); // Pobieramy listę usług dla admina
    }
    if (activeTab === 'documents' || activeTab === 'invoices') fetchDocuments();
    if (activeTab === 'services') fetchServices();
  }, [activeTab, userData.isAdmin]);

  // --- API ---
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const res = await fetch('https://api.inteli-it.com:4443/api/admin/users', { headers: { 'Authorization': `Bearer ${token}` } });
      if (res.ok) setUsersList(await res.json());
    } catch (e) {}
  };

  // NOWA FUNKCJA: Pobieranie wszystkich usług dla Admina
  const fetchAdminServices = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const res = await fetch('https://api.inteli-it.com:4443/api/admin/all-services', { 
        headers: { 'Authorization': `Bearer ${token}` } 
      });
      if (res.ok) setAdminServices(await res.json());
    } catch (e) { console.error(e); }
  };

  const fetchDocuments = async () => {
    setLoadingDocs(true);
    try {
      const token = localStorage.getItem('authToken');
      const res = await fetch('https://api.inteli-it.com:4443/api/documents', { headers: { 'Authorization': `Bearer ${token}` } });
      if (res.ok) setDocuments(await res.json());
    } catch (e) {}
    setLoadingDocs(false);
  };

  const fetchServices = async () => {
    setLoadingServices(true);
    try {
      const token = localStorage.getItem('authToken');
      const res = await fetch('https://api.inteli-it.com:4443/api/services', { headers: { 'Authorization': `Bearer ${token}` } });
      if (res.ok) setServices(await res.json());
    } catch (e) {}
    setLoadingServices(false);
  };

  // NOWA FUNKCJA: Zmiana statusu usługi
  const toggleServiceStatus = async (id: number, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'finished' : 'active';
    try {
      const token = localStorage.getItem('authToken');
      await fetch(`https://api.inteli-it.com:4443/api/admin/services/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ status: newStatus })
      });
      fetchAdminServices(); // Odśwież tabelę
    } catch (e) { alert("Błąd edycji"); }
  };

  // NOWA FUNKCJA: Usuwanie usługi
  const deleteService = async (id: number) => {
    if(!window.confirm("Czy na pewno usunąć tę usługę?")) return;
    try {
      const token = localStorage.getItem('authToken');
      await fetch(`https://api.inteli-it.com:4443/api/admin/services/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchAdminServices(); // Odśwież tabelę
    } catch (e) { alert("Błąd usuwania"); }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    setCreateStatus(null);
    try {
      const token = localStorage.getItem('authToken');
      const res = await fetch('https://api.inteli-it.com:4443/api/admin/create-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ email: newEmail, company: newCompany, nip: newNip })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Błąd');
      setCreateStatus({ type: 'success', msg: `Utworzono konto dla ${data.email}` });
      setNewEmail(''); setNewCompany(''); setNewNip('');
      fetchUsers();
    } catch (err: any) { setCreateStatus({ type: 'error', msg: err.message }); }
    finally { setIsCreating(false); }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !selectedUser) return;
    setIsUploading(true);
    setUploadStatus(null);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', selectedUser);
    formData.append('title', docTitle);
    formData.append('type', docType);
    try {
      const token = localStorage.getItem('authToken');
      const res = await fetch('https://api.inteli-it.com:4443/api/admin/upload', {
        method: 'POST', headers: { 'Authorization': `Bearer ${token}` }, body: formData
      });
      if (!res.ok) throw new Error('Błąd');
      setUploadStatus({ type: 'success', msg: 'Wgrano plik!' });
      setDocTitle(''); setFile(null);
    } catch (err: any) { setUploadStatus({ type: 'error', msg: err.message }); }
    finally { setIsUploading(false); }
  };

  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAddingSrv(true);
    setSrvStatus(null);
    try {
      const token = localStorage.getItem('authToken');
      const res = await fetch('https://api.inteli-it.com:4443/api/admin/add-service', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ userId: srvUser, name: srvName, description: srvDesc })
      });
      if (!res.ok) throw new Error('Błąd');
      setSrvStatus({ type: 'success', msg: 'Usługa dodana!' });
      setSrvName(''); setSrvDesc('');
      fetchAdminServices(); // Odśwież tabelę usług po dodaniu!
    } catch (err: any) { setSrvStatus({ type: 'error', msg: err.message }); }
    finally { setIsAddingSrv(false); }
  };

  const handleDownload = async (docId: number, title: string) => {
    try {
      const token = localStorage.getItem('authToken');
      const res = await fetch(`https://api.inteli-it.com:4443/api/documents/${docId}/download`, { headers: { 'Authorization': `Bearer ${token}` } });
      if (!res.ok) throw new Error("Błąd");
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href = url; a.download = `${title}.pdf`;
      document.body.appendChild(a); a.click(); a.remove();
    } catch (e) { alert("Błąd pobierania"); }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsChangingPass(true);
    setPassStatus(null);
    try {
        const token = localStorage.getItem('authToken');
        const res = await fetch('https://api.inteli-it.com:4443/api/change-password', {
            method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ oldPassword: oldPass, newPassword: newPass })
        });
        if(!res.ok) throw new Error('Błąd');
        setPassStatus({ type: 'success', msg: 'Hasło zmienione.' });
        setOldPass(''); setNewPass('');
    } catch (err: any) { setPassStatus({ type: 'error', msg: err.message }); }
    finally { setIsChangingPass(false); }
  };
  // components/Dashboard.tsx - CZĘŚĆ 2

  const filteredDocs = documents.filter(doc => {
    if (activeTab === 'invoices') return doc.type === 'invoice';
    if (activeTab === 'documents') return doc.type === 'contract';
    return false;
  });

  const menuItems = [
    { id: 'overview', label: lang === 'pl' ? 'Przegląd' : 'Overview', icon: LayoutDashboard },
    { id: 'services', label: lang === 'pl' ? 'Twoje Usługi' : 'Your Services', icon: Server },
    { id: 'invoices', label: lang === 'pl' ? 'Faktury' : 'Invoices', icon: CreditCard },
    { id: 'documents', label: lang === 'pl' ? 'Umowy' : 'Contracts', icon: FileText },
    { id: 'settings', label: lang === 'pl' ? 'Ustawienia' : 'Settings', icon: Settings },
  ];
  if (userData.isAdmin) menuItems.push({ id: 'admin', label: 'Klienci (Admin)', icon: Users });

  const displayName = userData.company || userData.email.split('@')[0];

  return (
    <div className="min-h-screen pt-20 bg-slate-950 flex flex-col md:flex-row">
      <aside className="w-full md:w-64 bg-slate-900 border-r border-white/5 flex flex-col">
        <div className="p-6 border-b border-white/5 flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${userData.isAdmin ? 'bg-red-600' : 'bg-blue-600'}`}>
             {userData.isAdmin ? 'A' : displayName.charAt(0).toUpperCase()}
          </div>
          <div className="overflow-hidden">
            <h3 className="font-bold text-white truncate">{displayName}</h3>
            <p className="text-xs text-slate-400 truncate">{userData.email}</p>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {menuItems.map((item) => (
            <button key={item.id} onClick={() => setActiveTab(item.id as any)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === item.id ? 'bg-blue-600/10 text-blue-400 border border-blue-600/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
              <item.icon className="w-5 h-5" /> {item.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-white/5">
          <button onClick={onLogout} className="w-full flex text-red-400 gap-3 px-4 py-3 rounded-lg text-sm font-medium hover:bg-red-500/10"><LogOut className="w-5 h-5" /> Wyloguj</button>
        </div>
      </aside>

      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        <header className="mb-8"><h1 className="text-3xl font-bold text-white mb-2">{menuItems.find(i => i.id === activeTab)?.label}</h1></header>
        <motion.div key={activeTab} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          
          {/* SETTINGS */}
          {activeTab === 'settings' && (
            <div className="max-w-md bg-slate-900 border border-white/10 rounded-xl p-6 shadow-xl">
               <h2 className="text-lg font-bold text-white mb-4 flex gap-2"><Lock /> Zmiana hasła</h2>
               <form onSubmit={handleChangePassword} className="space-y-4">
                 <input type="password" required value={oldPass} onChange={e => setOldPass(e.target.value)} placeholder="Stare hasło" className="w-full bg-slate-950 border border-slate-700 rounded p-3 text-white text-sm" />
                 <input type="password" required value={newPass} onChange={e => setNewPass(e.target.value)} placeholder="Nowe hasło" className="w-full bg-slate-950 border border-slate-700 rounded p-3 text-white text-sm" />
                 {passStatus && <div className={`p-2 text-xs rounded ${passStatus.type === 'success' ? 'text-emerald-400' : 'text-red-400'}`}>{passStatus.msg}</div>}
                 <button disabled={isChangingPass} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 rounded">Zmień hasło</button>
               </form>
            </div>
          )}

          {/* ADMIN - POPRAWIONY UKŁAD */}
          {activeTab === 'admin' && userData.isAdmin && (
            <div className="space-y-8">
              
              {/* RZĄD 1: FORMULARZE (3 Kolumny) */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                
                {/* Form 1: Add User */}
                <div className="bg-slate-900 border border-white/10 rounded-xl p-6 shadow-xl h-fit">
                  <h2 className="text-lg font-bold text-white mb-4 flex gap-2"><Users /> Dodaj klienta</h2>
                  <form onSubmit={handleCreateUser} className="space-y-4">
                    <input required value={newCompany} onChange={e => setNewCompany(e.target.value)} placeholder="Firma" className="w-full bg-slate-950 border border-slate-700 rounded p-3 text-white text-sm" />
                    <input required value={newNip} onChange={e => setNewNip(e.target.value)} placeholder="NIP" className="w-full bg-slate-950 border border-slate-700 rounded p-3 text-white text-sm" />
                    <input required value={newEmail} onChange={e => setNewEmail(e.target.value)} placeholder="Email" className="w-full bg-slate-950 border border-slate-700 rounded p-3 text-white text-sm" />
                    <div className="text-xs text-slate-500 italic">Hasło zostanie wygenerowane i wysłane mailem.</div>
                    {createStatus && <div className={`p-2 text-xs rounded ${createStatus.type === 'success' ? 'text-emerald-400' : 'text-red-400'}`}>{createStatus.msg}</div>}
                    <button disabled={isCreating} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 rounded">Utwórz</button>
                  </form>
                </div>
                
                {/* Form 2: Add Service (Środek) */}
                <div className="bg-slate-900 border border-white/10 rounded-xl p-6 shadow-xl h-fit">
                  <h2 className="text-lg font-bold text-white mb-4 flex gap-2"><Zap /> Przypisz usługę</h2>
                  <form onSubmit={handleAddService} className="space-y-4">
                    <select required value={srvUser} onChange={e => setSrvUser(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded p-3 text-white text-sm">
                      <option value="">-- Klient --</option>
                      {usersList.map(u => <option key={u.id} value={u.id}>{u.company_name}</option>)}
                    </select>
                    <input required value={srvName} onChange={e => setSrvName(e.target.value)} placeholder="Nazwa usługi" className="w-full bg-slate-950 border border-slate-700 rounded p-3 text-white text-sm" />
                    <textarea value={srvDesc} onChange={e => setSrvDesc(e.target.value)} placeholder="Opis (np. SLA)" className="w-full bg-slate-950 border border-slate-700 rounded p-3 text-white text-sm h-24 resize-none" />
                    {srvStatus && <div className={`p-2 text-xs rounded ${srvStatus.type === 'success' ? 'text-emerald-400' : 'text-red-400'}`}>{srvStatus.msg}</div>}
                    <button disabled={isAddingSrv} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 rounded">Dodaj usługę</button>
                  </form>
                </div>

                {/* Form 3: Upload */}
                <div className="bg-slate-900 border border-white/10 rounded-xl p-6 shadow-xl h-fit">
                  <h2 className="text-lg font-bold text-white mb-4 flex gap-2"><Upload /> Wyślij dokument</h2>
                  <form onSubmit={handleUpload} className="space-y-4">
                    <select required value={selectedUser} onChange={e => setSelectedUser(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded p-3 text-white text-sm">
                      <option value="">-- Klient --</option>
                      {usersList.map(u => <option key={u.id} value={u.id}>{u.company_name} {u.nip?`(${u.nip})`:''}</option>)}
                    </select>
                    <select value={docType} onChange={e => setDocType(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded p-3 text-white text-sm">
                        <option value="invoice">Faktura</option><option value="contract">Umowa</option>
                    </select>
                    <input required value={docTitle} onChange={e => setDocTitle(e.target.value)} placeholder="Tytuł" className="w-full bg-slate-950 border border-slate-700 rounded p-3 text-white text-sm" />
                    <input type="file" required accept="application/pdf" onChange={e => setFile(e.target.files?.[0] || null)} className="text-slate-400 text-sm" />
                    {uploadStatus && <div className={`p-2 text-xs rounded ${uploadStatus.type === 'success' ? 'text-emerald-400' : 'text-red-400'}`}>{uploadStatus.msg}</div>}
                    <button disabled={isUploading} className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-2 rounded">Wyślij</button>
                  </form>
                </div>
              </div>

              {/* RZĄD 2: TABELA USŁUG (Na całą szerokość) */}
              <div className="bg-slate-900 border border-white/10 rounded-xl p-6 shadow-xl">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Server className="text-blue-500" /> Zarządzanie Usługami
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="text-xs text-slate-500 uppercase border-b border-white/10">
                        <th className="p-3">Firma</th>
                        <th className="p-3">Usługa</th>
                        <th className="p-3">Status</th>
                        <th className="p-3">Data</th>
                        <th className="p-3 text-right">Akcje</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm text-slate-300">
                      {adminServices.length === 0 ? (
                        <tr><td colSpan={5} className="p-4 text-center text-slate-500">Brak usług.</td></tr>
                      ) : (
                        adminServices.map(srv => (
                          <tr key={srv.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                            <td className="p-3 text-white">{srv.company_name}<br/><span className="text-xs text-slate-500">{srv.email}</span></td>
                            <td className="p-3"><span className="block font-bold">{srv.name}</span><span className="text-xs text-slate-500">{srv.description}</span></td>
                            <td className="p-3">
                              <button onClick={() => toggleServiceStatus(srv.id, srv.status)} className={`px-2 py-1 rounded text-xs font-bold uppercase border ${srv.status === 'active' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-slate-500/10 text-slate-400 border-slate-500/20'}`}>
                                {srv.status === 'active' ? 'Aktywna' : 'Zakończona'}
                              </button>
                            </td>
                            <td className="p-3 font-mono text-xs">{new Date(srv.created_at).toLocaleDateString()}</td>
                            <td className="p-3 text-right">
                              <button onClick={() => deleteService(srv.id)} className="p-2 text-red-400 hover:bg-red-500/10 rounded"><Trash2 className="w-4 h-4" /></button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* DOCUMENTS / INVOICES */}
          {(activeTab === 'invoices' || activeTab === 'documents') && (
            <div>
               {loadingDocs ? <Loader2 className="animate-spin mx-auto text-blue-500" /> : filteredDocs.length === 0 ? (
                 <div className="text-center py-10 bg-slate-900 rounded-xl border border-white/5">
                   <h3 className="text-white font-bold">Brak {activeTab === 'invoices' ? 'faktur' : 'dokumentów'}</h3>
                 </div>
               ) : (
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   {filteredDocs.map(doc => (
                     <div key={doc.id} className="bg-slate-900 border border-white/5 p-5 rounded-xl flex justify-between items-center">
                       <div>
                         <h4 className="text-white font-bold">{doc.title}</h4>
                         <p className="text-xs text-slate-400">{new Date(doc.created_at).toLocaleDateString()}</p>
                       </div>
                       <button onClick={() => handleDownload(doc.id, doc.title)} className="bg-white/5 hover:bg-white/10 text-blue-400 p-2 rounded transition-colors flex gap-2 text-sm items-center"><Download className="w-4 h-4" /> Pobierz</button>
                     </div>
                   ))}
                 </div>
               )}
            </div>
          )}

         {/* SERVICES (Widok Klienta - NOWY DESIGN) */}
          {activeTab === 'services' && (
             <div>
                {loadingServices ? <Loader2 className="animate-spin mx-auto text-blue-500" /> : services.length === 0 ? (
                   <div className="bg-slate-900 border border-white/5 p-8 rounded-xl text-center">
                     <Server className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                     <h3 className="text-white font-bold mb-2">Brak aktywnych usług</h3>
                     <p className="text-slate-400 text-sm">Skontaktuj się z nami, aby uruchomić automatyzację.</p>
                   </div>
                ) : (
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {services.map(srv => (
                        <div key={srv.id} className={`relative p-6 rounded-2xl border transition-all duration-300 group ${srv.status === 'active' ? 'bg-slate-900 border-white/10 hover:border-blue-500/50' : 'bg-slate-900/50 border-white/5 opacity-60'}`}>
                           
                           {/* Dekoracyjny gradient w rogu (zamiast ikony) */}
                           <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-600/10 to-transparent rounded-bl-full -mr-6 -mt-6 pointer-events-none" />

                           <div className="relative z-10 flex flex-col h-full">
                              <div className="flex justify-between items-start mb-4">
                                 {/* Ikona w ładnym boxie */}
                                 <div className={`p-3 rounded-xl ${srv.status === 'active' ? 'bg-blue-600/20 text-blue-400' : 'bg-slate-700/30 text-slate-500'}`}>
                                    <Server className="w-6 h-6" />
                                 </div>
                                 
                                 {/* Status Badge */}
                                 <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${srv.status === 'active' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-slate-500/10 text-slate-400 border-slate-500/20'}`}>
                                    {srv.status === 'active' ? 'Aktywna' : 'Zakończona'}
                                 </span>
                              </div>

                              <div className="mt-2 mb-4">
                                 <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">{srv.name}</h3>
                                 <p className="text-slate-400 text-sm leading-relaxed">
                                   {srv.description || "Brak dodatkowego opisu."}
                                 </p>
                              </div>

                              {/* Stopka z datą */}
                              <div className="mt-auto pt-4 border-t border-white/5 text-xs text-slate-600 font-mono flex items-center gap-2">
                                 <CheckCircle className="w-3 h-3" /> Uruchomiono: {new Date(srv.created_at).toLocaleDateString()}
                              </div>
                           </div>
                        </div>
                      ))}
                   </div>
                )}
             </div>
          )}

          {/* OVERVIEW */}
          {activeTab === 'overview' && ( <div className="bg-slate-900 border border-white/5 p-8 rounded-xl"><h3 className="text-white font-bold">Witaj w panelu</h3></div> )}

        </motion.div>
      </main>
    </div>
  );
};

export default Dashboard;
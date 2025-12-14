import React, { useState } from 'react';
import { X, Trash2, CreditCard, CheckCircle, Loader2 } from 'lucide-react';
import { Language, CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  lang: Language;
  onRemoveItem: (index: number) => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose, items, lang, onRemoveItem }) => {
  const [step, setStep] = useState<'cart' | 'details' | 'payment' | 'success'>('cart');
  const [isProcessing, setIsProcessing] = useState(false);
  const total = items.reduce((sum, item) => sum + item.price, 0);

  const handleCheckout = () => {
    setIsProcessing(true);
    // Simulate API call
    setTimeout(() => {
      setIsProcessing(false);
      setStep('success');
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex justify-end">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      {/* Drawer */}
      <div className="relative w-full max-w-md bg-slate-900 h-full border-l border-white/10 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-slate-950">
          <h2 className="text-xl font-heading font-bold text-white">
            {lang === 'pl' ? 'Twój Koszyk' : 'Your Cart'}
          </h2>
          <button 
            onClick={onClose} 
            aria-label={lang === 'pl' ? 'Zamknij koszyk' : 'Close cart'}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {step === 'cart' && (
            <>
              {items.length === 0 ? (
                <div className="text-center py-10 text-slate-400">
                  {lang === 'pl' ? 'Koszyk jest pusty.' : 'Cart is empty.'}
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item, idx) => (
                    <div key={idx} className="bg-slate-800 p-4 rounded-xl flex justify-between items-center border border-white/5">
                      <div>
                        <div className="font-bold text-white">{item.name}</div>
                        <div className="text-xs text-slate-400 uppercase">{item.type} {item.details && `• ${item.details}`}</div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-bold text-blue-400">{item.price} PLN</span>
                        <button 
                          onClick={() => onRemoveItem(idx)}
                          aria-label={lang === 'pl' ? 'Usuń z koszyka' : 'Remove from cart'}
                          className="text-slate-500 hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {step === 'success' && (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mb-6">
                <CheckCircle className="w-10 h-10 text-emerald-500" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                {lang === 'pl' ? 'Zamówienie przyjęte!' : 'Order Placed!'}
              </h3>
              <p className="text-slate-400 mb-8">
                {lang === 'pl' ? 'Dziękujemy za zaufanie. Szczegóły wysłaliśmy na maila.' : 'Thank you. Details have been sent to your email.'}
              </p>
              <button 
                onClick={() => { setStep('cart'); onClose(); }}
                className="bg-slate-800 text-white px-6 py-2 rounded-lg hover:bg-slate-700"
              >
                {lang === 'pl' ? 'Zamknij' : 'Close'}
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        {step === 'cart' && items.length > 0 && (
          <div className="p-6 border-t border-white/10 bg-slate-950">
            <div className="flex justify-between items-center mb-6 text-lg font-bold text-white">
              <span>{lang === 'pl' ? 'Razem (netto):' : 'Total (net):'}</span>
              <span>{total.toFixed(2)} PLN</span>
            </div>
            <button 
              onClick={handleCheckout}
              disabled={isProcessing}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {lang === 'pl' ? 'Przetwarzanie...' : 'Processing...'}
                </>
              ) : (
                <>
                  <CreditCard className="w-5 h-5" />
                  {lang === 'pl' ? 'Przejdź do płatności' : 'Checkout'}
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;
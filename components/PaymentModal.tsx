
import React, { useState } from 'react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handlePay = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onSuccess();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="glass w-full max-w-md p-8 rounded-3xl border-2 border-yellow-500/50 flex flex-col items-center text-center animate-in fade-in zoom-in duration-300">
        <h2 className="text-2xl font-gaming text-yellow-500 mb-4">MUA "VÉ THÔNG THÁI"</h2>
        <p className="text-slate-300 mb-6">Nạp 10.000 VNĐ để bỏ qua câu hỏi và chém Boss một nhát cực mạnh!</p>
        
        {/* Mock QR Code */}
        <div className="bg-white p-4 rounded-2xl mb-6 relative group overflow-hidden">
          <img 
            src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=SKIP_QUESTION_PAYMENT" 
            alt="QR Bank" 
            className="w-48 h-48 grayscale group-hover:grayscale-0 transition-all"
          />
          <div className="absolute inset-0 bg-blue-500/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-blue-600 font-bold text-xs bg-white/90 px-2 py-1 rounded">QUÉT NGAY</span>
          </div>
        </div>

        <div className="flex gap-4 w-full">
          <button 
            onClick={onClose}
            className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 font-bold"
          >
            HỦY
          </button>
          <button 
            onClick={handlePay}
            disabled={isProcessing}
            className="flex-1 py-3 rounded-xl bg-yellow-500 text-slate-900 font-bold hover:bg-yellow-400 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
            ) : "ĐÃ CHUYỂN KHOẢN"}
          </button>
        </div>
        
        <p className="mt-4 text-[10px] text-slate-500 uppercase tracking-tighter">Bảo mật bởi hệ thống ngân hàng liên kết</p>
      </div>
    </div>
  );
};

export default PaymentModal;

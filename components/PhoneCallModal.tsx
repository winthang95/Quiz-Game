
import React, { useEffect, useState } from 'react';

interface PhoneCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  relativeResponse: string | null;
  isLoading: boolean;
}

const PhoneCallModal: React.FC<PhoneCallModalProps> = ({ isOpen, onClose, relativeResponse, isLoading }) => {
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    let interval: number;
    if (isOpen) {
      interval = window.setInterval(() => setTimer(t => t + 1), 1000);
    } else {
      setTimer(0);
    }
    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="w-full max-w-sm glass rounded-[3rem] border-2 border-white/10 p-8 flex flex-col items-center shadow-2xl overflow-hidden relative">
        <div className="absolute top-4 w-16 h-1 bg-white/20 rounded-full"></div>
        
        {/* Caller Info */}
        <div className="mt-8 mb-6 flex flex-col items-center">
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 p-1 mb-4 shadow-lg ring-4 ring-blue-500/20">
            <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-6xl">
              👴
            </div>
          </div>
          <h2 className="text-2xl font-gaming text-white">Người Thân</h2>
          <p className="text-blue-400 font-mono mt-1">{isLoading ? "Đang gọi..." : formatTime(timer)}</p>
        </div>

        {/* Conversation Bubble */}
        <div className="flex-1 w-full min-h-[150px] bg-white/5 rounded-3xl p-6 border border-white/5 relative mb-8 flex flex-col justify-center overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
            </div>
          ) : (
            <p className="text-slate-300 italic text-center text-lg leading-relaxed animate-in slide-in-from-bottom-2 duration-500">
              "{relativeResponse}"
            </p>
          )}
        </div>

        {/* Call Controls */}
        <div className="grid grid-cols-1 w-full gap-4">
          <button 
            onClick={onClose}
            className="w-full py-5 rounded-full bg-red-500 hover:bg-red-600 text-white font-bold flex items-center justify-center gap-3 active:scale-95 transition-all shadow-lg shadow-red-500/20"
          >
            <span className="text-2xl">🤙</span> KẾT THÚC
          </button>
        </div>

        <p className="mt-6 text-[10px] text-slate-500 uppercase tracking-widest font-gaming">Sóng 5G Trực Tuyến</p>
      </div>
    </div>
  );
};

export default PhoneCallModal;

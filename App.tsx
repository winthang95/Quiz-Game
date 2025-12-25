
import React, { useState, useEffect } from 'react';
import { GameStatus, Question, CharacterState } from './types';
import { fetchQuestions, generateIllustration, callRelative } from './services/geminiService';
import HealthBar from './components/HealthBar';
import BossVisual from './components/BossVisual';
import PlayerVisual from './components/PlayerVisual';
import PaymentModal from './components/PaymentModal';
import PhoneCallModal from './components/PhoneCallModal';

const App: React.FC = () => {
  const [status, setStatus] = useState<GameStatus>(GameStatus.LOBBY);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [player, setPlayer] = useState<CharacterState>({ hp: 100, maxHp: 100, name: "Bạn" });
  const [boss, setBoss] = useState<CharacterState>({ hp: 100, maxHp: 100, name: "Boss" });
  
  // Animation & UI states
  const [isPlayerAttacking, setIsPlayerAttacking] = useState(false);
  const [isPlayerHurt, setIsPlayerHurt] = useState(false);
  const [isBossAttacking, setIsBossAttacking] = useState(false);
  const [isBossHurt, setIsBossHurt] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);

  // Lifeline states
  const [isCallUsed, setIsCallUsed] = useState(false);
  const [isCallModalOpen, setIsCallModalOpen] = useState(false);
  const [isCallLoading, setIsCallLoading] = useState(false);
  const [callResponse, setCallResponse] = useState<string | null>(null);

  const [feedback, setFeedback] = useState<{ message: string; type: 'success' | 'error' | 'info' | null }>({ message: '', type: null });
  const [loadingMsg, setLoadingMsg] = useState("Đang chuẩn bị...");

  const startGame = async () => {
    setStatus(GameStatus.LOADING);
    setLoadingMsg("Đang thiết lập vũ trụ tri thức...");
    try {
      const q = await fetchQuestions(10);
      if (q.length > 0) {
        setQuestions(q);
        setBoss({ hp: 100, maxHp: 100, name: "Siêu Boss Lớp 5" });
        setPlayer({ hp: 100, maxHp: 100, name: "Chiến Thần" });
        setCurrentIndex(0);
        setIsCallUsed(false);
        setStatus(GameStatus.PLAYING);
        // Load first image
        updateIllustration(q[0]);
      } else {
        alert("Lỗi tải câu hỏi!");
        setStatus(GameStatus.LOBBY);
      }
    } catch (err) {
      setStatus(GameStatus.LOBBY);
    }
  };

  const updateIllustration = async (q: Question) => {
    if (q.illustrationUrl) return;
    setIsGeneratingImage(true);
    try {
      const url = await generateIllustration(q.question);
      setQuestions(prev => {
        const newQs = [...prev];
        const target = newQs.find(item => item.question === q.question);
        if (target) target.illustrationUrl = url;
        return newQs;
      });
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleAnswer = (optionIndex: number) => {
    if (status !== GameStatus.PLAYING || feedback.type !== null) return;
    const currentQ = questions[currentIndex];
    const isCorrect = optionIndex === currentQ.correctIndex;

    executeTurn(isCorrect, currentQ.explanation);
  };

  const executeTurn = (isCorrect: boolean, msg: string) => {
    if (isCorrect) {
      setIsPlayerAttacking(true);
      setTimeout(() => {
        setIsPlayerAttacking(false);
        setIsBossHurt(true);
        setBoss(prev => ({ ...prev, hp: Math.max(0, prev.hp - 15) }));
        setTimeout(() => setIsBossHurt(false), 500);
      }, 300);
      setFeedback({ message: `CHÍNH XÁC! ${msg}`, type: 'success' });
    } else {
      setIsBossAttacking(true);
      setTimeout(() => {
        setIsBossAttacking(false);
        setIsPlayerHurt(true);
        setPlayer(prev => ({ ...prev, hp: Math.max(0, prev.hp - 20) }));
        setTimeout(() => setIsPlayerHurt(false), 500);
      }, 300);
      setFeedback({ message: `SAI RỒI! ${msg}`, type: 'error' });
    }

    checkGameEnd();
  };

  const handleSkipQuestion = () => {
    setIsPaymentOpen(false);
    setFeedback({ message: "ĐÃ NẠP TIỀN! BẠN ĐƯỢC BỎ QUA CÂU NÀY VÀ GÂY SÁT THƯƠNG CỰC LỚN!", type: 'info' });
    
    setIsPlayerAttacking(true);
    setTimeout(() => {
      setIsPlayerAttacking(false);
      setIsBossHurt(true);
      setBoss(prev => ({ ...prev, hp: Math.max(0, prev.hp - 30) }));
      setTimeout(() => setIsBossHurt(false), 500);
    }, 300);

    checkGameEnd();
  };

  const handleCallRelative = async () => {
    if (isCallUsed || status !== GameStatus.PLAYING) return;
    
    setIsCallModalOpen(true);
    setIsCallLoading(true);
    setIsCallUsed(true);
    
    try {
      const currentQ = questions[currentIndex];
      const resp = await callRelative(currentQ.question, currentQ.options);
      setCallResponse(resp);
    } catch (err) {
      setCallResponse("Alo? Ba đang bận quá, ba nghĩ là câu A đó con...");
    } finally {
      setIsCallLoading(false);
    }
  };

  const checkGameEnd = () => {
    setTimeout(() => {
      setFeedback({ message: '', type: null });
      if (player.hp <= 0) setStatus(GameStatus.GAMEOVER);
      else if (boss.hp <= 0) setStatus(GameStatus.VICTORY);
      else if (currentIndex < questions.length - 1) {
        const nextIdx = currentIndex + 1;
        setCurrentIndex(nextIdx);
        updateIllustration(questions[nextIdx]);
      } else {
        setStatus(GameStatus.VICTORY);
      }
    }, 3500);
  };

  if (status === GameStatus.LOBBY) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <div className="relative mb-12">
          <div className="absolute inset-0 blur-3xl bg-blue-500/30 rounded-full scale-150 animate-pulse"></div>
          <h1 className="text-6xl md:text-8xl font-gaming font-bold tracking-tighter text-white relative">
            SUPER<br/><span className="text-yellow-400">CLASS 5</span>
          </h1>
        </div>
        <p className="text-slate-400 mb-12 max-w-lg text-lg uppercase tracking-widest">Đấu trường tri thức 3D thế hệ mới</p>
        <button 
          onClick={startGame}
          className="glass px-12 py-5 text-yellow-400 font-gaming font-bold text-xl rounded-full border-2 border-yellow-400/50 hover:bg-yellow-400 hover:text-slate-950 transition-all active:scale-95 shadow-[0_0_50px_rgba(250,204,21,0.2)]"
        >
          BẮT ĐẦU CHIẾN ĐẤU
        </button>
      </div>
    );
  }

  if (status === GameStatus.LOADING) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="w-20 h-20 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-6"></div>
        <p className="font-gaming text-blue-400 animate-pulse tracking-widest">{loadingMsg}</p>
      </div>
    );
  }

  const currentQ = questions[currentIndex];

  return (
    <div className="min-h-screen flex flex-col">
      <PaymentModal 
        isOpen={isPaymentOpen} 
        onClose={() => setIsPaymentOpen(false)} 
        onSuccess={handleSkipQuestion} 
      />

      <PhoneCallModal 
        isOpen={isCallModalOpen}
        onClose={() => setIsCallModalOpen(false)}
        relativeResponse={callResponse}
        isLoading={isCallLoading}
      />

      {/* Header HUD */}
      <div className="p-4 grid grid-cols-2 gap-8 glass border-b border-white/10 sticky top-0 z-40">
        <HealthBar current={player.hp} max={player.maxHp} label="PLAYER" color="bg-blue-500 shadow-blue-500/50 shadow-lg" />
        <HealthBar current={boss.hp} max={boss.maxHp} label={boss.name} color="bg-red-500 shadow-red-500/50 shadow-lg" />
      </div>

      <main className="flex-1 flex flex-col lg:flex-row p-4 gap-8">
        {/* Battle Stage */}
        <div className="flex-1 flex flex-col items-center justify-center relative min-h-[400px]">
          <div className="absolute inset-0 bg-blue-500/5 blur-[100px] pointer-events-none"></div>
          <div className="flex items-center justify-around w-full max-w-3xl">
            <PlayerVisual isAttacking={isPlayerAttacking} isHurt={isPlayerHurt} />
            <div className="font-gaming text-4xl text-slate-700 opacity-20">VS</div>
            <BossVisual isAttacking={isBossAttacking} isHurt={isBossHurt} bossType={Math.floor(currentIndex / 3)} />
          </div>
        </div>

        {/* Interaction Panel */}
        <div className="lg:w-[450px] flex flex-col gap-4">
          {/* Question Card */}
          <div className="glass rounded-3xl p-6 border-2 border-white/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-2 text-[10px] font-gaming text-slate-500">
              Q{currentIndex+1}/{questions.length} • GR{currentQ?.grade}
            </div>
            
            {/* Question Illustration */}
            <div className="w-full h-40 bg-slate-800/50 rounded-2xl mb-4 overflow-hidden relative border border-white/5">
              {isGeneratingImage ? (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : currentQ?.illustrationUrl ? (
                <img src={currentQ.illustrationUrl} className="w-full h-full object-cover animate-in fade-in duration-700" alt="Illustration" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-600 font-gaming text-xs">AWAITING SCAN...</div>
              )}
            </div>

            <h3 className="text-xl font-bold mb-6 leading-relaxed">
              {currentQ?.question}
            </h3>

            <div className="grid grid-cols-1 gap-3 mb-4">
              {currentQ?.options.map((opt, i) => (
                <button
                  key={i}
                  disabled={feedback.type !== null}
                  onClick={() => handleAnswer(i)}
                  className={`
                    p-4 rounded-xl text-left border-2 transition-all active:scale-95 group
                    ${feedback.type === null 
                      ? 'bg-white/5 border-white/10 hover:border-yellow-500/50 hover:bg-white/10' 
                      : i === currentQ.correctIndex ? 'border-green-500 bg-green-500/20 text-green-300' : 'opacity-40 border-transparent'
                    }
                  `}
                >
                  <span className="font-gaming text-xs text-slate-500 mr-3 group-hover:text-yellow-500">{String.fromCharCode(65+i)}</span>
                  {opt}
                </button>
              ))}
            </div>

            {/* Lifelines Buttons */}
            {feedback.type === null && (
              <div className="flex gap-2">
                <button 
                  onClick={() => setIsPaymentOpen(true)}
                  className="flex-1 py-2 rounded-lg border border-dashed border-yellow-500/40 text-yellow-500 text-[10px] font-gaming hover:bg-yellow-500/10 transition-colors uppercase tracking-tight"
                >
                  ⚡️ NẠP TIỀN BỎ QUA
                </button>
                <button 
                  onClick={handleCallRelative}
                  disabled={isCallUsed}
                  className={`flex-1 py-2 rounded-lg border border-dashed text-[10px] font-gaming transition-colors uppercase tracking-tight ${
                    isCallUsed 
                      ? 'border-slate-700 text-slate-700 cursor-not-allowed' 
                      : 'border-blue-500/40 text-blue-500 hover:bg-blue-500/10'
                  }`}
                >
                  📞 GỌI NGƯỜI THÂN {isCallUsed && "(HẾT)"}
                </button>
              </div>
            )}

            {/* Feedback Message */}
            {feedback.type && (
              <div className={`mt-4 p-4 rounded-xl text-sm italic border-l-4 animate-in slide-in-from-top-4 ${
                feedback.type === 'success' ? 'bg-green-500/10 border-green-500 text-green-400' : 
                feedback.type === 'info' ? 'bg-blue-500/10 border-blue-500 text-blue-400' : 'bg-red-500/10 border-red-500 text-red-400'
              }`}>
                {feedback.message}
              </div>
            )}
          </div>
        </div>
      </main>

      {status === GameStatus.VICTORY && (
        <div className="fixed inset-0 z-[200] bg-blue-600 flex flex-col items-center justify-center p-8 text-center animate-in zoom-in duration-500">
          <div className="text-9xl mb-8">💎</div>
          <h2 className="text-5xl font-gaming mb-4">CHIẾN THẮNG TUYỆT ĐỐI</h2>
          <p className="text-xl opacity-80 mb-12">Bộ óc của bạn đã vượt xa trình độ lớp 5!</p>
          <button onClick={() => setStatus(GameStatus.LOBBY)} className="px-10 py-4 bg-white text-blue-600 font-bold rounded-full font-gaming">TRANG CHỦ</button>
        </div>
      )}

      {status === GameStatus.GAMEOVER && (
        <div className="fixed inset-0 z-[200] bg-red-950 flex flex-col items-center justify-center p-8 text-center animate-in zoom-in duration-500">
          <div className="text-9xl mb-8 grayscale">🎓</div>
          <h2 className="text-5xl font-gaming mb-4 text-red-500">GAME OVER</h2>
          <p className="text-xl opacity-80 mb-12">Học sinh lớp 5 đã chiến thắng bạn...</p>
          <button onClick={() => setStatus(GameStatus.LOBBY)} className="px-10 py-4 bg-white text-red-950 font-bold rounded-full font-gaming">THỬ LẠI</button>
        </div>
      )}
    </div>
  );
};

export default App;

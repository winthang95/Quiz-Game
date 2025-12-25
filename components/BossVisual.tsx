
import React from 'react';

interface BossVisualProps {
  isAttacking: boolean;
  isHurt: boolean;
  bossType: number;
}

const BossVisual: React.FC<BossVisualProps> = ({ isAttacking, isHurt, bossType }) => {
  const bosses = [
    { emoji: "🤖", name: "Cyber Teacher", color: "from-purple-600 to-indigo-900", border: "border-purple-500" },
    { emoji: "🐉", name: "Librarian Drake", color: "from-orange-600 to-red-900", border: "border-orange-500" },
    { emoji: "👻", name: "Spirit of Math", color: "from-teal-600 to-cyan-900", border: "border-teal-500" }
  ];

  const currentBoss = bosses[bossType % bosses.length];

  return (
    <div className={`perspective-1000 transition-all duration-500 ${isAttacking ? 'scale-110 translate-y-4' : ''}`}>
      <div className={`
        relative w-48 h-64 rounded-3xl preserve-3d card-3d glass border-2 
        ${isHurt ? 'border-red-500 bg-red-500/20' : currentBoss.border}
        flex flex-col items-center justify-center shadow-[0_0_50px_rgba(168,85,247,0.3)]
        ${isHurt ? 'animate-shake' : 'floating'}
      `}>
        {/* Shadow */}
        <div className="absolute -bottom-12 w-32 h-6 bg-black/50 blur-2xl rounded-full"></div>

        <div className="text-9xl drop-shadow-[0_20px_20px_rgba(0,0,0,0.6)] transform translate-z-20">
          {currentBoss.emoji}
        </div>
        
        <div className="mt-4 font-gaming text-sm text-yellow-400 tracking-tighter uppercase font-bold">
          {currentBoss.name}
        </div>

        {/* Boss Powers */}
        <div className="absolute -z-10 w-full h-full bg-gradient-to-t from-purple-500/20 to-transparent blur-3xl rounded-full"></div>

        {isHurt && <div className="absolute inset-0 bg-red-500/40 rounded-3xl slash-effect active-slash"></div>}
      </div>
    </div>
  );
};

export default BossVisual;

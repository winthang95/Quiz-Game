
import React from 'react';

interface PlayerVisualProps {
  isAttacking: boolean;
  isHurt: boolean;
}

const PlayerVisual: React.FC<PlayerVisualProps> = ({ isAttacking, isHurt }) => {
  return (
    <div className={`perspective-1000 transition-all duration-500 ${isAttacking ? 'scale-110 -translate-y-4' : ''}`}>
      <div className={`
        relative w-40 h-56 rounded-2xl preserve-3d card-3d glass border-2 
        ${isHurt ? 'border-red-500 bg-red-500/20' : 'border-blue-400/50'}
        flex flex-col items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.3)]
        ${isHurt ? 'animate-shake' : 'floating'}
      `}>
        {/* Shadow */}
        <div className="absolute -bottom-10 w-24 h-4 bg-black/40 blur-xl rounded-full"></div>
        
        {/* Character Image (3D Emoji/Icon) */}
        <div className="text-8xl drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)] transform translate-z-10">
          🧑‍🚀
        </div>
        
        <div className="mt-4 font-gaming text-xs text-blue-300 tracking-widest uppercase">
          Player One
        </div>

        {/* Attack Effect */}
        {isAttacking && (
          <div className="absolute top-1/2 left-full -translate-y-1/2 w-40 h-2 bg-gradient-to-r from-blue-400 to-transparent blur-sm animate-pulse"></div>
        )}

        {/* Hurt Effect Overlay */}
        {isHurt && <div className="absolute inset-0 bg-red-500/40 rounded-2xl slash-effect active-slash"></div>}
      </div>
    </div>
  );
};

export default PlayerVisual;

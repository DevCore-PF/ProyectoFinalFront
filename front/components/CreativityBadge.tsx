import { IoFlashSharp } from "react-icons/io5";

const CreativityBadge = () => {
  return (
    <div className="relative inline-flex items-center gap-3 px-8 py-4 bg-white/90 backdrop-blur-sm rounded-xl border border-white/30 shadow-lg">
      
      
      <div className="flex items-center justify-center w-8 h-8 bg-purple-500 rounded text-white">
        <IoFlashSharp className="w-5 h-5" />
      </div>
      <span className="text-gray-800 font-semibold text-3xl sm:text-4xl lg:text-5xl" style={{ fontFamily: 'var(--font-title)', fontSize: 'clamp(24px, 4vw, 48px)' }}>
        <span className="font-semibold" style={{ color: '#7E4BDE' }}>Potenciá</span> tu creatividad
      </span>
    </div>
  );
};

export default CreativityBadge;
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-[#1a0b38] to-[#2d1163] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      
      {/* 3D Orbs / Glow */}
      <div className="absolute top-10 left-10 w-64 h-64 bg-primary/30 blur-[80px] rounded-full pointer-events-none animate-pulse" style={{ animationDuration: '4s' }}></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-fuchsia-600/20 blur-[100px] rounded-full pointer-events-none animate-pulse" style={{ animationDuration: '6s' }}></div>

      {/* Floating 3D Icon in Background */}
      <div className="absolute top-1/4 right-1/4 w-32 h-32 opacity-20 pointer-events-none mix-blend-screen transform rotate-12 blur-[2px]">
        <img src="/icons/icon_ideas.jpg" alt="" className="w-full h-full object-cover rounded-full" />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center">
        {/* 3D 404 Text */}
        <h1 
          className="text-[120px] sm:text-[180px] font-headline-display font-black text-white leading-none tracking-tighter"
          style={{
            textShadow: `
              0 1px 0 #8247E5, 
              0 2px 0 #7038d1, 
              0 3px 0 #612dbf, 
              0 4px 0 #5224ad, 
              0 5px 0 #461c99, 
              0 6px 1px rgba(0,0,0,.1), 
              0 0 5px rgba(0,0,0,.1), 
              0 1px 3px rgba(0,0,0,.3), 
              0 3px 5px rgba(0,0,0,.2), 
              0 5px 10px rgba(0,0,0,.25), 
              0 10px 10px rgba(0,0,0,.2), 
              0 20px 20px rgba(0,0,0,.15)
            `
          }}
        >
          404
        </h1>
        
        {/* Glassmorphism Card */}
        <div className="mt-8 p-8 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)] max-w-md relative overflow-hidden group">
          {/* Card inner shine */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

          <h2 className="text-2xl font-bold text-white mb-3">Unvalidated Route?</h2>
          <p className="text-white/70 mb-8 font-medium leading-relaxed">
            It looks like this page failed our market validation. It either doesn't exist, was moved, or is just an idea that hasn't been built yet.
          </p>

          <Link 
            href="/overview"
            className="group/btn w-full flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-primary to-[#8247E5] text-white font-bold shadow-[0_0_20px_rgba(109,59,215,0.4)] hover:shadow-[0_0_40px_rgba(109,59,215,0.6)] transition-all duration-300 hover:-translate-y-1"
          >
            Return to Overview
          </Link>
        </div>
      </div>
    </div>
  );
}

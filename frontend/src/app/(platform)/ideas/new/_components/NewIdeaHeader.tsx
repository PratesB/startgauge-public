import Link from "next/link";

export default function NewIdeaHeader() {
  return (
    <div className="relative mb-6 overflow-hidden rounded-[1.5rem] bg-gradient-to-br from-primary/[0.05] via-primary/[0.02] to-fuchsia-500/[0.05] border border-primary/10 p-5 sm:p-6 sm:px-8 flex flex-col sm:flex-row sm:items-center justify-between shadow-sm">
      <div className="relative z-10 max-w-xl">
        <div className="flex items-center gap-3 mb-2">
          <Link 
            href="/ideas" 
            className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-container-lowest shadow-sm border border-card-border hover:bg-surface-container hover:scale-105 transition-all text-text-muted hover:text-primary shrink-0"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          </Link>
          <h1 className="text-3xl sm:text-4xl font-headline-display font-black bg-clip-text text-transparent bg-gradient-to-r from-primary to-[#8247E5] tracking-tight">
            Spark a New Idea
          </h1>
        </div>
        <p className="text-text-muted mt-2 sm:ml-13 text-base font-medium leading-relaxed">
          Plant the seed. Give us the details and let our intelligent system analyze the market, find your competitors, build your Canvas and more.
        </p>
      </div>
      
      {/* Floating 3D Graphic */}
      <div className="hidden sm:block absolute right-6 top-1/2 -translate-y-1/2 w-28 h-28 opacity-90 mix-blend-multiply rounded-full overflow-hidden animate-[bounce_6s_infinite] shadow-[0_0_20px_rgba(109,59,215,0.15)]">
          <img src="/icons/icon_ideas.jpg" alt="Idea Spark" className="w-full h-full object-cover scale-110" />
      </div>
    </div>
  );
}

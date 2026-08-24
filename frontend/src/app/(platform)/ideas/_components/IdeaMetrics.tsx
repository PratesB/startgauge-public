import { useMemo } from "react";

interface Idea {
  id: string;
  title: string;
  description: string;
  country: string;
  created_at: string;
  updated_at: string;
}

const getFlagCode = (country: string) => {
  if (!country) return "un";
  // Demo version only supports Finland
  if (country.toLowerCase() === "finland") return "fi";
  return "un";
};

export default function IdeaMetrics({ ideas }: { ideas: Idea[] }) {
  const metrics = useMemo(() => {
    const total = ideas.length;

    // Calculate Top Market
    const marketCounts: Record<string, number> = {};
    let topMarket = "None";
    let maxCount = 0;
    
    ideas.forEach(idea => {
      if (idea.country) {
        const country = idea.country;
        marketCounts[country] = (marketCounts[country] || 0) + 1;
        if (marketCounts[country] > maxCount) {
          maxCount = marketCounts[country];
          topMarket = country;
        }
      }
    });

    const marketPercentage = total > 0 ? Math.round((maxCount / total) * 100) : 0;

    // Calculate Heatmap (Last 14 days)
    const heatmapDays = Array.from({ length: 14 }).map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (13 - i));
      const dateStr = d.toISOString().split('T')[0];
      
      const count = ideas.filter(idea => {
        if (!idea.updated_at) return false;
        return idea.updated_at.startsWith(dateStr);
      }).length;
      
      return { date: dateStr, count, isToday: i === 13 };
    });

    const activeLast14d = heatmapDays.reduce((acc, day) => acc + day.count, 0);

    // Calculate Growth (Last 30 days vs Previous 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

    const createdLast30d = ideas.filter(idea => new Date(idea.created_at) > thirtyDaysAgo).length;
    const createdPrevious30d = ideas.filter(idea => {
      const d = new Date(idea.created_at);
      return d > sixtyDaysAgo && d <= thirtyDaysAgo;
    }).length;

    let growthPercentage = 0;
    if (createdPrevious30d === 0) {
      growthPercentage = createdLast30d > 0 ? 100 : 0;
    } else {
      growthPercentage = Math.round(((createdLast30d - createdPrevious30d) / createdPrevious30d) * 100);
    }
    const trendText = growthPercentage >= 0 ? `+${growthPercentage}% vs last month` : `${growthPercentage}% vs last month`;
    const trendColorClass = growthPercentage >= 0 ? "text-blue-600 bg-blue-50 border-blue-100" : "text-slate-500 bg-slate-50 border-slate-200";

    // Generate Dynamic SVG Sparkline based on activity
    const maxActivity = Math.max(...heatmapDays.map(d => d.count), 1);
    const sparklinePoints = heatmapDays.map((day, i) => {
      const x = (i / 13) * 100;
      const y = 35 - ((day.count / maxActivity) * 25); // Range from Y=35 (bottom) to Y=10 (top)
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    });
    const sparklineArea = `M0,40 L${sparklinePoints.join(' L')} L100,40 Z`;
    const sparklineLine = `M${sparklinePoints.join(' L')}`;

    return { total, topMarket, marketPercentage, heatmapDays, activeLast14d, trendText, trendColorClass, sparklineArea, sparklineLine };
  }, [ideas]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
      
      {/* 1. Total Ideas */}
      <div className="relative overflow-hidden bg-white border border-slate-200 rounded-2xl pt-6 px-6 shadow-sm flex flex-col justify-between group">
        <div className="relative z-10 flex justify-between items-start mb-2">
          <h3 className="text-[12px] font-bold text-slate-400 tracking-wider uppercase">Total Ideas</h3>
          <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${metrics.trendColorClass}`}>
            {metrics.trendText}
          </span>
        </div>
        
        <div className="relative z-20 flex items-end gap-3 mt-2 mb-6 pointer-events-none">
          <span className="text-6xl font-black text-slate-900 leading-none tracking-tighter">{metrics.total}</span>
          <div className="flex flex-col pb-1 bg-white/50 backdrop-blur-[2px] rounded-md pr-2">
            <span className="text-[12px] font-medium text-emerald-500">Live</span>
            <span className="text-[11px] text-slate-400">in your portfolio</span>
          </div>
        </div>

        {/* Rich Area Sparkline at the bottom */}
        <div className="absolute bottom-0 left-0 w-full h-16 opacity-60 group-hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-none">
          <svg viewBox="0 0 100 40" className="w-full h-full" preserveAspectRatio="none">
            <path d={metrics.sparklineArea} fill="url(#blue-gradient-total)" className="opacity-30" />
            <path d={metrics.sparklineLine} fill="none" stroke="currentColor" strokeWidth="2.5" className="text-blue-500" strokeLinecap="round" strokeLinejoin="round" />
            <defs>
              <linearGradient id="blue-gradient-total" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="transparent" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      {/* 2. Top Market */}
      <div className="relative overflow-hidden bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between group">
        <div className="relative z-10 flex justify-between items-start">
          <h3 className="text-[12px] font-bold text-slate-400 tracking-wider uppercase">Top Market</h3>
          <span className="text-[11px] font-medium text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-100">{metrics.marketPercentage}% of portfolio</span>
        </div>
        
        <div className="relative z-10 flex items-center gap-4 mt-6">
          <div className="relative flex items-center justify-center w-12 h-12">
            {/* Subtle Pulse */}
            <div className="absolute inset-0 rounded-full border border-purple-200 animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite]" />
            
            {metrics.topMarket !== "None" && getFlagCode(metrics.topMarket) !== "un" ? (
              <img 
                src={`https://flagcdn.com/${getFlagCode(metrics.topMarket)}.svg`} 
                alt={metrics.topMarket} 
                className="relative z-10 w-10 h-10 object-cover rounded-full shadow-sm border border-slate-200"
              />
            ) : (
              <div className="relative z-10 w-10 h-10 bg-slate-100 rounded-full shadow-sm border border-slate-200 flex items-center justify-center">
                <span className="material-symbols-outlined text-slate-400 text-[20px]">public</span>
              </div>
            )}
          </div>
          
          <div className="flex flex-col">
            <span className="text-3xl font-bold text-slate-900 tracking-tight truncate max-w-[150px]">{metrics.topMarket}</span>
            <span className="text-[12px] text-slate-400">Primary target region</span>
          </div>
        </div>

        {/* Abstract Globe/Map lines in light gray */}
        <div className="absolute -right-8 -bottom-8 w-40 h-40 opacity-20 pointer-events-none group-hover:opacity-40 transition-opacity duration-500">
          <svg viewBox="0 0 100 100" className="w-full h-full text-slate-400" fill="none" stroke="currentColor" strokeWidth="1">
            <circle cx="50" cy="50" r="45" strokeDasharray="4 4" />
            <path d="M50,5 Q90,50 50,95 Q10,50 50,5" strokeDasharray="4 4" />
            <path d="M5,50 Q50,90 95,50 Q50,10 5,50" strokeDasharray="4 4" />
          </svg>
        </div>
      </div>

      {/* 3. Activity Heatmap */}
      <div className="relative overflow-hidden bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-[12px] font-bold text-slate-400 tracking-wider uppercase">Activity Pulse</h3>
          <span className="text-[11px] text-slate-500 font-medium">Last 14 Days</span>
        </div>
        
        <div className="flex flex-col gap-3 mt-4">
          {/* The Heatmap Grid */}
          <div className="flex items-end gap-1.5 h-16">
            {metrics.heatmapDays.map((day, idx) => {
              // Determine color intensity based on count
              let bgClass = "bg-slate-100";
              let heightClass = "h-4";
              
              if (day.count === 1) {
                bgClass = "bg-emerald-200";
                heightClass = "h-8";
              } else if (day.count === 2) {
                bgClass = "bg-emerald-400";
                heightClass = "h-12";
              } else if (day.count > 2) {
                bgClass = "bg-emerald-600 shadow-[0_0_10px_rgba(16,185,129,0.4)] z-10";
                heightClass = "h-full";
              }

              return (
                <div key={day.date} className="group relative flex-1 flex flex-col justify-end h-full">
                  <div className={`w-full rounded-sm transition-all duration-300 hover:opacity-80 cursor-crosshair ${bgClass} ${heightClass}`} />
                  
                  {/* Tooltip on hover */}
                  <div className={`absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 whitespace-nowrap bg-slate-900 text-white text-[10px] px-2 py-1 rounded ${
                    idx >= 11 ? "right-0" : idx <= 2 ? "left-0" : "left-1/2 -translate-x-1/2"
                  }`}>
                    {day.count} updates on {day.date}
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium">
            <span>{metrics.activeLast14d} total updates</span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-sm bg-slate-100"></span>
              <span className="w-2 h-2 rounded-sm bg-emerald-200"></span>
              <span className="w-2 h-2 rounded-sm bg-emerald-400"></span>
              <span className="w-2 h-2 rounded-sm bg-emerald-600"></span>
            </span>
          </div>
        </div>
      </div>

    </div>
  );
}

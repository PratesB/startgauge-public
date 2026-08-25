"use client";

import { useEffect, useState } from "react";
import { fetchAPI } from "@/lib/api";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { TaskProvider } from "./_components/TaskContext";
import { GlobalTaskNotification } from "./_components/GlobalTaskNotification";

const FINNISH_MARKET_NEWS = [
  { tag: "Economy", text: "Finland's economy shows resilience with tech exports driving steady growth." },
  { tag: "Startups", text: "Record-breaking year: Finnish tech startups secure over €1.2B in funding." },
  { tag: "Investments", text: "Global investors pour €500M into new green energy facilities in Northern Finland." },
  { tag: "Gov Support", text: "Business Finland announces a new €50M grant initiative for AI and deep tech." }
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentIdeaName, setCurrentIdeaName] = useState<string | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [newsIndex, setNewsIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setNewsIndex((prev) => (prev + 1) % FINNISH_MARKET_NEWS.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await fetchAPI("/api/v1/users/me");
        setUser(data);
      } catch (err) {
        // Token expired or not logged in
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [router]);

  useEffect(() => {
    const ideaIdMatch = pathname.match(/^\/ideas\/([^\/]+)/);
    if (ideaIdMatch && ideaIdMatch[1] !== "new") {
      const ideaId = ideaIdMatch[1];
      fetchAPI(`/api/v1/ideas/${ideaId}`)
        .then((data) => setCurrentIdeaName(data.title))
        .catch(() => setCurrentIdeaName(null));
    } else {
      setCurrentIdeaName(null);
    }
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    router.push("/login");
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-deep">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  const isLinkActive = (path: string) => pathname === path;
  const isIdeasActive = pathname === "/ideas" || (pathname.startsWith("/ideas/") && pathname !== "/ideas/new");

  const getBreadcrumbs = (path: string) => {
    const crumbs: Array<{ label: string; href: string | null }> = [{ label: "StartGauge", href: null }];
    
    if (path === "/overview") {
      crumbs.push({ label: "Overview", href: null });
    } else if (path === "/ideas") {
      crumbs.push({ label: "My Ideas", href: null });
    } else if (path === "/ideas/new") {
      crumbs.push({ label: "Ideas", href: "/ideas" });
      crumbs.push({ label: "New Idea", href: null });
    } else if (path.startsWith("/ideas/")) {
      crumbs.push({ label: "Ideas", href: "/ideas" });
      
      if (currentIdeaName) {
        crumbs.push({ label: currentIdeaName, href: null });
      }
    } else if (path.includes("/profile")) {
      crumbs.push({ label: "Profile", href: null });
    } else if (path === "/onboarding") {
      crumbs.push({ label: "Onboarding", href: null });
    } else {
      crumbs.push({ label: "App", href: null });
    }
    
    return crumbs;
  };

  return (
    <TaskProvider>
    <div className="bg-[#f0f2f5] font-sans text-slate-800 antialiased min-h-screen flex">
      {/* Floating Curved Sidebar */}
      <aside 
        className={`fixed left-4 top-4 bottom-4 transition-all duration-300 ease-in-out bg-white rounded-[32px] z-50 flex flex-col shadow-[0_8px_30px_rgb(0,0,0,0.04)] print:hidden overflow-y-auto overflow-x-hidden ${isCollapsed ? 'w-[88px]' : 'w-[240px]'}`}
      >
        <div className={`flex items-center mb-8 mt-6 transition-all duration-300 ${isCollapsed ? 'justify-center px-0' : 'justify-between px-6'}`}>
          {isCollapsed ? (
            <button 
              onClick={() => setIsCollapsed(false)}
              className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
              title="Expand Sidebar"
            >
              <span className="material-symbols-outlined text-[22px]">keyboard_double_arrow_right</span>
            </button>
          ) : (
            <>
              <span className="font-extrabold text-primary tracking-tight text-[22px]">
                StartGauge
              </span>
              <button 
                onClick={() => setIsCollapsed(true)} 
                className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                title="Collapse Sidebar"
              >
                <span className="material-symbols-outlined text-[18px]">
                  keyboard_double_arrow_left
                </span>
              </button>
            </>
          )}
        </div>
        
        <nav className="flex-1 flex flex-col gap-2 px-4 mt-2">
          
          <Link href="/overview" className={`flex items-center rounded-[14px] transition-all duration-200 group/link ${isLinkActive("/overview") ? 'bg-primary/10 text-primary font-bold' : 'text-slate-500 hover:bg-primary/5 hover:text-primary font-medium'} ${isCollapsed ? 'justify-center p-3' : 'px-4 py-3'}`}>
            <span className={`material-symbols-outlined text-[20px] transition-all duration-300 ${isCollapsed ? '' : 'mr-4'} ${isLinkActive("/overview") ? 'text-primary' : 'text-slate-400 group-hover/link:text-primary'}`}>home</span>
            <span className={`text-[14.5px] transition-all duration-300 overflow-hidden whitespace-nowrap ${isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'}`}>Overview</span>
          </Link>
          
          <Link href="/ideas" className={`flex items-center rounded-[14px] transition-all duration-200 group ${isIdeasActive ? 'bg-primary/10 text-primary font-bold' : 'text-slate-500 hover:bg-primary/5 hover:text-primary font-medium'} ${isCollapsed ? 'justify-center p-3' : 'px-4 py-3'}`}>
            <span className={`material-symbols-outlined text-[20px] transition-all duration-300 ${isCollapsed ? '' : 'mr-4'} ${isIdeasActive ? 'text-primary' : 'text-slate-400 group-hover:text-primary'}`}>article</span>
            <span className={`text-[14.5px] transition-all duration-300 overflow-hidden whitespace-nowrap ${isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'}`}>Ideas</span>
          </Link>

          <Link href="/profile" className={`flex items-center rounded-[14px] transition-all duration-200 group ${isLinkActive("/profile") ? 'bg-primary/10 text-primary font-bold' : 'text-slate-500 hover:bg-primary/5 hover:text-primary font-medium'} ${isCollapsed ? 'justify-center p-3' : 'px-4 py-3'}`}>
            <span className={`material-symbols-outlined text-[20px] transition-all duration-300 ${isCollapsed ? '' : 'mr-4'} ${isLinkActive("/profile") ? 'text-primary' : 'text-slate-400 group-hover:text-primary'}`}>person</span>
            <span className={`text-[14.5px] transition-all duration-300 overflow-hidden whitespace-nowrap ${isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'}`}>Profile</span>
          </Link>
          
          <Link href="/ideas/new" className={`flex items-center rounded-[14px] transition-all duration-200 group ${isLinkActive("/ideas/new") ? 'bg-primary/10 text-primary font-bold' : 'text-slate-500 hover:bg-primary/5 hover:text-primary font-medium'} ${isCollapsed ? 'justify-center p-3' : 'px-4 py-3'}`}>
            <span className={`material-symbols-outlined text-[20px] transition-all duration-300 ${isCollapsed ? '' : 'mr-4'} ${isLinkActive("/ideas/new") ? 'text-primary' : 'text-slate-400 group-hover:text-primary'}`}>lightbulb</span>
            <span className={`text-[14.5px] transition-all duration-300 overflow-hidden whitespace-nowrap ${isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'}`}>New Idea</span>
          </Link>
          
        </nav>
        
        <div className="px-4 pb-6 mt-auto flex flex-col gap-2">
          {user && (
            <div className={`flex flex-col mb-2 overflow-hidden transition-all duration-300 ${isCollapsed ? 'opacity-0 h-0 w-0' : 'opacity-100 px-2'}`}>
              <span className="text-[14.5px] font-bold text-primary truncate">{user.name || "User"}</span>
              <span className="text-[13px] text-slate-500 truncate">{user.email}</span>
            </div>
          )}
          
          <button 
            onClick={handleLogout}
            className={`w-full flex items-center rounded-[14px] text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors font-medium cursor-pointer ${isCollapsed ? 'justify-center p-3' : 'px-4 py-3'}`}
          >
            <span className={`material-symbols-outlined text-[20px] transition-all duration-300 ${isCollapsed ? '' : 'mr-4'}`}>power_settings_new</span>
            <span className={`text-[14.5px] transition-all duration-300 overflow-hidden whitespace-nowrap ${isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'}`}>Log Out</span>
          </button>
        </div>
      </aside>

      <div 
        className={`flex-1 flex flex-col h-screen p-4 print:!p-0 print:h-auto print:block transition-all duration-300 ease-in-out ${isCollapsed ? 'pl-[120px]' : 'pl-[272px]'}`}
      >
        
        {/* Floating Curved Main Container */}
        <div className="flex-1 bg-white rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col relative overflow-hidden print:shadow-none print:rounded-none">
          
          <header className="shrink-0 h-[88px] px-10 flex items-center justify-between border-b border-slate-100 print:hidden bg-white z-10">
            {/* Left: Greeting & Breadcrumbs */}
            <div className="flex flex-col justify-center">
              <div className="flex items-center gap-1.5 text-sm font-medium">
                {getBreadcrumbs(pathname).map((crumb, index, arr) => {
                  const isLast = index === arr.length - 1;
                  return (
                    <div key={index} className="flex items-center gap-1.5">
                      {crumb.href && !isLast ? (
                        <Link href={crumb.href} className="text-slate-400 hover:text-primary transition-colors">
                          {crumb.label}
                        </Link>
                      ) : (
                        <span className={isLast ? "text-primary font-bold" : "text-slate-400"}>
                          {crumb.label}
                        </span>
                      )}
                      
                      {!isLast && (
                        <span className="material-symbols-outlined text-[16px] text-slate-300">chevron_right</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* Right: Market News Ticker */}
            <div className="flex items-center w-[350px] overflow-hidden ml-auto">
              <div className="flex flex-col overflow-hidden w-full relative h-[36px] justify-center pl-6 border-l border-slate-200">
                {FINNISH_MARKET_NEWS.map((news, idx) => (
                  <div 
                    key={idx}
                    className={`absolute left-6 right-0 transition-all duration-500 ease-in-out flex flex-col ${
                      idx === newsIndex 
                        ? 'opacity-100 translate-y-0 z-10' 
                        : idx < newsIndex 
                          ? 'opacity-0 -translate-y-4 z-0' 
                          : 'opacity-0 translate-y-4 z-0'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                      </span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none">Market • {news.tag}</span>
                    </div>
                    <span className="text-[12.5px] text-slate-700 truncate font-medium leading-none" title={news.text}>{news.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto p-10 print:overflow-visible print:p-0 relative">
            {/* Missing Background Banner */}
            {(!user?.professional_background && pathname !== "/onboarding") && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-8 flex items-start gap-4 shadow-sm">
                <span className="material-symbols-outlined text-amber-600 mt-0.5 flex-shrink-0">warning</span>
                <div className="flex-1">
                  <h3 className="text-sm font-bold text-amber-900">Professional background missing</h3>
                  <p className="text-sm text-amber-700 mt-1 leading-relaxed">
                    To get the best validations for your ideas, please add your professional background in your Profile.
                  </p>
                </div>
                <Link href="/onboarding" className="text-sm font-bold text-amber-800 hover:text-amber-900 bg-amber-100 hover:bg-amber-200 px-4 py-2 rounded-xl transition-colors">
                  Update Profile
                </Link>
              </div>
            )}

            {children}
          </main>
        </div>
      </div>
      <GlobalTaskNotification />
    </div>
    </TaskProvider>
  );
}

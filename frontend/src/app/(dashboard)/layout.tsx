"use client";

import { useEffect, useState } from "react";
import { fetchAPI } from "@/lib/api";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
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

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-deep">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Determine active state for menu items
  const isLinkActive = (path: string) => {
    return pathname === path 
      ? "bg-primary/10 text-primary border-l-4 border-primary" 
      : "text-on-surface-variant hover:bg-surface-variant/50 hover:text-primary border-l-4 border-transparent group";
  };

  const getIconActive = (path: string) => {
    return pathname === path
      ? ""
      : "text-text-muted group-hover:text-primary transition-colors";
  };

  return (
    <div className="bg-bg-deep font-body-md text-on-surface antialiased min-h-screen flex">
      <aside className="fixed left-0 top-0 h-full w-sidebar-width bg-sidebar/90 backdrop-blur-xl z-50 flex flex-col border-r border-card-border/60">
        <div className="h-header-height flex items-center px-gutter-lg mb-2">
          <span className="text-xl font-extrabold text-primary tracking-tight">StartGauge</span>
        </div>
        
        {/* Primary Action Button*/}
        <div className="px-4 mb-6">
          <Link href="/ideas/new" className="group relative w-full flex items-center justify-between p-1 rounded-2xl bg-gradient-to-r from-[#1a1528] to-[#0f0a18] border border-primary/30 shadow-[0_8px_25px_rgba(109,59,215,0.2)] hover:shadow-[0_8px_30px_rgba(109,59,215,0.5)] hover:border-primary/80 transition-all duration-500 hover:-translate-y-1">
            
            {/* Ambient Glow */}
            <div className="absolute inset-0 bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
            
            {/* Inner Content */}
            <div className="relative flex items-center w-full gap-3 px-2 py-1.5 z-10 overflow-hidden">
              {/* Shine sweep effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-[1.5s] ease-in-out"></div>
              
              {/* Icon Block */}
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-bg-deep border border-primary/30 group-hover:border-primary-fixed transition-all duration-500 relative overflow-hidden shrink-0 shadow-inner group-hover:shadow-[0_0_15px_rgba(109,59,215,0.4)]">
                <img src="/icons/icon_ideas.jpg" alt="Idea" className="absolute inset-0 w-full h-full object-cover group-hover:scale-125 transition-transform duration-700 opacity-90 group-hover:opacity-100 mix-blend-luminosity group-hover:mix-blend-normal" />
                <div className="absolute inset-0 bg-primary opacity-20 group-hover:opacity-0 mix-blend-color transition-opacity duration-500"></div>
              </div>
              
              {/* Text */}
              <div className="flex flex-col">
                <span className="text-sm font-extrabold text-white tracking-wide">Create New Idea</span>                
              </div>

              {/* Arrow */}
              <span className="material-symbols-outlined text-white/30 group-hover:text-white ml-auto transition-colors text-[18px]">east</span>
            </div>
          </Link>
        </div>
        
        <nav className="flex-1 flex flex-col gap-1 px-3">
          <Link href="/dashboard" className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${isLinkActive("/dashboard")}`}>
            <span className={`material-symbols-outlined mr-3 ${getIconActive("/dashboard")}`}>dashboard</span>
            <span className="font-body-md font-semibold">Dashboard</span>
          </Link>
          <Link href="/ideas" className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${isLinkActive("/ideas")}`}>
            <span className={`material-symbols-outlined mr-3 ${getIconActive("/ideas")}`}>lightbulb</span>
            <span className="font-body-md font-semibold">Ideas</span>
          </Link>
          <Link href="/dashboard/profile" className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${isLinkActive("/dashboard/profile")}`}>
            <span className={`material-symbols-outlined mr-3 ${getIconActive("/dashboard/profile")}`}>person</span>
            <span className="font-body-md font-semibold">Profile</span>
          </Link>
        </nav>
        
        <div className="p-4 mt-auto">
          <div className="p-4 rounded-2xl bg-surface-container/40 border border-card-border/50 flex flex-col items-center text-center group hover:bg-surface-container/80 transition-colors duration-300">
            <div className="w-28 h-20 mb-2 overflow-hidden rounded-lg flex items-center justify-center">
              <img src="/icons/icon_box_to_globe.jpg" alt="StartGauge Pro" className="w-full h-full object-cover mix-blend-multiply opacity-90 group-hover:scale-110 transition-transform duration-500" />
            </div>
            <h4 className="text-[15px] font-extrabold text-on-surface">StartGauge Pro</h4>
            <p className="text-[11px] text-text-muted font-medium mt-1 mb-4 leading-relaxed px-1">The complete system to validate and build your idea from scratch.</p>
            <button className="w-full py-2.5 rounded-[10px] bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-yellow-950 font-extrabold transition-all duration-300 shadow-sm text-sm hover:shadow-[0_4px_15px_rgba(245,158,11,0.4)] cursor-pointer">
              Get Premium
            </button>
          </div>
          
          <button 
            onClick={handleLogout}
            className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-error-red hover:bg-error-container/50 transition-colors font-semibold cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">logout</span>
            Log Out
          </button>
        </div>
      </aside>

      <div className="pl-sidebar-width flex-1 flex flex-col min-h-screen">
        <header className="fixed top-0 left-sidebar-width right-0 h-header-height bg-bg-deep/80 backdrop-blur-md z-40 border-b border-card-border/60 px-gutter-lg flex items-center justify-between">
          {/* Left: Greeting & Breadcrumbs */}
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-1.5 text-label-sm text-text-muted font-medium">
              <span>StartGauge</span>
              <span className="material-symbols-outlined text-[14px]">chevron_right</span>
              <span className="text-primary font-bold">{pathname === "/dashboard" ? "Dashboard" : pathname === "/ideas" ? "My Ideas" : "Profile"}</span>
            </div>
          </div>



          {/* Right: Actions & Profile */}
          <div className="flex items-center gap-4">
            {/* User Profile */}
            <div className="flex items-center gap-3 cursor-pointer group">
              <div className="text-right hidden sm:block">
                <p className="text-body-md font-semibold text-on-surface leading-none group-hover:text-primary transition-colors">{user?.name || "User"}</p>
                <p className="text-label-sm text-text-muted mt-1">{user?.email}</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 group-hover:bg-primary/20 transition-colors">
                <span className="material-symbols-outlined text-primary text-[20px]">person</span>
              </div>
            </div>
          </div>
        </header>

        <main className="relative pt-[calc(var(--spacing-header-height)+var(--spacing-container-margin))] pb-container-margin flex-1 px-gutter-lg overflow-x-hidden">
          {/* Missing Background Banner */}
          {(!user?.professional_background && pathname !== "/onboarding") && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-6 flex items-start gap-4 shadow-sm">
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
  );
}

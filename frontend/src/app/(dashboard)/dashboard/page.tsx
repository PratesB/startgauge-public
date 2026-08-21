"use client";

import { useEffect, useState } from "react";
import { fetchAPI } from "@/lib/api";

import MetricsGrid from "../_components/MetricsGrid";
import PortfolioStrength from "../_components/PortfolioStrength";
import ProInsightsCard from "../_components/ProInsightsCard";
import InvestorMatchesCard from "../_components/InvestorMatchesCard";
import SkillGapsCard from "../_components/SkillGapsCard";
import NewsAlertsCard from "../_components/NewsAlertsCard";

export default function DashboardPage() {
  const [stats, setStats] = useState({ ideas: 0, canvases: 0, feedbacks: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const ideasData = await fetchAPI("/api/v1/ideas/");
        const totalIdeas = ideasData.length;
        
        let totalCanvases = 0;
        if (totalIdeas > 0) {
          const canvasPromises = ideasData.map((idea: any) => 
            fetchAPI(`/api/v1/canvas/${idea.id}/history`).catch(() => [])
          );
          const canvasesResults = await Promise.all(canvasPromises);
          totalCanvases = canvasesResults.reduce((acc, curr) => acc + (Array.isArray(curr) ? curr.length : 0), 0);
        }

        setStats({
          ideas: totalIdeas,
          canvases: totalCanvases,
          feedbacks: totalCanvases 
        });
      } catch (err) {
        console.error("Failed to load dashboard stats", err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  return (
    <div className="flex flex-col w-full gap-8 pb-10">
      {/* Top Section: Overview & Stats */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-headline-display text-on-surface">Analytics Dashboard</h1>
          <p className="text-body-md text-text-muted mt-2">Your ideas overview and insights.</p>
        </div>
      </div>

      {/* Hero Stats Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left Column wrapper */}
        <div className="lg:col-span-3 flex flex-col gap-5">
          <MetricsGrid stats={stats} loading={loading} />
        </div>

        {/* Purple Promo Banner (Right) - The Gauge */}
        <div className="lg:col-span-1">
          <PortfolioStrength />
        </div>
      </div>

      {/* Middle Section: Radar & Premium */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProInsightsCard />
        <InvestorMatchesCard />
      </div>

      {/* Bottom Section: Courses & News/Legislation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SkillGapsCard />
        <NewsAlertsCard />
      </div>
      
    </div>
  );
}
"use client";

import OverviewHeader from "./_components/OverviewHeader";
import ExecutiveSummary from "./_components/ExecutiveSummary";
import CoreDeliverables from "./_components/CoreDeliverables";
import GettingStarted from "./_components/GettingStarted";
import OpenSourceFooter from "./_components/OpenSourceFooter";

export default function OverviewPage() {
  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto pb-16 animate-fade-in font-sans selection:bg-primary/20">
      <OverviewHeader />
      <div className="space-y-16">
        <ExecutiveSummary />
        <CoreDeliverables />
        <GettingStarted />
        <OpenSourceFooter />
      </div>
    </div>
  );
}
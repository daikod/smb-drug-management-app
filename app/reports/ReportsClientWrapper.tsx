"use client";

import dynamic from "next/dynamic";

// ✅ Dynamically load ReportsPanel without SSR
const ReportsPanel = dynamic(() => import("./ReportsPanel"), { ssr: false });

export default function ReportsClientWrapper() {
  return <ReportsPanel />;
}

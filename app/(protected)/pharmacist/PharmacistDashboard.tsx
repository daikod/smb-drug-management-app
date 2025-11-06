"use client";

import { useEffect, useState } from "react";

export default function PharmacistDashboard() {
  const [report, setReport] = useState<any>(null);

  useEffect(() => {
    fetch("/api/reports")
      .then(res => res.json())
      .then(setReport)
      .catch(console.error);
  }, []);

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Pharmacist Dashboard</h1>

      {report ? (
        <div className="bg-blue-50 p-4 rounded-xl shadow">
          <h2 className="text-lg font-semibold">AI Daily Summary</h2>
          <p className="text-gray-800 whitespace-pre-line">{report.insights}</p>
        </div>
      ) : (
        <p>Generating summary...</p>
      )}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";
import Link from "next/link";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

interface ReportDrug {
  id: string;
  name: string;
  quantityAvailable: number;
  reorderLevel: number;
  expiryDate: string;
  supplier: string;
}

export default function ReportsPanel() {
  const [drugs, setDrugs] = useState<ReportDrug[]>([]);
  const [role, setRole] = useState<string>("");
  const [aiSummary, setAiSummary] = useState<string>("Generating intelligent summary...");

  // ✅ Load report data (Admin → all drugs, Pharmacist → assigned drugs)
  useEffect(() => {
    async function fetchReports() {
      try {
        const res = await fetch("/api/reports");
        const data = await res.json();
        setDrugs(data.drugs);
        setRole(data.role);

        // Request AI summary
        const summaryRes = await fetch("/api/ai-summary", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ drugs: data.drugs, role: data.role }),
        });
        let summaryData: any = {};
          try {
            const text = await summaryRes.text();
            summaryData = text ? JSON.parse(text) : {};
          } catch {
            summaryData = {};
      }
      setAiSummary(summaryData.summary || "No insights available.");
      } catch (err) {
        console.error("Error loading reports:", err);
        setAiSummary("Unable to generate summary.");
      }
    }
    fetchReports();
  }, []);

  // Chart data
  const barData = {
    labels: drugs.map((d) => d.name),
    datasets: [
      {
        label: "Available Quantity",
        data: drugs.map((d) => d.quantityAvailable),
        backgroundColor: "rgba(37, 99, 235, 0.5)", // blue
      },
      {
        label: "Reorder Level",
        data: drugs.map((d) => d.reorderLevel),
        backgroundColor: "rgba(239, 68, 68, 0.5)", // red
      },
    ],
  };

  const doughnutData = {
    labels: ["Safe Stock", "Low Stock"],
    datasets: [
      {
        data: [
          drugs.filter((d) => d.quantityAvailable > d.reorderLevel).length,
          drugs.filter((d) => d.quantityAvailable <= d.reorderLevel).length,
        ],
        backgroundColor: ["#22c55e", "#f59e0b"],
      },
    ],
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Inventory Reports</h2>
        <span className="text-sm bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
          Role: {role}
        </span>
      </div>

      {/* ✅ Return to Dashboard Link */}
      <div className="flex justify-end">
        <Link
          href={role === "ADMIN" ? "/admin" : "/pharmacist"}
          className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition"
        >
          ← Return to Dashboard
        </Link>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Stock vs Reorder Levels</h3>
          <Bar
            data={barData}
            options={{
              responsive: true,
              plugins: {
                legend: { position: "bottom" },
                title: { display: false },
              },
            }}
          />
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Stock Health Overview</h3>
          <Doughnut data={doughnutData} />
        </div>
      </div>

      {/* AI Insights Section */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 shadow-sm">
        <h3 className="text-lg font-semibold text-blue-800 mb-2">AI-Generated Summary</h3>
        <p className="text-sm text-gray-700 whitespace-pre-line">{aiSummary}</p>
      </div>
    </div>
  );
}

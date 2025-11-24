import { useEffect, useState } from "react";
import API from "../../utils/api";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function AdminAnalytics() {
  const [stats, setStats] = useState({
    total: 0,
    approved: 0,
    pending: 0,
    rejected: 0,
  });

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await API.get("/api/admin/analytics");
        setStats(res.data);
      } catch (err) {
        console.error("Analytics load failed");
      }
    };

    fetchAnalytics();
  }, []);

  const chartData = {
    labels: ["Approved", "Pending", "Rejected"],
    datasets: [
      {
        data: [stats.approved, stats.pending, stats.rejected],
        backgroundColor: ["#4CAF50", "#FF9800", "#F44336"],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* ✅ Header */}
      <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-12">
        📊 Admin Analytics
      </h1>

      {/* ✅ GreenBin Style Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-6xl mx-auto mb-16">
        <StatCard title="Total Projects" value={stats.total} color="green" />
        <StatCard title="Approved" value={stats.approved} color="blue" />
        <StatCard title="Pending" value={stats.pending} color="orange" />
        <StatCard title="Rejected" value={stats.rejected} color="red" />
      </div>

      {/* ✅ Pie Chart Card */}
      <div className="max-w-lg mx-auto bg-white p-8 rounded-2xl shadow-lg">
        <Pie data={chartData} />
      </div>
    </div>
  );
}

/* ✅ GreenBin Card Component */
function StatCard({ title, value, color }) {
  const colorMap = {
    green: "border-green-500 bg-green-50 text-green-700",
    blue: "border-blue-500 bg-blue-50 text-blue-700",
    orange: "border-orange-500 bg-orange-50 text-orange-700",
    red: "border-red-500 bg-red-50 text-red-700",
  };

  return (
    <div
      className={`bg-white border-l-8 ${colorMap[color]} p-6 rounded-xl shadow hover:shadow-lg transition`}
    >
      <h3 className="text-sm font-semibold">{title}</h3>
      <p className="text-3xl font-bold mt-2">{value}</p>
    </div>
  );
}

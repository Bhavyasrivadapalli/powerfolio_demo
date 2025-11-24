import { useEffect, useState } from "react";
import API from "../../utils/api";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Analytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchSummary = async () => {
    try {
      const res = await API.get("/api/analytics/summary", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setData(res.data);
    } catch (err) {
      console.error("Analytics error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  if (loading) {
    return (
      <div className="p-10 text-center text-xl font-semibold">
        Loading analytics...
      </div>
    );
  }

  const chartData = {
    labels: ["Approved", "Pending", "Rejected"],
    datasets: [
      {
        data: [data.approved, data.pending, data.rejected],
        backgroundColor: ["#4CAF50", "#FF9800", "#F44336"],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* Title */}
      <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-10">
        📊 Analytics Dashboard
      </h1>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
        <StatCard title="Total Projects" value={data.total} color="green" />
        <StatCard title="Approved" value={data.approved} color="blue" />
        <StatCard title="Pending" value={data.pending} color="orange" />
        <StatCard title="Rejected" value={data.rejected} color="red" />
      </div>

      {/* Pie Chart */}
      <div className="max-w-lg mx-auto mt-16 bg-white p-6 rounded-2xl shadow">
        <Pie data={chartData} />
      </div>
    </div>
  );
}

/* ✅ GreenBin Style Cards */
function StatCard({ title, value, color }) {
  const colorMap = {
    green: "border-green-500 bg-green-50 text-green-700",
    blue: "border-blue-500 bg-blue-50 text-blue-700",
    orange: "border-orange-500 bg-orange-50 text-orange-700",
    red: "border-red-500 bg-red-50 text-red-700",
  };

  return (
    <div
      className={`bg-white border-l-8 ${colorMap[color]} p-6 rounded-xl shadow`}
    >
      <h3 className="text-sm font-semibold">{title}</h3>
      <p className="text-3xl font-bold mt-2">{value}</p>
    </div>
  );
}

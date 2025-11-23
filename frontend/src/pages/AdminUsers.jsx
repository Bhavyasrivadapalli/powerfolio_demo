import { useEffect, useState } from "react";
import API from "../../utils/api";
import { User } from "lucide-react";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await API.get("/admin/users");
        setUsers(res.data);
      } catch (err) {
        console.error("Failed to load users");
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* ✅ Header */}
      <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-12">
        👥 User Management
      </h1>

      {/* ✅ User Cards */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {users.map((user) => (
          <div
            key={user._id}
            className="bg-white rounded-2xl p-6 shadow hover:shadow-lg transition border-t-4 border-indigo-500"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-2 rounded-full">
                <User size={22} />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">
                {user.name}
              </h3>
            </div>

            <p className="text-sm text-gray-600 mb-2">
              📧 {user.email}
            </p>

            <span
              className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold ${
                user.role === "admin"
                  ? "bg-purple-100 text-purple-600"
                  : "bg-blue-100 text-blue-600"
              }`}
            >
              {user.role.toUpperCase()}
            </span>
          </div>
        ))}

        {users.length === 0 && (
          <p className="col-span-full text-center text-gray-500">
            No users found
          </p>
        )}
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { User } from "lucide-react";

export default function AccountPage() {
  const [user, setUser] = useState<{ name: string; email: string } | null>(
    null,
  );

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <div className="flex gap-8 items-start">
      <section className="flex-1 min-w-0 border border-gray-100 rounded-xl p-8 space-y-8">
        <div>
          <h1 className="font-display text-2xl italic text-gray-900 mb-1">
            My Account
          </h1>
          <p className="text-sm text-gray-400 font-light">
            Manage your profile and preferences
          </p>
        </div>

        <div className="flex items-center gap-5 p-6 border border-gray-100 rounded-xl bg-white">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 shrink-0">
            <User size={28} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-gray-900 text-base capitalize">
              {user?.name || "Guest"}
            </p>
            <p className="text-sm text-gray-400 font-light">{user?.email}</p>
          </div>
          <button className="text-xs border border-gray-200 rounded-lg px-4 py-2 text-gray-600 hover:border-gray-400 hover:text-gray-900 transition-colors">
            Edit
          </button>
        </div>

        {user && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="border border-gray-100 rounded-xl p-5">
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">
                Full Name
              </p>
              <p className="text-sm text-gray-800 font-light capitalize">
                {user.name}
              </p>
            </div>
            <div className="border border-gray-100 rounded-xl p-5">
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">
                Email
              </p>
              <p className="text-sm text-gray-800 font-light">{user.email}</p>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

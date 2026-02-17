"use client";
import { createClient } from "@/utils/supabase/client";
import { useState, useRef, useEffect } from "react";
import { LogOut, User } from "lucide-react";

export default function AuthButton({ user }: { user: any }) {
    const supabase = createClient();
    const [open, setOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const handleLogin = async () => {
        await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
            },
        });
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        window.location.href = "/";
    };

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // If user not logged in
    if (!user) {
        return (
            <button
                onClick={handleLogin}
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-medium transition"
            >
                Sign in with Google
            </button>
        );
    }

    return (
        <div className="relative" ref={menuRef}>
            {/* Avatar Button */}
            <button
                onClick={() => setOpen(!open)}
                className="w-9 h-9 rounded-full bg-zinc-900 text-white flex items-center justify-center text-sm font-medium hover:opacity-80 transition"
            >
                {user?.user_metadata?.avatar_url ? (
                    <img
                        src={user.user_metadata.avatar_url}
                        alt="profile"
                        className="w-9 h-9 rounded-full object-cover"
                    />
                ) : (
                    user.email?.charAt(0).toUpperCase()
                )}
            </button>

            {/* Dropdown */}
            {open && (
                <div className="absolute right-0 mt-3 w-56 bg-white border border-zinc-100 rounded-xl shadow-lg p-2">
                    <div className="px-3 py-2 text-sm text-zinc-500 border-b border-zinc-100 truncate">
                        {user.email}
                    </div>

                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-50 rounded-lg transition"
                    >
                        <LogOut className="w-4 h-4" />
                        Logout
                    </button>
                </div>
            )}
        </div>
    );
}

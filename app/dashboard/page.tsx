import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import BookmarkManager from "@/components/BookmarkManager";
import AuthButton from "@/components/AuthButton";

export default async function DashboardPage() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/");
    }

    const { data: bookmarks } = await supabase
        .from("bookmarks")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

    return (
        <div className="min-h-screen bg-white text-zinc-900 flex flex-col">

            {/* NAVBAR */}
            <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-zinc-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex justify-between items-center">

                    {/* Branding */}
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 sm:w-9 sm:h-9 bg-zinc-900 rounded-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                        </div>

                        <div className="leading-none">
                            <span className="font-serif italic text-lg sm:text-xl tracking-tight block">
                                Smart Bookmark
                            </span>
                        </div>
                    </div>

                    {/* Right Side */}
                    <div className="flex items-center gap-4 sm:gap-6">
                        <div className="hidden md:block h-6 w-px bg-zinc-200" />
                        <AuthButton user={user} />
                    </div>
                </div>
            </nav>

            {/* HERO SECTION */}
            <header className="pt-12 sm:pt-16 pb-8 sm:pb-12 px-4 sm:px-6">
                <div className="max-w-6xl mx-auto text-center">
                    <h1 className="text-3xl sm:text-5xl md:text-7xl font-serif text-zinc-900 mb-4 tracking-tight italic leading-tight">
                        Your Saved Resources
                    </h1>

                    <p className="text-zinc-500 max-w-xl mx-auto font-light leading-relaxed mt-4">
                        Save, organize, and preserve your most valuable discoveries.
                    </p>
                </div>
            </header>

            {/* MAIN CONTENT */}
            <main className="flex-1 px-4 sm:px-6 lg:px-8">
                <div className="max-w-5xl mx-auto">
                    <BookmarkManager
                        initialBookmarks={bookmarks ?? []}
                        userId={user.id}
                    />
                </div>
            </main>


        </div>
    );

}

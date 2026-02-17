import { createClient } from "@/utils/supabase/server";
import AuthButton from "@/components/AuthButton";
import BookmarkManager from "@/components/BookmarkManager";
import { ArrowRight } from "lucide-react";

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let bookmarks: any[] = [];

  if (user) {
    const { data } = await supabase
      .from('bookmarks')
      .select('*')
      .order('created_at', { ascending: false });
    bookmarks = data || [];
  }

  return (
    <div className="min-h-screen bg-white selection:bg-zinc-200">
      {/* Nav */}
      <nav className="sticky top-0 z-50 w-full bg-white/70 backdrop-blur-xl border-b border-zinc-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-20 flex justify-between items-center">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="w-8 h-8 sm:w-9 sm:h-9 bg-zinc-900 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
            </div>
            <span className="font-serif italic text-2xl tracking-tighter text-zinc-900">
              Smart Bookmark
            </span>
          </div>
          <AuthButton user={user} />
        </div>
      </nav>

      {/* HERO */}
      <main className="relative">
        {user ? (
          <div className="py-12 px-4 sm:px-8">
            <div className="max-w-6xl mx-auto">
              <header className="mb-12 text-center md:text-left">
                <h2 className="text-4xl md:text-5xl font-serif text-zinc-900 italic mb-2">
                  Welcome back, {user.email?.split('@')[0]}
                </h2>
                <p className="text-zinc-500 font-light tracking-wide uppercase text-xs">
                  Your curated digital collection
                </p>
              </header>
              <BookmarkManager initialBookmarks={bookmarks} userId={user.id} />
            </div>
          </div>
        ) : (
          <div className="relative flex flex-col items-center overflow-hidden bg-linear-to-b from-white via-zinc-50 to-white">

            {/* Soft Background Glow */}
            <div className="absolute -top-50 w-150 h-150 bg-linear-to-r from-blue-200/30 via-purple-200/30 to-pink-200/30 blur-3xl rounded-full opacity-60"></div>

            {/* Hero Section */}
            <section className="relative pt-32 pb-28 px-6 text-center max-w-5xl mx-auto">

              {/*Badge */}
              <div className="inline-flex items-center gap-2 bg-zinc-100 text-zinc-600 px-4 py-1.5 rounded-full text-sm font-medium mb-8 border border-zinc-200 shadow-sm">
                ✨ Smart Bookmark Manager
              </div>

              {/* Main Heading */}
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif leading-[0.95] tracking-tight text-zinc-900 mb-8">
                Organize your <br />
                <span className="bg-linear-to-r from-zinc-900 via-zinc-500 to-zinc-300 bg-clip-text text-transparent font-sans font-extrabold not-italic">
                  digital world.
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-zinc-500 text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed mb-12">
                A minimal, secure, and lightning-fast vault designed to keep your most important links beautifully organized.
              </p>
            </section>
          </div>

        )}
      </main>


    </div>
  );
}

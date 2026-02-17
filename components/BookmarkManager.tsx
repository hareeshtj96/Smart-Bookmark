"use client";

import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { toast, Toaster } from "sonner";
import { Trash2, ExternalLink, Plus, Globe, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Bookmark = {
    id: number;
    title: string;
    url: string;
};

export default function BookmarkManager({
    initialBookmarks,
    userId,
}: {
    initialBookmarks: Bookmark[];
    userId: string;
}) {
    const [bookmarks, setBookmarks] = useState<Bookmark[]>(initialBookmarks);
    const [title, setTitle] = useState("");
    const [url, setUrl] = useState("");
    const [isAdding, setIsAdding] = useState(false);
    const supabase = createClient();

    // Pagination
    const ITEMS_PER_PAGE = 5;
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(bookmarks.length / ITEMS_PER_PAGE);

    const paginatedBookmarks = bookmarks.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    useEffect(() => {
        const channel = supabase
            .channel('bookmarks-changes')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'bookmarks',
                    filter: `user_id=eq.${userId}`,
                },
                (payload) => {
                    if (payload.eventType === 'INSERT') {
                        const newBookmark = payload.new as Bookmark;

                        setBookmarks((prev) => {
                            const exists = prev.some((b) => b.id === newBookmark.id);
                            if (exists) return prev; // prevent duplicate
                            return [...prev, newBookmark];
                        });
                    }

                    if (payload.eventType === 'DELETE') {
                        setBookmarks((prev) =>
                            prev.filter((b) => b.id !== (payload.old as Bookmark).id)
                        );
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [userId]);


    const addBookmark = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !url) return;

        // Check if url exists
        const exists = bookmarks.some(
            (b) => b.url.trim().toLowerCase() === url.trim().toLowerCase()
        );

        if (exists) {
            toast.error("This URL already exists in your library");
            return;
        }

        setIsAdding(true);
        const { data, error } = await supabase
            .from("bookmarks")
            .insert({ title, url, user_id: userId })
            .select()
            .single();

        if (error) {
            toast.error("Failed to add bookmark");
        } else {
            // setBookmarks((prev) => [...prev, data]);
            toast.success("Bookmark added successfully");
            setTitle("");
            setUrl("");
        }
        setIsAdding(false);
    };

    const deleteBookmark = async (id: number) => {
        //  Confirm Dialog 
        toast("Delete this bookmark?", {
            action: {
                label: "Delete",
                onClick: async () => {
                    const { error } = await supabase
                        .from("bookmarks")
                        .delete()
                        .eq("id", id);

                    if (error) {
                        toast.error("Could not delete");
                    } else {
                        toast.success("Deleted");
                    }
                },
            },
            cancel: {
                label: "Cancel",
                onClick: () => { },
            },
            className: "bg-white",
            actionButtonStyle: {
                backgroundColor: "#ef4444",
                color: "white",
            },
        });

    };

    return (
        <div className="max-w-2xl mx-auto px-4 pb-20">
            <Toaster position="top-center" richColors />

            {/* Input Form */}
            <form
                onSubmit={addBookmark}
                className="group mb-12 bg-white/50 border border-zinc-200 p-2 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 focus-within:ring-1 focus-within:ring-zinc-400"
            >
                <div className="flex flex-col  gap-3">
                    <input
                        type="text"
                        placeholder="Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="flex-1 bg-transparent px-4 py-2 outline-none text-zinc-800 placeholder:text-zinc-400"
                    />
                    <input
                        type="url"
                        placeholder="https://..."
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        className="flex-1 bg-transparent px-4 py-2 outline-none text-zinc-800 placeholder:text-zinc-400"
                    />
                    <button
                        type="submit"
                        disabled={isAdding}
                        className="bg-green-600 text-white px-6 py-2 rounded-xl hover:bg-green-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {isAdding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                        <span>Add</span>
                    </button>
                </div>
            </form>

            {/* Bookmarks List */}
            <div className="space-y-4">
                <AnimatePresence mode="popLayout">
                    {paginatedBookmarks.map((bookmark) => (
                        <motion.div
                            key={bookmark.id}
                            layout
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="group bg-white border border-zinc-100 p-4 rounded-xl flex items-center justify-between hover:border-zinc-300 transition-all shadow-[0_1px_3px_rgba(0,0,0,0.02)]"
                        >
                            <div className="flex items-start gap-4 overflow-hidden">
                                <div className="w-10 h-10 rounded-lg bg-zinc-50 flex items-center justify-center border border-zinc-100 group-hover:bg-zinc-100 transition-colors">
                                    <Globe className="w-5 h-5 text-zinc-400" />
                                </div>
                                <div className="overflow-hidden">
                                    <a
                                        href={bookmark.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="font-medium text-zinc-900 hover:text-blue-600 flex items-center gap-1 transition-colors"
                                    >
                                        {bookmark.title}
                                        <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </a>
                                    <p className="text-sm text-zinc-400 truncate mt-0.5">{new URL(bookmark.url).hostname}</p>
                                </div>
                            </div>

                            <button
                                onClick={() => deleteBookmark(bookmark.id)}
                                className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {bookmarks.length === 0 && (
                    <div className="text-center py-20 border-2 border-dashed border-zinc-100 rounded-3xl">
                        <p className="text-zinc-400 font-light text-lg">Your collection is empty.</p>
                    </div>
                )}

                {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-4 mt-10">
                        <button
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage((prev) => prev - 1)}
                            className="px-4 py-2 rounded-lg border text-sm disabled:opacity-40"
                        >
                            Previous
                        </button>

                        <span className="text-sm text-zinc-500">
                            Page {currentPage} of {totalPages}
                        </span>

                        <button
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage((prev) => prev + 1)}
                            className="px-4 py-2 rounded-lg border text-sm disabled:opacity-40"
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
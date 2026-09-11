import React, { useState, useEffect } from "react";
import { Bookmark, Lock } from "lucide-react";
import { base44 } from "@/api/base44Client";
import PostCard from "@/components/PostCard";

export default function ProfileSaved({ currentUser, theme, inModal }) {
  const [savedPosts, setSavedPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadSaved = async () => {
    if (!currentUser) { setLoading(false); return; }
    try {
      const saved = await base44.entities.SavedPost.list("-created_date", 50);
      const postIds = saved.map(s => s.post_id).filter(Boolean);
      if (postIds.length === 0) { setSavedPosts([]); setLoading(false); return; }
      const posts = await Promise.all(
        postIds.map(id => base44.entities.Post.get(id).catch(() => null))
      );
      setSavedPosts(posts.filter(Boolean));
    } catch (e) {}
    setLoading(false);
  };

  useEffect(() => { loadSaved(); }, [currentUser]);

  const header = !inModal && (
    <p className="text-xs mb-3 flex items-center gap-1" style={{ color: theme.primary, opacity: 0.5 }}>
      <Lock className="w-3 h-3" /> Apenas você vê seus posts salvos.
    </p>
  );

  if (loading) {
    return (
      <div>
        {header}
        <div className="bg-white rounded-2xl border-2 p-8 text-center" style={{ borderColor: theme.light }}>
          <div className="w-6 h-6 border-2 rounded-full animate-spin mx-auto" style={{ borderColor: theme.light, borderTopColor: theme.primary }} />
        </div>
      </div>
    );
  }

  return (
    <div>
      {header}
      {savedPosts.length === 0 ? (
        <div className="bg-white rounded-2xl border-2 p-8 text-center" style={{ borderColor: theme.light }}>
          <Bookmark className="w-10 h-10 mx-auto mb-2" style={{ color: theme.primary, opacity: 0.3 }} />
          <p className="text-sm" style={{ color: theme.primary, opacity: 0.5 }}>
            Posts que você salvar na Comunidade aparecerão aqui.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {savedPosts.map(p => (
            <PostCard key={p.id} post={p} currentUser={currentUser} onSavedChanged={loadSaved} />
          ))}
        </div>
      )}
    </div>
  );
}
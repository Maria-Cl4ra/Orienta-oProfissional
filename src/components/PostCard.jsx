import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal, Pencil, Trash2, Send } from "lucide-react";
import { base44 } from "@/api/base44Client";
import Avatar from "@/components/Avatar";
import CommentSection from "@/components/CommentSection";
import { timeAgo } from "@/lib/social";
import { useToast } from "@/components/ui/use-toast";

export default function PostCard({ post, currentUser, onDeleted, onSavedChanged }) {
  const { toast } = useToast();
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes_count || 0);
  const [showComments, setShowComments] = useState(false);
  const [commentCount, setCommentCount] = useState(post.comments_count || 0);
  const [editing, setEditing] = useState(false);
  const [editContent, setEditContent] = useState(post.content);
  const [menuOpen, setMenuOpen] = useState(false);
  const [authorProfileId, setAuthorProfileId] = useState(null);
  const [saved, setSaved] = useState(false);

  const isAuthor = currentUser && post.created_by_id === currentUser.id;

  useEffect(() => {
    base44.entities.Profile.filter({ created_by_id: post.created_by_id }).then(profs => {
      if (profs[0]) setAuthorProfileId(profs[0].id);
    }).catch(() => {});
  }, [post.created_by_id]);

  useEffect(() => {
    if (!currentUser) return;
    base44.entities.Like.filter({ target_type: "post", target_id: post.id, created_by_id: currentUser.id })
      .then(likes => setLiked(likes.length > 0))
      .catch(() => {});
    base44.entities.SavedPost.filter({ post_id: post.id, created_by_id: currentUser.id })
      .then(records => setSaved(records.length > 0))
      .catch(() => {});
  }, [post.id, currentUser]);

  const toggleSave = async () => {
    if (!currentUser) { toast({ title: "Faça login para salvar", variant: "destructive" }); return; }
    try {
      if (saved) {
        const existing = await base44.entities.SavedPost.filter({ post_id: post.id, created_by_id: currentUser.id });
        if (existing[0]) await base44.entities.SavedPost.delete(existing[0].id);
        setSaved(false);
        toast({ title: "Removido dos salvos" });
      } else {
        await base44.entities.SavedPost.create({ post_id: post.id });
        setSaved(true);
        toast({ title: "Salvo!" });
      }
      onSavedChanged?.();
    } catch (e) {
      toast({ title: "Erro ao salvar", variant: "destructive" });
    }
  };

  const toggleLike = async () => {
    if (!currentUser) { toast({ title: "Faça login para curtir", variant: "destructive" }); return; }
    try {
      if (liked) {
        const existing = await base44.entities.Like.filter({ target_type: "post", target_id: post.id, created_by_id: currentUser.id });
        if (existing[0]) await base44.entities.Like.delete(existing[0].id);
        setLiked(false);
        setLikeCount(c => Math.max(0, c - 1));
        await base44.entities.Post.update(post.id, { likes_count: Math.max(0, likeCount - 1) });
      } else {
        await base44.entities.Like.create({ target_type: "post", target_id: post.id });
        setLiked(true);
        setLikeCount(c => c + 1);
        await base44.entities.Post.update(post.id, { likes_count: likeCount + 1 });
      }
    } catch (e) {
      toast({ title: "Erro ao curtir", variant: "destructive" });
    }
  };

  const handleDelete = async () => {
    await base44.entities.Post.delete(post.id);
    toast({ title: "Postagem excluída" });
    onDeleted?.(post.id);
  };

  const handleSaveEdit = async () => {
    await base44.entities.Post.update(post.id, { content: editContent, edited: true });
    post.content = editContent;
    post.edited = true;
    setEditing(false);
    setMenuOpen(false);
    toast({ title: "Postagem editada" });
  };

  return (
    <div className="bg-white rounded-2xl border-2 border-owl-purpleLight/30 shadow-sm hover:shadow-md transition-shadow overflow-hidden animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <Link to={authorProfileId ? `/perfil/${authorProfileId}` : "#"} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <Avatar src={post.author_avatar} name={post.author_name} size={42} />
          <div>
            <p className="font-bold text-sm text-owl-navy hover:underline cursor-pointer">{post.author_name || "Anônimo"}</p>
            <p className="text-xs text-owl-navy/40">{timeAgo(post.created_date)}{post.edited && " • editado"}</p>
          </div>
        </Link>
        {isAuthor && (
          <div className="relative">
            <button onClick={() => setMenuOpen(!menuOpen)} className="p-2 rounded-full hover:bg-owl-purpleLight/30 transition-colors">
              <MoreHorizontal className="w-5 h-5 text-owl-navy/60" />
            </button>
            {menuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                <div className="absolute right-0 top-10 z-20 bg-white rounded-xl shadow-lg border border-owl-purpleLight/30 py-1 w-36">
                  <button onClick={() => { setEditing(true); setMenuOpen(false); }} className="w-full text-left px-4 py-2 text-sm hover:bg-owl-purpleLight/20 flex items-center gap-2 text-owl-navy">
                    <Pencil className="w-3.5 h-3.5" /> Editar
                  </button>
                  <button onClick={handleDelete} className="w-full text-left px-4 py-2 text-sm hover:bg-red-50 flex items-center gap-2 text-red-600">
                    <Trash2 className="w-3.5 h-3.5" /> Excluir
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="px-4 pb-3">
        {editing ? (
          <div className="space-y-2">
            <textarea value={editContent} onChange={e => setEditContent(e.target.value)} rows={4} className="w-full px-3 py-2 rounded-xl border border-owl-purpleLight/40 focus:border-owl-purple focus:outline-none text-sm resize-none" />
            <div className="flex gap-2">
              <button onClick={handleSaveEdit} className="px-4 py-1.5 bg-owl-navy text-white rounded-full text-xs font-semibold">Salvar</button>
              <button onClick={() => setEditing(false)} className="px-4 py-1.5 border border-owl-navy/20 text-owl-navy rounded-full text-xs font-semibold">Cancelar</button>
            </div>
          </div>
        ) : (
          <p className="text-sm text-owl-navy leading-relaxed whitespace-pre-wrap">{post.content}</p>
        )}
      </div>

      {/* Images */}
      {post.images && post.images.length > 0 && (
        <div className={post.images.length === 1 ? "grid grid-cols-1" : "grid grid-cols-2 gap-0.5"}>
          {post.images.map((img, i) => (
            <img key={i} src={img} alt="" className="w-full max-h-96 object-cover" />
          ))}
        </div>
      )}

      {/* Tags + Category */}
      <div className="flex flex-wrap items-center gap-2 px-4 pt-2">
        <span className="px-2.5 py-0.5 bg-owl-purpleLight/30 text-owl-navy text-xs font-bold rounded-full">{post.category}</span>
        {post.tags?.map((tag, i) => (
          <span key={i} className="text-xs text-owl-purple">#{tag}</span>
        ))}
      </div>

      {/* Stats bar */}
      <div className="px-4 py-2 text-xs text-owl-navy/40 flex gap-4 border-t border-owl-purpleLight/20 mt-2">
        <span>{likeCount} curtida{likeCount !== 1 ? "s" : ""}</span>
        <span>{commentCount} comentário{commentCount !== 1 ? "s" : ""}</span>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-around px-2 py-1 border-t border-owl-purpleLight/20">
        <button onClick={toggleLike} className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium transition-colors ${liked ? "text-red-500" : "text-owl-navy/60 hover:bg-owl-purpleLight/20"}`}>
          <Heart className={`w-4 h-4 ${liked ? "fill-red-500" : ""}`} /> Curtir
        </button>
        <button onClick={() => setShowComments(!showComments)} className="flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium text-owl-navy/60 hover:bg-owl-purpleLight/20 transition-colors">
          <MessageCircle className="w-4 h-4" /> Comentar
        </button>
        <button onClick={() => toast({ title: "Compartilhamento em breve!" })} className="flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium text-owl-navy/60 hover:bg-owl-purpleLight/20 transition-colors">
          <Share2 className="w-4 h-4" />
        </button>
        <button onClick={toggleSave} className={`px-3 py-2 rounded-full text-sm font-medium transition-colors ${saved ? "text-owl-purple" : "text-owl-navy/60 hover:bg-owl-purpleLight/20"}`}>
          <Bookmark className={`w-4 h-4 ${saved ? "fill-owl-purple" : ""}`} />
        </button>
      </div>

      {/* Comments */}
      {showComments && (
        <div className="border-t border-owl-purpleLight/20 bg-owl-beige/30">
          <CommentSection postId={post.id} currentUser={currentUser} onCommentAdded={() => setCommentCount(c => c + 1)} />
        </div>
      )}
    </div>
  );
}
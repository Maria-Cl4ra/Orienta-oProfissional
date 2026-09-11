import React, { useState, useEffect } from "react";
import { Send, Heart, Trash2, Reply } from "lucide-react";
import { base44 } from "@/api/base44Client";
import Avatar from "@/components/Avatar";
import { timeAgo } from "@/lib/social";
import { useToast } from "@/components/ui/use-toast";

export default function CommentSection({ postId, currentUser, onCommentAdded }) {
  const { toast } = useToast();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [likedComments, setLikedComments] = useState({});

  const loadComments = async () => {
    try {
      const data = await base44.entities.Comment.filter({ post_id: postId }, "created_date");
      setComments(data);
    } catch (e) {}
  };

  useEffect(() => { loadComments(); }, [postId]);

  useEffect(() => {
    if (!currentUser || comments.length === 0) return;
    comments.forEach(async (c) => {
      try {
        const likes = await base44.entities.Like.filter({ target_type: "comment", target_id: c.id, created_by_id: currentUser.id });
        if (likes.length > 0) setLikedComments(prev => ({ ...prev, [c.id]: true }));
      } catch (e) {}
    });
  }, [comments, currentUser]);

  const handleAdd = async () => {
    if (!currentUser) { toast({ title: "Faça login para comentar", variant: "destructive" }); return; }
    if (!newComment.trim()) return;
    try {
      await base44.entities.Comment.create({
        post_id: postId,
        content: newComment,
        author_name: currentUser.full_name || "Usuário",
        author_avatar: ""
      });
      setNewComment("");
      loadComments();
      onCommentAdded?.();
      await base44.entities.Post.update(postId, { comments_count: comments.length + 1 });
    } catch (e) {
      toast({ title: "Erro ao comentar", variant: "destructive" });
    }
  };

  const handleReply = async (parentId) => {
    if (!currentUser) { toast({ title: "Faça login", variant: "destructive" }); return; }
    if (!replyText.trim()) return;
    await base44.entities.Comment.create({
      post_id: postId,
      content: replyText,
      parent_id: parentId,
      author_name: currentUser.full_name || "Usuário",
      author_avatar: ""
    });
    setReplyText("");
    setReplyingTo(null);
    loadComments();
  };

  const toggleCommentLike = async (comment) => {
    if (!currentUser) { toast({ title: "Faça login", variant: "destructive" }); return; }
    const isLiked = likedComments[comment.id];
    try {
      if (isLiked) {
        const existing = await base44.entities.Like.filter({ target_type: "comment", target_id: comment.id, created_by_id: currentUser.id });
        if (existing[0]) await base44.entities.Like.delete(existing[0].id);
        setLikedComments(prev => ({ ...prev, [comment.id]: false }));
        await base44.entities.Comment.update(comment.id, { likes_count: Math.max(0, (comment.likes_count || 0) - 1) });
      } else {
        await base44.entities.Like.create({ target_type: "comment", target_id: comment.id });
        setLikedComments(prev => ({ ...prev, [comment.id]: true }));
        await base44.entities.Comment.update(comment.id, { likes_count: (comment.likes_count || 0) + 1 });
      }
      loadComments();
    } catch (e) {
      toast({ title: "Erro", variant: "destructive" });
    }
  };

  const handleDelete = async (commentId) => {
    await base44.entities.Comment.delete(commentId);
    toast({ title: "Comentário excluído" });
    loadComments();
  };

  const topLevel = comments.filter(c => !c.parent_id);
  const getReplies = (parentId) => comments.filter(c => c.parent_id === parentId);

  const renderComment = (comment, isReply = false) => {
    const isAuthor = currentUser && comment.created_by_id === currentUser.id;
    return (
      <div key={comment.id} className={`flex gap-2 ${isReply ? "ml-10" : ""}`}>
        <Avatar src={comment.author_avatar} name={comment.author_name} size={32} />
        <div className="flex-1 min-w-0">
          <div className="bg-white rounded-2xl px-3 py-2 border border-owl-purpleLight/20">
            <p className="font-bold text-xs text-owl-navy">{comment.author_name || "Anônimo"}</p>
            <p className="text-sm text-owl-navy/80 mt-0.5 break-words">{comment.content}</p>
          </div>
          <div className="flex items-center gap-3 mt-1 ml-2">
            <span className="text-xs text-owl-navy/30">{timeAgo(comment.created_date)}</span>
            <button onClick={() => toggleCommentLike(comment)} className={`flex items-center gap-1 text-xs ${likedComments[comment.id] ? "text-red-500" : "text-owl-navy/40 hover:text-owl-purple"}`}>
              <Heart className={`w-3 h-3 ${likedComments[comment.id] ? "fill-red-500" : ""}`} />
              {(comment.likes_count || 0) > 0 && comment.likes_count}
            </button>
            {!isReply && (
              <button onClick={() => { setReplyingTo(replyingTo === comment.id ? null : comment.id); setReplyText(""); }} className="text-xs text-owl-navy/40 hover:text-owl-purple flex items-center gap-1">
                <Reply className="w-3 h-3" /> Responder
              </button>
            )}
            {isAuthor && (
              <button onClick={() => handleDelete(comment.id)} className="text-xs text-owl-navy/40 hover:text-red-500">
                <Trash2 className="w-3 h-3" />
              </button>
            )}
          </div>
          {replyingTo === comment.id && (
            <div className="flex gap-2 mt-2">
              <input
                value={replyText}
                onChange={e => setReplyText(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleReply(comment.id)}
                placeholder="Escreva uma resposta..."
                className="flex-1 px-3 py-1.5 rounded-full border border-owl-purpleLight/40 focus:border-owl-purple focus:outline-none text-xs"
                autoFocus
              />
              <button onClick={() => handleReply(comment.id)} className="p-1.5 bg-owl-navy text-white rounded-full"><Send className="w-3 h-3" /></button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 space-y-3">
      <div className="flex gap-2 items-start">
        <Avatar src={""} name={currentUser?.full_name} size={32} />
        <div className="flex-1 flex gap-2">
          <input
            value={newComment}
            onChange={e => setNewComment(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleAdd()}
            placeholder="Escreva um comentário..."
            className="flex-1 px-4 py-2 rounded-full border border-owl-purpleLight/40 focus:border-owl-purple focus:outline-none text-sm"
          />
          <button onClick={handleAdd} className="p-2 bg-owl-navy text-white rounded-full hover:bg-owl-navyDeep transition-colors"><Send className="w-4 h-4" /></button>
        </div>
      </div>

      {topLevel.length === 0 && !newComment && (
        <p className="text-center text-xs text-owl-navy/30 py-2">Seja o primeiro a comentar 💬</p>
      )}

      {topLevel.map(comment => (
        <div key={comment.id} className="space-y-2">
          {renderComment(comment)}
          {getReplies(comment.id).map(reply => renderComment(reply, true))}
        </div>
      ))}
    </div>
  );
}
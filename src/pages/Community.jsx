import React, { useState, useEffect } from "react";
import { ImagePlus, Send, X, Users } from "lucide-react";
import { base44 } from "@/api/base44Client";
import Layout from "@/components/Layout";
import PostCard from "@/components/PostCard";
import { CATEGORIES } from "@/lib/social";
import { useToast } from "@/components/ui/use-toast";

export default function Community() {
  const { toast } = useToast();
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("Programação");
  const [tagsInput, setTagsInput] = useState("");
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [filterCategory, setFilterCategory] = useState("");

  useEffect(() => {
    base44.auth.me().then(u => {
      setUser(u);
      base44.entities.Profile.filter({ created_by_id: u.id }).then(profs => {
        if (profs[0]) setUserProfile(profs[0]);
      }).catch(() => {});
    }).catch(() => {});
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const data = await base44.entities.Post.list("-created_date", 50);
      setPosts(data);
    } catch (e) {
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setUploading(true);
    try {
      const urls = [];
      for (const file of files) {
        const { file_url } = await base44.integrations.Core.UploadFile({ file });
        urls.push(file_url);
      }
      setImages(prev => [...prev, ...urls]);
    } catch (e) {
      toast({ title: "Erro ao enviar imagem", variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const handlePost = async () => {
    if (!user) { toast({ title: "Faça login para postar", variant: "destructive" }); return; }
    if (!content.trim()) { toast({ title: "Escreva algo", variant: "destructive" }); return; }
    const tags = tagsInput.split(",").map(t => t.trim()).filter(Boolean);
    try {
      await base44.entities.Post.create({
        content,
        category,
        tags,
        images,
        author_name: user.full_name || user.email,
        author_avatar: userProfile?.avatar_url || ""
      });
      setContent("");
      setTagsInput("");
      setImages([]);
      toast({ title: "Postagem publicada!" });
      loadPosts();
    } catch (e) {
      toast({ title: "Erro ao postar", variant: "destructive" });
    }
  };

  const filteredPosts = filterCategory ? posts.filter(p => p.category === filterCategory) : posts;

  return (
    <Layout centerLabel="COMUNIDADE">
      <div className="max-w-3xl mx-auto p-4 md:p-8 pb-20 md:pb-8">
        <h1 className="text-3xl md:text-4xl font-script font-bold text-owl-purple mb-1">Comunidade</h1>
        <p className="text-sm text-owl-navy/60 mb-6">Compartilhe, pergunte e conecte-se com outros aprendizes 🦉</p>

        {/* Create post */}
        <div className="bg-white rounded-2xl border-2 border-owl-purpleLight/40 shadow-sm p-4 mb-6">
          <textarea value={content} onChange={e => setContent(e.target.value)} placeholder="O que você quer compartilhar?" rows={3} className="w-full px-4 py-3 rounded-xl border border-owl-purpleLight/40 focus:border-owl-purple focus:outline-none text-sm resize-none mb-3" />
          {images.length > 0 && (
            <div className="grid grid-cols-3 gap-2 mb-3">
              {images.map((img, i) => (
                <div key={i} className="relative">
                  <img src={img} alt="" className="w-full h-24 object-cover rounded-xl" />
                  <button onClick={() => setImages(images.filter((_, idx) => idx !== i))} className="absolute top-1 right-1 bg-owl-navy/80 text-white p-1 rounded-full"><X className="w-3 h-3" /></button>
                </div>
              ))}
            </div>
          )}
          <div className="flex flex-wrap items-center gap-2">
            <select value={category} onChange={e => setCategory(e.target.value)} className="px-3 py-1.5 rounded-full border border-owl-purpleLight/40 bg-owl-beige text-sm font-medium text-owl-navy focus:outline-none">
              {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
            <input value={tagsInput} onChange={e => setTagsInput(e.target.value)} placeholder="tags (vírgula)" className="flex-1 min-w-[120px] px-3 py-1.5 rounded-full border border-owl-purpleLight/40 text-sm focus:outline-none focus:border-owl-purple" />
            <label className="cursor-pointer p-2 rounded-full hover:bg-owl-purpleLight/30 transition-colors">
              <ImagePlus className="w-5 h-5 text-owl-purple" />
              <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
            </label>
            <button onClick={handlePost} disabled={uploading} className="ml-auto flex items-center gap-2 bg-owl-navy hover:bg-owl-navyDeep text-white font-semibold px-5 py-2 rounded-full transition-colors text-sm disabled:opacity-50">
              <Send className="w-4 h-4" /> Publicar
            </button>
          </div>
        </div>

        {/* Category filter */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-3 mb-4">
          <button onClick={() => setFilterCategory("")} className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${!filterCategory ? "bg-owl-navy text-white" : "bg-white text-owl-navy border border-owl-purpleLight/40"}`}>Todas</button>
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setFilterCategory(cat)} className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${filterCategory === cat ? "bg-owl-navy text-white" : "bg-white text-owl-navy border border-owl-purpleLight/40"}`}>{cat}</button>
          ))}
        </div>

        {/* Posts */}
        {loading ? (
          <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-owl-purple/30 border-t-owl-purple rounded-full animate-spin" /></div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-20">
            <Users className="w-12 h-12 text-owl-purpleLight mx-auto mb-3" />
            <p className="text-owl-navy/60 text-sm">Ainda não há postagens. Seja o primeiro!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredPosts.map(post => <PostCard key={post.id} post={post} currentUser={user} onDeleted={(id) => setPosts(posts.filter(p => p.id !== id))} />)}
          </div>
        )}
      </div>
    </Layout>
  );
}
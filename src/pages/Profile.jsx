import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Bookmark } from "lucide-react";
import { base44 } from "@/api/base44Client";
import Layout from "@/components/Layout";
import { useToast } from "@/components/ui/use-toast";
import { getTheme } from "@/lib/profileThemes";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileStats from "@/components/profile/ProfileStats";
import ProfileBadges from "@/components/profile/ProfileBadges";
import ProfileAbout from "@/components/profile/ProfileAbout";
import ProfilePortfolio from "@/components/profile/ProfilePortfolio";
import ProfileFeed from "@/components/profile/ProfileFeed";
import ProfileSaved from "@/components/profile/ProfileSaved";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function Profile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profile, setProfile] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [projects, setProjects] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showSaved, setShowSaved] = useState(false);

  useEffect(() => { base44.auth.me().then(setCurrentUser).catch(() => {}); }, []);
  useEffect(() => { if (id) loadProfile(); }, [id, currentUser]);

  const loadProfile = async () => {
    try {
      const data = await base44.entities.Profile.get(id);
      setProfile(data);
      const [userPosts, userProjects] = await Promise.all([
        base44.entities.Post.filter({ created_by_id: data.created_by_id }, "-created_date", 50),
        base44.entities.Project.filter({ created_by_id: data.created_by_id }, "-created_date", 50)
      ]);
      setPosts(userPosts);
      setProjects(userProjects);
      if (currentUser && currentUser.id !== data.created_by_id) {
        const follows = await base44.entities.Follow.filter({ following_id: data.created_by_id, created_by_id: currentUser.id });
        setIsFollowing(follows.length > 0);
      }
    } catch (e) {
      toast({ title: "Perfil não encontrado", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async () => {
    if (!currentUser) { navigate("/login"); return; }
    try {
      if (isFollowing) {
        const existing = await base44.entities.Follow.filter({ following_id: profile.created_by_id, created_by_id: currentUser.id });
        if (existing[0]) await base44.entities.Follow.delete(existing[0].id);
        const newCount = Math.max(0, (profile.followers_count || 0) - 1);
        await base44.entities.Profile.update(profile.id, { followers_count: newCount });
        setProfile({ ...profile, followers_count: newCount });
        setIsFollowing(false);
      } else {
        await base44.entities.Follow.create({ following_id: profile.created_by_id, following_name: profile.full_name });
        const newCount = (profile.followers_count || 0) + 1;
        await base44.entities.Profile.update(profile.id, { followers_count: newCount });
        setProfile({ ...profile, followers_count: newCount });
        setIsFollowing(true);
        await base44.entities.Notification.create({
          type: "follow",
          from_name: currentUser.full_name || "Usuário",
          from_avatar: "",
          message: `${currentUser.full_name || "Alguém"} começou a seguir você`,
          target_id: profile.created_by_id,
          read: false
        }).catch(() => {});
      }
    } catch (e) {
      toast({ title: "Erro ao seguir", variant: "destructive" });
    }
  };

  if (loading) {
    return <Layout><div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-owl-purple/30 border-t-owl-purple rounded-full animate-spin" /></div></Layout>;
  }
  if (!profile) {
    return <Layout><div className="text-center py-20"><p className="text-owl-navy/60">Perfil não encontrado.</p></div></Layout>;
  }

  const isOwn = currentUser && currentUser.id === profile.created_by_id;
  const isAdmin = currentUser?.role === "admin";
  const theme = getTheme(profile.theme);

  return (
    <Layout>
      <div className="min-h-screen" style={{ backgroundColor: theme.soft }}>
      <div className="max-w-3xl mx-auto pb-24 md:pb-12">
        <ProfileHeader
          profile={profile}
          theme={theme}
          isOwn={isOwn}
          isFollowing={isFollowing}
          onFollow={handleFollow}
          onMessage={() => isOwn ? navigate("/editar-perfil") : toast({ title: "Mensagens privadas em breve!" })}
          onMentor={() => toast({ title: "Solicitação de mentoria em breve!" })}
          onSaved={() => setShowSaved(true)}
          isAdmin={isAdmin}
        />

        <div className="px-4 md:px-8 mt-5 space-y-5">
          <ProfileBadges
            highlightedBadges={profile.highlighted_badges}
            isAdmin={isAdmin}
            theme={theme}
          />

          <ProfileStats
            level={profile.level}
            xp={profile.xp}
            followers={profile.followers_count}
            following={profile.following_count}
            mentorias={profile.mentorias_count}
            projects={projects.length}
            theme={theme}
          />

          <ProfileAbout
            profile={profile}
            theme={theme}
            isOwn={isOwn}
            onEdit={() => navigate("/editar-perfil")}
          />

          <ProfilePortfolio
            projects={projects}
            isOwn={isOwn}
            theme={theme}
            onRefresh={loadProfile}
          />

          <ProfileFeed
            posts={posts}
            currentUser={currentUser}
            profile={profile}
            isOwn={isOwn}
            theme={theme}
            onPostCreated={loadProfile}
          />

          <Dialog open={showSaved} onOpenChange={setShowSaved}>
            <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto bg-white">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2" style={{ color: theme.primary }}>
                  <Bookmark className="w-5 h-5" /> Salvos
                </DialogTitle>
              </DialogHeader>
              {isOwn && (
                <ProfileSaved currentUser={currentUser} theme={theme} inModal />
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>
      </div>
    </Layout>
  );
}
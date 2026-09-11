import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, UserPlus, Heart, MessageCircle, Reply, Award, Trash2, CheckCheck } from "lucide-react";
import { base44 } from "@/api/base44Client";
import Layout from "@/components/Layout";
import Avatar from "@/components/Avatar";
import { timeAgo } from "@/lib/social";

const ICONS = {
  follow: UserPlus,
  like: Heart,
  comment: MessageCircle,
  reply: Reply,
  achievement: Award,
  message: MessageCircle,
  system: Bell
};

export default function Notifications() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.auth.me().then(u => {
      setUser(u);
      loadNotifications();
    }).catch(() => navigate("/login"));
  }, []);

  const loadNotifications = async () => {
    try {
      const data = await base44.entities.Notification.list("-created_date", 50);
      setNotifications(data);
    } catch (e) {}
    setLoading(false);
  };

  const handleMarkAllRead = async () => {
    const unread = notifications.filter(n => !n.read);
    if (unread.length === 0) return;
    for (const n of unread) {
      await base44.entities.Notification.update(n.id, { read: true });
    }
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const handleDelete = async (id) => {
    await base44.entities.Notification.delete(id);
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <Layout centerLabel="NOTIFICAÇÕES">
      <div className="max-w-2xl mx-auto p-4 md:p-6 pb-24 md:pb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-script font-bold text-owl-purple">Avisos</h1>
            {unreadCount > 0 && <p className="text-xs text-owl-navy/50">{unreadCount} não lida{unreadCount !== 1 ? "s" : ""}</p>}
          </div>
          {unreadCount > 0 && (
            <button onClick={handleMarkAllRead} className="flex items-center gap-1.5 text-xs font-semibold text-owl-navy bg-white border border-owl-purpleLight/40 px-3 py-1.5 rounded-full hover:bg-owl-purpleLight/20 transition-colors">
              <CheckCheck className="w-3.5 h-3.5" /> Marcar todas
            </button>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-owl-purple/30 border-t-owl-purple rounded-full animate-spin" /></div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-20">
            <Bell className="w-12 h-12 text-owl-purpleLight mx-auto mb-3" />
            <p className="text-owl-navy/50 text-sm">Nenhuma notificação ainda.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {notifications.map(n => {
              const Icon = ICONS[n.type] || Bell;
              return (
                <div key={n.id} className={`flex items-start gap-3 p-3 rounded-2xl border transition-colors ${n.read ? "bg-white border-owl-purpleLight/20" : "bg-owl-purpleLight/20 border-owl-purpleLight/40"}`}>
                  <div className="relative flex-shrink-0">
                    <Avatar src={n.from_avatar} name={n.from_name} size={40} />
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-owl-purple flex items-center justify-center ring-2 ring-white">
                      <Icon className="w-2.5 h-2.5 text-white" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-owl-navy">{n.message}</p>
                    <p className="text-xs text-owl-navy/40 mt-0.5">{timeAgo(n.created_date)}</p>
                  </div>
                  {!n.read && <span className="w-2 h-2 rounded-full bg-owl-purple flex-shrink-0 mt-2" />}
                  <button onClick={() => handleDelete(n.id)} className="p-1 rounded-lg hover:bg-red-50 text-owl-navy/30 hover:text-red-500 transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
}
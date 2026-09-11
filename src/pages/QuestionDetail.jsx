import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle2, ChevronUp, ChevronDown, Send, MessageSquare } from "lucide-react";
import { base44 } from "@/api/base44Client";
import Layout from "@/components/Layout";
import Avatar from "@/components/Avatar";
import { timeAgo } from "@/lib/social";
import { useToast } from "@/components/ui/use-toast";

export default function QuestionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState(null);
  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [newAnswer, setNewAnswer] = useState("");
  const [loading, setLoading] = useState(true);
  const [voted, setVoted] = useState({});

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  useEffect(() => {
    if (!id) return;
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      const q = await base44.entities.Question.get(id);
      setQuestion(q);
      const ans = await base44.entities.Answer.filter({ question_id: id }, "-votes");
      // sort: accepted first, then by votes
      ans.sort((a, b) => {
        if (a.is_accepted && !b.is_accepted) return -1;
        if (!a.is_accepted && b.is_accepted) return 1;
        return (b.votes || 0) - (a.votes || 0);
      });
      setAnswers(ans);
      // increment views
      await base44.entities.Question.update(id, { views_count: (q.views_count || 0) + 1 });
    } catch (e) {
      toast({ title: "Pergunta não encontrada", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = async () => {
    if (!user) { toast({ title: "Faça login para responder", variant: "destructive" }); return; }
    if (!newAnswer.trim()) return;
    try {
      const created = await base44.entities.Answer.create({
        question_id: id,
        content: newAnswer,
        author_name: user.full_name || "Usuário",
        author_avatar: ""
      });
      setAnswers(prev => [...prev, created]);
      setNewAnswer("");
      await base44.entities.Question.update(id, { answers_count: (question.answers_count || 0) + 1 });
      setQuestion({ ...question, answers_count: (question.answers_count || 0) + 1 });
      toast({ title: "Resposta publicada!" });
    } catch (e) {
      toast({ title: "Erro ao responder", variant: "destructive" });
    }
  };

  const handleVote = async (answer, dir) => {
    if (!user) { toast({ title: "Faça login para votar", variant: "destructive" }); return; }
    const newVotes = (answer.votes || 0) + dir;
    await base44.entities.Answer.update(answer.id, { votes: newVotes });
    setAnswers(prev => prev.map(a => a.id === answer.id ? { ...a, votes: newVotes } : a));
    setVoted({ ...voted, [answer.id]: dir > 0 ? "up" : "down" });
  };

  const handleAccept = async (answer) => {
    if (!question || !user || user.id !== question.created_by_id) return;
    try {
      // unaccept any previously accepted
      const prevAccepted = answers.find(a => a.is_accepted);
      if (prevAccepted) {
        await base44.entities.Answer.update(prevAccepted.id, { is_accepted: false });
      }
      await base44.entities.Answer.update(answer.id, { is_accepted: true });
      setAnswers(prev => prev.map(a => ({ ...a, is_accepted: a.id === answer.id })));
      await base44.entities.Question.update(id, { has_accepted: true });
      setQuestion({ ...question, has_accepted: true });
      toast({ title: "Resposta aceita!" });
    } catch (e) {
      toast({ title: "Erro", variant: "destructive" });
    }
  };

  if (loading) return <Layout><div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-owl-purple/30 border-t-owl-purple rounded-full animate-spin" /></div></Layout>;
  if (!question) return <Layout><div className="text-center py-20"><p className="text-owl-navy/60">Pergunta não encontrada.</p></div></Layout>;

  const isQuestionAuthor = user && user.id === question.created_by_id;

  return (
    <Layout centerLabel="PERGUNTA">
      <div className="max-w-3xl mx-auto p-4 md:p-6 pb-24 md:pb-8">
        <button onClick={() => navigate("/perguntas")} className="flex items-center gap-1.5 text-sm text-owl-navy/60 hover:text-owl-purple mb-4">
          <ArrowLeft className="w-4 h-4" /> Voltar às perguntas
        </button>

        {/* Question */}
        <div className="bg-white rounded-2xl border-2 border-owl-purpleLight/30 p-5 mb-5">
          <div className="flex items-center gap-2 mb-3">
            <Avatar src={question.author_avatar} name={question.author_name} size={32} />
            <span className="text-xs text-owl-navy/50">{question.author_name} • {timeAgo(question.created_date)}</span>
          </div>
          <h1 className="text-lg font-bold text-owl-navy mb-2">{question.title}</h1>
          <p className="text-sm text-owl-navy/80 leading-relaxed whitespace-pre-wrap">{question.description}</p>
          <div className="flex flex-wrap items-center gap-2 mt-3">
            <span className="px-2.5 py-0.5 bg-owl-purpleLight/30 text-owl-navy text-xs font-bold rounded-full">{question.category}</span>
            {question.tags?.map((tag, i) => <span key={i} className="text-xs text-owl-purple">#{tag}</span>)}
          </div>
        </div>

        {/* Answers header */}
        <div className="flex items-center gap-2 mb-3">
          <MessageSquare className="w-4 h-4 text-owl-purple" />
          <h2 className="font-bold text-sm text-owl-navy">{answers.length} resposta{answers.length !== 1 ? "s" : ""}</h2>
        </div>

        {/* Answers */}
        {answers.length === 0 ? (
          <p className="text-center text-owl-navy/40 text-sm py-8">Nenhuma resposta ainda. Seja o primeiro!</p>
        ) : (
          <div className="space-y-3 mb-5">
            {answers.map(answer => (
              <div key={answer.id} className={`bg-white rounded-2xl border-2 p-4 ${answer.is_accepted ? "border-owl-green bg-owl-green/5" : "border-owl-purpleLight/30"}`}>
                <div className="flex gap-3">
                  {/* Vote buttons */}
                  <div className="flex flex-col items-center gap-1 flex-shrink-0">
                    <button onClick={() => handleVote(answer, 1)} className={`p-1 rounded-lg hover:bg-owl-purpleLight/30 transition-colors ${voted[answer.id] === "up" ? "text-owl-purple" : "text-owl-navy/40"}`}>
                      <ChevronUp className="w-5 h-5" />
                    </button>
                    <span className="text-sm font-bold text-owl-navy">{answer.votes || 0}</span>
                    <button onClick={() => handleVote(answer, -1)} className={`p-1 rounded-lg hover:bg-owl-purpleLight/30 transition-colors ${voted[answer.id] === "down" ? "text-owl-purple" : "text-owl-navy/40"}`}>
                      <ChevronDown className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="flex-1 min-w-0">
                    {answer.is_accepted && (
                      <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-owl-green/30 text-owl-navy text-xs font-bold rounded-full mb-2">
                        <CheckCircle2 className="w-3 h-3" /> Resposta aceita
                      </div>
                    )}
                    <p className="text-sm text-owl-navy/80 leading-relaxed whitespace-pre-wrap">{answer.content}</p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-1.5">
                        <Avatar src={answer.author_avatar} name={answer.author_name} size={24} />
                        <span className="text-xs text-owl-navy/50">{answer.author_name} • {timeAgo(answer.created_date)}</span>
                      </div>
                      {isQuestionAuthor && !answer.is_accepted && (
                        <button onClick={() => handleAccept(answer)} className="text-xs text-owl-green font-semibold flex items-center gap-1 hover:underline">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Aceitar
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add answer */}
        {user ? (
          <div className="bg-white rounded-2xl border-2 border-owl-purpleLight/40 p-4">
            <textarea value={newAnswer} onChange={e => setNewAnswer(e.target.value)} placeholder="Escreva sua resposta..." rows={4} className="w-full px-4 py-2.5 rounded-xl border border-owl-purpleLight/40 focus:border-owl-purple focus:outline-none text-sm resize-none mb-3" />
            <button onClick={handleAnswer} className="flex items-center gap-2 bg-owl-navy text-white font-semibold px-5 py-2 rounded-full text-sm hover:bg-owl-navyDeep transition-colors">
              <Send className="w-4 h-4" /> Responder
            </button>
          </div>
        ) : (
          <div className="bg-owl-purpleLight/20 rounded-2xl p-4 text-center">
            <p className="text-sm text-owl-navy/60">Faça login para responder</p>
          </div>
        )}
      </div>
    </Layout>
  );
}
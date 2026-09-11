import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Check, X, RotateCcw, Trophy } from "lucide-react";
import { base44 } from "@/api/base44Client";
import Layout from "@/components/Layout";
import OwlMascot from "@/components/OwlMascot";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";

export default function InterviewSimulation() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    try {
      const data = await base44.entities.InterviewQuestion.list("order", 20);
      setQuestions(data);
    } catch (e) {
      toast({ title: "Erro ao carregar perguntas", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = (qId, optIdx) => {
    if (showFeedback) return;
    setSelectedOption(optIdx);
    setShowFeedback(true);
    const question = questions[currentIdx];
    if (question.options[optIdx].is_best) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIdx + 1 >= questions.length) {
      setFinished(true);
    } else {
      setCurrentIdx(prev => prev + 1);
      setSelectedOption(null);
      setShowFeedback(false);
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setSelectedOption(null);
    setShowFeedback(false);
    setScore(0);
    setFinished(false);
  };

  if (loading) {
    return (
      <Layout centerLabel="SIMULAÇÃO DE ENTREVISTA">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="w-8 h-8 border-4 border-owl-purple/30 border-t-owl-purple rounded-full animate-spin" />
        </div>
      </Layout>
    );
  }

  if (questions.length === 0) {
    return (
      <Layout centerLabel="SIMULAÇÃO DE ENTREVISTA">
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">
          <OwlMascot size={80} className="mb-4 opacity-60" />
          <p className="text-owl-navy text-lg">Nenhuma pergunta de entrevista disponível no momento.</p>
        </div>
      </Layout>
    );
  }

  // Results screen
  if (finished) {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <Layout centerLabel="SIMULAÇÃO DE ENTREVISTA">
        <div className="max-w-2xl mx-auto p-4 md:p-8 pb-20 text-center">
          <Trophy className="w-16 h-16 text-owl-purple mx-auto mb-4 animate-pop-in" />
          <h1 className="text-3xl font-display font-bold text-owl-navy mb-2">Simulação Concluída!</h1>
          <p className="text-muted-foreground mb-6">Você respondeu {questions.length} perguntas</p>

          <div className="bg-white rounded-2xl p-8 border border-muted/30 mb-6">
            <div className="text-5xl font-extrabold text-owl-purple mb-2">{pct}%</div>
            <p className="text-owl-navy font-semibold">
              {score} de {questions.length} respostas ideais
            </p>
            <div className="mt-4 h-3 bg-muted/30 rounded-full overflow-hidden">
              <div className="h-full bg-owl-purple rounded-full transition-all duration-1000" style={{ width: `${pct}%` }} />
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              {pct >= 80 ? "Excelente! Você está bem preparado para entrevistas." : pct >= 50 ? "Bom trabalho! Revise as perguntas que errou para melhorar." : "Continue praticando! A prática leva à perfeição."}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button onClick={handleRestart} className="flex items-center gap-2 px-6 py-3 rounded-full bg-owl-purple hover:bg-owl-navy text-white font-bold transition-colors">
              <RotateCcw className="w-4 h-4" />
              Refazer Simulação
            </button>
            <button onClick={() => navigate("/")} className="px-6 py-3 rounded-full border-2 border-owl-navy text-owl-navy font-bold hover:bg-owl-navy hover:text-white transition-all">
              Voltar ao Início
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  const currentQuestion = questions[currentIdx];
  const progress = ((currentIdx) / questions.length) * 100;

  return (
    <Layout centerLabel="SIMULAÇÃO DE ENTREVISTA">
      <div className="max-w-2xl mx-auto p-4 md:p-8 pb-20">
        {/* Progress */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-owl-navy">
              Pergunta {currentIdx + 1} de {questions.length}
            </span>
            <span className="text-sm font-semibold text-owl-purple">
              {score} acertos
            </span>
          </div>
          <div className="h-2 bg-muted/30 rounded-full overflow-hidden">
            <div className="h-full bg-owl-purple rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* Chat-style question */}
        <div className="bg-owl-gray/30 rounded-3xl p-4 md:p-6 min-h-[400px] flex flex-col">
          {/* Owl asks the question */}
          <div className="flex items-start gap-3 mb-6 animate-slide-in">
            <OwlMascot size={40} className="flex-shrink-0" />
            <div className="bg-white rounded-2xl rounded-tl-none p-4 max-w-[85%] shadow-sm">
              <span className="text-xs font-bold text-owl-purple uppercase mb-1 block">
                {currentQuestion.category}
              </span>
              <p className="text-owl-navy text-sm md:text-base font-medium">
                {currentQuestion.question}
              </p>
            </div>
          </div>

          {/* Options */}
          <div className="space-y-2 flex-1">
            {currentQuestion.options.map((opt, idx) => {
              const isSelected = selectedOption === idx;
              const isBest = opt.is_best;
              const showCorrect = showFeedback && isBest;
              const showWrong = showFeedback && isSelected && !isBest;

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(currentQuestion.id, idx)}
                  disabled={showFeedback}
                  className={cn(
                    "w-full text-left p-4 rounded-2xl border-2 transition-all duration-200 flex items-start gap-3",
                    !showFeedback && "bg-white border-muted/30 hover:border-owl-purple hover:bg-owl-purpleLight/5",
                    showCorrect && "bg-owl-green/20 border-owl-green",
                    showWrong && "bg-owl-redLight/15 border-owl-redLight",
                    showFeedback && !isSelected && !isBest && "bg-white border-muted/20 opacity-50"
                  )}
                >
                  <span className={cn(
                    "flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold",
                    !showFeedback && "bg-muted/30 text-muted-foreground",
                    showCorrect && "bg-owl-green text-owl-navy",
                    showWrong && "bg-owl-redLight text-white",
                    showFeedback && !isSelected && !isBest && "bg-muted/20 text-muted-foreground"
                  )}>
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="text-sm text-owl-navy flex-1">{opt.text}</span>
                  {showCorrect && <Check className="w-5 h-5 text-owl-green flex-shrink-0" />}
                  {showWrong && <X className="w-5 h-5 text-owl-redLight flex-shrink-0" />}
                </button>
              );
            })}
          </div>

          {/* Feedback */}
          {showFeedback && (
            <div className="mt-4 animate-fade-in">
              <div className={cn(
                "rounded-2xl p-4 border-2",
                currentQuestion.options[selectedOption]?.is_best
                  ? "bg-owl-green/10 border-owl-green/50"
                  : "bg-owl-yellow/20 border-owl-yellow"
              )}>
                <p className="text-xs font-bold uppercase mb-1" style={{ color: currentQuestion.options[selectedOption]?.is_best ? "#2d7a2d" : "#8a7a1a" }}>
                  {currentQuestion.options[selectedOption]?.is_best ? "✓ Resposta ideal!" : "Dica do recrutador"}
                </p>
                <p className="text-sm text-owl-navy">{currentQuestion.options[selectedOption]?.feedback}</p>
              </div>
              <button
                onClick={handleNext}
                className="mt-4 w-full flex items-center justify-center gap-2 bg-owl-purple hover:bg-owl-navy text-white font-bold py-3 rounded-full transition-colors"
              >
                {currentIdx + 1 >= questions.length ? "Ver Resultado" : "Próxima Pergunta"}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
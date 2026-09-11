import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, ArrowLeft, Check, Clock, FileQuestion, Sparkles } from "lucide-react";
import Layout from "@/components/Layout";
import OwlMascot from "@/components/OwlMascot";
import { STEPS, SCALE_LABELS } from "@/lib/vocationalData";
import { cn } from "@/lib/utils";

const TOTAL_STEPS = STEPS.length;

export default function VocationalTest() {
  const navigate = useNavigate();
  const [started, setStarted] = useState(false);
  const [stepIdx, setStepIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [direction, setDirection] = useState(1);

  const currentStep = STEPS[stepIdx];
  const progress = started ? ((stepIdx) / TOTAL_STEPS) * 100 : 0;

  const handleSelect = (qId, value) => {
    setAnswers(prev => ({ ...prev, [qId]: value }));
  };

  const handleMulti = (qId, optIdx) => {
    setAnswers(prev => {
      const current = prev[qId] || [];
      return {
        ...prev,
        [qId]: current.includes(optIdx) ? current.filter(i => i !== optIdx) : [...current, optIdx]
      };
    });
  };

  const isStepComplete = () => {
    if (!currentStep?.questions) return true;
    return currentStep.questions.every(q => {
      const ans = answers[q.id];
      if (q.type === "multi") return Array.isArray(ans) && ans.length > 0;
      return ans !== undefined && ans !== null;
    });
  };

  const handleNext = () => {
    if (stepIdx + 1 >= TOTAL_STEPS) {
      navigate("/resultado-teste", { state: { answers } });
    } else {
      setDirection(1);
      setStepIdx(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (stepIdx === 0) return;
    setDirection(-1);
    setStepIdx(prev => prev - 1);
  };

  // Intro screen
  if (!started) {
    return (
      <Layout centerLabel="TESTE VOCACIONAL">
        <div className="max-w-2xl mx-auto p-4 md:p-8 pb-24 min-h-[70vh] flex flex-col items-center justify-center text-center">
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-owl-purpleLight/40 blur-3xl rounded-full" />
            <OwlMascot size={100} className="relative animate-pop-in" />
          </div>
          <h1 className="text-3xl md:text-4xl font-script font-bold text-owl-purple mb-3">
            Teste Vocacional MentorOwl
          </h1>
          <p className="text-sm md:text-base text-owl-navy/70 mb-8 max-w-md leading-relaxed">
            Um teste profundo e personalizado que analisa sua personalidade, interesses,
            habilidades, valores e muito mais para encontrar as profissões que mais combinam com você.
          </p>

          <div className="grid grid-cols-3 gap-3 mb-8 w-full max-w-sm">
            <InfoCard icon={Clock} value="15-20" label="minutos" />
            <InfoCard icon={FileQuestion} value="~50" label="perguntas" />
            <InfoCard icon={Sparkles} value="12" label="competências" />
          </div>

          <div className="bg-owl-purpleLight/20 rounded-2xl p-4 mb-8 max-w-md text-left w-full">
            <p className="text-xs font-bold text-owl-purple uppercase mb-2">O que vamos analisar:</p>
            <div className="grid grid-cols-2 gap-1.5">
              {STEPS.map(s => (
                <div key={s.id} className="flex items-center gap-1.5 text-xs text-owl-navy/70">
                  <span>{s.icon}</span> {s.title}
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => setStarted(true)}
            className="flex items-center gap-2 bg-owl-navy hover:bg-owl-navyDeep text-white font-bold px-8 py-4 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg text-lg"
          >
            Começar Teste <ArrowRight className="w-5 h-5" />
          </button>
          <p className="text-xs text-owl-navy/40 mt-4">Responda com sinceridade — não há respostas certas ou erradas!</p>
        </div>
      </Layout>
    );
  }

  // Question screen
  return (
    <Layout centerLabel={`PASSO ${stepIdx + 1}/${TOTAL_STEPS}`}>
      <div className="max-w-2xl mx-auto p-4 md:p-8 pb-24">
        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{currentStep.icon}</span>
              <h2 className="text-lg font-bold text-owl-navy">{currentStep.title}</h2>
            </div>
            <span className="text-xs font-semibold text-owl-purple">{Math.round(progress)}%</span>
          </div>
          <div className="h-2.5 bg-owl-purpleLight/30 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-owl-purple to-owl-navy rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* Questions */}
        <div key={stepIdx} className="space-y-6 animate-fade-in">
          {currentStep.questions.map((q, qIdx) => (
            <QuestionCard key={q.id} question={q} index={qIdx} answers={answers} onSelect={handleSelect} onMulti={handleMulti} />
          ))}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8">
          <button
            onClick={handleBack}
            disabled={stepIdx === 0}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full border-2 border-owl-navy/20 text-owl-navy font-semibold text-sm hover:bg-owl-navy/5 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="w-4 h-4" /> Voltar
          </button>
          <button
            onClick={handleNext}
            disabled={!isStepComplete()}
            className="flex items-center gap-2 bg-owl-navy hover:bg-owl-navyDeep text-white font-bold px-6 py-2.5 rounded-full transition-all duration-300 hover:scale-105 disabled:opacity-40 disabled:cursor-not-allowed text-sm"
          >
            {stepIdx + 1 >= TOTAL_STEPS ? "Ver Resultado" : "Próximo"}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </Layout>
  );
}

function InfoCard({ icon: Icon, value, label }) {
  return (
    <div className="bg-white rounded-2xl border-2 border-owl-purpleLight/30 p-3 text-center">
      <Icon className="w-5 h-5 text-owl-purple mx-auto mb-1" />
      <p className="font-bold text-owl-navy text-sm">{value}</p>
      <p className="text-xs text-owl-navy/50">{label}</p>
    </div>
  );
}

function QuestionCard({ question, index, answers, onSelect, onMulti }) {
  const ans = answers[question.id];

  return (
    <div className="bg-white rounded-2xl border-2 border-owl-purpleLight/30 p-4 md:p-5">
      <div className="flex items-start gap-3 mb-4">
        <span className="flex-shrink-0 w-7 h-7 rounded-full bg-owl-purpleLight/40 text-owl-navy text-xs font-bold flex items-center justify-center mt-0.5">
          {index + 1}
        </span>
        <p className="font-medium text-owl-navy text-sm md:text-base leading-relaxed">{question.question}</p>
      </div>

      {/* Select (radio) */}
      {question.type === "select" && (
        <div className="grid gap-2 ml-10">
          {question.options.map((opt, i) => (
            <button
              key={i}
              onClick={() => onSelect(question.id, i)}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl border-2 text-left transition-all duration-200 text-sm",
                ans === i
                  ? "border-owl-purple bg-owl-purpleLight/20 text-owl-navy font-semibold"
                  : "border-owl-purpleLight/20 bg-white hover:border-owl-purpleLight/60 text-owl-navy/80"
              )}
            >
              <span className={cn(
                "flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors",
                ans === i ? "border-owl-purple bg-owl-purple" : "border-owl-navy/20"
              )}>
                {ans === i && <span className="w-2 h-2 bg-white rounded-full" />}
              </span>
              {opt.text}
            </button>
          ))}
        </div>
      )}

      {/* Scale (1-5) */}
      {question.type === "scale" && (
        <div className="ml-10">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-xs font-semibold text-owl-navy/40">Discordo</span>
            <span className="text-xs font-semibold text-owl-navy/40">Concordo</span>
          </div>
          <div className="grid grid-cols-5 gap-2">
            {[1, 2, 3, 4, 5].map(val => (
              <button
                key={val}
                onClick={() => onSelect(question.id, val)}
                title={SCALE_LABELS[val - 1]}
                className={cn(
                  "py-3 rounded-xl border-2 text-sm font-bold transition-all duration-200",
                  ans === val
                    ? "border-owl-purple bg-owl-purple text-white scale-105"
                    : "border-owl-purpleLight/30 bg-white text-owl-navy hover:border-owl-purpleLight/60 hover:bg-owl-purpleLight/10"
                )}
              >
                {val}
              </button>
            ))}
          </div>
          {ans && <p className="text-xs text-owl-purple font-medium mt-2 text-center">{SCALE_LABELS[ans - 1]}</p>}
        </div>
      )}

      {/* Multi-select (checkboxes) */}
      {question.type === "multi" && (
        <div className="grid sm:grid-cols-2 gap-2 ml-10">
          {question.options.map((opt, i) => {
            const selected = Array.isArray(ans) && ans.includes(i);
            return (
              <button
                key={i}
                onClick={() => onMulti(question.id, i)}
                className={cn(
                  "flex items-center gap-2.5 px-3 py-2.5 rounded-xl border-2 text-left transition-all duration-200 text-sm",
                  selected
                    ? "border-owl-purple bg-owl-purpleLight/20 text-owl-navy font-medium"
                    : "border-owl-purpleLight/20 bg-white hover:border-owl-purpleLight/60 text-owl-navy/80"
                )}
              >
                <span className={cn(
                  "flex-shrink-0 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors",
                  selected ? "border-owl-purple bg-owl-purple" : "border-owl-navy/20"
                )}>
                  {selected && <Check className="w-3 h-3 text-white" />}
                </span>
                {opt.text}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
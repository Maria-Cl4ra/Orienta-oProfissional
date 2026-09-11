import { Shield, Code2, GraduationCap, Heart, Users, Flame, Bird, Star, BookOpen, Award } from "lucide-react";

export const PROFILE_BADGES = [
  { key: "adm", label: "ADM", icon: Shield, color: "#dc2626" },
  { key: "programador", label: "Programador", icon: Code2, color: "#2563eb" },
  { key: "enem", label: "ENEM", icon: GraduationCap, color: "#7c3aed" },
  { key: "colaborador", label: "Colaborador", icon: Heart, color: "#ec4899" },
  { key: "mentor", label: "Mentor", icon: Users, color: "#f97316" },
  { key: "sequencia", label: "Sequência de Estudos", icon: Flame, color: "#ef4444" },
  { key: "owl", label: "MentorOwl", icon: Bird, color: "#604734" },
  { key: "especialista", label: "Especialista", icon: Star, color: "#f59e0b" },
  { key: "leitor", label: "Leitor Assíduo", icon: BookOpen, color: "#0891b2" },
  { key: "conquista", label: "Conquistador", icon: Award, color: "#16a34a" }
];

export const getBadge = (key) => PROFILE_BADGES.find(b => b.key === key);
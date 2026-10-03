import {
  BookOpen,
  Briefcase,
  Car,
  CircleDollarSign,
  Coffee,
  Home,
  HeartPulse,
  PiggyBank,
  ShoppingBag,
  Smile,
  Sparkles,
  Utensils,
  Wifi,
  type LucideIcon,
} from "lucide-react";

const CATEGORY_ICON_MAP: Record<string, LucideIcon> = {
  // pt-BR
  transporte: Car,
  carro: Car,
  lazer: Smile,
  entretenimento: Sparkles,
  salário: Briefcase,
  salario: Briefcase,
  trabalho: Briefcase,
  "contas de casa": Home,
  moradia: Home,
  aluguel: Home,
  casa: Home,
  alimentação: Utensils,
  alimentacao: Utensils,
  comida: Utensils,
  mercado: ShoppingBag,
  compras: ShoppingBag,
  saúde: HeartPulse,
  saude: HeartPulse,
  educação: BookOpen,
  educacao: BookOpen,
  internet: Wifi,
  café: Coffee,
  cafe: Coffee,
  investimento: PiggyBank,
  // en (backend seed data.sql)
  transport: Car,
  entertainment: Sparkles,
  utilities: Home,
  healthcare: HeartPulse,
  shopping: ShoppingBag,
  salary: Briefcase,
  freelance: Briefcase,
  food: Utensils,
  education: BookOpen,
  investment: PiggyBank,
};

export function getCategoryIcon(categoria: string): LucideIcon {
  return CATEGORY_ICON_MAP[categoria.toLowerCase().trim()] ?? CircleDollarSign;
}

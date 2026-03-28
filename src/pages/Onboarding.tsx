import { useState } from "react"
import { Button } from "../components/ui/button"
import { ArrowRight, CheckCircle2, GraduationCap, Building2, Search, Sparkles, BookOpen, Mail, Users, Timer, type LucideIcon } from "lucide-react"

type StepId = 'role' | 'volume' | 'challenge'

interface OnboardingData {
  role: string;
  volume: string;
  challenge: string;
}

interface Props {
  onComplete: () => void;
}

interface Option {
  value: string;
  label: string;
  icon?: LucideIcon;
  desc?: string;
}

interface StepConfig {
  title: string;
  subtitle: string;
  options: Option[];
}

const STEPS: StepId[] = ['role', 'volume', 'challenge'];

const STEP_CONFIG: Record<StepId, StepConfig> = {
  role: {
    title: "Quel est votre rôle ?",
    subtitle: "Pour personnaliser votre espace dès aujourd'hui.",
    options: [
      { value: "responsable_admissions", label: "Responsable admissions",  icon: GraduationCap },
      { value: "directeur_etudes",       label: "Directeur des études",     icon: Building2 },
      { value: "charge_recrutement",     label: "Chargé·e de recrutement", icon: Search },
      { value: "autre",                  label: "Autre profil",             icon: Sparkles },
    ],
  },
  volume: {
    title: "Combien de candidatures traitez-vous ?",
    subtitle: "Par an, toutes formations confondues.",
    options: [
      { value: "<200",       label: "Moins de 200",   desc: "Petite structure, fort besoin de qualité" },
      { value: "200-1000",   label: "200 à 1 000",    desc: "Le cœur de cible Lighthouse" },
      { value: "1000-5000",  label: "1 000 à 5 000",  desc: "Volume important, gains décuplés" },
      { value: ">5000",      label: "Plus de 5 000",  desc: "Déploiement sur mesure" },
    ],
  },
  challenge: {
    title: "Quel est votre défi principal ?",
    subtitle: "Lighthouse s'adapte à votre priorité.",
    options: [
      { value: "volume",     label: "Traiter un volume élevé de dossiers",  icon: BookOpen },
      { value: "qualite",    label: "Améliorer la qualité des retours",      icon: Mail },
      { value: "ressources", label: "Compenser le manque de ressources",     icon: Users },
      { value: "delais",     label: "Tenir les délais de réponse annoncés",  icon: Timer },
    ],
  },
};

const ROLE_LABELS: Record<string, string> = {
  responsable_admissions: "Responsable admissions",
  directeur_etudes:       "Directeur des études",
  charge_recrutement:     "Chargé·e de recrutement",
  autre:                  "Professionnel de l'admission",
};

const CHALLENGE_MESSAGES: Record<string, string> = {
  volume:     "Lighthouse va vous faire gagner des heures sur chaque campagne. Le tri de centaines de dossiers devient une affaire de minutes.",
  qualite:    "Chaque candidat refusé recevra un retour personnalisé et bienveillant. Votre image de marque s'en souviendra.",
  ressources: "Lighthouse multiplie l'impact de votre équipe. Trois personnes peuvent désormais gérer ce qui en nécessitait dix.",
  delais:     "Vos délais seront tenus. L'IA traite instantanément, vous validez en quelques clics.",
};

export default function Onboarding({ onComplete }: Props) {
  const [stepIndex, setStepIndex] = useState(0);
  const [showWelcome, setShowWelcome] = useState(false);
  const [data, setData] = useState<OnboardingData>({ role: '', volume: '', challenge: '' });

  const currentStepId = STEPS[stepIndex];
  const currentStep = STEP_CONFIG[currentStepId];
  const currentValue = data[currentStepId];
  const isLast = stepIndex === STEPS.length - 1;

  const handleSelect = (value: string) => {
    setData(prev => ({ ...prev, [currentStepId]: value }));
  };

  const handleNext = () => {
    if (isLast) {
      setShowWelcome(true);
    } else {
      setStepIndex(i => i + 1);
    }
  };

  if (showWelcome) {
    return (
      <div className="min-h-screen bg-[#FFFDF9] flex flex-col items-center justify-center px-4 py-12 animate-in fade-in duration-500">
        <div className="max-w-lg w-full text-center space-y-8">
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center border border-green-100 shadow-sm animate-in zoom-in duration-500">
              <CheckCircle2 className="w-10 h-10 text-green-500" />
            </div>
          </div>

          <div className="space-y-3">
            <h1 className="text-4xl font-serif font-bold text-slate-900">
              Votre espace est prêt.
            </h1>
            <p className="text-lg text-slate-600 leading-relaxed max-w-md mx-auto">
              {CHALLENGE_MESSAGES[data.challenge] ?? "Lighthouse est configuré pour optimiser vos admissions."}
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 text-left space-y-3 shadow-sm">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Votre profil</p>
            <div className="flex flex-wrap gap-2">
              {[
                ROLE_LABELS[data.role],
                `${data.volume} candidatures / an`,
                STEP_CONFIG.challenge.options.find(o => o.value === data.challenge)?.label,
              ].filter(Boolean).map((tag, i) => (
                <span key={i} className="bg-slate-100 text-slate-700 text-sm font-medium px-3 py-1 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <Button
            onClick={onComplete}
            size="lg"
            className="bg-slate-900 text-white hover:bg-slate-800 rounded-full px-8 py-6 text-lg font-semibold shadow-xl w-full flex items-center justify-center group"
          >
            Accéder à mon espace
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFDF9] flex flex-col">
      {/* Header */}
      <div className="px-8 py-5 flex items-center justify-between border-b border-slate-100 bg-white/80 backdrop-blur-md">
        <div className="flex items-center space-x-2.5">
          <img src={`${import.meta.env.BASE_URL}logo.png`} alt="Lighthouse" className="h-8 w-auto" />
          <span className="font-bold text-lg tracking-tight font-serif">Lighthouse</span>
        </div>
        <span className="text-sm text-slate-400 font-medium">Étape {stepIndex + 1} / {STEPS.length}</span>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-slate-100">
        <div
          className="h-1 bg-slate-900 transition-all duration-500 ease-out"
          style={{ width: `${((stepIndex + 1) / STEPS.length) * 100}%` }}
        />
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div
          key={stepIndex}
          className="max-w-lg w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300"
        >
          <div className="text-center space-y-2">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-900">
              {currentStep.title}
            </h2>
            <p className="text-slate-500 text-lg">{currentStep.subtitle}</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {currentStep.options.map(opt => {
              const selected = currentValue === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => handleSelect(opt.value)}
                  className={`p-5 rounded-2xl border-2 text-left transition-all duration-150 hover:shadow-md ${
                    selected
                      ? 'border-slate-900 bg-slate-900 shadow-lg scale-[1.02]'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  {opt.icon && (
                    <opt.icon className={`w-6 h-6 mb-3 ${selected ? 'text-white' : 'text-slate-500'}`} strokeWidth={1.5} />
                  )}
                  <p className={`font-semibold text-sm leading-snug ${selected ? 'text-white' : 'text-slate-900'}`}>
                    {opt.label}
                  </p>
                  {opt.desc && (
                    <p className={`text-xs mt-1 leading-snug ${selected ? 'text-slate-300' : 'text-slate-400'}`}>
                      {opt.desc}
                    </p>
                  )}
                </button>
              );
            })}
          </div>

          <div className="space-y-3">
            <Button
              onClick={handleNext}
              disabled={!currentValue}
              size="lg"
              className="w-full bg-slate-900 text-white hover:bg-slate-800 rounded-full py-6 text-base font-semibold disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center group"
            >
              {isLast ? 'Voir mon espace' : 'Continuer'}
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>

            {stepIndex > 0 && (
              <button
                type="button"
                onClick={() => setStepIndex(i => i - 1)}
                className="w-full text-center text-sm text-slate-400 hover:text-slate-600 transition-colors py-1"
              >
                ← Étape précédente
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

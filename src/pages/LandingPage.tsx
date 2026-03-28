import { Button } from "../components/ui/button"
import { ArrowRight, CheckCircle2, Zap, Target, Mail, Quote, Users, ChevronDown } from "lucide-react"
import { useState } from "react"

const base = import.meta.env.BASE_URL

interface Props {
  onGetStarted: () => void;
}

const FAQ_ITEMS = [
  {
    q: "L'IA prend-elle les décisions d'admission à notre place ?",
    a: "Non. Lighthouse est un outil d'aide à la décision, pas un décisionnaire. L'IA analyse et classe les dossiers selon vos critères, mais chaque admission ou refus est validé manuellement par votre équipe. Vous restez seuls responsables des décisions finales."
  },
  {
    q: "Est-ce que Lighthouse est conforme au RGPD ?",
    a: "Oui. Les données des candidats sont traitées sur des serveurs hébergés en Europe, supprimées à l'issue de chaque campagne selon votre paramétrage, et aucune donnée n'est utilisée pour entraîner des modèles tiers. Nous fournissons un DPA (Data Processing Agreement) signable sur demande."
  },
  {
    q: "Combien de temps faut-il pour déployer Lighthouse ?",
    a: "Une campagne peut être configurée en moins d'une heure. L'intégration d'un formulaire d'inscription sur votre site se fait via un simple copier-coller de code iframe. Aucune compétence technique n'est requise côté école."
  },
  {
    q: "Peut-on connecter Lighthouse à notre logiciel existant ?",
    a: "Lighthouse fonctionne de façon autonome, mais propose une API d'intégration pour s'interfacer avec les principaux CRM et logiciels de gestion scolaire (Ypareo, Aurion, Salesforce Education Cloud...). Le périmètre exact est défini lors de l'onboarding."
  },
  {
    q: "Que se passe-t-il si un candidat conteste son refus ?",
    a: "Chaque refus est accompagné d'un retour pédagogique structuré et traçable, généré selon vos critères officiels. En cas de recours, vous disposez d'un historique complet des décisions et des justifications associées, consultable à tout moment."
  },
  {
    q: "Est-ce adapté aux petites équipes ou seulement aux grandes écoles ?",
    a: "Lighthouse est conçu pour s'adapter à tous les volumes. Une équipe de 2 personnes gérant 200 candidatures y trouve autant de valeur qu'une direction des admissions traitant 5 000 dossiers — le gain de temps et la qualité des retours sont proportionnels au volume."
  },
];

export default function LandingPage({ onGetStarted }: Props) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  return (
    <div className="min-h-screen bg-[#FFFDF9] font-sans text-slate-900 overflow-x-hidden selection:bg-brand-purple/30">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 bg-[#FFFDF9]/80 backdrop-blur-md z-50 border-b border-orange-900/5">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <img src={`${base}logo.png`} alt="Lighthouse Logo" className="h-8 w-auto" />
            <span className="font-sans font-bold text-xl tracking-tight text-slate-900">Lighthouse</span>
          </div>
          <div className="hidden md:flex space-x-8 text-sm font-medium text-slate-600">
            <a 
              href="#features" 
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="hover:text-slate-900 transition-colors cursor-pointer"
            >
              Fonctionnalités
            </a>
            <a 
              href="#how-it-works" 
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="hover:text-slate-900 transition-colors cursor-pointer"
            >
              Comment ça marche
            </a>
            <a 
              href="#pricing" 
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="hover:text-slate-900 transition-colors cursor-pointer"
            >
              Tarifs
            </a>
          </div>
          <div className="flex items-center space-x-4">
            <button className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors hidden md:block">
              Connexion
            </button>
            <Button onClick={onGetStarted} className="bg-slate-900 text-white rounded-full px-5 py-2.5 text-sm font-semibold hover:bg-slate-800 transition-all hover:scale-105 active:scale-95 shadow-sm">
              Commencer
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Video background */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover object-right"
          src={`${base}hero.mp4`}
        />

        {/* Subtle left fade so text stays readable */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/50 to-transparent z-10" />

        <div className="relative z-20 max-w-6xl mx-auto px-8 w-full pt-16">
          <div className="max-w-xl space-y-8">
            <div className="inline-flex items-center space-x-2 bg-white/70 backdrop-blur-sm border border-slate-200/60 rounded-full px-4 py-1.5 text-sm font-medium text-slate-600 shadow-sm">
              <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
              <span>La nouvelle norme pour les admissions</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-serif font-bold tracking-tight text-slate-900 leading-[1.1]">
              Des admissions{" "}
              <span className="font-serif italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-orange-500">justes</span>,{" "}
              <span className="font-serif italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-orange-500">rapides</span>{" "}
              et{" "}
              <span className="font-serif italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-orange-500">bienveillantes.</span>
            </h1>

            <p className="text-xl text-slate-600 leading-relaxed">
              Automatisez le tri de milliers de candidatures tout en offrant un retour pédagogique personnalisé à chaque postulant.
            </p>

            <div>
              <Button onClick={onGetStarted} className="bg-slate-900 text-white rounded-full px-8 py-7 text-lg font-semibold hover:bg-slate-800 transition-all hover:scale-105 active:scale-95 shadow-xl flex items-center group w-full sm:w-auto">
                Découvrir la plateforme
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>

            <div className="pt-4 space-y-4">
              <p className="text-sm text-slate-500 font-medium">Déjà adopté par les meilleures écoles</p>
              <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
                {[
                  { src: `${base}logos/omnes-education.png`,  alt: "Omnes Education" },
                  { src: `${base}logos/sciences-po.png`,       alt: "Sciences Po", small: true },
                  { src: `${base}logos/centrale-supelec.png`,  alt: "CentraleSupélec" },
                  { src: `${base}logos/hec-paris.png`,         alt: "HEC Paris" },
                ].map((logo) => (
                  <img
                    key={logo.alt}
                    src={logo.src}
                    alt={logo.alt}
                    className={`${'small' in logo && logo.small ? 'h-5 md:h-6' : 'h-10 md:h-12'} w-auto object-contain opacity-75 hover:opacity-100 transition-opacity`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Preview / Bento Grid Inspiration */}
      <section id="features" className="py-20 px-4 scroll-mt-20">
        <div className="max-w-6xl mx-auto">
          {/* Main big feature */}
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex flex-col md:flex-row items-center gap-12 mb-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-brand-purple/10 to-transparent rounded-bl-full -z-10 transition-transform duration-700 group-hover:scale-110" />
            
            <div className="flex-1 space-y-6">
              <div className="w-12 h-12 bg-orange-50 text-brand-orange rounded-2xl flex items-center justify-center">
                <Zap className="w-6 h-6" />
              </div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-900">
                L'IA comme assistant, vous gardez le contrôle
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed">
                Ne passez plus des semaines à éplucher des CV. L'IA pré-analyse et trie les candidatures selon vos critères pour vous faire gagner un temps précieux, mais <strong className="text-slate-900">la décision finale vous appartient toujours.</strong>
              </p>
              <ul className="space-y-3 pt-4">
                <li className="flex items-center text-slate-700"><CheckCircle2 className="w-5 h-5 text-green-500 mr-3" /> Pré-analyse sémantique des dossiers</li>
                <li className="flex items-center text-slate-700"><CheckCircle2 className="w-5 h-5 text-green-500 mr-3" /> Mise en avant des profils pertinents</li>
                <li className="flex items-center text-slate-700"><CheckCircle2 className="w-5 h-5 text-green-500 mr-3" /> <strong className="text-slate-900 ml-1">Vous restez le seul décisionnaire</strong></li>
              </ul>
            </div>
            <div className="flex-1 w-full bg-slate-50 rounded-2xl border border-slate-200/60 p-4 shadow-inner relative flex flex-col gap-4">
              {/* Mockup UI Piece */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-sm font-bold text-slate-500">LM</div>
                  <div>
                    <div className="text-sm font-bold text-slate-900">Léa Martin</div>
                    <div className="text-xs text-slate-500">Match : 98%</div>
                  </div>
                </div>
                <div className="bg-green-100 text-green-700 text-xs font-bold px-2.5 py-1 rounded-md">Retenu</div>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 flex items-center justify-between opacity-70">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-sm font-bold text-slate-500">TB</div>
                  <div>
                    <div className="text-sm font-bold text-slate-900">Thomas Bernard</div>
                    <div className="text-xs text-slate-500">Match : 42%</div>
                  </div>
                </div>
                <div className="bg-red-100 text-red-700 text-xs font-bold px-2.5 py-1 rounded-md">Refusé</div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Feature 2 */}
            <div className="bg-white rounded-3xl p-8 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-gradient-to-bl from-blue-50 to-transparent rounded-bl-full -z-10 transition-transform duration-700 group-hover:scale-110" />
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
                <Target className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-serif font-bold text-slate-900 mb-4">
                Sélection 100% objective
              </h2>
              <p className="text-slate-600 leading-relaxed mb-6">
                Une IA impartiale qui évalue les dossiers uniquement sur la base de critères académiques transparents, éliminant totalement les biais cognitifs humains liés à la fatigue ou aux préjugés.
              </p>
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 mt-auto">
                <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden mb-2">
                  <div className="h-full bg-blue-500 w-[85%] rounded-full"></div>
                </div>
                <div className="text-xs text-slate-500 font-medium flex justify-between">
                  <span>Critère : Mathématiques</span>
                  <span className="text-slate-900 font-bold">85/100</span>
                </div>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-3xl p-8 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-gradient-to-bl from-brand-purple/10 to-transparent rounded-bl-full -z-10 transition-transform duration-700 group-hover:scale-110" />
              <div className="w-12 h-12 bg-purple-50 text-brand-purple rounded-2xl flex items-center justify-center mb-6">
                <Mail className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-serif font-bold text-slate-900 mb-4">
                Expérience candidat premium
              </h2>
              <p className="text-slate-600 leading-relaxed mb-6">
                Fini les refus génériques frustrants. Chaque postulant refusé reçoit instantanément un retour pédagogique personnalisé et constructif, valorisant votre image de marque employeur/école.
              </p>
              <div className="bg-[#FFFDF9] rounded-xl p-4 border border-orange-900/10 mt-auto shadow-sm">
                <div className="flex gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-red-400"></div>
                  <div className="w-2 h-2 rounded-full bg-amber-400"></div>
                  <div className="w-2 h-2 rounded-full bg-green-400"></div>
                </div>
                <div className="text-xs text-slate-600 font-serif leading-relaxed italic">
                  "Malgré un excellent profil en design, vos compétences en développement sont en deçà de nos attentes pour cette session. Nous vous conseillons de..."
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Collaboration Section */}
      <section className="py-24 px-4 bg-[#FFFDF9]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-16">
          {/* Text */}
          <div className="flex-1 space-y-6">
            <div className="inline-flex items-center gap-2 bg-brand-purple/10 text-brand-purple rounded-full px-4 py-1.5 text-sm font-semibold">
              <Users className="w-4 h-4" />
              Collaboration d'équipe
            </div>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 leading-tight">
              Toute votre équipe admissions,<br className="hidden md:block" /> réunie.
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              Invitez vos collègues et travaillez ensemble sur la même campagne en temps réel. Chaque décision est partagée instantanément, pour une revue collective fluide et sans friction.
            </p>
            <ul className="space-y-3 pt-2">
              <li className="flex items-center text-slate-700"><CheckCircle2 className="w-5 h-5 text-green-500 mr-3 shrink-0" /> Présence en direct de chaque membre</li>
              <li className="flex items-center text-slate-700"><CheckCircle2 className="w-5 h-5 text-green-500 mr-3 shrink-0" /> Décisions visibles par toute l'équipe</li>
              <li className="flex items-center text-slate-700"><CheckCircle2 className="w-5 h-5 text-green-500 mr-3 shrink-0" /> Historique complet des actions</li>
            </ul>
          </div>

          {/* Visual mockup */}
          <div className="flex-1 w-full bg-slate-50 rounded-2xl border border-slate-200 p-5 shadow-[0_8px_30px_rgb(0,0,0,0.06)] space-y-3">
            {/* Header barre équipe */}
            <div className="bg-white rounded-xl px-4 py-3 flex items-center justify-between border border-slate-100 shadow-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-xs font-semibold text-slate-600">3 membres actifs sur cette campagne</span>
              </div>
              <div className="flex -space-x-2">
                {[
                  { initials: "MT", color: "bg-purple-500" },
                  { initials: "TD", color: "bg-blue-500" },
                  { initials: "JR", color: "bg-emerald-500" },
                ].map(m => (
                  <div key={m.initials} className={`w-7 h-7 ${m.color} text-white rounded-full flex items-center justify-center text-[10px] font-bold ring-2 ring-white`}>
                    {m.initials}
                  </div>
                ))}
              </div>
            </div>

            {/* Candidate row — "being reviewed" */}
            <div className="bg-white rounded-xl border border-brand-purple/30 p-3 shadow-sm relative">
              <div className="absolute -top-2 left-4">
                <span className="bg-purple-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse inline-block"></span>
                  Marie T. consulte ce dossier
                </span>
              </div>
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-slate-100 rounded-full flex items-center justify-center text-xs font-bold text-slate-500">LM</div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">Léa Martin</p>
                    <p className="text-xs text-slate-500">Score IA : 98/100</p>
                  </div>
                </div>
                <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2.5 py-1 rounded-md">Admis</span>
              </div>
            </div>

            {/* Candidate row — normal */}
            <div className="bg-white rounded-xl border border-slate-100 p-3 shadow-sm opacity-80">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-slate-100 rounded-full flex items-center justify-center text-xs font-bold text-slate-500">TB</div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">Thomas Bernard</p>
                    <p className="text-xs text-slate-500">Score IA : 62/100</p>
                  </div>
                </div>
                <span className="bg-red-100 text-red-700 text-[10px] font-bold px-2.5 py-1 rounded-md">Refusé</span>
              </div>
            </div>

            {/* Activity feed */}
            <div className="border-t border-slate-100 pt-3 space-y-1.5">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-2">Activité récente</p>
              {[
                { color: "bg-emerald-500", initials: "JR", name: "Julie R.", action: "a refusé Hugo Simon", time: "il y a 1 min" },
                { color: "bg-blue-500",    initials: "TD", name: "Thomas D.", action: "a admis Camille Petit", time: "il y a 3 min" },
              ].map((a, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-slate-500">
                  <div className={`w-5 h-5 ${a.color} text-white rounded-full flex items-center justify-center text-[9px] font-bold shrink-0`}>{a.initials}</div>
                  <span><strong className="text-slate-700">{a.name}</strong> {a.action}</span>
                  <span className="ml-auto text-slate-400 shrink-0">{a.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How it works Section */}
      <section id="how-it-works" className="py-24 px-4 bg-white border-y border-slate-100 scroll-mt-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-slate-900">Comment ça marche ?</h2>
            <p className="text-xl text-slate-500 max-w-2xl mx-auto">Trois étapes simples pour révolutionner votre processus d'admission.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 relative">
            {/* Ligne de connexion pour desktop */}
            <div className="hidden md:block absolute top-8 left-1/6 right-1/6 h-0.5 bg-slate-100 z-0"></div>

            {/* Step 1 */}
            <div className="relative z-10 flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 bg-slate-100 text-slate-900 rounded-full flex items-center justify-center font-bold text-2xl border-4 border-white shadow-sm ring-1 ring-slate-200">
                1
              </div>
              <h3 className="text-xl font-bold text-slate-900 font-serif">Configurez vos critères</h3>
              <p className="text-slate-600 leading-relaxed">
                Définissez vos prérequis académiques, compétences attendues et le ton de vos retours personnalisés en quelques clics.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative z-10 flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 bg-slate-100 text-slate-900 rounded-full flex items-center justify-center font-bold text-2xl border-4 border-white shadow-sm ring-1 ring-slate-200">
                2
              </div>
              <h3 className="text-xl font-bold text-slate-900 font-serif">L'IA analyse les dossiers</h3>
              <p className="text-slate-600 leading-relaxed">
                Récupérez les candidatures depuis nos formulaires ou votre site. L'IA extrait, lit et évalue chaque dossier instantanément.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative z-10 flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 bg-slate-100 text-slate-900 rounded-full flex items-center justify-center font-bold text-2xl border-4 border-white shadow-sm ring-1 ring-slate-200">
                3
              </div>
              <h3 className="text-xl font-bold text-slate-900 font-serif">Vous validez</h3>
              <p className="text-slate-600 leading-relaxed">
                Consultez le classement, ajustez si besoin, et validez. L'IA génère et envoie un e-mail bienveillant à ceux qui ne sont pas retenus.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Cas d'usage chiffré */}
      <section className="py-24 px-4 bg-white border-t border-slate-100">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14 space-y-3">
            <span className="inline-block bg-slate-900 text-white text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full">Cas client</span>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-slate-900">Des résultats mesurables,<br className="hidden md:block" /> dès la première campagne.</h2>
          </div>

          <div className="bg-gradient-to-br from-slate-950 to-slate-800 rounded-3xl overflow-hidden shadow-2xl">
            {/* Header du cas */}
            <div className="px-10 pt-10 pb-8 border-b border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <p className="text-slate-400 text-sm font-semibold uppercase tracking-widest mb-1">École Supérieure de Management de Lyon</p>
                <p className="text-white text-xl font-serif font-bold">Campagne d'admission — Master Innovation & Stratégie</p>
                <p className="text-slate-400 text-sm mt-1">Session 2025 · 1 formation · équipe de 3 responsables admissions</p>
              </div>
              <div className="shrink-0 bg-white/10 border border-white/20 rounded-2xl px-5 py-3 text-center">
                <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">Candidatures reçues</p>
                <p className="text-white text-3xl font-bold font-serif">847</p>
              </div>
            </div>

            {/* Métriques */}
            <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-white/10">
              {[
                { before: "3 semaines", after: "4 jours",  label: "Délai de traitement" },
                { before: "0 %",        after: "100 %",   label: "Candidats ayant reçu un retour" },
                { before: "~35 heures", after: "6 h",     label: "Temps équipe par campagne" },
                { before: "Non mesuré", after: "4,6 / 5", label: "Satisfaction candidats (post-refus)" },
              ].map((stat) => (
                <div key={stat.label} className="px-7 py-8 flex flex-col gap-2">
                  <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider leading-snug">{stat.label}</p>
                  <p className="text-3xl font-bold font-serif mt-1 text-white">
                    {stat.after}
                  </p>
                  <p className="text-sm text-slate-500">
                    <span className="line-through decoration-red-400/70">{stat.before}</span>
                    <span className="text-slate-600 ml-1.5">avant</span>
                  </p>
                </div>
              ))}
            </div>

            {/* Citation */}
            <div className="px-10 py-8 border-t border-white/10 flex flex-col md:flex-row items-start gap-5">
              <Quote className="w-8 h-8 text-brand-purple/60 shrink-0 mt-1" />
              <div>
                <p className="text-slate-200 text-lg leading-relaxed italic font-serif">
                  "Ce qui nous a convaincu, c'est que les candidats refusés nous ont remercié pour la qualité des retours. Pour la première fois, on n'a eu aucune demande de réexamen liée à l'absence de motivation dans la réponse."
                </p>
                <div className="flex items-center gap-3 mt-5">
                  <div className="w-10 h-10 rounded-full bg-brand-purple/30 flex items-center justify-center text-sm font-bold text-white">SB</div>
                  <div>
                    <p className="text-white font-semibold text-sm">Sophie Bernardi</p>
                    <p className="text-slate-400 text-xs">Directrice des admissions — ESML</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tarifs */}
      <section id="pricing" className="py-24 px-4 scroll-mt-20 bg-[#FFFDF9]">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <div className="space-y-3">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-slate-900">Tarifs</h2>
            <p className="text-xl text-slate-600 max-w-xl mx-auto">
              Un devis personnalisé, adapté à votre établissement.
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 md:p-12 text-left space-y-8">
            <div className="text-center pb-6 border-b border-slate-100">
              <p className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-2">Modèle</p>
              <p className="text-3xl md:text-4xl font-serif font-bold text-slate-900">Devis sur mesure</p>
              <p className="text-slate-600 mt-3 max-w-md mx-auto">
                Nous construisons une offre en fonction de votre volume de candidatures, de vos besoins spécifiques et du nombre de formations concernées.
              </p>
            </div>

            <ul className="space-y-4 text-slate-700">
              <li className="flex gap-3">
                <CheckCircle2 className="w-5 h-5 text-slate-900 shrink-0 mt-0.5" />
                <span><strong className="text-slate-900">Nombre de candidats</strong> — le tarif reflète le volume annuel ou par campagne que vous traitez.</span>
              </li>
              <li className="flex gap-3">
                <CheckCircle2 className="w-5 h-5 text-slate-900 shrink-0 mt-0.5" />
                <span><strong className="text-slate-900">Besoins de l&apos;école</strong> — formulaires personnalisés, intégrations, niveau d&apos;accompagnement : tout est ajusté à votre contexte.</span>
              </li>
              <li className="flex gap-3">
                <CheckCircle2 className="w-5 h-5 text-slate-900 shrink-0 mt-0.5" />
                <span><strong className="text-slate-900">Nombre de formations</strong> — une ou plusieurs filières, plusieurs campagnes : la proposition commerciale suit l&apos;ampleur de votre dispositif.</span>
              </li>
            </ul>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button onClick={onGetStarted} className="bg-slate-900 text-white rounded-full px-8 py-6 text-base font-semibold hover:bg-slate-800 w-full sm:w-auto">
                Demander un devis
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Témoignages (démonstration) */}
      <section className="py-20 px-4 bg-white border-t border-slate-200">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
            <p className="text-sm font-semibold uppercase tracking-wider text-slate-500">Ils nous font confiance</p>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-900">
              Ce que disent les équipes admissions
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                quote:
                  "On a divisé par trois le temps passé sur le tri des dossiers, sans sacrifier la qualité des retours aux candidats.",
                author: "Claire Dumont",
                role: "Responsable admissions — école de commerce",
                avatar: `${base}testimonials/avatar-1.png`,
              },
              {
                quote:
                  "Les refus sont enfin accompagnés d'un message clair et pédagogique. Les candidats nous le disent : c'est plus humain.",
                author: "Marc Lefèvre",
                role: "Directeur des études — institut universitaire",
                avatar: `${base}testimonials/avatar-2.png`,
              },
              {
                quote:
                  "La vue par campagne et le classement IA nous ont permis de tenir nos délais de réponse annoncés aux candidats.",
                author: "Philippe Garnier",
                role: "Responsable recrutement — formation continue",
                avatar: `${base}testimonials/avatar-3.png`,
              },
            ].map((t) => (
              <blockquote
                key={t.author}
                className="relative rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm flex flex-col h-full"
              >
                <Quote className="w-8 h-8 text-brand-purple/40 mb-4 shrink-0" aria-hidden />
                <p className="text-slate-800 leading-relaxed flex-1 text-[15px]">&ldquo;{t.quote}&rdquo;</p>
                <footer className="mt-6 pt-4 border-t border-slate-200/80 flex items-center gap-3">
                  <img
                    src={t.avatar}
                    alt=""
                    width={56}
                    height={56}
                    className="w-14 h-14 rounded-full object-cover object-top shrink-0 ring-2 ring-white shadow-md"
                  />
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-900">{t.author}</p>
                    <p className="text-sm text-slate-600 mt-0.5 leading-snug">{t.role}</p>
                  </div>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 px-4 bg-[#FFFDF9] border-t border-slate-100">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14 space-y-3">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-slate-900">Questions fréquentes</h2>
            <p className="text-lg text-slate-500">Tout ce que vous vous demandez avant de vous lancer.</p>
          </div>
          <div className="space-y-3">
            {FAQ_ITEMS.map((item, i) => (
              <div
                key={i}
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden transition-shadow hover:shadow-sm"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-5 text-left gap-4"
                >
                  <span className="font-semibold text-slate-900 text-[15px] leading-snug">{item.q}</span>
                  <ChevronDown className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5 text-slate-600 text-[15px] leading-relaxed border-t border-slate-100 pt-4">
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA final + pied de page (fond sombre, lisible) */}
      <section className="relative overflow-hidden bg-slate-950 text-slate-100">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,_rgba(139,92,246,0.18),_transparent)] pointer-events-none" />
        <div className="relative py-20 px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-white leading-tight">
              Prêt à transformer vos admissions ?
            </h2>
            <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto">
              Rejoignez les institutions qui recrutent mieux, plus vite, et avec plus d&apos;humanité.
            </p>
            <div className="pt-2">
              <Button
                onClick={onGetStarted}
                className="bg-white text-slate-950 rounded-full px-8 py-6 text-lg font-bold hover:bg-slate-100 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xl"
              >
                Démarrer gratuitement
              </Button>
            </div>
          </div>
        </div>

        <footer className="relative border-t border-slate-800/80 py-10 px-4">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center space-x-2">
              <img src={`${base}logo.png`} alt="Lighthouse Logo" className="h-6 w-auto opacity-90 brightness-0 invert" />
              <span className="font-sans font-bold text-white">Lighthouse</span>
            </div>
            <p className="text-sm text-slate-400 text-center md:text-left">
              © 2026 Lighthouse. Tous droits réservés. Hackathon Edition.
            </p>
            <div className="flex gap-6 text-sm font-medium text-slate-400">
              <a href="#" className="hover:text-white transition-colors">
                Confidentialité
              </a>
              <a href="#" className="hover:text-white transition-colors">
                CGU
              </a>
            </div>
          </div>
        </footer>
      </section>
    </div>
  )
}
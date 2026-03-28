import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { CheckCircle2, XCircle, BrainCircuit, X, Search } from "lucide-react"
import { useState, useMemo, useCallback, useLayoutEffect, useEffect } from "react"
import type { Candidate } from "../types"
import emailjs from "@emailjs/browser"
import { showToast } from "../components/Toaster"

interface Props {
  candidates: Candidate[];
  setCandidates: React.Dispatch<React.SetStateAction<Candidate[]>>;
  capacity: number;
  onNext: () => void;
  onPrev: () => void;
}

const ITEMS_PER_PAGE = 10;

export default function Step4Selection({ candidates, setCandidates, capacity, onNext, onPrev }: Props) {
  const [sortMode, setSortMode] = useState<"score_desc" | "date_desc" | "date_asc" | "name_asc" | "name_desc">("score_desc");
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const acceptedCount = candidates.filter(c => c.status === 'accepted').length;
  const selectedCandidate = candidates.find(c => c.id === selectedCandidateId);

  useLayoutEffect(() => {
    setCandidates((prev) => {
      let changed = false;
      const next = prev.map((c) => {
        if (c.status === "accepted" || c.status === "rejected" || c.status === "pending") {
          return c;
        }
        changed = true;
        return { ...c, status: "pending" as const };
      });
      return changed ? next : prev;
    });
  }, [setCandidates]);

  const sortCandidates = useCallback(
    (list: Candidate[]) => {
      return [...list].sort((a, b) => {
        if (a.id === "1") return -1;
        if (b.id === "1") return 1;

        if (sortMode === "score_desc") return (b.score || 0) - (a.score || 0);
        if (sortMode === "name_asc") return a.name.localeCompare(b.name);
        if (sortMode === "name_desc") return b.name.localeCompare(a.name);
        if (sortMode === "date_desc") return new Date(b.applicationDate).getTime() - new Date(a.applicationDate).getTime();
        if (sortMode === "date_asc") return new Date(a.applicationDate).getTime() - new Date(b.applicationDate).getTime();
        return 0;
      });
    },
    [sortMode]
  );

  const decidedCandidates = useMemo(() => {
    const filtered = candidates.filter(
      c => (c.status === "accepted" || c.status === "rejected") &&
      c.name.toLowerCase().includes(search.toLowerCase())
    );
    return sortCandidates(filtered);
  }, [candidates, sortCandidates, search]);

  const awaitingCandidates = useMemo(() => {
    const filtered = candidates.filter(
      c => c.status === "pending" &&
      c.name.toLowerCase().includes(search.toLowerCase())
    );
    return sortCandidates(filtered);
  }, [candidates, sortCandidates, search]);

  useEffect(() => { setCurrentPage(1); }, [search, sortMode]);

  const updateStatus = async (id: string, newStatus: "accepted" | "rejected" | "pending"): Promise<boolean> => {
    const candidate = candidates.find(c => c.id === id);
    if (!candidate) return false;

    if (newStatus === "accepted" && acceptedCount >= capacity && candidate.status !== "accepted" && capacity !== Infinity) {
      showToast("Capacité nominale atteinte — ce candidat sera en liste de priorité", "warning");
    }

    // Effet WOW pour Léa Martin (ID 1) UNIQUEMENT si acceptée
    // Si refusée, le mail partira à l'étape 5 (batch)
    if (candidate.email === "gadwstudio@gmail.com" && newStatus === "accepted" && candidate.status !== "accepted") {
      const SERVICE_ID = "service_ry8qdnr";
      const TEMPLATE_ID = "template_ud9775f";
      const PUBLIC_KEY = "Rr9hfefYgp0HXZ2yw";

      const htmlMessage = `
<p style="font-size:15px;color:#1e293b;">Bonjour Léa,</p>

<p style="font-size:15px;color:#1e293b;">Nous avons le plaisir de vous confirmer votre <strong>admission au Master Management de l'Innovation — session 2025-2026</strong>.</p>

<p style="font-size:15px;color:#1e293b;">Cette décision n'a pas été prise à la légère. Parmi les <strong>847 candidatures</strong> reçues cette année — un record — votre dossier a fait l'objet d'une discussion approfondie en jury. Ce message a pour vocation de vous donner une lecture honnête et complète de ce qui a emporté notre décision, et de vous préparer au mieux pour la rentrée.</p>

<hr style="border:none;border-top:2px solid #e2e8f0;margin:28px 0"/>

<p style="font-size:16px;font-weight:700;color:#0f172a;">✦ Analyse de votre dossier — ce que le jury a retenu</p>

<p style="font-size:14px;color:#475569;font-style:italic;">Chaque point ci-dessous correspond à un critère d'évaluation explicite de notre grille de sélection.</p>

<p style="font-size:15px;color:#1e293b;margin-top:16px;"><strong>① Expérience professionnelle — L'Oréal (Assistant Chef de Produit, 3 mois)</strong><br/>
C'est l'élément le plus distinctif de votre candidature. Non pas parce que L'Oréal est un grand groupe — mais parce que vous avez conduit une <em>analyse concurrentielle autonome sur les cosmétiques éco-responsables</em> dans un secteur en pleine disruption réglementaire (directive CSRD, normes EU Green Deal). À ce stade du cursus, c'est une exposition à la complexité stratégique que peu de candidats ont eue. Le jury a noté que vous avez su relier une tendance macro (durabilité) à des décisions opérationnelles (reformulation produit, repositionnement prix) — c'est exactement le raisonnement que nous formons.</p>

<p style="font-size:15px;color:#1e293b;margin-top:16px;"><strong>② Engagement associatif — Trésorier BDE, budget 15 000 €</strong><br/>
Gérer un budget de 15 000 € et coordonner des événements pour 500 personnes n'est pas une ligne de CV ordinaire. Ce que le jury a apprécié, c'est la <em>responsabilité financière réelle</em> que vous avez assumée : trésorerie, fournisseurs, arbitrages budgétaires en temps réel. Cela révèle une capacité à prendre des décisions sous contrainte — compétence que les cours seuls ne peuvent pas enseigner. Plusieurs membres du jury ont commenté que votre posture de "trésorier actif" (et non représentatif) était perceptible dans la façon dont vous l'avez décrit.</p>

<p style="font-size:15px;color:#1e293b;margin-top:16px;"><strong>③ Compétences linguistiques — TOEIC 910/990 + espagnol B2</strong><br/>
Deux tiers de nos intervenants extérieurs sont anglophones (McKinsey, BCG, Unilever Europe). Trois modules de S2 sont dispensés intégralement en anglais. Votre score TOEIC vous place dans le premier quartile des candidats admis cette année — vous n'aurez pas à dépenser d'énergie sur la langue, vous pourrez vous concentrer sur le fond. Le B2 en espagnol est un plus non négligeable : nous développons un partenariat avec ESADE Barcelona pour un module commun à partir de 2026.</p>

<p style="font-size:15px;color:#1e293b;margin-top:16px;"><strong>④ Lettre de motivation — cohérence et profondeur</strong><br/>
Votre lettre a marqué par sa précision. Vous citez le module <em>"Green Business Models"</em> non pas comme un argument marketing, mais en expliquant comment il s'articule avec votre projet professionnel (conseil en stratégie RSE). Le jury est habitué aux lettres génériques — la vôtre prouvait que vous aviez lu notre programme en détail et que votre intérêt était authentique. C'est rare, et ça compte.</p>

<p style="font-size:15px;color:#1e293b;margin-top:16px;"><strong>⑤ Cohérence globale du projet</strong><br/>
L'expérience L'Oréal + l'engagement BDE + la lettre forment un projet lisible et cohérent. Le jury peut voir où vous allez. Beaucoup de candidats ont de bons éléments épars — vous, vous avez une trajectoire.</p>

<hr style="border:none;border-top:2px solid #e2e8f0;margin:28px 0"/>

<p style="font-size:16px;font-weight:700;color:#0f172a;">✦ Axes de progression — pour aborder le programme dans les meilleures conditions</p>

<p style="font-size:14px;color:#475569;font-style:italic;">Ces recommandations sont constructives, non éliminatoires. Votre admission est ferme. Ce sont des investissements pour que votre rentrée soit plus sereine.</p>

<p style="font-size:15px;color:#1e293b;margin-top:16px;"><strong>① Comptabilité de gestion — priorité haute</strong><br/>
Le module "Business Modelling & Finance d'entreprise" (Semestre 1, obligatoire) présuppose une maîtrise des notions de coûts complets, marges sur coûts variables et seuil de rentabilité. Votre parcours marketing n'a pas nécessairement couvert ces bases en profondeur — et c'est normal.<br/><br/>
<em>Ce que nous vous recommandons :</em><br/>
— MOOC "Comptabilité de gestion" de l'Université Paris-Dauphine sur FUN-MOOC (gratuit, 10h, niveau accessible)<br/>
— Ouvrage : <em>Contrôle de gestion</em>, Claude Alazard & Sabine Sépari — Chapitres 1 à 4 suffisent<br/>
— Objectif minimal : savoir lire un compte de résultat différentiel et calculer un point mort<br/><br/>
Si vous investissez 2h/semaine jusqu'en septembre, vous arriverez à niveau.</p>

<p style="font-size:15px;color:#1e293b;margin-top:16px;"><strong>② Droit des affaires — priorité moyenne</strong><br/>
Votre futur rôle de manager vous confrontera à des questions contractuelles, de propriété intellectuelle et de conformité réglementaire (particulièrement dans la durabilité : CSRD, taxonomie verte). Une base juridique vous rendra plus crédible face aux équipes légales et aux clients.<br/><br/>
<em>Ce que nous vous recommandons :</em><br/>
— MOOC "Introduction au droit des entreprises", Université Paris 2 Panthéon-Assas sur Coursera (6h, gratuit en audit)<br/>
— Focus sur : contrats commerciaux, responsabilité du dirigeant, notions de droit de la concurrence<br/>
— Pas besoin d'aller plus loin : notre cours de S2 couvrira les spécificités sectorielles</p>

<p style="font-size:15px;color:#1e293b;margin-top:16px;"><strong>③ Excel / modélisation financière — priorité complémentaire</strong><br/>
Si votre maîtrise d'Excel se limite aux usages courants (tableaux, formules simples), un effort de mise à niveau sera utile. Le module Business Modelling utilise des modèles multi-scénarios avec TCD, INDEX/EQUIV et des bases de simulation Monte Carlo.<br/><br/>
<em>Ressource :</em> la série "Excel for Business" de Macquarie University sur Coursera (auditable gratuitement) couvre l'essentiel en 15h.</p>

<hr style="border:none;border-top:2px solid #e2e8f0;margin:28px 0"/>

<p style="font-size:16px;font-weight:700;color:#0f172a;">✦ Prochaines étapes — ce que vous devez faire</p>

<table style="width:100%;border-collapse:collapse;font-size:14px;color:#1e293b;">
  <tr style="border-bottom:1px solid #e2e8f0;">
    <td style="padding:10px 8px;font-weight:600;">📌 Confirmation d'inscription</td>
    <td style="padding:10px 8px;">Avant le <strong>15 juillet 2025</strong> — lien dans le portail admissions</td>
  </tr>
  <tr style="border-bottom:1px solid #e2e8f0;">
    <td style="padding:10px 8px;font-weight:600;">📘 Livret pédagogique de préparation</td>
    <td style="padding:10px 8px;">Envoi sous <strong>15 jours</strong> — contient le syllabus détaillé S1 et la liste de lectures recommandées</td>
  </tr>
  <tr style="border-bottom:1px solid #e2e8f0;">
    <td style="padding:10px 8px;font-weight:600;">👥 Journée de pré-rentrée (présentiel)</td>
    <td style="padding:10px 8px;"><strong>1er septembre 2025</strong> — rencontre de la promotion, remise des accès plateforme, présentation des intervenants</td>
  </tr>
  <tr style="border-bottom:1px solid #e2e8f0;">
    <td style="padding:10px 8px;font-weight:600;">📅 Rentrée officielle</td>
    <td style="padding:10px 8px;"><strong>8 septembre 2025</strong> — premier cours : Stratégie & Positionnement concurrentiel</td>
  </tr>
  <tr>
    <td style="padding:10px 8px;font-weight:600;">💬 Entretien individuel optionnel</td>
    <td style="padding:10px 8px;">Disponible sur demande avec votre référent pédagogique — répondez à cet email pour planifier</td>
  </tr>
</table>

<hr style="border:none;border-top:2px solid #e2e8f0;margin:28px 0"/>

<p style="font-size:15px;color:#1e293b;">Léa, nous terminons chaque année par la même phrase aux candidats admis, et elle est sincère : <strong>nous avons autant à apprendre de vous que vous de nous</strong>. Votre regard extérieur, votre expérience terrain, vos questionnements — ce sont eux qui font vivre le programme.</p>

<p style="font-size:15px;color:#1e293b;">Si vous avez des questions sur le contenu pédagogique, la vie étudiante, les débouchés ou simplement sur ce qui vous attend — répondez directement à cet email. Nous lisons tout.</p>

<p style="font-size:15px;color:#1e293b;">À très bientôt,</p>

<p style="font-size:15px;color:#1e293b;">
<strong>Claire Beaumont</strong><br/>
Responsable des Admissions<br/>
<em>Master Management de l'Innovation — Promotion 2025-2026</em>
</p>
`;

      try {
        await emailjs.send(
          SERVICE_ID,
          TEMPLATE_ID,
          {
            to_name: candidate.name,
            to_email: candidate.email,
            message: htmlMessage,
            reply_to: "gadwstudio@gmail.com"
          },
          PUBLIC_KEY
        );
        console.log("Email d'admission (Effet Wow) envoyé à", candidate.email);
      } catch (e) {
        console.error("Erreur lors de l'envoi de l'email wow", e);
      }
    }

    setCandidates(candidates.map(c => c.id === id ? { ...c, status: newStatus } : c));
    return true;
  };

  const publishReturns = () => {
    onNext();
  };

  const closeSelection = () => {
    const hasPending = candidates.some((c) => c.status === "pending");
    if (hasPending) {
      setCandidates(prev => prev.map(c =>
        c.status === "pending" ? { ...c, status: "rejected" as const } : c
      ));
    }
    onNext();
  };

  const renderCandidateRow = (c: Candidate) => {
    const decided = c.status === "accepted" || c.status === "rejected";
    return (
      <div
        key={c.id}
        className={`flex items-center bg-white border p-3 rounded-lg hover:shadow-md transition-all cursor-pointer hover:border-slate-300 ${
          decided
            ? c.status === "accepted"
              ? "border-l-4 border-l-green-500 border-slate-200"
              : "border-l-4 border-l-red-400 border-slate-200"
            : "border-slate-200 border-l-4 border-l-transparent"
        }`}
        onClick={() => setSelectedCandidateId(c.id)}
      >
        <div className="flex-1 pr-4 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-semibold text-slate-900">{c.name}</p>
            {decided && (
              <span
                className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-md ${
                  c.status === "accepted" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                }`}
              >
                {c.status === "accepted" ? "Admis" : "Refusé"}
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 flex items-center mt-1 line-clamp-2">
            <BrainCircuit className="w-3 h-3 mr-1 shrink-0 text-brand-purple" />
            {c.aiAnalysis}
          </p>
        </div>
        <div className="w-28 text-sm text-slate-500 shrink-0 text-right">
          {new Date(c.applicationDate).toLocaleDateString("fr-FR")}
        </div>
        <div className="w-48 flex justify-end space-x-2 shrink-0" onClick={(e) => e.stopPropagation()}>
          <Button
            size="sm"
            variant={c.status === "accepted" ? "default" : "outline"}
            className={
              c.status === "accepted"
                ? "bg-green-600 hover:bg-green-700 text-white border-none"
                : "bg-white hover:bg-green-50 hover:text-green-700 hover:border-green-200"
            }
            onClick={() => updateStatus(c.id, c.status === "accepted" ? "pending" : "accepted")}
          >
            <CheckCircle2 className="w-4 h-4 mr-1" /> {c.status === "accepted" ? "Admis" : "Admettre"}
          </Button>
          <Button
            size="sm"
            variant={c.status === "rejected" ? "default" : "outline"}
            className={
              c.status === "rejected"
                ? "bg-red-600 hover:bg-red-700 text-white border-none"
                : "bg-white hover:bg-red-50 hover:text-red-700 hover:border-red-200"
            }
            onClick={() => updateStatus(c.id, c.status === "rejected" ? "pending" : "rejected")}
          >
            <XCircle className="w-4 h-4 mr-1" /> {c.status === "rejected" ? "Refusé" : "Refuser"}
          </Button>
        </div>
      </div>
    );
  };

  const totalAwaitingPages = Math.max(1, Math.ceil(awaitingCandidates.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalAwaitingPages);
  const paginatedAwaiting = awaitingCandidates.slice((safePage - 1) * ITEMS_PER_PAGE, safePage * ITEMS_PER_PAGE);

  return (
    <div className="flex flex-col space-y-6 relative">
      <Card className="max-w-5xl mx-auto shadow-sm w-full">
        <CardHeader className="pb-6">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-3xl font-serif mb-2">Étape 4 : Sélection des Candidats</CardTitle>
              <CardDescription className="text-lg">
                L'algorithme a mis en avant les profils les plus pertinents. Sélectionnez les candidats admis dans la limite de vos places.
              </CardDescription>
            </div>
            <div className={`px-6 py-3 rounded-xl border ${
              acceptedCount > capacity && capacity !== Infinity ? 'bg-orange-50 border-orange-200 text-orange-700' :
              acceptedCount === capacity && capacity !== Infinity ? 'bg-amber-50 border-amber-200 text-amber-700' :
              'bg-green-50 border-green-200 text-green-700'
            }`}>
              <p className="text-sm font-semibold uppercase tracking-wider mb-1">Places pourvues</p>
              <p className="text-2xl font-bold">{acceptedCount} / {capacity === Infinity ? "∞" : capacity}</p>
              {acceptedCount > capacity && capacity !== Infinity && (
                <p className="text-xs font-semibold mt-1">dont +{acceptedCount - capacity} en liste de priorité</p>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-3 mt-4">
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Rechercher un candidat..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 border border-slate-200 bg-slate-50 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-900 placeholder-slate-400"
              />
            </div>
            <select
              className="border border-slate-200 bg-slate-50 rounded-lg px-4 py-2.5 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-900 cursor-pointer shadow-sm hover:bg-slate-100 transition-colors"
              value={sortMode}
              onChange={(e) => setSortMode(e.target.value as any)}
            >
              <option value="score_desc">Trier par : Pertinence du profil par rapport à la formation</option>
              <option value="date_desc">Trier par : Date de candidature (Plus récent)</option>
              <option value="date_asc">Trier par : Date de candidature (Plus ancien)</option>
              <option value="name_asc">Trier par : Nom (De A à Z)</option>
              <option value="name_desc">Trier par : Nom (De Z à A)</option>
            </select>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-8">
          {/* Décisions prises sur ce tour */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/60 overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-200 bg-white/80 flex flex-wrap items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Décisions prises</h3>
                <p className="text-xs text-slate-500 mt-0.5">Profils admis ou refusés — repassez en attente avec les boutons si besoin</p>
              </div>
              <span className="text-sm font-semibold tabular-nums bg-white px-3 py-1 rounded-full border border-slate-200 text-slate-700">
                {decidedCandidates.length}
              </span>
            </div>
            <div className="p-3 max-h-[min(40vh,420px)] overflow-y-auto space-y-2">
              {decidedCandidates.length === 0 ? (
                <p className="text-sm text-slate-500 text-center py-10 px-4">
                  Aucune décision pour l&apos;instant. Les candidats apparaîtront ici après « Admettre » ou « Refuser ».
                </p>
              ) : (
                decidedCandidates.map((c) => renderCandidateRow(c))
              )}
            </div>
          </div>

          {/* Encore en attente */}
          <div className="rounded-xl border border-amber-200/80 bg-amber-50/30 overflow-hidden">
            <div className="px-4 py-3 border-b border-amber-200/60 bg-white/90 flex flex-wrap items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">En attente de décision</h3>
                <p className="text-xs text-slate-600 mt-0.5">Dossiers à trancher sur ce tour de sélection</p>
              </div>
              <span className="text-sm font-semibold tabular-nums bg-amber-100/80 text-amber-950 px-3 py-1 rounded-full border border-amber-200/80">
                {awaitingCandidates.length}
              </span>
            </div>
            <div className="p-3 space-y-2">
              {awaitingCandidates.length === 0 ? (
                <p className="text-sm text-slate-600 text-center py-10 px-4">
                  Tous les dossiers ont reçu une décision. Vous pouvez encore modifier un choix dans la zone du dessus.
                </p>
              ) : (
                paginatedAwaiting.map((c) => renderCandidateRow(c))
              )}
            </div>
            {totalAwaitingPages > 1 && (
              <div className="px-4 py-3 border-t border-amber-200/60 bg-white/50 flex items-center justify-between">
                <p className="text-xs text-slate-500 font-medium">
                  Page {safePage} / {totalAwaitingPages} · {awaitingCandidates.length} dossiers
                </p>
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalAwaitingPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      type="button"
                      onClick={() => setCurrentPage(page)}
                      className={`w-7 h-7 rounded-md text-xs font-semibold transition-colors ${
                        safePage === page
                          ? 'bg-slate-900 text-white'
                          : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between sm:items-center pt-2 border-t border-slate-100">
            <Button variant="outline" onClick={onPrev}>
              Retour
            </Button>
            <div className="flex flex-col gap-2 sm:flex-row sm:justify-end sm:gap-3">
              <Button variant="outline" className="border-slate-300" onClick={publishReturns}>
                Publier les retours
              </Button>
              <Button className="bg-slate-900 text-white hover:bg-slate-800" onClick={closeSelection}>
                Clôturer la sélection
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modale de profil */}
      {selectedCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={() => setSelectedCandidateId(null)}>
          <Card className="w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl bg-white overflow-hidden animate-in fade-in zoom-in duration-200" onClick={e => e.stopPropagation()}>
            <CardHeader className="pb-4 border-b border-slate-100 bg-white relative z-10">
              <button 
                onClick={() => setSelectedCandidateId(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 p-1.5 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="flex justify-between items-start pr-8">
                <div>
                  <CardTitle className="text-2xl">{selectedCandidate.name}</CardTitle>
                  <CardDescription className="mt-1">{selectedCandidate.email} • Postulé le {new Date(selectedCandidate.applicationDate).toLocaleDateString('fr-FR')}</CardDescription>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="p-6 overflow-y-auto flex-1 space-y-6 bg-white relative z-0">
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                <h4 className="font-semibold text-slate-800 mb-2 flex items-center">
                  <BrainCircuit className="w-4 h-4 text-brand-purple mr-2" />
                  Avis de l'IA
                </h4>
                <p className="text-sm text-slate-700">
                  {selectedCandidate.aiAnalysis}
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-slate-800 mb-2 text-sm">Dossier de candidature complet</h4>
                <p className="text-sm text-slate-600 bg-white border border-slate-200 p-4 rounded-md shadow-inner whitespace-pre-wrap leading-relaxed">
                  {selectedCandidate.profileData}
                </p>
              </div>
            </CardContent>

            <div className="p-4 border-t border-slate-100 bg-slate-50 rounded-b-lg flex justify-end space-x-3 relative z-10">
              <Button 
                variant={selectedCandidate.status === 'rejected' ? 'default' : 'outline'}
                className={selectedCandidate.status === 'rejected' ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-white text-slate-700 border-slate-200 hover:bg-red-50 hover:text-red-700 hover:border-red-200'}
                onClick={async () => {
                  if (selectedCandidate.status === 'rejected') {
                    await updateStatus(selectedCandidate.id, 'pending');
                    return;
                  }
                  const ok = await updateStatus(selectedCandidate.id, 'rejected');
                  if (ok) setSelectedCandidateId(null);
                }}
              >
                <XCircle className="w-4 h-4 mr-2" /> {selectedCandidate.status === 'rejected' ? 'Refusé' : 'Refuser'}
              </Button>
              <Button 
                variant={selectedCandidate.status === 'accepted' ? 'default' : 'outline'}
                className={selectedCandidate.status === 'accepted' ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-white text-slate-700 border-slate-200 hover:bg-green-50 hover:text-green-700 hover:border-green-200'}
                onClick={async () => {
                  if (selectedCandidate.status === 'accepted') {
                    await updateStatus(selectedCandidate.id, 'pending');
                    return;
                  }
                  const ok = await updateStatus(selectedCandidate.id, 'accepted');
                  if (ok) setSelectedCandidateId(null);
                }}
              >
                <CheckCircle2 className="w-4 h-4 mr-2" /> {selectedCandidate.status === 'accepted' ? 'Admis' : 'Admettre'}
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
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
<p>Bonjour Léa,</p>

<p>Je vous écris avec un vrai plaisir ce soir — votre dossier a été accepté en jury cet après-midi et je tenais à vous l'annoncer moi-même plutôt que de vous laisser attendre un email automatique.</p>

<p>Vous intégrez le Master Management de l'Innovation à la rentrée de septembre.</p>

<p>Je vais vous dire ce qui a retenu l'attention dans votre dossier, parce que je trouve que les candidats méritent de savoir pourquoi ils sont admis — pas juste d'apprendre qu'ils le sont.</p>

<p>Votre stage chez L'Oréal a compté, mais pas pour les raisons que vous imaginez peut-être. Ce n'est pas le nom de l'entreprise — c'est ce que vous en avez fait. Conduire une analyse concurrentielle sur les cosmétiques éco-responsables de façon autonome, en comprenant les enjeux réglementaires derrière (la CSRD, le Green Deal), c'est une maturité qu'on ne voit pas souvent à ce stade. Savoir relier une tendance macro à une décision opérationnelle, c'est exactement ce qu'on cherche à développer ici. Vous l'avez déjà fait.</p>

<p>Le BDE aussi. Trésorier actif avec 15 000 € sous responsabilité et des événements à 500 personnes, ce n'est pas une ligne de CV qu'on lit en diagonale. Ce qu'on a vu derrière, c'est quelqu'un qui arbitre sous contrainte, qui gère des fournisseurs, qui assume. Vous en parliez avec précision — pas comme une expérience à valoriser, mais comme quelque chose que vous avez vraiment fait. Ça se sent.</p>

<p>Votre TOEIC à 910 vous met dans le premier quart de la promotion — les modules en anglais du S2 ne seront pas un obstacle pour vous, vous pourrez vous concentrer sur le fond. Et le B2 en espagnol tombe bien : on est en train de monter un module commun avec ESADE Barcelona, vous serez dans les premières promos à en bénéficier.</p>

<p>Votre lettre de motivation m'a aussi marquée. Vous citez le module Green Business Models en expliquant pourquoi il s'articule avec votre projet — pas pour faire bien, mais parce que vous avez réellement lu le programme. Le jury est habitué aux lettres génériques. La vôtre ne l'était pas.</p>

<p>Maintenant, quelques mots francs sur ce que vous allez rencontrer à la rentrée, parce que je préfère vous le dire maintenant plutôt que de vous laisser la surprise.</p>

<p>Le module Business Modelling du S1 va être exigeant si vous n'avez pas de base en comptabilité de gestion. Ce n'est pas rédhibitoire — beaucoup d'étudiants arrivent sans cette base — mais si vous pouvez vous y mettre avant septembre, vous vous faciliterez vraiment la vie. Le MOOC de Paris-Dauphine sur FUN-MOOC est bien fait et gratuit, une dizaine d'heures suffisent pour avoir les fondamentaux. L'objectif c'est juste de savoir lire un compte de résultat différentiel et calculer un seuil de rentabilité, pas de devenir expert-comptable.</p>

<p>Sur le droit des affaires, même chose — une initiation courte sur Coursera (l'université Paris 2 en propose une bonne, 6 heures en audit gratuit) vous donnera le vocabulaire pour ne pas être perdue quand les questions contractuelles ou de propriété intellectuelle arrivent dans les cas. Et elles arrivent souvent.</p>

<p>Ce ne sont pas des conditions à votre admission — votre place est confirmée. C'est juste ce que j'aurais aimé qu'on me dise quand j'étais à votre place.</p>

<p>Pour la suite concrète : vous devez confirmer votre inscription avant le 15 juillet via le portail (lien dans l'email de confirmation officiel qui suivra). Je vous enverrai le livret de préparation pédagogique d'ici deux semaines — il contient le syllabus complet et les lectures conseillées par module. La journée de pré-rentrée est fixée au 1er septembre, en présentiel. Le premier cours a lieu le 8.</p>

<p>Si vous avez des questions — sur le programme, sur la vie à Paris, sur les stages, sur quoi que ce soit — répondez directement à cet email. Je lis tout, même si je ne réponds pas toujours vite.</p>

<p>Bienvenue dans la promotion 2025-2026. On a hâte de vous voir.</p>

<p>
Claire Beaumont<br/>
Responsable des Admissions<br/>
Master Management de l'Innovation
</p>
`;

      try {
        await emailjs.send(
          SERVICE_ID,
          TEMPLATE_ID,
          {
            to_name: candidate.name,
            to_email: candidate.email,
            subject: "Votre admission au Master Management de l'Innovation — 2025-2026",
            message: htmlMessage,
            reply_to: "admissions@isi-paris.fr"
          },
          PUBLIC_KEY
        );
        showToast(`Email d'admission envoyé à ${candidate.email}`, "success");
      } catch (e) {
        console.error("Erreur lors de l'envoi de l'email wow", e);
        showToast("Erreur lors de l'envoi de l'email", "error");
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
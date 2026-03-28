import { Button } from "../components/ui/button"
import { Textarea } from "../components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { ChevronRight, Check, X, Send, Loader2 } from "lucide-react"
import { useState, useEffect, useMemo, useRef } from "react"
import type { Candidate } from "../types"
import emailjs from '@emailjs/browser'

interface Props {
  candidates: Candidate[];
  setCandidates: (val: Candidate[]) => void;
  onPrev: () => void;
  onNext: () => void;
}

export default function Step5Response({ candidates, setCandidates, onPrev, onNext }: Props) {
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [isGenerating, setIsGenerating] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [selectedForSendIds, setSelectedForSendIds] = useState<Set<string>>(() => new Set());
  const selectionInitRef = useRef(false);

  // On se concentre uniquement sur les profils refusés pour les retours pédagogiques
  const rejectedCandidates = candidates.filter(c => c.status === "rejected");
  const unsentCandidates = rejectedCandidates.filter(c => c.userValidation !== "sent");
  const sentCount = rejectedCandidates.filter(c => c.userValidation === "sent").length;

  const unsentIdsKey = useMemo(
    () => unsentCandidates.map(c => c.id).sort().join(","),
    [unsentCandidates]
  );

  useEffect(() => {
    if (isGenerating) return;
    const ids = candidates
      .filter((c) => c.status === "rejected" && c.userValidation !== "sent")
      .map((c) => c.id);
    if (!selectionInitRef.current && ids.length > 0) {
      selectionInitRef.current = true;
      setSelectedForSendIds(new Set(ids));
      return;
    }
    setSelectedForSendIds((prev) => {
      const idSet = new Set(ids);
      return new Set([...prev].filter((id) => idSet.has(id)));
    });
  }, [isGenerating, unsentIdsKey, candidates]);

  const selectedToSend = useMemo(
    () => unsentCandidates.filter((c) => selectedForSendIds.has(c.id)),
    [unsentCandidates, selectedForSendIds]
  );

  const toggleSelectForSend = (id: string) => {
    setSelectedForSendIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectAllUnsent = () => {
    setSelectedForSendIds(new Set(unsentCandidates.map((c) => c.id)));
  };

  const deselectAllUnsent = () => {
    setSelectedForSendIds(new Set());
  };

  const totalPages = Math.ceil(rejectedCandidates.length / itemsPerPage);
  const paginatedCandidates = rejectedCandidates.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const selectedCandidate = candidates.find(c => c.id === selectedCandidateId);

  // Générer les brouillons automatiquement si pas encore fait
  useEffect(() => {
    const needsGeneration = rejectedCandidates.some(c => !c.aiEmailDraft);
    if (!needsGeneration) {
      setIsGenerating(false);
      return;
    }

    const timer = setTimeout(() => {
      const processed = candidates.map(c => {
        if (c.status === "rejected" && !c.aiEmailDraft) {
          const firstName = c.name.split(' ')[0] || c.name;
          return {
            ...c,
            aiExplanation: [
              "Le profil présente des lacunes vis-à-vis des prérequis académiques exigés.",
              "Le score de pertinence est insuffisant face au niveau de la concurrence cette année."
            ],
            aiEmailDraft: `<p>Bonjour ${firstName},</p>

<p>Merci d'avoir candidaté au Master Management de l'Innovation. Nous avons étudié votre dossier avec attention et je vous contacte pour vous informer que nous ne pouvons pas vous proposer une place dans la promotion 2025-2026.</p>

<p>Je sais que ce type de message est difficile à recevoir, et je préfère vous en dire un peu plus plutôt que de vous laisser avec une réponse sèche.</p>

<p>Cette année, nous avons reçu 847 candidatures pour 42 places. La sélection a été particulièrement serrée, et certains dossiers n'ont pas été retenus non pas parce qu'ils étaient insuffisants, mais parce que d'autres profils répondaient plus directement aux critères de cette promotion spécifique. Ce n'est pas un jugement sur votre valeur ou votre potentiel.</p>

<p>Les éléments qui ont joué en votre faveur ont bien été identifiés — votre lettre témoignait d'un intérêt sincère pour le programme et votre parcours comporte des aspects solides. Ce qui a manqué, c'est principalement l'expérience terrain en lien direct avec les enjeux du management de l'innovation — qu'il s'agisse de stages, de projets associatifs à responsabilité réelle ou d'une exposition aux dynamiques d'entreprise en transformation.</p>

<p>Si vous envisagez de recandidater l'année prochaine, voici les deux points sur lesquels concentrer votre énergie d'ici là : construire une expérience professionnelle ou associative où vous avez eu une responsabilité mesurable — budget, équipe, livrable — et être en mesure d'expliquer, avec précision, en quoi cette expérience vous a changé dans votre façon de raisonner. C'est ce que le jury cherche au-delà du CV.</p>

<p>La candidature reste ouverte l'année prochaine. Plusieurs membres de notre promotion actuelle n'ont pas été admis du premier coup.</p>

<p>Je vous souhaite sincèrement bonne continuation dans votre parcours.</p>

<p>Claire Beaumont<br/>
Responsable des Admissions<br/>
Master Management de l'Innovation</p>`
          };
        }
        return c;
      });
      setCandidates(processed);
      setIsGenerating(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, [candidates, rejectedCandidates, setCandidates]);

  const handleSendEmails = async () => {
    if (selectedToSend.length === 0) {
      alert("Sélectionnez au moins un candidat à qui envoyer le bilan.");
      return;
    }

    setIsSending(true);

    const SERVICE_ID = "service_ry8qdnr";
    const TEMPLATE_ID = "template_ud9775f";
    const PUBLIC_KEY = "Rr9hfefYgp0HXZ2yw";

    const idsToMark = new Set(selectedToSend.map((c) => c.id));

    try {
      for (const candidate of selectedToSend) {
        if (!candidate.aiEmailDraft) continue;

        if (candidate.email === "gadwstudio@gmail.com") {
          const htmlMessage = candidate.aiEmailDraft.replace(/\n/g, '<br/>');
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
        }
      }

      alert(`✅ Succès ! ${selectedToSend.length} retour(s) pédagogique(s) diffusé(s).`);

      setCandidates(
        candidates.map((c) =>
          idsToMark.has(c.id) ? { ...c, userValidation: "sent" as const } : c
        )
      );

      setSelectedForSendIds((prev) => {
        const next = new Set(prev);
        idsToMark.forEach((id) => next.delete(id));
        return next;
      });
    } catch (error) {
      console.error("Erreur lors de l'envoi des emails:", error);
      alert("❌ Une erreur est survenue lors de l'envoi. Vérifiez la console ou vos clés EmailJS.");
    } finally {
      setIsSending(false);
    }
  };

  const updateCandidateEmail = (id: string, newDraft: string) => {
    setCandidates(candidates.map(c => 
      c.id === id ? { ...c, aiEmailDraft: newDraft } : c
    ));
  };

  if (isGenerating) {
    return (
      <Card className="max-w-3xl mx-auto shadow-sm text-center py-16">
        <CardContent className="flex flex-col items-center justify-center space-y-6">
          <Loader2 className="h-12 w-12 animate-spin text-brand-purple" />
          <h3 className="text-xl font-serif text-slate-800">Génération des bilans pédagogiques...</h3>
          <p className="text-slate-500 max-w-md">
            L'IA rédige actuellement un retour constructif et personnalisé pour chaque candidat non retenu.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex flex-col space-y-6 relative max-w-5xl mx-auto">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold font-serif text-slate-900 mb-2">Retours Pédagogiques</h2>
          <p className="text-slate-500 text-lg">Vérifiez les bilans personnalisés avant de les diffuser aux candidats non retenus.</p>
        </div>
        <div className="text-[15px] font-medium bg-white px-5 py-2.5 rounded-xl border border-slate-200 shadow-sm">
          Retours diffusés : <span className="text-green-600 font-bold">{sentCount}</span> / {rejectedCandidates.length}
        </div>
      </div>

      <Card className="shadow-sm flex flex-col">
        <CardHeader className="pb-3 border-b border-slate-100 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-lg">Candidats Non Retenus</CardTitle>
          {unsentCandidates.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <span className="text-slate-500 mr-1">Sélection pour l&apos;envoi :</span>
              <Button type="button" variant="outline" size="sm" className="h-8 text-xs" onClick={selectAllUnsent}>
                Tout sélectionner
              </Button>
              <Button type="button" variant="outline" size="sm" className="h-8 text-xs" onClick={deselectAllUnsent}>
                Tout désélectionner
              </Button>
              <span className="text-slate-600 font-medium tabular-nums">
                {selectedToSend.length} / {unsentCandidates.length}
              </span>
            </div>
          )}
        </CardHeader>
        <CardContent className="p-0 flex-1">
          <ul className="divide-y divide-slate-100">
            {paginatedCandidates.map(c => (
              <li 
                key={c.id} 
                className={`p-4 cursor-pointer transition-colors hover:bg-slate-50 border-l-4 border-transparent flex items-center gap-3`}
                onClick={() => setSelectedCandidateId(c.id)}
              >
                {c.userValidation !== "sent" ? (
                  <input
                    type="checkbox"
                    checked={selectedForSendIds.has(c.id)}
                    onClick={(e) => e.stopPropagation()}
                    onChange={() => toggleSelectForSend(c.id)}
                    className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900 shrink-0 accent-slate-900"
                    aria-label={`Inclure ${c.name} dans l'envoi du bilan`}
                  />
                ) : (
                  <span className="w-4 shrink-0" aria-hidden />
                )}
                <div className="flex flex-1 justify-between items-center min-w-0">
                  <div className="font-semibold text-slate-900 truncate pr-2">{c.name}</div>
                  <div className="flex space-x-4 items-center shrink-0">
                    <div className="w-28 text-right">
                      {c.userValidation === 'sent' && <span className="text-xs text-green-600 font-medium inline-flex items-center"><Check className="w-3 h-3 mr-1"/> Diffusé</span>}
                      {c.userValidation !== 'sent' && <span className="text-xs text-slate-400 font-medium inline-flex items-center">Bilan prêt</span>}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          
          {totalPages > 1 && (
            <div className="p-4 border-t border-slate-100 flex items-center justify-center space-x-2 bg-slate-50">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 rounded-full text-sm font-medium transition-colors flex items-center justify-center ${
                    currentPage === page 
                      ? "bg-slate-900 text-white" 
                      : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-between mt-6">
        <Button variant="outline" onClick={onPrev} className="bg-white">
          Retour à la sélection
        </Button>
        <Button 
          onClick={() => {
            if (unsentCandidates.length === 0) {
              onNext();
            } else {
              handleSendEmails();
            }
          }} 
          className="bg-slate-900 hover:bg-slate-800 text-white min-w-[250px]"
          disabled={isSending || (unsentCandidates.length > 0 && selectedToSend.length === 0)}
        >
          {isSending ? (
            <span className="flex items-center">Diffusion en cours... <Loader2 className="w-4 h-4 ml-2 animate-spin" /></span>
          ) : unsentCandidates.length === 0 ? (
            <span className="flex items-center">
              Voir le Bilan de la Campagne <Send className="w-4 h-4 ml-2" />
            </span>
          ) : (
            <span className="flex items-center">
              Diffuser les bilans ({selectedToSend.length} sélectionné{selectedToSend.length !== 1 ? "s" : ""}) <Send className="w-4 h-4 ml-2" />
            </span>
          )}
        </Button>
      </div>

      {/* Pop-up Modale */}
      {selectedCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl bg-white overflow-hidden animate-in fade-in zoom-in duration-200">
            <CardHeader className="pb-4 border-b border-slate-100 bg-white relative z-10">
              <button 
                onClick={() => setSelectedCandidateId(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 p-1.5 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="flex justify-between items-start pr-8">
                <div>
                  <CardTitle className="text-xl">{selectedCandidate.name}</CardTitle>
                  <CardDescription className="mt-1">{selectedCandidate.email}</CardDescription>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="p-6 overflow-y-auto flex-1 space-y-6 bg-white relative z-0">
              {/* Explication IA */}
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                <h4 className="font-semibold text-slate-800 mb-3 flex items-center">
                  <span className="bg-slate-200 text-slate-700 w-6 h-6 rounded-full flex items-center justify-center text-xs mr-2">IA</span>
                  Éléments d'analyse
                </h4>
                <ul className="space-y-2">
                  {selectedCandidate.aiExplanation?.map((point, idx) => (
                    <li key={idx} className="flex items-start text-sm text-slate-700">
                      <ChevronRight className="w-4 h-4 text-brand-purple mr-1 shrink-0 mt-0.5" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Editeur d'email */}
              <div className="space-y-2">
                <h4 className="font-semibold text-slate-800 text-sm flex items-center justify-between">
                  Bilan à envoyer au candidat
                  <span className="text-xs font-normal text-slate-500">Éditable</span>
                </h4>
                <Textarea 
                  className="min-h-[220px] text-sm leading-relaxed font-sans text-slate-800 bg-white"
                  value={selectedCandidate.aiEmailDraft}
                  onChange={(e) => updateCandidateEmail(selectedCandidate.id, e.target.value)}
                />
              </div>
            </CardContent>

            {/* Actions Pop-up */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 rounded-b-lg flex justify-between items-center relative z-10">
              <span className="text-sm font-medium text-slate-500">
                Statut : {selectedCandidate.userValidation === 'sent' ? '📨 Déjà publié' : '⏳ En attente de diffusion'}
              </span>
              <div className="space-x-3">
                <Button 
                  variant="outline"
                  onClick={() => setSelectedCandidateId(null)}
                >
                  Fermer
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
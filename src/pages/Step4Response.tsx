import { Button } from "../components/ui/button"
import { Textarea } from "../components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { CheckCircle2, XCircle, Clock, ChevronRight, Check } from "lucide-react"
import { useState } from "react"
import type { Candidate } from "../types"

interface Props {
  candidates: Candidate[];
  setCandidates: (val: Candidate[]) => void;
  onPrev: () => void;
  onReset: () => void;
}

export default function Step4Response({ 
  candidates, 
  setCandidates, 
  onPrev,
  onReset
}: Props) {
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(candidates[0]?.id || null);

  const selectedCandidate = candidates.find(c => c.id === selectedCandidateId);
  const pendingCount = candidates.filter(c => c.userValidation === "pending" || !c.userValidation).length;

  const updateCandidateValidation = (id: string, status: "approved" | "rejected" | "modified") => {
    setCandidates(candidates.map(c => 
      c.id === id ? { ...c, userValidation: status } : c
    ));
  };

  const updateCandidateEmail = (id: string, newDraft: string) => {
    setCandidates(candidates.map(c => 
      c.id === id ? { ...c, aiEmailDraft: newDraft } : c
    ));
  };

  const getDecisionBadge = (decision?: string) => {
    switch(decision) {
      case 'accept': return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"><CheckCircle2 className="w-3 h-3 mr-1"/> Admis</span>;
      case 'reject': return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800"><XCircle className="w-3 h-3 mr-1"/> Refusé</span>;
      case 'waitlist': return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1"/> Attente</span>;
      default: return null;
    }
  };

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Tableau de Bord des Décisions</h2>
          <p className="text-slate-500">Examinez les propositions de l'IA et validez les réponses.</p>
        </div>
        <div className="text-sm font-medium bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm">
          Reste à valider : <span className="text-brand text-blue-600 font-bold">{pendingCount}</span> / {candidates.length}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Colonne de Gauche : Liste des candidats */}
        <Card className="flex-1 lg:w-1/3 shadow-sm h-[600px] flex flex-col">
          <CardHeader className="pb-3 border-b border-slate-100">
            <CardTitle className="text-lg">Candidats</CardTitle>
          </CardHeader>
          <CardContent className="p-0 overflow-y-auto flex-1">
            <ul className="divide-y divide-slate-100">
              {candidates.map(c => (
                <li 
                  key={c.id} 
                  className={`p-4 cursor-pointer transition-colors hover:bg-slate-50 ${selectedCandidateId === c.id ? 'bg-blue-50 border-l-4 border-blue-600' : 'border-l-4 border-transparent'}`}
                  onClick={() => setSelectedCandidateId(c.id)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="font-semibold text-slate-900">{c.name}</div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                        {c.aiScore}/100
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    {getDecisionBadge(c.aiDecision)}
                    
                    {c.userValidation === 'approved' && <span className="text-xs text-green-600 font-medium flex items-center"><Check className="w-3 h-3 mr-1"/> Validé</span>}
                    {c.userValidation === 'rejected' && <span className="text-xs text-red-600 font-medium flex items-center"><XCircle className="w-3 h-3 mr-1"/> Annulé</span>}
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Colonne de Droite : Détails et Action */}
        <Card className="flex-[2] shadow-sm h-[600px] flex flex-col">
          {selectedCandidate ? (
            <>
              <CardHeader className="pb-4 border-b border-slate-100">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{selectedCandidate.name}</CardTitle>
                    <CardDescription className="mt-1">{selectedCandidate.email}</CardDescription>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="text-3xl font-black text-slate-800">{selectedCandidate.aiScore}<span className="text-lg text-slate-400 font-normal">/100</span></div>
                    {getDecisionBadge(selectedCandidate.aiDecision)}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="p-6 overflow-y-auto flex-1 space-y-6">
                
                {/* Explication IA (Bullet points) */}
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                  <h4 className="font-semibold text-slate-800 mb-3 flex items-center">
                    <span className="bg-slate-200 text-slate-700 w-6 h-6 rounded-full flex items-center justify-center text-xs mr-2">IA</span>
                    Analyse & Justification
                  </h4>
                  <ul className="space-y-2">
                    {selectedCandidate.aiExplanation?.map((point, idx) => (
                      <li key={idx} className="flex items-start text-sm text-slate-700">
                        <ChevronRight className="w-4 h-4 text-blue-500 mr-1 shrink-0 mt-0.5" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Profil Brut (Toggle ou affichage simple) */}
                <div>
                  <h4 className="font-semibold text-slate-800 mb-2 text-sm">Extrait du dossier</h4>
                  <p className="text-sm text-slate-600 italic bg-white border border-slate-200 p-3 rounded-md shadow-inner">
                    "{selectedCandidate.profileData}"
                  </p>
                </div>

                {/* Editeur d'email */}
                <div className="space-y-2">
                  <h4 className="font-semibold text-slate-800 text-sm">Brouillon d'email à envoyer</h4>
                  <Textarea 
                    className="min-h-[180px] text-sm leading-relaxed"
                    value={selectedCandidate.aiEmailDraft}
                    onChange={(e) => updateCandidateEmail(selectedCandidate.id, e.target.value)}
                  />
                </div>
              </CardContent>

              {/* Actions */}
              <div className="p-4 border-t border-slate-100 bg-slate-50 rounded-b-lg flex justify-between items-center">
                <span className="text-sm text-slate-500">
                  Statut : {selectedCandidate.userValidation === 'approved' ? '✅ Prêt à l\'envoi' : selectedCandidate.userValidation === 'rejected' ? '❌ Rejeté' : '⏳ En attente de validation'}
                </span>
                <div className="space-x-3">
                  <Button 
                    variant="outline" 
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                    onClick={() => updateCandidateValidation(selectedCandidate.id, 'rejected')}
                  >
                    Refuser la décision
                  </Button>
                  <Button 
                    className="bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => updateCandidateValidation(selectedCandidate.id, 'approved')}
                  >
                    Valider l'email
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-slate-400">
              Sélectionnez un candidat pour voir les détails
            </div>
          )}
        </Card>
      </div>

      <div className="flex justify-between mt-6">
        <Button variant="outline" onClick={onPrev} className="bg-white">
          Retour aux critères
        </Button>
        <Button 
          onClick={onReset} 
          className="bg-blue-600 hover:bg-blue-700 text-white"
          disabled={pendingCount > 0}
        >
          Terminer et Envoyer les Mails ({candidates.filter(c => c.userValidation === 'approved').length})
        </Button>
      </div>
    </div>
  );
}

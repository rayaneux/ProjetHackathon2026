import { Button } from "../components/ui/button"
import { Textarea } from "../components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { CheckCircle2, XCircle, Clock, ChevronRight, Check, X, Send } from "lucide-react"
import { useState } from "react"
import type { Candidate } from "../types"
import emailjs from '@emailjs/browser'

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
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);

  const selectedCandidate = candidates.find(c => c.id === selectedCandidateId);
  const pendingCount = candidates.filter(c => c.userValidation === "pending" || !c.userValidation).length;
  const approvedCandidates = candidates.filter(c => c.userValidation === "approved");

  const handleSendEmails = async () => {
    setIsSending(true);
    
    // Remplacer ces valeurs par celles de ton compte EmailJS !
    const SERVICE_ID = "service_ry8qdnr";
    const TEMPLATE_ID = "template_ud9775f";
    const PUBLIC_KEY = "Rr9hfefYgp0HXZ2yw";

    try {
      // On envoie un email pour chaque candidat approuvé
      for (const candidate of approvedCandidates) {
        if (!candidate.aiEmailDraft) continue;

        // On convertit les sauts de ligne texte (\n) en balises HTML (<br/>) pour l'email
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
      
      alert(`✅ Succès ! ${approvedCandidates.length} email(s) envoyé(s) avec succès.`);
      onReset();
    } catch (error) {
      console.error("Erreur lors de l'envoi des emails:", error);
      alert("❌ Une erreur est survenue lors de l'envoi des emails. Vérifiez la console ou vos clés EmailJS.");
    } finally {
      setIsSending(false);
    }
  };

  const updateCandidateValidation = (id: string, status: "approved" | "rejected" | "modified") => {
    setCandidates(candidates.map(c => 
      c.id === id ? { ...c, userValidation: status } : c
    ));
    setSelectedCandidateId(null); // Fermer la modale après validation
  };

  const updateCandidateEmail = (id: string, newDraft: string) => {
    setCandidates(candidates.map(c => 
      c.id === id ? { ...c, aiEmailDraft: newDraft } : c
    ));
  };

  const getDecisionBadge = (decision?: string) => {
    switch(decision) {
      case 'accept': return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"><CheckCircle2 className="w-3 h-3 mr-1"/> Admis (par l'école)</span>;
      case 'reject': return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800"><XCircle className="w-3 h-3 mr-1"/> Refusé (par l'école)</span>;
      case 'waitlist': return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1"/> Attente (par l'école)</span>;
      default: return null;
    }
  };

  return (
    <div className="flex flex-col space-y-6 relative">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold font-serif text-slate-900 mb-2">Tableau de Bord des Décisions</h2>
          <p className="text-slate-500 text-lg">Cliquez sur un candidat pour examiner la proposition de l'IA et valider.</p>
        </div>
        <div className="text-[15px] font-medium bg-white px-5 py-2.5 rounded-xl border border-slate-200 shadow-sm">
          Reste à valider : <span className="text-brand text-blue-600 font-bold">{pendingCount}</span> / {candidates.length}
        </div>
      </div>

      <Card className="shadow-sm h-[600px] flex flex-col">
        <CardHeader className="pb-3 border-b border-slate-100">
          <CardTitle className="text-lg">Liste des Candidats</CardTitle>
        </CardHeader>
        <CardContent className="p-0 overflow-y-auto flex-1">
          <ul className="divide-y divide-slate-100">
            {candidates.map(c => (
              <li 
                key={c.id} 
                className={`p-4 cursor-pointer transition-colors hover:bg-slate-50 border-l-4 border-transparent`}
                onClick={() => setSelectedCandidateId(c.id)}
              >
                <div className="flex justify-between items-center">
                  <div className="font-semibold text-slate-900">{c.name}</div>
                  <div className="flex space-x-4 items-center">
                    {getDecisionBadge(c.aiDecision)}
                    <div className="w-24 text-right">
                      {c.userValidation === 'approved' && <span className="text-xs text-green-600 font-medium inline-flex items-center"><Check className="w-3 h-3 mr-1"/> Validé</span>}
                      {c.userValidation === 'rejected' && <span className="text-xs text-red-600 font-medium inline-flex items-center"><XCircle className="w-3 h-3 mr-1"/> Annulé</span>}
                      {(!c.userValidation || c.userValidation === 'pending') && <span className="text-xs text-slate-400 font-medium inline-flex items-center">À traiter</span>}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <div className="flex justify-between mt-6">
        <Button variant="outline" onClick={onPrev} className="bg-white">
          Retour aux critères
        </Button>
        <Button 
          onClick={handleSendEmails} 
          className="bg-blue-600 hover:bg-blue-700 text-white min-w-[200px]"
          disabled={pendingCount > 0 || isSending || approvedCandidates.length === 0}
        >
          {isSending ? (
            <span className="flex items-center">Envoi en cours...</span>
          ) : (
            <span className="flex items-center">
              Terminer et Envoyer les Mails ({approvedCandidates.length}) <Send className="w-4 h-4 ml-2" />
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
                <div className="flex flex-col items-end">
                  {getDecisionBadge(selectedCandidate.aiDecision)}
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="p-6 overflow-y-auto flex-1 space-y-6 bg-white relative z-0">
              {/* Explication IA */}
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

              {/* Profil Brut */}
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
                    className="min-h-[180px] text-sm leading-relaxed font-sans text-slate-800"
                    value={selectedCandidate.aiEmailDraft}
                    onChange={(e) => updateCandidateEmail(selectedCandidate.id, e.target.value)}
                  />
                </div>
            </CardContent>

            {/* Actions Pop-up */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 rounded-b-lg flex justify-between items-center relative z-10">
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
          </Card>
        </div>
      )}
    </div>
  );
}

import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { CheckCircle2, Send, Home, Users } from "lucide-react"
import type { Candidate } from "../types"

interface Props {
  candidates: Candidate[];
  schoolCriteria: string;
  onReset: () => void;
}

export default function Step6Bilan({ candidates, schoolCriteria, onReset }: Props) {
  const extractField = (text: string, startKey: string, nextKeys: string[]) => {
    if (!text) return "";
    const startIndex = text.indexOf(startKey);
    if (startIndex === -1) return "";
    const contentStart = startIndex + startKey.length;
    let endIndex = text.length;
    for (const key of nextKeys) {
      const keyIndex = text.indexOf(key, contentStart);
      if (keyIndex !== -1 && keyIndex < endIndex) {
        endIndex = keyIndex;
      }
    }
    return text.substring(contentStart, endIndex).trim();
  };

  const formationName = extractField(schoolCriteria, "Formation visée :", ["\nDate de début :", "\nDate de clôture :", "\nPlaces :", "\nPrérequis académiques/techniques :"]);
  const capacityStr = extractField(schoolCriteria, "Places :", ["\nPrérequis académiques/techniques :"]);
  const capacity = parseInt(capacityStr, 10) || "∞";

  const totalCandidates = candidates.length;
  const acceptedCandidates = candidates.filter(c => c.status === "accepted");
  const rejectedCandidates = candidates.filter(c => c.status === "rejected");
  const sentFeedbacks = candidates.filter(c => c.userValidation === "sent").length;

  return (
    <div className="flex flex-col space-y-6 relative max-w-4xl mx-auto animate-in fade-in zoom-in duration-500">
      <Card className="shadow-lg border-brand-purple/20 overflow-hidden">
        <div className="bg-slate-900 h-2 w-full"></div>
        <CardHeader className="pb-8 pt-8">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-2 shadow-sm border border-green-100">
              <CheckCircle2 className="w-10 h-10 text-green-500" />
            </div>
            <CardTitle className="text-4xl font-serif text-slate-900">Campagne Terminée</CardTitle>
            <CardDescription className="text-xl max-w-2xl">
              Le recrutement pour <span className="font-semibold text-slate-800">{formationName || "votre formation"}</span> est désormais clôturé.
            </CardDescription>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-8 px-12 pb-12">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex flex-col items-center text-center">
              <Users className="w-8 h-8 text-slate-400 mb-3" />
              <p className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-1">Candidatures reçues</p>
              <p className="text-4xl font-bold text-slate-900">{totalCandidates}</p>
            </div>
            
            <div className="bg-green-50 p-6 rounded-2xl border border-green-100 flex flex-col items-center text-center">
              <CheckCircle2 className="w-8 h-8 text-green-500 mb-3" />
              <p className="text-sm font-semibold uppercase tracking-wider text-green-700 mb-1">Candidats Admis</p>
              <p className="text-4xl font-bold text-green-600">{acceptedCandidates.length} <span className="text-lg text-green-500/70">/ {capacity}</span></p>
            </div>

            <div className="bg-brand-purple/5 p-6 rounded-2xl border border-brand-purple/20 flex flex-col items-center text-center">
              <Send className="w-8 h-8 text-brand-purple mb-3" />
              <p className="text-sm font-semibold uppercase tracking-wider text-brand-dark mb-1">Retours Pédagogiques</p>
              <p className="text-4xl font-bold text-brand-purple">{sentFeedbacks} <span className="text-lg text-brand-purple/60">/ {rejectedCandidates.length}</span></p>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
            <h3 className="text-xl font-semibold text-slate-900 mb-6 font-serif">Aperçu de la promotion sélectionnée</h3>
            <div className="space-y-3">
              {acceptedCandidates.length === 0 ? (
                <p className="text-slate-500 italic text-center py-4">Aucun candidat n'a été admis pour cette session.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {acceptedCandidates.map(c => (
                    <div key={c.id} className="flex items-center space-x-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
                      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-slate-600 font-bold border border-slate-200 shadow-sm">
                        {c.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 text-sm">{c.name}</p>
                        <p className="text-xs text-slate-500">Score IA : <span className="font-medium text-slate-700">{c.score}/100</span></p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-center pt-8 border-t border-slate-100">
            <Button 
              size="lg"
              className="bg-slate-900 text-white hover:bg-slate-800 rounded-full px-8 py-6 text-lg shadow-xl hover:shadow-2xl transition-all flex items-center" 
              onClick={onReset}
            >
              <Home className="w-5 h-5 mr-3" /> Retourner au tableau de bord
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
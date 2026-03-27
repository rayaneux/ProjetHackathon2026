import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Loader2 } from "lucide-react"
import type { Candidate } from "../types"

interface Props {
  schoolCriteria: string;
  candidates: Candidate[];
  setCandidates: (val: Candidate[]) => void;
  onNext: () => void;
}

export default function Step3Generate({ 
  schoolCriteria,
  candidates,
  setCandidates,
  onNext
}: Props) {
  const [progress, setProgress] = useState("Initialisation de l'analyse...");

  useEffect(() => {
    // Si aucun candidat, on skip (sécurité)
    if (candidates.length === 0) {
      onNext();
      return;
    }

    const timer1 = setTimeout(() => {
      setProgress(`Traitement de ${candidates.length} dossiers en cours...`);
    }, 1500);

    const timer2 = setTimeout(() => {
      setProgress("Confrontation aux critères de l'école et calcul des notes...");
    }, 3000);

    const timer3 = setTimeout(() => {
      // Mock des résultats de l'IA pour chaque candidat
      const processed: Candidate[] = candidates.map((c, index) => {
        const decision = c.decision;
        const firstName = c.name.split(' ')[0] || c.name;
        
        if (decision === "accept") {
          return {
            ...c,
            aiExplanation: [
              "Le profil correspond parfaitement aux standards académiques et aux valeurs de l'établissement.",
              "Les notes et/ou l'expérience démontrent un réel potentiel de réussite dans notre programme.",
              "Motivation et maturité en adéquation avec nos exigences."
            ],
            aiEmailDraft: `Bonjour ${firstName},\n\nNous avons le grand plaisir de vous annoncer votre admission au sein de notre établissement pour la prochaine rentrée.\n\nVotre dossier a particulièrement retenu l'attention de notre jury. Les éléments que vous avez mis en avant ("${c.profileData.substring(0, 50)}...") démontrent un profil tout à fait en phase avec l'exigence et les valeurs de notre école. Nous sommes convaincus que vous pourrez pleinement vous épanouir dans ce cursus.\n\nVous recevrez prochainement un email contenant les modalités d'inscription définitive.\n\nFélicitations pour cette admission, et au plaisir de vous compter parmi nous !\n\nCordialement,\n\nL'équipe des Admissions.`
          };
        } else if (decision === "reject") {
          return {
            ...c,
            aiExplanation: [
              "Les résultats académiques ou le profil général ne permettent pas de garantir la réussite dans ce cursus exigeant.",
              "Le dossier est jugé soit trop fragile sur les prérequis, soit en inadéquation avec les attentes du programme.",
            ],
            aiEmailDraft: `Bonjour ${firstName},\n\nSuite à l'étude attentive de votre dossier de candidature par notre jury d'admission, nous sommes au regret de vous informer que nous ne pouvons pas donner une suite favorable à votre demande.\n\nMalgré l'intérêt que nous portons à votre profil (notamment concernant : "${c.profileData.substring(0, 40)}..."), le niveau de notre formation et le nombre limité de places nous obligent à une sélection extrêmement rigoureuse cette année. Au vu de la concurrence, d'autres candidatures correspondaient plus précisément à nos prérequis immédiats.\n\nNous vous remercions de l'intérêt porté à notre établissement et vous souhaitons une excellente continuation dans vos futurs projets académiques et professionnels.\n\nCordialement,\n\nL'équipe des Admissions.`
          };
        } else {
          // waitlist ou unknown
          return {
            ...c,
            aiExplanation: [
              "Le dossier est intéressant mais se situe à la limite de la barre d'admission directe.",
              "Candidature placée sur liste d'attente dans l'éventualité de désistements.",
              "Certaines lacunes mineures justifient cette mise en attente par rapport aux dossiers prioritaires."
            ],
            aiEmailDraft: `Bonjour ${firstName},\n\nNous vous remercions pour l'intérêt que vous portez à notre établissement.\n\nAprès examen approfondi de votre dossier, le jury d'admission a statué en faveur d'une mise sur liste d'attente. Vos qualités sont indéniables, cependant le nombre restreint de places ("${c.profileData.substring(0, 30)}...") ne nous permet pas de vous formuler une offre d'admission ferme aujourd'hui.\n\nSoyez assuré(e) que nous vous tiendrons informé(e) très rapidement dès qu'un désistement nous permettra de faire évoluer votre situation.\n\nMerci de votre patience.\n\nCordialement,\n\nL'équipe des Admissions.`
          };
        }
      });
      
      setCandidates(processed);
      onNext();
    }, 4500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [candidates, setCandidates, onNext]);

  return (
    <Card className="max-w-3xl mx-auto shadow-sm text-center py-12">
      <CardHeader>
        <CardTitle className="text-2xl">Étape 3 : Génération de l'Analyse IA</CardTitle>
        <CardDescription>
          L'intelligence artificielle étudie la liste des candidats selon vos critères.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center space-y-6 min-h-[200px]">
        <Loader2 className="h-12 w-12 animate-spin text-slate-800" />
        <p className="text-slate-600 font-medium animate-pulse">{progress}</p>
        <div className="w-full max-w-sm bg-slate-100 rounded-full h-2.5 mt-4 overflow-hidden">
          <div className="bg-slate-800 h-2.5 rounded-full transition-all duration-[3000ms] ease-in-out w-full animate-pulse"></div>
        </div>
      </CardContent>
    </Card>
  );
}

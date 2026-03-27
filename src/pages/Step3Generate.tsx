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
        // Au lieu de deviner la décision, on utilise celle importée de l'école (c.decision)
        const decision = c.decision;
        
        if (decision === "accept") {
          return {
            ...c,
            aiExplanation: [
              "Le profil correspond parfaitement aux standards académiques et aux valeurs de l'établissement.",
              "Les notes et/ou l'expérience démontrent un réel potentiel de réussite dans notre programme.",
              "Motivation et maturité en adéquation avec nos exigences."
            ],
            aiEmailDraft: `Bonjour ${c.name},\n\nNous avons le grand plaisir de vous annoncer votre admission au sein de notre établissement.\n\nVotre dossier a particulièrement retenu l'attention de notre jury d'admission. Nous avons été très sensibles à votre profil, qui résonne parfaitement avec les valeurs que nous prônons. De plus, les éléments de votre dossier démontrent votre sérieux et votre rigueur.\n\nNous serions ravis de vous compter parmi nos étudiants à la rentrée prochaine. Vous recevrez prochainement les modalités d'inscription définitive.\n\nFélicitations et à très bientôt,\n\nCordialement,\nLe Service des Admissions.`
          };
        } else if (decision === "reject") {
          return {
            ...c,
            aiExplanation: [
              "Les résultats académiques ou le profil général ne permettent pas de garantir la réussite dans ce cursus exigeant.",
              "Le dossier est jugé soit trop fragile sur les prérequis, soit en inadéquation avec les attentes du programme.",
            ],
            aiEmailDraft: `Bonjour ${c.name},\n\nSuite à l'étude attentive de votre dossier de candidature par notre jury d'admission, nous sommes au regret de vous informer que nous ne pouvons pas donner une suite favorable à votre demande.\n\nMalgré l'intérêt de votre parcours, le niveau d'exigence de notre formation et le nombre limité de places nous obligent à une sélection extrêmement rigoureuse. Nous avons estimé que votre profil ne correspondait pas totalement aux prérequis attendus pour cette année.\n\nNous vous remercions de l'intérêt porté à notre établissement et vous souhaitons une excellente continuation dans vos projets futurs.\n\nCordialement,\nLe Service des Admissions.`
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
            aiEmailDraft: `Bonjour ${c.name},\n\nNous vous remercions pour l'intérêt que vous portez à notre établissement.\n\nAprès examen approfondi de votre dossier, le jury d'admission a décidé de vous placer sur liste d'attente. Votre profil possède des qualités indéniables, mais le nombre très limité de places ne nous permet pas de vous formuler une offre d'admission directe à ce stade.\n\nNous vous tiendrons informé(e) de l'évolution de votre situation dès que des places se libèreront.\n\nCordialement,\nLe Service des Admissions.`
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

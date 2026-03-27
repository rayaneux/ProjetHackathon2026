import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Loader2 } from "lucide-react"
import { Candidate } from "../types"

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
        if (index === 0) {
          // Léa Martin - Acceptee
          return {
            ...c,
            aiDecision: "accept",
            aiScore: 92,
            aiExplanation: [
              "Excellents résultats académiques en filière S.",
              "Le projet associatif démontre un fort engagement et des valeurs communes avec l'école.",
              "La structuration de la lettre prouve une grande maturité."
            ],
            aiEmailDraft: `Bonjour ${c.name},\n\nNous avons le grand plaisir de vous annoncer votre admission au sein de notre établissement.\n\nVotre dossier a particulièrement retenu notre attention. Nous avons été très sensibles à votre projet associatif, qui résonne parfaitement avec les valeurs d'engagement que nous prônons. De plus, vos excellents résultats académiques démontrent votre sérieux et votre rigueur.\n\nNous serions ravis de vous compter parmi nos étudiants à la rentrée prochaine.\n\nCordialement,\nLe Service des Admissions.`
          };
        } else if (index === 1) {
          // Thomas Dubois - Refusé
          return {
            ...c,
            aiDecision: "reject",
            aiScore: 45,
            aiExplanation: [
              "Résultats insuffisants dans les matières clés (mathématiques).",
              "Le profil est intéressant (sportif) mais la base académique est trop fragile pour notre cursus intensif.",
            ],
            aiEmailDraft: `Bonjour ${c.name},\n\nSuite à l'étude attentive de votre dossier de candidature, nous sommes au regret de vous informer que nous ne pouvons pas donner une suite favorable à votre demande d'admission.\n\nBien que votre profil sportif témoigne d'un bel esprit de compétition et de persévérance, le niveau d'exigence de notre formation, particulièrement dans les matières scientifiques, requiert des bases que nous jugeons encore fragiles à ce stade de votre parcours.\n\nNous vous souhaitons une excellente continuation dans vos projets.\n\nCordialement,\nLe Service des Admissions.`
          };
        } else if (index === 2) {
          // Sarah Connor - Acceptee
          return {
            ...c,
            aiDecision: "accept",
            aiScore: 85,
            aiExplanation: [
              "Profil en reconversion très motivé.",
              "L'expérience professionnelle de 5 ans est un atout majeur pour l'employabilité post-formation.",
              "Démarche proactive (auto-formation) très appréciée."
            ],
            aiEmailDraft: `Bonjour ${c.name},\n\nNous avons le plaisir de vous informer que votre candidature a été retenue pour intégrer notre programme.\n\nVotre démarche de reconversion et votre forte motivation nous ont convaincus. Nous valorisons les profils atypiques et riches d'une expérience professionnelle préalable, car ils apportent une réelle maturité aux promotions.\n\nFélicitations pour votre admission.\n\nCordialement,\nLe Service des Admissions.`
          };
        } else {
          // Lucas Bernard - Liste d'attente
          return {
            ...c,
            aiDecision: "waitlist",
            aiScore: 68,
            aiExplanation: [
              "Vraie passion technique démontrée par les projets.",
              "Cependant, de trop grandes lacunes en langues et communication.",
              "Profil mis en attente pour voir s'il reste des places."
            ],
            aiEmailDraft: `Bonjour ${c.name},\n\nNous vous remercions pour l'intérêt que vous portez à notre établissement.\n\nAprès examen de votre dossier, le jury d'admission a décidé de vous placer sur liste d'attente. Vos compétences techniques et votre passion sont indéniables, mais nos critères exigent également un niveau minimal en langues et en communication que vous devez encore consolider.\n\nNous vous tiendrons informé de l'évolution de votre statut d'ici quelques semaines.\n\nCordialement,\nLe Service des Admissions.`
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

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
  schoolCriteria: _schoolCriteria,
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
      // Mock des résultats de l'IA pour chaque candidat (scoring)
      const processed: Candidate[] = candidates.map((c, index) => {
        // Génère un score un peu aléatoire pour la démo, avec une courbe pour simuler de bons et mauvais dossiers
        let score;
        if (c.id === "1") {
          score = 98; // On s'assure que le profil détaillé soit toujours premier
        } else {
          const randomScore = Math.floor(Math.random() * 40) + 40 + (index % 3 === 0 ? 15 : 0); 
          score = Math.min(100, randomScore);
        }

        let aiAnalysis = "";
        if (score >= 80) {
          aiAnalysis = "Profil très solide, correspond parfaitement aux exigences académiques de la formation.";
        } else if (score >= 60) {
          aiAnalysis = "Dossier intéressant mais présente quelques lacunes sur les prérequis techniques.";
        } else {
          aiAnalysis = "Profil fragile, les résultats ou le parcours ne sont pas alignés avec les attentes.";
        }

        const hadScoreAlready = typeof c.score === "number" && !Number.isNaN(c.score);
        const keepStatus =
          hadScoreAlready && (c.status === "accepted" || c.status === "rejected");

        return {
          ...c,
          score,
          aiAnalysis,
          applicationDate: c.applicationDate || new Date().toISOString(),
          status: keepStatus ? c.status : "pending",
        };
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
      <CardHeader className="pb-8">
        <CardTitle className="text-3xl font-serif text-center mb-2">Étape 3 : Génération de l'Analyse IA</CardTitle>
        <CardDescription className="text-center text-lg">
          L'intelligence artificielle analyse les lacunes et rédige des conseils personnalisés.
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

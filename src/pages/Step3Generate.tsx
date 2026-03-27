import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Loader2 } from "lucide-react"

interface Props {
  schoolCriteria: string;
  candidateName: string;
  candidateProfile: string;
  setGeneratedResponse: (val: string) => void;
  onNext: () => void;
}

export default function Step3Generate({ 
  schoolCriteria,
  candidateName,
  candidateProfile,
  setGeneratedResponse,
  onNext
}: Props) {
  const [progress, setProgress] = useState("Analyse du profil...");

  useEffect(() => {
    // Simulation d'un appel LLM avec des timeouts
    const timer1 = setTimeout(() => {
      setProgress("Confrontation avec les critères de l'école...");
    }, 1500);

    const timer2 = setTimeout(() => {
      setProgress("Rédaction de la réponse personnalisée...");
    }, 3000);

    const timer3 = setTimeout(() => {
      // Mock d'une réponse générée
      const mockResponse = `Bonjour ${candidateName},\n\nNous vous remercions pour l'intérêt que vous portez à notre établissement.\n\nAprès étude attentive de votre profil, nous avons été particulièrement sensibles à [Point fort du profil à insérer basé sur: "${candidateProfile.substring(0, 30)}..."]. Cela correspond parfaitement à nos critères d'exigence, notamment concernant : "${schoolCriteria.substring(0, 30)}...".\n\n[Suite de la réponse générée par l'IA...]\n\nCordialement,\nLe Service des Admissions.`;
      
      setGeneratedResponse(mockResponse);
      onNext();
    }, 4500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [candidateName, candidateProfile, schoolCriteria, setGeneratedResponse, onNext]);

  return (
    <Card className="max-w-3xl mx-auto shadow-sm text-center py-12">
      <CardHeader>
        <CardTitle className="text-2xl">Étape 3 : Génération de l'Analyse</CardTitle>
        <CardDescription>
          L'IA est au travail. Veuillez patienter.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center space-y-6 min-h-[200px]">
        <Loader2 className="h-12 w-12 animate-spin text-slate-800" />
        <p className="text-slate-600 font-medium animate-pulse">{progress}</p>
      </CardContent>
    </Card>
  );
}

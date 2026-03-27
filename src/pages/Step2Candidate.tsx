import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Textarea } from "../components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import { Label } from "../components/ui/label"

interface Props {
  candidateName: string;
  setCandidateName: (val: string) => void;
  candidateProfile: string;
  setCandidateProfile: (val: string) => void;
  onNext: () => void;
  onPrev: () => void;
}

export default function Step2Candidate({ 
  candidateName, 
  setCandidateName, 
  candidateProfile, 
  setCandidateProfile, 
  onNext, 
  onPrev 
}: Props) {
  const isFormValid = candidateName.trim().length > 0 && candidateProfile.trim().length > 0;

  return (
    <Card className="max-w-3xl mx-auto shadow-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Étape 2 : Dossier Candidat</CardTitle>
        <CardDescription>
          Saisissez les informations du candidat. Dans la version finale, cela pourrait être l'upload d'un CV ou d'une lettre de motivation.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nom du candidat</Label>
          <Input 
            id="name"
            placeholder="Ex: Jean Dupont"
            value={candidateName}
            onChange={(e) => setCandidateName(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="profile">Profil / Lettre de motivation (Texte brut)</Label>
          <Textarea 
            id="profile"
            placeholder="Copiez-collez ici le parcours, les notes, ou la lettre de motivation du candidat..."
            className="min-h-[150px]"
            value={candidateProfile}
            onChange={(e) => setCandidateProfile(e.target.value)}
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onPrev} className="bg-slate-100 text-slate-800 hover:bg-slate-200 border-none">
          Retour
        </Button>
        <Button onClick={onNext} disabled={!isFormValid}>
          Générer la réponse
        </Button>
      </CardFooter>
    </Card>
  );
}

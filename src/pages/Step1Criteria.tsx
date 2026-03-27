import { Button } from "../components/ui/button"
import { Textarea } from "../components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import { Label } from "../components/ui/label"

interface Props {
  schoolCriteria: string;
  setSchoolCriteria: (val: string) => void;
  onNext: () => void;
}

export default function Step1Criteria({ schoolCriteria, setSchoolCriteria, onNext }: Props) {
  const isFormValid = schoolCriteria.trim().length > 0;

  return (
    <Card className="max-w-3xl mx-auto shadow-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Étape 1 : Critères de l'École</CardTitle>
        <CardDescription>
          Configurez ici les critères de sélection, l'ADN de votre école et le ton souhaité pour vos réponses.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="criteria">Critères & Ton (Prompt Système)</Label>
          <Textarea 
            id="criteria"
            placeholder="Ex: Nous cherchons des candidats créatifs, autonomes et passionnés par l'innovation. Le ton de la réponse doit être encourageant mais professionnel..."
            className="min-h-[150px]"
            value={schoolCriteria}
            onChange={(e) => setSchoolCriteria(e.target.value)}
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button onClick={onNext} disabled={!isFormValid}>
          Enregistrer & Continuer
        </Button>
      </CardFooter>
    </Card>
  );
}

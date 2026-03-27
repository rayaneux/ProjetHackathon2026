import { Button } from "../components/ui/button"
import { Textarea } from "../components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import { Label } from "../components/ui/label"
import { CheckCircle2 } from "lucide-react"
import { useState } from "react"

interface Props {
  generatedResponse: string;
  setGeneratedResponse: (val: string) => void;
  onPrev: () => void;
  onReset: () => void;
}

export default function Step4Response({ 
  generatedResponse, 
  setGeneratedResponse, 
  onPrev,
  onReset
}: Props) {
  const [isSent, setIsSent] = useState(false);

  if (isSent) {
    return (
      <Card className="max-w-3xl mx-auto shadow-sm text-center py-12">
        <CardContent className="flex flex-col items-center justify-center space-y-6">
          <CheckCircle2 className="h-16 w-16 text-green-500" />
          <h2 className="text-2xl font-bold text-slate-900">Réponse validée !</h2>
          <p className="text-slate-500">Le message a été enregistré (et fictivement envoyé au candidat).</p>
          <Button onClick={onReset} className="mt-4">
            Traiter un autre candidat
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-3xl mx-auto shadow-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Étape 4 : Visualisation & Réponse</CardTitle>
        <CardDescription>
          Vérifiez, modifiez si besoin, puis validez la réponse générée par l'IA.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="response">Proposition de réponse</Label>
          <Textarea 
            id="response"
            className="min-h-[300px] leading-relaxed"
            value={generatedResponse}
            onChange={(e) => setGeneratedResponse(e.target.value)}
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onPrev} className="bg-slate-100 text-slate-800 hover:bg-slate-200 border-none">
          Refaire la génération
        </Button>
        <Button onClick={() => setIsSent(true)} className="bg-green-600 hover:bg-green-700 text-white">
          Valider & Envoyer
        </Button>
      </CardFooter>
    </Card>
  );
}

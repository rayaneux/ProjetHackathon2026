import { Button } from "../components/ui/button"
import { Textarea } from "../components/ui/textarea"
import { Input } from "../components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import { Label } from "../components/ui/label"
import { useState, useEffect } from "react"

interface Props {
  schoolCriteria: string;
  setSchoolCriteria: (val: string) => void;
  onNext: () => void;
}

export default function Step1Criteria({ schoolCriteria, setSchoolCriteria, onNext }: Props) {
  // On découpe les critères en plusieurs champs pour une meilleure UX
  const [formationName, setFormationName] = useState("");
  const [hardSkills, setHardSkills] = useState("");
  const [softSkills, setSoftSkills] = useState("");
  const [tone, setTone] = useState("Professionnel, encourageant et bienveillant.");

  // Dès qu'un champ change, on met à jour le prompt global "schoolCriteria" caché
  useEffect(() => {
    const combinedCriteria = `
Formation visée : ${formationName}
Prérequis académiques/techniques : ${hardSkills}
Savoir-être recherchés : ${softSkills}
Ton de la réponse : ${tone}
    `.trim();
    setSchoolCriteria(combinedCriteria);
  }, [formationName, hardSkills, softSkills, tone, setSchoolCriteria]);

  // Le formulaire est valide si au moins la formation et les prérequis sont remplis
  const isFormValid = formationName.trim().length > 0 && hardSkills.trim().length > 0;

  return (
    <Card className="max-w-3xl mx-auto shadow-sm">
      <CardHeader className="pb-8">
        <CardTitle className="text-3xl font-serif text-center mb-2">Étape 1 : Paramétrage de la Formation</CardTitle>
        <CardDescription className="text-center text-lg">
          Définissez précisément les attentes de votre jury d'admission pour configurer l'IA.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        
        <div className="space-y-2">
          <Label htmlFor="formation" className="text-slate-800 font-semibold">Nom de la Formation ciblée</Label>
          <Input 
            id="formation"
            placeholder="Ex: Master 1 en Management de l'Innovation"
            value={formationName}
            onChange={(e) => setFormationName(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="hardSkills" className="text-slate-800 font-semibold">Prérequis académiques (Hard Skills)</Label>
            <Textarea 
              id="hardSkills"
              placeholder="Ex: Minimum 12/20 en mathématiques. Bon niveau d'anglais exigé (TOEIC > 750). Au moins une première expérience en entreprise."
              className="min-h-[120px] resize-none"
              value={hardSkills}
              onChange={(e) => setHardSkills(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="softSkills" className="text-slate-800 font-semibold">Qualités humaines (Soft Skills)</Label>
            <Textarea 
              id="softSkills"
              placeholder="Ex: Nous cherchons des profils très motivés, avec un esprit entrepreneurial et capables de travailler en équipe."
              className="min-h-[120px] resize-none"
              value={softSkills}
              onChange={(e) => setSoftSkills(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="tone" className="text-slate-800 font-semibold">Ton de la réponse (Prompt IA)</Label>
          <Input 
            id="tone"
            placeholder="Ex: Professionnel, encourageant et bienveillant."
            value={tone}
            onChange={(e) => setTone(e.target.value)}
          />
          <p className="text-xs text-slate-500 mt-1">Ceci définira la manière dont l'IA rédigera les brouillons de refus ou d'acceptation.</p>
        </div>

      </CardContent>
      <CardFooter className="flex justify-end pt-4 border-t border-slate-100">
        <Button onClick={onNext} disabled={!isFormValid} className="px-8">
          Enregistrer & Continuer
        </Button>
      </CardFooter>
    </Card>
  );
}

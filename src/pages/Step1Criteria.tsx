import { Button } from "../components/ui/button"
import { Textarea } from "../components/ui/textarea"
import { Input } from "../components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import { Label } from "../components/ui/label"
import { useState, useEffect, useCallback, type KeyboardEvent, type ClipboardEvent, type ReactNode } from "react"
import { cn } from "../lib/utils"

interface Props {
  schoolCriteria: string;
  setSchoolCriteria: (val: string) => void;
  onNext: () => void;
}

const DATE_GHOSTS = ["J", "J", "M", "M", "A", "A", "A", "A"] as const;

/** Extrait jusqu'à 8 chiffres depuis une ligne stockée (ex. 01/01/2026 ou JJ/MM/AAAA résiduel). */
function parseDigitsFromSaved(raw: string): string {
  return raw.replace(/\D/g, "").slice(0, 8);
}

/** Ligne compacte pour schoolCriteria (sans espaces ni lettres fantôme). */
function digitsToCriteriaLine(digits: string): string {
  const d = digits.replace(/\D/g, "").slice(0, 8);
  if (d.length === 0) return "";
  if (d.length <= 2) return d;
  if (d.length <= 4) return `${d.slice(0, 2)}/${d.slice(2)}`;
  return `${d.slice(0, 2)}/${d.slice(2, 4)}/${d.slice(4)}`;
}

function parseDateFromDigits(digits: string): Date | null {
  const d = digits.replace(/\D/g, "");
  if (d.length !== 8) return null;
  const parsed = new Date(`${d.slice(4, 8)}-${d.slice(2, 4)}-${d.slice(0, 2)}`);
  return isNaN(parsed.getTime()) ? null : parsed;
}

interface DateMaskFieldProps {
  id: string;
  value: string;
  onChange: (digits: string) => void;
  ariaLabel: string;
}

function DateMaskField({ id, value, onChange, ariaLabel }: DateMaskFieldProps) {
  const [focused, setFocused] = useState(false);
  const digits = value.replace(/\D/g, "").slice(0, 8);

  const commitDigits = useCallback(
    (next: string) => {
      onChange(next.replace(/\D/g, "").slice(0, 8));
    },
    [onChange]
  );

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key >= "0" && e.key <= "9" && digits.length < 8) {
      commitDigits(digits + e.key);
      e.preventDefault();
      return;
    }
    if (e.key === "Backspace" || e.key === "Delete") {
      commitDigits(digits.slice(0, -1));
      e.preventDefault();
    }
  };

  const onPaste = (e: ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const t = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 8);
    commitDigits(t);
  };

  const ariaValue =
    digits.length === 0
      ? "Date vide"
      : digits.length === 8
        ? `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4, 8)}`
        : `Saisie en cours, ${digits.length} chiffres`;

  /** Curseur à la position d’insertion : n = nombre de chiffres déjà saisis (0–7). */
  const caretAt = (n: number) =>
    focused && digits.length === n && digits.length < 8 ? (
      <span
        key={`caret-${n}`}
        className="mx-px inline-block w-px shrink-0 animate-pulse bg-slate-900 align-text-bottom"
        style={{ height: "1.1em" }}
        aria-hidden
      />
    ) : null;

  const digitSpan = (i: number) => {
    const ch = digits[i];
    return (
      <span
        key={`c-${i}`}
        className={cn("inline-block min-w-[0.65em] text-center", ch ? "font-medium text-slate-900" : "text-slate-400")}
      >
        {ch || DATE_GHOSTS[i]}
      </span>
    );
  };

  const sepDayMonth = (
    <span
      key="sep-day-month"
      className={cn(
        "select-none transition-colors",
        digits.length >= 3 ? "font-medium text-slate-900" : "text-slate-400"
      )}
    >
      {" / "}
    </span>
  );
  const sepMonthYear = (
    <span
      key="sep-month-year"
      className={cn(
        "select-none transition-colors",
        digits.length >= 5 ? "font-medium text-slate-900" : "text-slate-400"
      )}
    >
      {" / "}
    </span>
  );

  /** Ordre visuel : curseur après n chiffres = avant la prochaine case (séparateurs inclus). */
  const cells: ReactNode[] = [
    caretAt(0),
    digitSpan(0),
    caretAt(1),
    digitSpan(1),
    sepDayMonth,
    caretAt(2),
    digitSpan(2),
    caretAt(3),
    digitSpan(3),
    sepMonthYear,
    caretAt(4),
    digitSpan(4),
    caretAt(5),
    digitSpan(5),
    caretAt(6),
    digitSpan(6),
    caretAt(7),
    digitSpan(7),
  ];

  return (
    <div
      id={id}
      role="textbox"
      tabIndex={0}
      aria-label={ariaLabel}
      aria-valuetext={ariaValue}
      inputMode="numeric"
      onKeyDown={onKeyDown}
      onPaste={onPaste}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      className={cn(
        "flex h-12 w-full cursor-text items-center rounded-xl border border-input bg-white px-4 font-mono text-[15px] tabular-nums shadow-[0_2px_10px_rgb(0,0,0,0.02)] ring-offset-background transition-all",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-transparent"
      )}
    >
      <span className="inline-flex items-baseline gap-0 whitespace-nowrap select-none">
        {cells}
      </span>
    </div>
  );
}

export default function Step1Criteria({ schoolCriteria, setSchoolCriteria, onNext }: Props) {
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

  const [formationName, setFormationName] = useState(() => 
    extractField(schoolCriteria, "Formation visée :", ["\nDate de début :", "\nDate de clôture :", "\nPlaces :", "\nPrérequis académiques/techniques :"])
  );
  
  const [startDate, setStartDate] = useState(() =>
    parseDigitsFromSaved(
      extractField(schoolCriteria, "Date de début :", ["\nDate de clôture :", "\nPlaces :", "\nPrérequis académiques/techniques :"])
    )
  );

  const [endDate, setEndDate] = useState(() =>
    parseDigitsFromSaved(
      extractField(schoolCriteria, "Date de clôture :", ["\nPlaces :", "\nPrérequis académiques/techniques :"])
    )
  );

  const [capacity, setCapacity] = useState(() => 
    extractField(schoolCriteria, "Places :", ["\nPrérequis académiques/techniques :"])
  );

  const [hardSkills, setHardSkills] = useState(() => 
    extractField(schoolCriteria, "Prérequis académiques/techniques :", ["\nSavoir-être recherchés :", "\nTon de la réponse :"])
  );
  
  const [softSkills, setSoftSkills] = useState(() => 
    extractField(schoolCriteria, "Savoir-être recherchés :", ["\nTon de la réponse :"])
  );
  
  const [tone, setTone] = useState(() => {
    const val = extractField(schoolCriteria, "Ton de la réponse :", []);
    return val || "Professionnel, encourageant et bienveillant.";
  });

  // On sauvegarde automatiquement à chaque modification pour éviter de perdre les données
  // si l'utilisateur retourne au dashboard sans cliquer sur "Enregistrer"
  useEffect(() => {
    const combinedCriteria = `Formation visée : ${formationName}
Date de début : ${digitsToCriteriaLine(startDate)}
Date de clôture : ${digitsToCriteriaLine(endDate)}
Places : ${capacity}
Prérequis académiques/techniques : ${hardSkills}
Savoir-être recherchés : ${softSkills}
Ton de la réponse : ${tone}`;
    
    // Pour éviter les boucles infinies, on ne met à jour que si c'est différent
    if (schoolCriteria !== combinedCriteria) {
      setSchoolCriteria(combinedCriteria);
    }
  }, [formationName, startDate, endDate, capacity, hardSkills, softSkills, tone, schoolCriteria, setSchoolCriteria]);

  const handleNext = () => {
    onNext();
  };

  const startD = parseDateFromDigits(startDate);
  const endD = parseDateFromDigits(endDate);
  
  let dateError = "";
  if (startD && endD) {
    // Check if end date is strictly before start date
    if (endD < startD) {
      dateError = "La date de clôture ne peut pas être antérieure à la date de début.";
    }
  }

  const isFormValid = formationName.trim().length > 0 && hardSkills.trim().length > 0 && dateError === "";

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

        <div className="space-y-2">
          <Label htmlFor="capacity" className="text-slate-800 font-semibold">Nombre de places disponibles</Label>
          <Input 
            id="capacity"
            type="text"
            inputMode="numeric"
            placeholder="Ex: 30"
            value={capacity}
            onChange={(e) => {
              const val = e.target.value.replace(/[^\d]/g, '');
              setCapacity(val);
            }}
          />
        </div>

        <div className="space-y-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="startDate" className="text-slate-800 font-semibold">Date de début de campagne</Label>
              <DateMaskField
                id="startDate"
                value={startDate}
                onChange={setStartDate}
                ariaLabel="Date de début de campagne, format jour mois année, chiffres uniquement"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate" className="text-slate-800 font-semibold">Date de clôture de campagne</Label>
              <DateMaskField
                id="endDate"
                value={endDate}
                onChange={setEndDate}
                ariaLabel="Date de clôture de campagne, format jour mois année, chiffres uniquement"
              />
            </div>
          </div>
          {dateError && (
            <p className="text-sm font-medium text-red-500 mt-1">{dateError}</p>
          )}
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
        <Button onClick={handleNext} disabled={!isFormValid} className="px-8">
          Enregistrer & Continuer
        </Button>
      </CardFooter>
    </Card>
  );
}

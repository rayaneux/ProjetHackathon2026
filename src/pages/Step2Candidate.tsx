import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import { UploadCloud, FileSpreadsheet, Trash2, Users } from "lucide-react"
import type { Candidate } from "../types"
import { useRef, useState } from "react"
import Papa from "papaparse"

interface Props {
  candidates: Candidate[];
  setCandidates: (val: Candidate[]) => void;
  onNext: () => void;
  onPrev: () => void;
}

export default function Step2Candidate({ candidates, setCandidates, onNext, onPrev }: Props) {
  const hasCandidates = candidates.length > 0;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string>("");

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFileName(file.name);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const parsedData = results.data as any[];
        const mappedCandidates: Candidate[] = parsedData.map((row, index) => ({
          id: `imported-${index}`,
          // On essaie de récupérer différentes clés possibles
          name: row.Nom || row.name || row.Name || "Inconnu",
          email: row.Email || row.email || "Inconnu",
          profileData: row.Dossier_Profil || row.dossier || row.profile || JSON.stringify(row),
        }));
        
        setCandidates(mappedCandidates);
      }
    });
  };

  const handleSimulateUpload = () => {
    const mockData: Candidate[] = [
      { id: "1", name: "Léa Martin", email: "lea.martin@email.com", profileData: "Bac S mention Très Bien. Projet associatif fort en écologie. Lettre de motivation très structurée et claire." },
      { id: "2", name: "Thomas Dubois", email: "thomas.d@email.com", profileData: "Bac ES mention Assez Bien. Notes moyennes en mathématiques. Activité sportive niveau régional." },
      { id: "3", name: "Sarah Connor", email: "sarah.c@email.com", profileData: "Reconversion professionnelle. 5 ans d'expérience en marketing. Très motivée par le digital." },
      { id: "4", name: "Lucas Bernard", email: "lucas.b@email.com", profileData: "Bac STI2D. Passionné d'informatique. Excellentes notes en projet technique, difficultés en anglais." },
      { id: "5", name: "Amira Diallo", email: "amira.d@email.com", profileData: "Licence de Droit validée. Profil analytique très rigoureux. Stages pertinents en cabinet." },
      { id: "6", name: "Hugo Petit", email: "hugo.p@email.com", profileData: "Dossier très faible. Nombreuses absences injustifiées. Motivation générique." },
      { id: "7", name: "Clara Leroy", email: "clara.l@email.com", profileData: "Excellents résultats en prépa littéraire. Esprit de synthèse remarquable. Très bonne plume." },
      { id: "8", name: "Marc Antoine", email: "marc.a@email.com", profileData: "BTS Commerce International. Profil commercial affirmé. A monté sa propre micro-entreprise." },
      { id: "9", name: "Sophie Dubois", email: "sophie.d@email.com", profileData: "Licence d'Histoire de l'Art. Profil atypique mais curieux. Expérience de bénévolat à l'étranger." },
      { id: "10", name: "Antoine Griezmann", email: "antoine.g@email.com", profileData: "Sportif de haut niveau en reconversion. Grande capacité de travail et résistance au stress." },
      { id: "11", name: "Juliette Rousseau", email: "juliette.r@email.com", profileData: "Master 1 en biologie. Excellente élève. Cherche une double compétence en management." },
      { id: "12", name: "Maxime Chen", email: "maxime.c@email.com", profileData: "Candidature incomplète. Lettre de motivation manquante. Notes moyennes." },
      { id: "13", name: "Elodie Farès", email: "elodie.f@email.com", profileData: "3 ans d'expérience comme assistante RH. Profil très structuré, excellentes recommandations." },
      { id: "14", name: "Nicolas Moreau", email: "nicolas.m@email.com", profileData: "Profil entrepreneurial. A déjà créé 2 startups. Tire de bonnes leçons de ses échecs." },
      { id: "15", name: "Alice Dupont", email: "alice.d@email.com", profileData: "Excellents résultats au Bac. Première année ratée, cherche à se réorienter. Très travailleuse." },
    ];
    setFileName("candidats_mock.csv");
    setCandidates(mockData);
  };

  const clearCandidates = () => {
    setCandidates([]);
    setFileName("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <Card className="max-w-4xl mx-auto shadow-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Étape 2 : Dossiers Candidats</CardTitle>
        <CardDescription>
          Importez le tableau des élèves avec les informations récupérées dans leurs dossiers de candidature.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {!hasCandidates ? (
          <div 
            className="border-2 border-dashed border-slate-300 rounded-xl p-12 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-50 transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept=".csv"
              onChange={handleFileUpload}
            />
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4">
              <UploadCloud className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-1">Cliquez pour importer votre fichier CSV</h3>
            <p className="text-slate-500 max-w-sm mb-4">
              Le fichier CSV doit idéalement contenir les colonnes : Nom, Email, Dossier_Profil.
            </p>
            <div className="flex gap-4 mt-2">
              <Button variant="outline">Parcourir les fichiers</Button>
              <Button variant="secondary" onClick={(e) => { e.stopPropagation(); handleSimulateUpload(); }}>Utiliser données test</Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-slate-100 p-4 rounded-lg">
              <div className="flex items-center space-x-3">
                <FileSpreadsheet className="w-6 h-6 text-green-600" />
                <div>
                  <p className="font-semibold text-slate-900">{fileName || "import_candidats.csv"}</p>
                  <p className="text-xs text-slate-500">{candidates.length} candidats importés avec succès</p>
                </div>
              </div>
              <Button variant="outline" size="icon" onClick={clearCandidates} className="text-red-500 hover:text-red-700 hover:bg-red-50">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>

            <div className="border border-slate-200 rounded-lg overflow-hidden max-h-64 overflow-y-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-600 uppercase font-semibold border-b border-slate-200 sticky top-0">
                  <tr>
                    <th className="px-4 py-3">Nom</th>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3">Aperçu du Profil</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {candidates.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-medium text-slate-900 whitespace-nowrap">{c.name}</td>
                      <td className="px-4 py-3 text-slate-500 whitespace-nowrap">{c.email}</td>
                      <td className="px-4 py-3 text-slate-500 truncate max-w-xs" title={c.profileData}>{c.profileData}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onPrev} className="bg-slate-100 text-slate-800 hover:bg-slate-200 border-none">
          Retour
        </Button>
        <Button onClick={onNext} disabled={!hasCandidates}>
          Lancer l'Analyse IA <Users className="w-4 h-4 ml-2" />
        </Button>
      </CardFooter>
    </Card>
  );
}

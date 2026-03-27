import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import { UploadCloud, FileSpreadsheet, Trash2, Users } from "lucide-react"
import { Candidate } from "../types"

interface Props {
  candidates: Candidate[];
  setCandidates: (val: Candidate[]) => void;
  onNext: () => void;
  onPrev: () => void;
}

export default function Step2Candidate({ candidates, setCandidates, onNext, onPrev }: Props) {
  const hasCandidates = candidates.length > 0;

  const handleSimulateUpload = () => {
    // Fausse donnée pour simuler l'import d'un tableau de candidats
    const mockData: Candidate[] = [
      {
        id: "1",
        name: "Léa Martin",
        email: "lea.martin@email.com",
        profileData: "Bac S mention Très Bien. Projet associatif fort en écologie. Lettre de motivation très structurée et claire.",
      },
      {
        id: "2",
        name: "Thomas Dubois",
        email: "thomas.d@email.com",
        profileData: "Bac ES mention Assez Bien. Notes moyennes en mathématiques. Activité sportive (tennis) niveau régional.",
      },
      {
        id: "3",
        name: "Sarah Connor",
        email: "sarah.c@email.com",
        profileData: "Reconversion professionnelle. 5 ans d'expérience en marketing. Très motivée par le digital, auto-formation en cours.",
      },
      {
        id: "4",
        name: "Lucas Bernard",
        email: "lucas.b@email.com",
        profileData: "Bac STI2D. Passionné d'informatique. Excellentes notes en projet technique, difficultés importantes en anglais et français.",
      }
    ];
    setCandidates(mockData);
  };

  const clearCandidates = () => setCandidates([]);

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
            onClick={handleSimulateUpload}
          >
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4">
              <UploadCloud className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-1">Cliquez pour importer (Simulation)</h3>
            <p className="text-slate-500 max-w-sm mb-4">
              Formats supportés: CSV, Excel (.xlsx). Le fichier doit contenir les colonnes: Nom, Email, Dossier/Profil.
            </p>
            <Button variant="outline">Parcourir les fichiers</Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-slate-100 p-4 rounded-lg">
              <div className="flex items-center space-x-3">
                <FileSpreadsheet className="w-6 h-6 text-green-600" />
                <div>
                  <p className="font-semibold text-slate-900">candidats_import.csv</p>
                  <p className="text-xs text-slate-500">{candidates.length} candidats importés avec succès</p>
                </div>
              </div>
              <Button variant="outline" size="icon" onClick={clearCandidates} className="text-red-500 hover:text-red-700 hover:bg-red-50">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>

            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-600 uppercase font-semibold border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3">Nom</th>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3">Aperçu du Profil</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {candidates.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-medium text-slate-900">{c.name}</td>
                      <td className="px-4 py-3 text-slate-500">{c.email}</td>
                      <td className="px-4 py-3 text-slate-500 truncate max-w-xs">{c.profileData}</td>
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

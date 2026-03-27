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
      {
        id: "1",
        name: "Léa Martin",
        email: "lea.martin@email.com",
        profileData: "Bac S mention Très Bien. Projet associatif fort en écologie. Lettre de motivation très structurée et claire.",
      },
      // ... autres mock data
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

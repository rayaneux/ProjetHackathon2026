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
          name: row.Nom || row.name || row.Name || "Inconnu",
          email: row.Email || row.email || "Inconnu",
          decision: row.Decision || row.decision || "unknown", // Prise en compte de la colonne Decision
          profileData: row.Dossier_Profil || row.dossier || row.profile || JSON.stringify(row),
        }));
        
        setCandidates(mappedCandidates);
      }
    });
  };

  const handleSimulateUpload = () => {
    const mockData: Candidate[] = [
      { id: "1", name: "Léa Martin", email: "lea.martin@email.com", decision: "accept", profileData: "Bac S mention Très Bien. Mathématiques: 18/20, Physique: 17/20. Projet associatif fort en écologie (présidente de club depuis 2 ans). Lettre de motivation très structurée et claire. Anglais courant (TOEIC 920). A participé à un concours national de robotique." },
      { id: "2", name: "Thomas Dubois", email: "thomas.d@email.com", decision: "reject", profileData: "Bac ES mention Assez Bien. Notes moyennes en mathématiques (10/20) et histoire (11/20). Activité sportive (tennis) niveau régional avec 10h d'entraînement par semaine. Bon niveau en économie (15/20). Lettre de motivation basique." },
      { id: "3", name: "Sarah Connor", email: "sarah.c@email.com", decision: "accept", profileData: "Reconversion professionnelle (32 ans). Master 2 en Littérature. 5 ans d'expérience en marketing classique chez L'Oréal. Très motivée par le digital, auto-formation en cours sur Codecademy et Coursera (Python, React). Recommandations élogieuses de ses anciens managers." },
      { id: "4", name: "Lucas Bernard", email: "lucas.b@email.com", decision: "waitlist", profileData: "Bac STI2D mention Bien. Passionné d'informatique depuis l'enfance. Excellentes notes en projet technique (18/20), développement d'une application mobile publiée sur les stores. Difficultés importantes en anglais (8/20) et français (7/20)." },
      { id: "5", name: "Amira Diallo", email: "amira.d@email.com", decision: "accept", profileData: "Licence 3 de Droit validée avec mention Assez Bien. Profil analytique très rigoureux. Stages de 6 mois pertinents en cabinet d'avocats d'affaires. Souhaite se réorienter vers le management de projet et le business international. Trilingue (Français, Anglais, Arabe)." },
      { id: "6", name: "Hugo Petit", email: "hugo.p@email.com", decision: "reject", profileData: "Bac STMG sans mention. Dossier très faible. Mathématiques: 6/20, Philosophie: 5/20. Nombreuses absences injustifiées (plus de 30 demi-journées). Lettre de motivation qui semble générique ou copiée-collée d'internet. Aucune activité extra-scolaire renseignée." },
      { id: "7", name: "Clara Leroy", email: "clara.l@email.com", decision: "accept", profileData: "Hypokhâgne AL. Excellents résultats en prépa littéraire, 2ème de sa classe en Lettres. Esprit de synthèse remarquable. Veut intégrer un master en communication d'entreprise. Très bonne plume, tient un blog suivi par 5000 personnes sur l'actualité culturelle." },
      { id: "8", name: "Marc Antoine", email: "marc.a@email.com", decision: "waitlist", profileData: "BTS Commerce International obtenu au rattrapage. Profil commercial affirmé, mais résultats académiques justes (10.5 de moyenne générale). A monté sa propre micro-entreprise de revente en ligne de sneakers à 19 ans qui génère un vrai chiffre d'affaires. Dynamique mais brouillon." },
      { id: "9", name: "Sophie Dubois", email: "sophie.d@email.com", decision: "waitlist", profileData: "Licence d'Histoire de l'Art. Profil atypique mais extrêmement curieux. Notes hétérogènes (de 8 à 18 selon la matière). Expérience de 6 mois de bénévolat dans un musée au Pérou. Veut s'orienter vers la gestion de projets culturels numérisés." },
      { id: "10", name: "Antoine Griezmann", email: "antoine.g@email.com", decision: "reject", profileData: "Ancien sportif de haut niveau en reconversion suite à une blessure. Grande capacité de travail, leadership naturel (capitaine d'équipe), et résistance au stress. Aucune base académique récente en gestion d'entreprise, mais une volonté de fer prouvée lors de sa rééducation." },
      { id: "11", name: "Juliette Rousseau", email: "juliette.r@email.com", decision: "accept", profileData: "Master 1 en biologie moléculaire mention Très Bien. Major de promo. Excellente élève scientifique. Cherche une double compétence en management de l'innovation pour travailler dans l'industrie pharmaceutique. Stage R&D chez Sanofi très bien noté." },
      { id: "12", name: "Maxime Chen", email: "maxime.c@email.com", decision: "reject", profileData: "Licence LEA (Langues Étrangères Appliquées). Candidature incomplète : la lettre de motivation n'a pas été fournie. Notes moyennes tournant autour de 11/20. Semble postuler 'au hasard'. Bon niveau en mandarin." },
      { id: "13", name: "Elodie Farès", email: "elodie.f@email.com", decision: "accept", profileData: "3 ans d'expérience comme assistante RH après un BTS. Souhaite reprendre ses études pour un Master RH en alternance. Profil très structuré, excellentes recommandations écrites de la directrice RH de son entreprise actuelle. Très pragmatique." },
      { id: "14", name: "Nicolas Moreau", email: "nicolas.m@email.com", decision: "waitlist", profileData: "Profil très entrepreneurial. N'a pas validé sa L2 d'éco-gestion (notes très faibles) car il a créé 2 startups en parallèle (qui ont fini par échouer). Il a rédigé une lettre fascinante sur les leçons qu'il a tirées de ces échecs. Profil 'risqué' mais avec un énorme potentiel pratique." },
      { id: "15", name: "Alice Dupont", email: "alice.d@email.com", decision: "reject", profileData: "Excellents résultats au Baccalauréat (Mention TB avec Félicitations du jury). Vient de rater sa première année de médecine (PASS) de quelques places. Cherche à se réorienter d'urgence. Très travailleuse, excellente capacité de mémorisation, mais semble un peu perdue sur son avenir pro." },
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
      <CardHeader className="pb-8">
        <CardTitle className="text-3xl font-serif text-center mb-2">Étape 2 : Dossiers Candidats</CardTitle>
        <CardDescription className="text-center text-lg">
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
                    <th className="px-4 py-3">Décision Prise</th>
                    <th className="px-4 py-3">Aperçu du Profil</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {candidates.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-medium text-slate-900 whitespace-nowrap">{c.name}</td>
                      <td className="px-4 py-3 text-slate-500 whitespace-nowrap">{c.email}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {c.decision === 'accept' && <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">Admis</span>}
                        {c.decision === 'reject' && <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-800">Refusé</span>}
                        {c.decision === 'waitlist' && <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-yellow-100 text-yellow-800">Attente</span>}
                        {(!c.decision || c.decision === 'unknown') && <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-slate-100 text-slate-800">Inconnu</span>}
                      </td>
                      <td className="px-4 py-3 text-slate-500 truncate max-w-[200px]" title={c.profileData}>{c.profileData}</td>
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

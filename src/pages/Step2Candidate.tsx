import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import { Trash2, Users } from "lucide-react"
import type { Candidate } from "../types"
import { useRef, useState } from "react"

interface Props {
  candidates: Candidate[];
  setCandidates: (val: Candidate[]) => void;
  onNext: () => void;
  onPrev: () => void;
}

export default function Step2Candidate({ candidates, setCandidates, onNext, onPrev }: Props) {
  const hasCandidates = candidates.length > 0;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [, setFileName] = useState<string>("");

  const handleSimulateUpload = () => {
    const firstNames = ["Léa", "Thomas", "Marie", "Hugo", "Camille", "Lucas", "Chloé", "Antoine", "Sarah", "Paul", "Julie", "Arthur", "Emma", "Maxime", "Manon", "Alexandre", "Laura", "Victor", "Alice", "Nicolas"];
    const lastNames = ["Martin", "Bernard", "Thomas", "Petit", "Robert", "Richard", "Durand", "Dubois", "Moreau", "Laurent", "Simon", "Michel", "Lefevre", "Leroy", "Roux", "David", "Bertrand", "Morel", "Fournier", "Girard"];
    
    const mockData: Candidate[] = [];
    const now = new Date().getTime();
    
    for (let i = 0; i < 100; i++) {
      const fName = firstNames[i % 20];
      const lName = lastNames[Math.floor(i / 5) % 20];
      // Date aléatoire dans les 30 derniers jours
      const randomDate = new Date(now - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000);
      
      let profileData = "Dossier académique solide avec de bons résultats dans les matières principales. Motivation démontrée par plusieurs expériences associatives.";
      
      if (i === 0) {
        profileData = `Dossier de candidature - ${fName} ${lName}

[PARCOURS ACADÉMIQUE]
• Licence 3 en cours : Économie et Gestion (Université Paris 1 Panthéon-Sorbonne)
  - Moyenne globale estimée (S5) : 13.5/20
  - Points forts : Statistiques (16/20), Macroéconomie (15/20), Anglais (18/20)
  - Points faibles : Comptabilité de gestion (9/20), Droit des affaires (10/20)
• Baccalauréat Général (Spécialités : Mathématiques, Sciences Économiques et Sociales)
  - Mention : Bien (15.2/20)

[EXPÉRIENCES PROFESSIONNELLES]
• Stage de 3 mois (Juin - Août 2025) : Assistant Chef de Produit chez L'Oréal (Paris)
  - Analyse concurrentielle du marché des cosmétiques éco-responsables
  - Participation à l'élaboration de la stratégie marketing digitale
• Job étudiant (Depuis Septembre 2024) : Vendeur à temps partiel chez Zara (10h/semaine)
  - Gestion de la relation client et des encaissements
  - Développement de compétences en vente et en gestion du stress

[ACTIVITÉS EXTRA-SCOLAIRES & SOFT SKILLS]
• Trésorier du Bureau des Étudiants (BDE) de l'Université (2024-2025)
  - Gestion d'un budget de 15 000 €
  - Organisation d'événements pour 500 étudiants (gala de fin d'année, week-end d'intégration)
• Bénévole actif au sein de la Croix-Rouge Française (Maraudes hebdomadaires)
• Compétences relationnelles (Soft skills) déduites : Fort leadership, esprit d'équipe, très grande rigueur financière et empathie.

[LETTRE DE MOTIVATION (EXTRAIT)]
"Je souhaite intégrer votre Master en Management de l'Innovation car il représente pour moi le prolongement logique de mon parcours. Mon expérience chez L'Oréal m'a fait prendre conscience de l'importance d'allier performance économique et impact environnemental. J'ai particulièrement été attiré par votre module 'Green Business Models' et par les projets de groupe avec des entreprises partenaires. Mon engagement associatif en tant que trésorier m'a appris à gérer des projets de A à Z avec rigueur, une compétence que je compte bien mettre au service de la vie étudiante de votre école."

[LANGUES & OUTILS]
• Anglais : Courant (TOEIC 910/990)
• Espagnol : Intermédiaire (B2)
• Outils : Suite Office (Expert sur Excel), Canva, Notions en Python.`;
      }

      mockData.push({
        id: (i + 1).toString(),
        name: `${fName} ${lName}`,
        email: i === 0 ? "gadwstudio@gmail.com" : `${fName.toLowerCase()}.${lName.toLowerCase()}@email.com`,
        profileData: profileData,
        applicationDate: randomDate.toISOString(),
        status: "pending"
      });
    }

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
          Supervisez les dossiers reçus en temps réel avant de lancer l'analyse IA.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {!hasCandidates ? (
          <div 
            className="border-2 border-dashed border-slate-300 rounded-xl p-12 flex flex-col items-center justify-center text-center bg-slate-50/50"
          >
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4">
              <Users className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-1">En attente de nouvelles candidatures...</h3>
            <p className="text-slate-500 max-w-sm mb-6">
              Votre CRM est prêt. Les dossiers des candidats apparaîtront ici automatiquement dès qu'ils postuleront à votre formation.
            </p>
            <div className="flex flex-col items-center gap-3 w-full max-w-xs">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider w-full flex items-center gap-2">
                <div className="flex-1 h-px bg-slate-200"></div>
                Mode Démo
                <div className="flex-1 h-px bg-slate-200"></div>
              </div>
              <Button onClick={handleSimulateUpload} className="w-full bg-slate-900 text-white hover:bg-slate-800">
                Simuler la réception de 100 dossiers
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-slate-100 p-4 rounded-lg">
              <div className="flex items-center space-x-3">
                <Users className="w-6 h-6 text-blue-600" />
                <div>
                  <p className="font-semibold text-slate-900">Flux de candidatures synchronisé</p>
                  <p className="text-xs text-slate-500">{candidates.length} dossiers reçus en attente d'analyse</p>
                </div>
              </div>
              <Button variant="outline" size="icon" onClick={clearCandidates} className="text-red-500 hover:text-red-700 hover:bg-red-50" title="Vider la liste (Démo)">
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
          Analyse des lacunes et rédaction <Users className="w-4 h-4 ml-2" />
        </Button>
      </CardFooter>
    </Card>
  );
}

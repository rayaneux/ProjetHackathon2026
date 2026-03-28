import { useState, useEffect, useRef } from 'react'
import { Toaster, showToast } from './components/Toaster'
import { Stepper } from './components/Stepper'
import Step1Criteria from './pages/Step1Criteria'
import Step2Candidate from './pages/Step2Candidate'
import Step3Generate from './pages/Step3Generate'
import Step4Selection from './pages/Step4Selection'
import Step5Response from './pages/Step5Response'
import Step6Bilan from './pages/Step6Bilan'
import Dashboard from './pages/Dashboard'
import SchoolLanding from './pages/SchoolLanding'
import LandingPage from './pages/LandingPage'
import FormBuilder from './pages/FormBuilder'
import Onboarding from './pages/Onboarding'
import type { Candidate, Campaign, Form } from './types'

const DEMO_VERSION = 'v3'

const rejectionDraft = (firstName: string) => `<p>Bonjour ${firstName},</p>

<p>Merci d'avoir candidaté au Master Management de l'Innovation. Nous avons étudié votre dossier avec attention et je vous contacte pour vous informer que nous ne pouvons pas vous proposer une place dans la promotion 2025-2026.</p>

<p>Je sais que ce type de message est difficile à recevoir, et je préfère vous en dire un peu plus plutôt que de vous laisser avec une réponse sèche.</p>

<p>Cette année, nous avons reçu 847 candidatures pour 42 places. La sélection a été particulièrement serrée, et certains dossiers n'ont pas été retenus non pas parce qu'ils étaient insuffisants, mais parce que d'autres profils répondaient plus directement aux critères de cette promotion spécifique. Ce n'est pas un jugement sur votre valeur ou votre potentiel.</p>

<p>Les éléments qui ont joué en votre faveur ont bien été identifiés — votre lettre témoignait d'un intérêt sincère pour le programme et votre parcours comporte des aspects solides. Ce qui a manqué, c'est principalement l'expérience terrain en lien direct avec les enjeux du management de l'innovation — stages, projets associatifs à responsabilité réelle ou exposition aux dynamiques d'entreprise en transformation.</p>

<p>Si vous envisagez de recandidater l'année prochaine : construire une expérience où vous avez eu une responsabilité mesurable — budget, équipe, livrable — et être en mesure d'expliquer avec précision en quoi elle vous a changé dans votre façon de raisonner. C'est ce que le jury cherche au-delà du CV.</p>

<p>La candidature reste ouverte l'année prochaine. Plusieurs membres de notre promotion actuelle n'ont pas été admis du premier coup.</p>

<p>Je vous souhaite sincèrement bonne continuation.</p>

<p>Claire Beaumont<br/>Responsable des Admissions<br/>Master Management de l'Innovation</p>`

const MMI_CRITERIA = `Formation visée : Master Management de l'Innovation
Date de début : 08 septembre 2025
Date de clôture : 30 juin 2025
Places : 42
Prérequis académiques/techniques : Bac+3 minimum, anglais B2 requis, expérience professionnelle ou associative appréciée
Compétences prioritaires : Stratégie d'entreprise, Management de projet, Leadership, Anglais professionnel
Ton de communication : Professionnel, bienveillant et précis`

const SEED_CANDIDATES: Candidate[] = [
  {
    id: '1',
    name: 'Léa Martin',
    email: 'gadwstudio@gmail.com',
    score: 98,
    status: 'pending',
    userValidation: 'pending',
    applicationDate: '2025-04-12T09:14:00.000Z',
    aiAnalysis: 'Profil exceptionnel. Stage L\'Oréal avec analyse concurrentielle autonome sur les cosmétiques éco-responsables. Trésorier BDE — budget 15 000 €, 500 participants. TOEIC 910/990, Espagnol B2. Lettre de motivation très précise sur le module Green Business Models.',
    profileData: `• Stage Assistant Chef de Produit — L'Oréal (3 mois)\n  Analyse concurrentielle cosmétiques éco-responsables, stratégie marketing digital\n• Trésorier BDE — Gestion budget 15 000 €, organisation événements 500 étudiants\n• TOEIC 910/990 — Espagnol B2\n• Lettre de motivation : module Green Business Models, projet conseil RSE`,
    aiEmailDraft: '',
    criteriaScores: {},
  },
  {
    id: '2',
    name: 'Thomas Dubois',
    email: 'thomas.dubois@email.com',
    score: 91,
    status: 'accepted',
    userValidation: 'approved',
    applicationDate: '2025-04-10T11:30:00.000Z',
    aiAnalysis: 'Excellent profil. Stage Consultant Junior chez McKinsey (4 mois), projet de restructuration industrielle. Président d\'une association entrepreneuriale (120 membres). TOEIC 945.',
    profileData: `• Stage Consultant Junior — McKinsey & Company (4 mois)\n  Diagnostic et restructuration d'une PME industrielle\n• Président association Entrepreneuriat & Innovation — 120 membres\n• TOEIC 945, Allemand B1\n• Double parcours Éco-Gestion + Ingénierie`,
    aiEmailDraft: '',
    criteriaScores: {},
  },
  {
    id: '3',
    name: 'Marie Lefèvre',
    email: 'marie.lefevre@email.com',
    score: 87,
    status: 'accepted',
    userValidation: 'approved',
    applicationDate: '2025-04-08T14:22:00.000Z',
    aiAnalysis: 'Très bon dossier. Chef de projet junior chez Danone (6 mois), lancement d\'une gamme plant-based sur 3 marchés européens. Bilingue anglais-espagnol. Forte cohérence avec le programme.',
    profileData: `• Chef de projet junior — Danone (6 mois)\n  Lancement gamme plant-based sur 3 marchés européens\n• Bilingue anglais-espagnol (natif)\n• Responsable communication association humanitaire\n• Mémoire de M1 : Innovation frugale et marchés émergents`,
    aiEmailDraft: '',
    criteriaScores: {},
  },
  {
    id: '4',
    name: 'Hugo Bernard',
    email: 'hugo.bernard@email.com',
    score: 84,
    status: 'accepted',
    userValidation: 'approved',
    applicationDate: '2025-04-09T16:05:00.000Z',
    aiAnalysis: 'Bon profil tech-business. Développeur produit en startup SaaS (5 mois), ownership d\'une feature critère. Compétences analytiques solides, bonne maîtrise de l\'anglais technique.',
    profileData: `• Product Manager Intern — Startup SaaS B2B (5 mois)\n  Ownership feature analytique, +30% d'adoption en 3 mois\n• TOEIC 880, notions de Python et SQL\n• Vice-président Junior Entreprise — 45 missions réalisées\n• Formation initiale : École d'Ingénieurs (Bac+4)`,
    aiEmailDraft: '',
    criteriaScores: {},
  },
  {
    id: '5',
    name: 'Antoine Petit',
    email: 'antoine.petit@email.com',
    score: 83,
    status: 'accepted',
    userValidation: 'approved',
    applicationDate: '2025-04-11T10:18:00.000Z',
    aiAnalysis: 'Profil solide, bonne expérience terrain. Stage Analyste M&A dans une boutique financière (4 mois). Engagement associatif conséquent. Lettre claire et ambitieuse.',
    profileData: `• Analyste stagiaire — Cabinet M&A (4 mois)\n  Participation à 2 opérations de cession dans le secteur santé\n• Secrétaire général BDE — 8 événements organisés\n• Anglais C1 (Cambridge), Chinois HSK2\n• Licence Économie mention Très Bien`,
    aiEmailDraft: '',
    criteriaScores: {},
  },
  {
    id: '6',
    name: 'Lucas Moreau',
    email: 'lucas.moreau@email.com',
    score: 79,
    status: 'accepted',
    userValidation: 'approved',
    applicationDate: '2025-04-07T09:45:00.000Z',
    aiAnalysis: 'Profil marketing digital bien construit. Stage Growth chez une scale-up (3 mois), gestion de campagnes à 50k€. Créateur de contenu avec audience qualifiée. Anglais opérationnel.',
    profileData: `• Growth Marketing Intern — Scale-up e-commerce (3 mois)\n  Gestion campagnes Google/Meta, budget 50 000 €\n• Créateur de contenu LinkedIn — 4 200 abonnés, focus stratégie\n• TOEFL 102/120\n• Bachelor Marketing Digital (Bac+3)`,
    aiEmailDraft: '',
    criteriaScores: {},
  },
  {
    id: '7',
    name: 'Camille Roux',
    email: 'camille.roux@email.com',
    score: 62,
    status: 'rejected',
    userValidation: 'approved',
    applicationDate: '2025-04-13T15:30:00.000Z',
    aiAnalysis: 'Dossier insuffisant. Pas d\'expérience professionnelle significative. Lettre de motivation générique, absence de références au programme. Niveau d\'anglais non certifié.',
    profileData: `• Stage assistant commercial — PME locale (1 mois)\n• Membre (non actif) d'une association étudiante\n• Anglais niveau scolaire non certifié\n• Licence Droit, 2e année`,
    aiEmailDraft: rejectionDraft('Camille'),
    criteriaScores: {},
  },
  {
    id: '8',
    name: 'Sarah Girard',
    email: 'sarah.girard@email.com',
    score: 58,
    status: 'rejected',
    userValidation: 'approved',
    applicationDate: '2025-04-14T08:55:00.000Z',
    aiAnalysis: 'Profil insuffisant pour le niveau de la promotion. Expériences non pertinentes par rapport aux critères. Lettre standard, manque de précision sur le projet professionnel.',
    profileData: `• Employée saisonnière — Grande surface (2 étés)\n• Aucune expérience associative à responsabilité\n• TOEIC 620 (seuil requis : 750)\n• BTS Management Commercial Evolutif`,
    aiEmailDraft: rejectionDraft('Sarah'),
    criteriaScores: {},
  },
  {
    id: '9',
    name: 'Julie Simon',
    email: 'julie.simon@email.com',
    score: 51,
    status: 'rejected',
    userValidation: 'approved',
    applicationDate: '2025-04-15T13:40:00.000Z',
    aiAnalysis: 'Dossier très en dessous du niveau attendu. Absence totale d\'expérience professionnelle. Lettre de motivation très courte, projet professionnel flou.',
    profileData: `• Aucune expérience professionnelle ou associative\n• Anglais débutant (A2)\n• Candidature tardive, dossier incomplet\n• Licence AES 1re année`,
    aiEmailDraft: rejectionDraft('Julie'),
    criteriaScores: {},
  },
  {
    id: '10',
    name: 'Paul Laurent',
    email: 'paul.laurent@email.com',
    score: 76,
    status: 'accepted',
    userValidation: 'approved',
    applicationDate: '2025-04-06T17:20:00.000Z',
    aiAnalysis: 'Bon profil avec expérience internationale. Semestre à l\'étranger à Berlin, stage dans une startup fintech (3 mois). Espagnol courant, anglais solide. Profil bien équilibré.',
    profileData: `• Intern Business Development — Fintech Berlin (3 mois)\n  Prospection B2B, +18 nouveaux comptes en 3 mois\n• Semestre Erasmus — Freie Universität Berlin\n• Anglais B2, Allemand B1, Espagnol courant\n• Licence Gestion mention Bien`,
    aiEmailDraft: '',
    criteriaScores: {},
  },
]

const SEED_CAMPAIGNS: Campaign[] = [
  {
    id: 'camp-mmi-2025',
    name: 'Master en Management de l\'Innovation',
    status: 'active',
    createdAt: '2025-03-01T08:00:00.000Z',
    totalCandidates: 10,
    processedCandidates: 9,
    capacity: 42,
    startDate: '2025-03-01',
    endDate: '2025-06-30',
    schoolCriteria: MMI_CRITERIA,
    candidates: SEED_CANDIDATES,
  },
  {
    id: 'camp-bba-2025',
    name: 'Bachelor Business Administration',
    status: 'active',
    createdAt: '2025-03-15T09:00:00.000Z',
    totalCandidates: 3,
    processedCandidates: 0,
    capacity: 60,
    startDate: '2025-03-15',
    endDate: '2025-07-15',
    schoolCriteria: `Formation visée : Bachelor Business Administration
Date de début : 15 septembre 2025
Date de clôture : 15 juillet 2025
Places : 60
Prérequis académiques/techniques : Bac général ou technologique, anglais B1 minimum
Compétences prioritaires : Curiosité intellectuelle, esprit d'équipe, communication
Ton de communication : Dynamique et encourageant`,
    candidates: [
      {
        id: 'bba-1', name: 'Emma Fournier', email: 'emma.fournier@email.com',
        score: 0, status: 'pending', userValidation: 'pending',
        applicationDate: '2025-04-20T10:00:00.000Z',
        aiAnalysis: '', profileData: '• Bac Général mention Bien\n• Erasmus prévu à Dublin\n• Anglais B2, Espagnol A2', aiEmailDraft: '', criteriaScores: {},
      },
      {
        id: 'bba-2', name: 'Maxime Giraud', email: 'maxime.giraud@email.com',
        score: 0, status: 'pending', userValidation: 'pending',
        applicationDate: '2025-04-21T14:30:00.000Z',
        aiAnalysis: '', profileData: '• Bac Techno STG mention Assez Bien\n• Stage en agence de communication (1 mois)\n• Anglais B1', aiEmailDraft: '', criteriaScores: {},
      },
      {
        id: 'bba-3', name: 'Chloé Renard', email: 'chloe.renard@email.com',
        score: 0, status: 'pending', userValidation: 'pending',
        applicationDate: '2025-04-22T09:15:00.000Z',
        aiAnalysis: '', profileData: '• Bac Général mention Très Bien\n• Déléguée de classe 3 ans\n• Anglais C1 (séjour linguistique Londres)', aiEmailDraft: '', criteriaScores: {},
      },
    ],
  },
  {
    id: 'camp-msc-data-2026',
    name: 'MSc Data & Intelligence Artificielle',
    status: 'upcoming',
    createdAt: '2025-04-01T10:00:00.000Z',
    totalCandidates: 0,
    processedCandidates: 0,
    capacity: 30,
    startDate: '2025-09-01',
    endDate: '2025-08-31',
    schoolCriteria: `Formation visée : MSc Data & Intelligence Artificielle pour le Management
Date de début : 01 septembre 2025
Date de clôture : 31 août 2025
Places : 30
Prérequis académiques/techniques : Bac+4 minimum, bases en statistiques ou programmation appréciées
Compétences prioritaires : Analyse de données, Python ou R, curiosité technologique, anglais C1
Ton de communication : Rigoureux et bienveillant`,
    candidates: [],
  },
  {
    id: 'camp-mba-exec-2024',
    name: 'MBA Executive Part-time',
    status: 'closed',
    createdAt: '2024-10-01T08:00:00.000Z',
    totalCandidates: 8,
    processedCandidates: 8,
    capacity: 25,
    startDate: '2024-10-01',
    endDate: '2025-02-28',
    schoolCriteria: `Formation visée : MBA Executive Part-time
Date de début : 01 octobre 2024
Date de clôture : 28 février 2025
Places : 25
Prérequis académiques/techniques : Bac+5 et 5 ans d'expérience professionnelle minimum
Compétences prioritaires : Leadership, gestion d'équipe, vision stratégique, anglais B2
Ton de communication : Formel et respectueux`,
    candidates: [
      { id: 'mba-1', name: 'Isabelle Fontaine', email: 'i.fontaine@email.com', score: 92, status: 'accepted', userValidation: 'sent', applicationDate: '2024-11-10T09:00:00.000Z', aiAnalysis: 'Directrice marketing 8 ans, MBA justifié par une prise de poste DG.', profileData: '• Directrice Marketing — Groupe Sanofi (8 ans)\n• Anglais C1, Espagnol professionnel\n• Projet : prise de poste Directrice Générale filiale', aiEmailDraft: '', criteriaScores: {} },
      { id: 'mba-2', name: 'Frédéric Morin', email: 'f.morin@email.com', score: 88, status: 'accepted', userValidation: 'sent', applicationDate: '2024-11-12T14:00:00.000Z', aiAnalysis: 'Directeur technique avec besoin fort de compétences business.', profileData: '• CTO — Scale-up logistique (6 ans)\n• Anglais B2, certifié PMP\n• Projet : transition vers rôle Chief Product Officer', aiEmailDraft: '', criteriaScores: {} },
      { id: 'mba-3', name: 'Nathalie Chevalier', email: 'n.chevalier@email.com', score: 85, status: 'accepted', userValidation: 'sent', applicationDate: '2024-11-08T11:30:00.000Z', aiAnalysis: 'Responsable RH senior, candidature pour évoluer vers DRH Groupe.', profileData: '• DRH — Groupe retail 1 200 salariés (7 ans)\n• Anglais B2, Coach certifiée ICF\n• Projet : DRH Groupe international', aiEmailDraft: '', criteriaScores: {} },
    ],
  },
]

function App() {
  // Navigation
  const [currentView, setCurrentView] = useState<"dashboard" | "funnel" | "school_landing" | "landing" | "forms" | "onboarding">(() => {
    const path = window.location.pathname;
    const qp = new URLSearchParams(window.location.search);
    const view = qp.get('view');
    if (path.endsWith('/school') || view === 'school') return "school_landing";
    if (path.endsWith('/app')    || view === 'app')    return "dashboard";
    return "landing";
  });
  const [currentStep, setCurrentStep] = useState(1);
  const [furthestStep, setFurthestStep] = useState(1);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Data — auto-migrate to seed data on version change
  const [campaigns, setCampaigns] = useState<Campaign[]>(() => {
    try {
      if (localStorage.getItem('lighthouse_version') !== DEMO_VERSION) {
        localStorage.removeItem('lighthouse_campaigns');
        localStorage.removeItem('lighthouse_deleted_campaigns');
        localStorage.setItem('lighthouse_version', DEMO_VERSION);
        return SEED_CAMPAIGNS;
      }
      const saved = localStorage.getItem('lighthouse_campaigns');
      return saved ? JSON.parse(saved) : SEED_CAMPAIGNS;
    } catch {
      return SEED_CAMPAIGNS;
    }
  });
  const [activeCampaignId, setActiveCampaignId] = useState<string | null>(null);

  const [deletedCampaigns, setDeletedCampaigns] = useState<Campaign[]>(() => {
    try {
      const saved = localStorage.getItem('lighthouse_deleted_campaigns');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [forms, setForms] = useState<Form[]>(() => {
    try {
      const saved = localStorage.getItem('lighthouse_forms');
      return saved ? JSON.parse(saved) : [{
        id: 'default',
        name: 'Formulaire Standard',
        createdAt: new Date().toISOString(),
        fields: [
          { id: 'firstName', label: 'Prénom', type: 'text', required: true },
          { id: 'lastName', label: 'Nom', type: 'text', required: true },
          { id: 'email', label: 'Email', type: 'email', required: true },
          { id: 'dossier', label: 'Dossier académique & Lettre de motivation', type: 'textarea', required: true }
        ]
      }];
    } catch {
      return [];
    }
  });

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem('lighthouse_campaigns', JSON.stringify(campaigns));
  }, [campaigns]);

  useEffect(() => {
    localStorage.setItem('lighthouse_forms', JSON.stringify(forms));
  }, [forms]);

  useEffect(() => {
    localStorage.setItem('lighthouse_deleted_campaigns', JSON.stringify(deletedCampaigns));
  }, [deletedCampaigns]);

  // Sync state across tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'lighthouse_campaigns' && e.newValue) {
        setCampaigns(JSON.parse(e.newValue));
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // App State (Temporary state for the active funnel)
  const [schoolCriteria, setSchoolCriteria] = useState("");
  const [candidates, setCandidates] = useState<Candidate[]>([]);

  // Helpers Navigation Funnel
  const nextStep = () => {
    setCurrentStep(prev => {
      const next = Math.min(prev + 1, 6);
      setFurthestStep(f => Math.max(f, next));
      return next;
    });
  };
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  // --- External Application Receiver ---
  const handleNewApplication = (campaignId: string, candidateData: any) => {
    setCampaigns(prev => {
      let targetId = campaignId;
      // Si l'ID n'est pas trouvé ou vide, on prend la première campagne existante par défaut
      if (!prev.find(c => c.id === targetId) && prev.length > 0) {
        targetId = prev[0].id;
      }

      return prev.map(camp => {
        if (camp.id === targetId) {
          const newCandidate: Candidate = {
            id: Date.now().toString() + Math.random().toString(36).substring(2, 7),
            name: `${candidateData.firstName} ${candidateData.lastName}`.trim(),
            email: candidateData.email,
            profileData: candidateData.dossier,
            applicationDate: new Date().toISOString(),
            status: 'pending',
            aiAnalysis: '',
            score: 0,
            criteriaScores: {},
            userValidation: 'pending'
          };
          
          return {
            ...camp,
            candidates: [...(camp.candidates || []), newCandidate],
            totalCandidates: (camp.totalCandidates || 0) + 1
          };
        }
        return camp;
      });
    });
  };

  // --- Actions Dashboard ---
  const handleCreateNewCampaign = () => {
    // 1. On nettoie le state temporaire
    setSchoolCriteria("");
    setCandidates([]);
    setCurrentStep(1);
    setFurthestStep(1);
    
    // 2. On crée une coquille vide de campagne
    const newCampaign: Campaign = {
      id: Date.now().toString(),
      name: "Nouvelle Campagne",
      createdAt: new Date().toISOString(),
      status: "upcoming", // Nouveau statut par défaut
      totalCandidates: 0,
      processedCandidates: 0,
    };
    
    setCampaigns([newCampaign, ...campaigns]);
    setActiveCampaignId(newCampaign.id);
    setCurrentView("funnel");
  };

  const handleUpdateCampaignStatus = (id: string, newStatus: Campaign['status']) => {
    setCampaigns(prev => prev.map(c => c.id === id ? { ...c, status: newStatus } : c));
  };

  const handleLinkFormToCampaign = (campaignId: string, formId: string) => {
    setCampaigns(prev =>
      prev.map(c => (c.id === campaignId ? { ...c, linkedFormId: formId } : c))
    );
  };

  const handleRenameCampaign = (id: string, newName: string) => {
    setCampaigns(prev => prev.map(c => c.id === id ? { ...c, name: newName } : c));
  };

  const handleSelectCampaign = (id: string) => {
    const camp = campaigns.find(c => c.id === id);
    if (!camp) return;

    // On recharge la data dans le funnel
    setSchoolCriteria(camp.schoolCriteria || "");
    setCandidates(camp.candidates || []);
    
  // Logique de reprise : on va là où il s'était arrêté
  if (camp.candidates && camp.candidates.length > 0) {
    if (camp.processedCandidates === camp.totalCandidates) {
      setCurrentStep(6); // Bilan
      setFurthestStep(6);
    }
    else {
      setCurrentStep(4); // Sélection ou Retours
      setFurthestStep(4);
    }
  } else {
    setCurrentStep(1);
    setFurthestStep(1);
  }

    setActiveCampaignId(camp.id);
    setCurrentView("funnel");
  };

  // --- Synchro Active Campaign <-> App State ---
  useEffect(() => {
    if (!activeCampaignId) return;

    setCampaigns(prev => prev.map(camp => {
      if (camp.id === activeCampaignId) {
        // Robust extraction logic matching Step1Criteria
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

        const newName = extractField(schoolCriteria, "Formation visée :", ["\nDate de début :", "\nDate de clôture :", "\nPlaces :", "\nPrérequis académiques/techniques :"]) || camp.name || "Nouvelle Campagne";
        const startDate = extractField(schoolCriteria, "Date de début :", ["\nDate de clôture :", "\nPlaces :", "\nPrérequis académiques/techniques :"]);
        const endDate = extractField(schoolCriteria, "Date de clôture :", ["\nPlaces :", "\nPrérequis académiques/techniques :"]);
        const capacityStr = extractField(schoolCriteria, "Places :", ["\nPrérequis académiques/techniques :"]);
        const parsedCapacity = parseInt(capacityStr, 10);
        const capacity = isNaN(parsedCapacity) ? undefined : parsedCapacity;

        // Auto-calcul du statut basé sur les dates
        let newStatus = camp.status;
        
        const parseDateSafe = (dStr: string): Date | null => {
          if (!dStr) return null;
          const digits = dStr.replace(/\D/g, "");
          if (digits.length === 8) {
            const parsed = new Date(
              `${digits.slice(4, 8)}-${digits.slice(2, 4)}-${digits.slice(0, 2)}`
            );
            return isNaN(parsed.getTime()) ? null : parsed;
          }
          const d = dStr.trim();
          if (d.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
            const [day, month, year] = d.split("/");
            const parsed = new Date(`${year}-${month}-${day}`);
            return isNaN(parsed.getTime()) ? null : parsed;
          }
          return null;
        };

        const start = parseDateSafe(startDate);
        const end = parseDateSafe(endDate);
        const now = new Date();
        now.setHours(0, 0, 0, 0); // On compare uniquement les jours
        
        if (start || end) {
          if (start) start.setHours(0, 0, 0, 0);
          if (end) end.setHours(23, 59, 59, 999);
          
          if (start && end) {
            if (now < start) newStatus = 'upcoming';
            else if (now > end) newStatus = 'closed';
            else newStatus = 'active';
          } else if (start) {
            if (now < start) newStatus = 'upcoming';
            else newStatus = 'active';
          } else if (end) {
            if (now > end) newStatus = 'closed';
            else newStatus = 'active';
          }
        }
        // Si aucune date n'est définie, on garde le statut actuel (ex: défini par drag & drop)

        return {
          ...camp,
          name: newName,
          totalCandidates: candidates.length,
          processedCandidates: candidates.filter(c => c.userValidation === 'sent').length,
          candidates: candidates,
          schoolCriteria: schoolCriteria,
          startDate: startDate || camp.startDate,
          endDate: endDate || camp.endDate,
          capacity: capacity || camp.capacity, // Ajout du nombre de places
          status: newStatus, // On met à jour le statut global !
        };
      }
      return camp;
    }));
  }, [schoolCriteria, candidates, activeCampaignId]);

  const handleDeleteCampaign = (id: string) => {
    const target = campaigns.find(c => c.id === id);
    if (target) {
      setDeletedCampaigns(d => [...d, { ...target, deletedAt: new Date().toISOString() }]);
    }
    setCampaigns(prev => prev.filter(c => c.id !== id));
  };

  const handleRestoreCampaign = (id: string) => {
    setDeletedCampaigns(prev => {
      const target = prev.find(c => c.id === id);
      if (target) {
        const { deletedAt: _deletedAt, ...restored } = target;
        setCampaigns(c => [restored, ...c]);
      }
      return prev.filter(c => c.id !== id);
    });
  };

  const handleEmptyTrash = () => {
    setDeletedCampaigns([]);
  };

  const handleBackToDashboard = () => {
    const activeCamp = campaigns.find(c => c.id === activeCampaignId);
    const isBlank = !activeCamp ||
      ((!activeCamp.candidates || activeCamp.candidates.length === 0) && !activeCamp.schoolCriteria);

    if (isBlank) {
      setCampaigns(prev => prev.filter(c => c.id !== activeCampaignId));
    } else {
      showToast("Brouillon sauvegardé", "success");
    }

    setCurrentView("dashboard");
    setActiveCampaignId(null);
  };


  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (currentView === "school_landing") {
    return <SchoolLanding onApply={handleNewApplication} />;
  }

  if (currentView === "onboarding") {
    return <Onboarding onComplete={() => {
      window.history.pushState({}, '', '/app');
      setCurrentView("dashboard");
    }} />;
  }

  if (currentView === "landing") {
    return <LandingPage onGetStarted={() => {
      setCurrentView("onboarding");
    }} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-foreground selection:bg-brand-purple/30 selection:text-brand-dark flex flex-col font-sans">
      <header className="bg-white/80 backdrop-blur-md border-b border-border py-4 px-8 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center space-x-8">
          <div 
            className="flex items-center space-x-3 cursor-pointer group" 
            onClick={handleBackToDashboard}
          >
            <img src={`${import.meta.env.BASE_URL}logo.png`} alt="Lighthouse Logo" className="h-10 w-auto object-contain group-hover:scale-105 transition-transform" />
            <h1 className="text-xl font-bold tracking-tight font-serif">Lighthouse</h1>
          </div>

          {(currentView === "dashboard" || currentView === "forms") && (
            <nav className="flex space-x-2">
              <button 
                onClick={() => setCurrentView("dashboard")}
                className={`text-sm font-semibold px-4 py-2 rounded-full transition-colors ${currentView === "dashboard" ? "bg-slate-900 text-white shadow-sm" : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"}`}
              >
                Campagnes
              </button>
              <button 
                onClick={() => setCurrentView("forms")}
                className={`text-sm font-semibold px-4 py-2 rounded-full transition-colors ${currentView === "forms" ? "bg-slate-900 text-white shadow-sm" : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"}`}
              >
                Formulaires
              </button>
            </nav>
          )}
        </div>
        <div className="flex items-center gap-5 text-[13px] font-medium text-muted-foreground">
          {/* Team presence */}
          <div className="flex items-center gap-2.5">
            <div className="flex -space-x-2">
              {[
                { initials: "MT", color: "bg-purple-500", name: "Marie T." },
                { initials: "TD", color: "bg-blue-500",   name: "Thomas D." },
                { initials: "JR", color: "bg-emerald-500", name: "Julie R." },
              ].map(m => (
                <div
                  key={m.initials}
                  title={`${m.name} — en ligne`}
                  className={`w-7 h-7 ${m.color} text-white rounded-full flex items-center justify-center text-[10px] font-bold ring-2 ring-white cursor-default select-none`}
                >
                  {m.initials}
                </div>
              ))}
            </div>
            <span className="text-xs text-slate-500 font-medium hidden sm:block">3 en ligne</span>
          </div>
          <div className="w-px h-4 bg-slate-200" />
          <span className="flex items-center"><div className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></div>Système Prêt</span>
          <div className="w-px h-4 bg-slate-200" />
          {/* User avatar + menu */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setShowUserMenu(v => !v)}
              className="w-8 h-8 rounded-full bg-slate-900 text-white text-[11px] font-bold flex items-center justify-center ring-2 ring-white hover:ring-slate-300 transition-all select-none"
              title="Mon compte"
            >
              GA
            </button>
            {showUserMenu && (
              <div className="absolute right-0 top-10 w-52 bg-white border border-slate-200 rounded-xl shadow-xl py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-4 py-2.5 border-b border-slate-100">
                  <p className="text-xs font-semibold text-slate-800">Gauthier A.</p>
                  <p className="text-[11px] text-slate-400 truncate">gadwstudio@gmail.com</p>
                </div>
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    setCurrentView("landing");
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors font-medium"
                >
                  Se déconnecter
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 py-12 px-4 w-full">
        {currentView === "forms" ? (
          <FormBuilder forms={forms} setForms={setForms} />
        ) : currentView === "dashboard" ? (
          <Dashboard
            campaigns={campaigns}
            forms={forms}
            onCreateNew={handleCreateNewCampaign}
            onSelectCampaign={handleSelectCampaign}
            onUpdateCampaignStatus={handleUpdateCampaignStatus}
            onLinkFormToCampaign={handleLinkFormToCampaign}
            onRenameCampaign={handleRenameCampaign}
            onDeleteCampaign={handleDeleteCampaign}
            deletedCampaigns={deletedCampaigns}
            onRestoreCampaign={handleRestoreCampaign}
            onEmptyTrash={handleEmptyTrash}
          />
        ) : (
          <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Bouton Retour */}
            <button 
              onClick={handleBackToDashboard}
              className="text-sm font-semibold text-slate-500 hover:text-brand-dark mb-6 flex items-center transition-colors"
            >
              ← Retour au tableau de bord
            </button>

            <Stepper currentStep={currentStep} furthestStep={furthestStep} onStepClick={setCurrentStep} />
            
            <div className="mt-8">
              {currentStep === 1 && (
                <Step1Criteria 
                  schoolCriteria={schoolCriteria}
                  setSchoolCriteria={setSchoolCriteria}
                  onNext={nextStep}
                />
              )}
              {currentStep === 2 && (
                <Step2Candidate 
                  candidates={candidates}
                  setCandidates={setCandidates}
                  onNext={nextStep}
                  onPrev={prevStep}
                />
              )}
              {currentStep === 3 && (
                <Step3Generate 
                  schoolCriteria={schoolCriteria}
                  candidates={candidates}
                  setCandidates={setCandidates}
                  onNext={nextStep}
                />
              )}
              {currentStep === 4 && (
                <Step4Selection 
                  candidates={candidates}
                  setCandidates={setCandidates}
                  capacity={campaigns.find(c => c.id === activeCampaignId)?.capacity || Infinity}
                  onNext={nextStep}
                  onPrev={prevStep}
                />
              )}
              {currentStep === 5 && (
                <Step5Response 
                  candidates={candidates}
                  setCandidates={setCandidates}
                  onPrev={prevStep}
                  onNext={nextStep}
                />
              )}
              {currentStep === 6 && (
                <Step6Bilan
                  candidates={candidates}
                  schoolCriteria={schoolCriteria}
                  onComplete={() => {
                    if (activeCampaignId) {
                      setCampaigns(prev => prev.map(c =>
                        c.id === activeCampaignId ? { ...c, status: "closed" as const } : c
                      ));
                    }
                    handleBackToDashboard();
                    setCurrentStep(1);
                  }}
                  onReset={() => {
                    handleBackToDashboard();
                    setCurrentStep(1);
                  }}
                />
              )}
            </div>
          </div>
        )}
      </main>
      <Toaster />
    </div>
  )
}

export default App

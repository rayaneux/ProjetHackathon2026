export type FormField = {
  id: string;
  label: string;
  type: 'text' | 'email' | 'textarea' | 'file' | 'url' | 'select' | 'checkboxes';
  required: boolean;
  options?: string[]; // Pour les types 'select' et 'checkboxes'
};

export type Form = {
  id: string;
  name: string;
  fields: FormField[];
  createdAt: string;
};

export type Candidate = {
  id: string;
  name: string;
  email: string;
  profileData: string;
  
  // Nouveaux champs pour le tri et la sélection
  applicationDate: string; 
  status: "pending" | "accepted" | "rejected";
  score?: number;
  aiAnalysis?: string;
  
  // Champs générés pour les refus
  aiExplanation?: string[];
  aiEmailDraft?: string;
  
  // Validation utilisateur finale (pour les emails)
  userValidation?: "approved" | "rejected" | "modified" | "pending" | "sent";

  /** Libellé import CSV / démo (aperçu étape 2) — distinct du statut d'admission */
  decision?: string;

  /** Scores détaillés par critère (généré par l'analyse IA) */
  criteriaScores?: Record<string, number>;
};

export type Campaign = {
  id: string;
  name: string;
  createdAt: string;
  status: "upcoming" | "active" | "closed";
  // Statistiques
  totalCandidates: number;
  processedCandidates: number; 
  
  // Données sauvegardées de l'étape 1
  schoolCriteria?: string;
  startDate?: string;
  endDate?: string;
  capacity?: number; // Nombre de places (nouveau)
  
  // Candidats
  candidates?: Candidate[];

  /** Formulaire d'admission lié (sélectionné depuis le tableau de bord) */
  linkedFormId?: string;

  /** Date de mise à la corbeille (ISO string) */
  deletedAt?: string;
};

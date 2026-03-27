export type Candidate = {
  id: string;
  name: string;
  email: string;
  profileData: string;
  
  // Champs générés par l'IA
  aiDecision?: "accept" | "reject" | "waitlist";
  aiScore?: number;
  aiExplanation?: string[];
  aiEmailDraft?: string;
  
  // Validation utilisateur
  userValidation?: "approved" | "rejected" | "modified" | "pending";
};

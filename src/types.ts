export type Candidate = {
  id: string;
  name: string;
  email: string;
  profileData: string;
  
  // Décision importée de l'école
  decision: "accept" | "reject" | "waitlist" | "unknown";
  
  // Champs générés par l'IA
  aiExplanation?: string[];
  aiEmailDraft?: string;
  
  // Validation utilisateur
  userValidation?: "approved" | "rejected" | "modified" | "pending" | "sent";
};

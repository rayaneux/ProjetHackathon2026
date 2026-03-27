import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

export type Criteria = {
  schoolName: string;
  minGrade: number;
  requiresMotivationLetter: boolean;
  requiresExperiences: boolean;
  schoolValues: string;
};

export type Candidate = {
  firstName: string;
  lastName: string;
  grade: number;
  hasMotivationLetter: boolean;
  experiences: string;
};

export type GeneratedResponse = {
  decision: "accepted" | "rejected";
  message: string;
};

type WorkflowState = {
  currentStep: number;
  criteria: Criteria | null;
  candidate: Candidate | null;
  generatedResponse: GeneratedResponse | null;
  nextStep: () => void;
  prevStep: () => void;
  setCriteria: (c: Criteria) => void;
  setCandidate: (c: Candidate) => void;
  setGeneratedResponse: (r: GeneratedResponse) => void;
};

const WorkflowContext = createContext<WorkflowState | null>(null);

export function WorkflowProvider({ children }: { children: ReactNode }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [criteria, setCriteria] = useState<Criteria | null>(null);
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [generatedResponse, setGeneratedResponse] = useState<GeneratedResponse | null>(null);

  const nextStep = () => setCurrentStep((s) => Math.min(s + 1, 4));
  const prevStep = () => setCurrentStep((s) => Math.max(s - 1, 1));

  return (
    <WorkflowContext.Provider
      value={{ currentStep, criteria, candidate, generatedResponse, nextStep, prevStep, setCriteria, setCandidate, setGeneratedResponse }}
    >
      {children}
    </WorkflowContext.Provider>
  );
}

export function useWorkflow() {
  const ctx = useContext(WorkflowContext);
  if (!ctx) throw new Error("useWorkflow must be used inside WorkflowProvider");
  return ctx;
}

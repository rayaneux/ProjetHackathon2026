import { Check } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type StepperProps = {
  currentStep: number;
};

export function Stepper({ currentStep }: StepperProps) {
  const steps = [
    { num: 1, label: "Critères" },
    { num: 2, label: "Candidat" },
    { num: 3, label: "Génération" },
    { num: 4, label: "Réponse" },
  ];

  return (
    <div className="w-full py-10 mb-6">
      <div className="flex items-center justify-between w-full max-w-3xl mx-auto px-4 relative">
        {/* Ligne de fond */}
        <div className="absolute top-1/2 left-4 right-4 h-[2px] bg-slate-200 -z-10 -translate-y-1/2" />
        
        {steps.map((step, index) => {
          const isCompleted = currentStep > step.num;
          const isCurrent = currentStep === step.num;

          return (
            <div key={step.num} className="flex flex-col items-center relative z-10">
              <div
                className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center text-sm font-semibold border-[3px] transition-all duration-300 leading-none shadow-sm",
                  isCompleted
                    ? "border-primary bg-primary text-white"
                    : isCurrent
                    ? "border-primary bg-white text-primary scale-110 shadow-md"
                    : "border-slate-200 bg-white text-slate-400"
                )}
              >
                {isCompleted ? <Check className="w-6 h-6" /> : <span className="pt-0.5">{step.num}</span>}
              </div>
              <span
                className={cn(
                  "absolute -bottom-8 whitespace-nowrap text-sm font-medium transition-colors",
                  isCurrent ? "text-primary" : isCompleted ? "text-slate-600" : "text-slate-400"
                )}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

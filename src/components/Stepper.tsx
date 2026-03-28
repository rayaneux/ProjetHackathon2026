import { Check } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type StepperProps = {
  currentStep: number;
  furthestStep: number;
  onStepClick?: (step: number) => void;
};

export function Stepper({ currentStep, furthestStep, onStepClick }: StepperProps) {
  const steps = [
    { num: 1, label: "Critères Pédagogiques" },
    { num: 2, label: "Dossiers" },
    { num: 3, label: "Analyse" },
    { num: 4, label: "Sélection" },
    { num: 5, label: "Retours" },
    { num: 6, label: "Bilan" },
  ];

  return (
    <div className="w-full py-10 mb-6">
      <div className="flex items-center justify-between w-full max-w-4xl mx-auto px-4 relative">
        {/* Ligne de fond */}
        <div className="absolute top-1/2 left-4 right-4 h-[2px] bg-slate-200 -z-10 -translate-y-1/2" />
        
        {steps.map((step) => {
          const isCurrent = currentStep === step.num;
          const isCompleted = step.num <= furthestStep && !isCurrent;
          const isClickable = step.num <= furthestStep;

          return (
            <div 
              key={step.num} 
              className={cn(
                "flex flex-col items-center relative z-10",
                isClickable ? "cursor-pointer" : ""
              )}
              onClick={() => {
                if (isClickable && onStepClick) {
                  onStepClick(step.num);
                }
              }}
            >
              <div
                className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center text-sm font-semibold border-[3px] transition-all duration-300 leading-none shadow-sm",
                  isCompleted
                    ? "border-primary bg-primary text-white hover:bg-primary/90"
                    : isCurrent
                    ? "border-primary bg-white text-primary scale-110 shadow-md"
                    : "border-slate-200 bg-white text-slate-400"
                )}
              >
                {isCompleted ? <Check className="w-6 h-6" /> : <span>{step.num}</span>}
              </div>
              <span
                className={cn(
                  "absolute -bottom-8 whitespace-nowrap text-sm font-medium transition-colors",
                  isCurrent ? "text-primary" : isCompleted ? "text-slate-600 hover:text-slate-900" : "text-slate-400"
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

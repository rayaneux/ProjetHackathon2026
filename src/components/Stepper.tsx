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
    <div className="w-full py-6">
      <div className="flex items-center justify-between w-full max-w-3xl mx-auto px-4">
        {steps.map((step, index) => {
          const isCompleted = currentStep > step.num;
          const isCurrent = currentStep === step.num;

          return (
            <div key={step.num} className="flex flex-col items-center relative flex-1">
              {/* Connector line */}
              {index !== 0 && (
                <div
                  className={cn(
                    "absolute top-5 h-[2px] w-full -left-1/2 -z-10",
                    isCompleted || isCurrent ? "bg-slate-900" : "bg-slate-200"
                  )}
                />
              )}

              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold border-2 bg-white transition-colors duration-300 leading-none pt-0.5",
                  isCompleted
                    ? "border-slate-900 bg-slate-900 text-white"
                    : isCurrent
                    ? "border-slate-900 text-slate-900"
                    : "border-slate-200 text-slate-400"
                )}
              >
                {isCompleted ? <Check className="w-5 h-5 -mt-0.5" /> : step.num}
              </div>
              <span
                className={cn(
                  "mt-3 text-xs md:text-sm font-medium",
                  isCurrent || isCompleted ? "text-slate-900" : "text-slate-400"
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

import { useState } from 'react'
import { Stepper } from './components/Stepper'
import Step1Criteria from './pages/Step1Criteria'
import Step2Candidate from './pages/Step2Candidate'
import Step3Generate from './pages/Step3Generate'
import Step4Response from './pages/Step4Response'
import type { Candidate } from './types'

function App() {
  const [currentStep, setCurrentStep] = useState(1);
  
  // App State
  const [schoolCriteria, setSchoolCriteria] = useState("");
  const [candidates, setCandidates] = useState<Candidate[]>([]);

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 4));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="bg-white border-b border-slate-200 py-4 px-6 flex items-center justify-between">
        <h1 className="text-xl font-bold tracking-tight">Plateforme d'Admission IA</h1>
        <div className="text-sm text-slate-500">Prototype Hackathon</div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <Stepper currentStep={currentStep} />
        
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
            <Step4Response 
              candidates={candidates}
              setCandidates={setCandidates}
              onPrev={prevStep}
              onReset={() => {
                setCandidates([]);
                setCurrentStep(2);
              }}
            />
          )}
        </div>
      </main>
    </div>
  )
}

export default App

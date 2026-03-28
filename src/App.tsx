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
    <div className="min-h-screen bg-background text-foreground selection:bg-brand-purple/30 selection:text-brand-dark">
      <header className="bg-white/80 backdrop-blur-md border-b border-border py-4 px-8 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center space-x-3">
          <img src="/logo.png" alt="Lighthouse Logo" className="h-8 w-auto object-contain" />
          <h1 className="text-xl font-bold tracking-tight font-serif">Lighthouse</h1>
        </div>
        <div className="flex items-center space-x-4 text-[13px] font-medium text-muted-foreground">
          <span className="flex items-center"><div className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></div>Système Prêt</span>
          <span className="hidden sm:inline-block px-3 py-1 bg-white border border-border rounded-full shadow-sm">Prototype Hackathon</span>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-12">
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

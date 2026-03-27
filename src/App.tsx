import { Stepper } from './components/Stepper'
import Step1Criteria from './pages/Step1Criteria'
// import Step2Candidate from './pages/Step2Candidate'
// import Step3Generate from './pages/Step3Generate'
// import Step4Response from './pages/Step4Response'

function App() {
  // @TODO Claude Code (LLM 2) : 
  // Gérer la logique de navigation et d'état entre les étapes (currentStep)
  // en utilisant un router (react-router-dom) ou un simple state.
  const mockCurrentStep = 1;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <header className="bg-white border-b border-slate-200 py-4 px-6">
        <h1 className="text-xl font-bold tracking-tight">Plateforme d'Admission IA</h1>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <Stepper currentStep={mockCurrentStep} />
        
        <div className="mt-8">
          {/* L'affichage conditionnel des composants pages est laissé à l'autre LLM */}
          <Step1Criteria />
        </div>
      </main>
    </div>
  )
}

export default App

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, ChevronLeft, Check } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

export default function MultiStepForm({ steps, onSubmit, initialData = {} }) {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState(initialData)
  const [direction, setDirection] = useState(1)
  const { theme } = useTheme()

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const next = () => {
    if (currentStep < steps.length - 1) {
      setDirection(1)
      setCurrentStep(prev => prev + 1)
    } else {
      onSubmit(formData)
    }
  }

  const prev = () => {
    if (currentStep > 0) {
      setDirection(-1)
      setCurrentStep(prev => prev - 1)
    }
  }

  const slideVariants = {
    enter: (dir) => ({ x: dir > 0 ? 300 : -300, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir) => ({ x: dir > 0 ? -300 : 300, opacity: 0 }),
  }

  const currentStepConfig = steps[currentStep]
  const progress = ((currentStep + 1) / steps.length) * 100

  return (
    <div className="w-full">
      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Step {currentStep + 1} of {steps.length}
          </span>
          <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            {Math.round(progress)}%
          </span>
        </div>
        <div className={`h-2 rounded-full overflow-hidden ${theme === 'dark' ? 'bg-[#1a1a1a]' : 'bg-gray-200'}`}>
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 to-teal-500"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Step indicators */}
      <div className="flex items-center justify-between mb-8">
        {steps.map((step, idx) => (
          <div key={idx} className="flex items-center">
            <motion.div
              animate={{
                scale: idx === currentStep ? 1.1 : 1,
                backgroundColor: idx < currentStep ? '#14b8a6' : idx === currentStep ? '#2563eb' : theme === 'dark' ? '#1a1a1a' : '#e5e7eb',
              }}
              className="w-10 h-10 rounded-full flex items-center justify-center border-2"
              style={{ 
                borderColor: idx < currentStep ? '#14b8a6' : idx === currentStep ? '#2563eb' : theme === 'dark' ? '#2a2a2a' : '#d1d5db' 
              }}
            >
              {idx < currentStep ? (
                <Check size={18} className="text-white" />
              ) : (
                <span className={`text-sm font-bold ${idx === currentStep ? 'text-white' : theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`}>
                  {idx + 1}
                </span>
              )}
            </motion.div>
            {idx < steps.length - 1 && (
              <div className={`w-8 h-0.5 mx-1 ${idx < currentStep ? 'bg-teal-500' : theme === 'dark' ? 'bg-[#2a2a2a]' : 'bg-gray-300'}`} />
            )}
          </div>
        ))}
      </div>

      {/* Step content */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={currentStep}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.3 }}
        >
          {currentStepConfig.render({ formData, updateField })}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex justify-between mt-8 pt-6 border-t" style={{ borderColor: theme === 'dark' ? '#1f1f1f' : '#e5e7eb' }}>
        <button
          onClick={prev}
          disabled={currentStep === 0}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl transition ${
            currentStep === 0 
              ? 'opacity-0 pointer-events-none' 
              : theme === 'dark'
              ? 'text-gray-400 hover:text-white hover:bg-white/5'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          <ChevronLeft size={16} /> Back
        </button>
        <button
          onClick={next}
          className="flex items-center gap-2 px-7 py-3 bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-500 hover:to-teal-500 rounded-xl font-semibold text-white transition shadow-lg shadow-blue-600/20"
        >
          {currentStep === steps.length - 1 ? 'Submit' : 'Next'} <ChevronRight size={16} />
        </button>
      </div>
    </div>
  )
}

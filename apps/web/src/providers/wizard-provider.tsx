'use client';

import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { useTelegram } from './telegram-provider';

interface WizardStep {
  id: number;
  label: string;
  description?: string;
}

const WIZARD_STEPS: WizardStep[] = [
  { id: 1, label: 'Kateqoriya', description: 'Dəvət növünü seçin' },
  { id: 2, label: 'Məlumat', description: 'Məlumatları daxil edin' },
  { id: 3, label: 'Şablon', description: 'Dizayn seçin' },
  { id: 4, label: 'Ön baxış', description: 'Nəticəyə baxın' },
  { id: 5, label: 'Düzəliş', description: 'Fərdiləşdirin' },
  { id: 6, label: 'Yarat', description: 'Kartı yaradın' },
  { id: 7, label: 'Endir', description: 'Yükləyin' },
];

interface WizardData {
  categoryId?: string;
  templateId?: string;
  title?: string;
  description?: string;
  date?: string;
  time?: string;
  location?: string;
  address?: string;
  hostName?: string;
  guestName?: string;
  phone?: string;
  email?: string;
  dressCode?: string;
  additionalInfo?: string;
  [key: string]: unknown;
}

interface WizardContextValue {
  currentStep: number;
  steps: WizardStep[];
  data: WizardData;
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  updateData: (data: Partial<WizardData>) => void;
  isFirstStep: boolean;
  isLastStep: boolean;
  totalSteps: number;
}

const WizardContext = createContext<WizardContextValue | undefined>(undefined);

export function WizardProvider({ children }: { children: React.ReactNode }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<WizardData>({});
  const { hapticFeedback } = useTelegram();

  const setStep = useCallback((step: number) => {
    if (step >= 1 && step <= WIZARD_STEPS.length) {
      setCurrentStep(step);
      hapticFeedback();
    }
  }, [hapticFeedback]);

  const nextStep = useCallback(() => {
    setCurrentStep((prev) => Math.min(prev + 1, WIZARD_STEPS.length));
    hapticFeedback();
  }, [hapticFeedback]);

  const prevStep = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    hapticFeedback();
  }, [hapticFeedback]);

  const updateData = useCallback((newData: Partial<WizardData>) => {
    setData((prev) => ({ ...prev, ...newData }));
  }, []);

  const value = useMemo<WizardContextValue>(() => ({
    currentStep,
    steps: WIZARD_STEPS,
    data,
    setStep,
    nextStep,
    prevStep,
    updateData,
    isFirstStep: currentStep === 1,
    isLastStep: currentStep === WIZARD_STEPS.length,
    totalSteps: WIZARD_STEPS.length,
  }), [currentStep, data, setStep, nextStep, prevStep, updateData]);

  return (
    <WizardContext.Provider value={value}>
      {children}
    </WizardContext.Provider>
  );
}

export function useWizard() {
  const ctx = useContext(WizardContext);
  if (!ctx) throw new Error('useWizard must be used within WizardProvider');
  return ctx;
}

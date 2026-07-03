'use client';

import { useEffect, useRef } from 'react';
import { useTelegram } from '@/providers/telegram-provider';
import { useAppStore } from '@/store/use-app-store';
import { StepIndicator } from '@invitely/ui';
import { AnimatedContainer } from '@invitely/ui';
import { StepCategory } from './steps/step-category';
import { StepInformation } from './steps/step-information';
import { StepTemplate } from './steps/step-template';
import { StepPreview } from './steps/step-preview';
import { StepCustomize } from './steps/step-customize';
import { StepGenerate } from './steps/step-generate';
import { StepDownload } from './steps/step-download';

const steps = [
  { id: 1, label: 'Kateqoriya' },
  { id: 2, label: 'Məlumat' },
  { id: 3, label: 'Şablon' },
  { id: 4, label: 'Ön baxış' },
  { id: 5, label: 'Düzəliş' },
  { id: 6, label: 'Yarat' },
  { id: 7, label: 'Endir' },
];

const stepComponents: Record<number, React.FC> = {
  1: StepCategory,
  2: StepInformation,
  3: StepTemplate,
  4: StepPreview,
  5: StepCustomize,
  6: StepGenerate,
  7: StepDownload,
};

export function WizardPage() {
  const { currentStep, nextStep, prevStep, isGenerating } = useAppStore();
  const { ready, expand, webApp } = useTelegram();
  const nextRef = useRef(nextStep);
  const prevRef = useRef(prevStep);

  nextRef.current = nextStep;
  prevRef.current = prevStep;

  useEffect(() => {
    ready();
    expand();
  }, []);

  useEffect(() => {
    if (!webApp || isGenerating) return;

    const isLastStep = currentStep === 7;

    if (isLastStep) {
      webApp.MainButton.hide();
      webApp.BackButton.hide();
      return;
    }

    const isSubmitStep = currentStep === 2 || currentStep === 5 || currentStep === 6;
    if (isSubmitStep) {
      webApp.MainButton.hide();
    } else {
      webApp.MainButton.setText('Davam et');
      webApp.MainButton.show();
      webApp.MainButton.onClick(() => nextRef.current());
    }

    if (currentStep > 1) {
      webApp.BackButton.show();
      webApp.BackButton.onClick(() => prevRef.current());
    } else {
      webApp.BackButton.hide();
    }
  }, [webApp, currentStep, isGenerating]);

  const StepComponent = stepComponents[currentStep];

  return (
    <div className="flex min-h-screen flex-col p-4">
      <div className="mb-6 mt-2">
        <StepIndicator steps={steps} currentStep={currentStep} />
      </div>

      <div className="flex-1">
        <AnimatedContainer key={currentStep} animation="slideInRight">
          {StepComponent ? <StepComponent /> : null}
        </AnimatedContainer>
      </div>
    </div>
  );
}

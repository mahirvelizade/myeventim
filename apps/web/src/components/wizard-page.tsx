'use client';

import { useEffect, useRef } from 'react';
import { useTelegram } from '@/providers/telegram-provider';
import { useAppStore } from '@/store/use-app-store';
import { StepIndicator, AnimatedContainer } from '@invitely/ui';
import { StepCategory } from './steps/step-category';
import { StepInformation } from './steps/step-information';
import { StepTemplate } from './steps/step-template';
import { StepPreview } from './steps/step-preview';
import { StepCustomize } from './steps/step-customize';
import { StepGenerate } from './steps/step-generate';
import { StepDownload } from './steps/step-download';

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
    <div className="flex min-h-screen flex-col">
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm px-4 pt-3 pb-2">
        <StepIndicator currentStep={currentStep} totalSteps={7} />
      </div>

      <div className="flex-1 px-4 pb-6">
        <AnimatedContainer key={currentStep} animation="slideInRight">
          {StepComponent ? <StepComponent /> : null}
        </AnimatedContainer>
      </div>
    </div>
  );
}

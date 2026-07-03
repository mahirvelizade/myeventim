'use client';

import { useState, useCallback } from 'react';
import { useAppStore } from '@/store/use-app-store';
import { Button, Card, CardContent, Progress } from '@invitely/ui';
import { Sparkles } from 'lucide-react';

export function StepGenerate() {
  const { selectedCategory, selectedTemplate, formData, customization, setGenerating, setGenerationProgress, generationProgress, isGenerating, nextStep, addInvitation } = useAppStore();
  const [started, setStarted] = useState(false);

  const handleGenerate = useCallback(async () => {
    if (isGenerating) return;
    setStarted(true);
    setGenerating(true);
    setGenerationProgress(0);

    const interval = setInterval(() => {
      setGenerationProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval);
          return 95;
        }
        return prev + 5;
      });
    }, 100);

    // Simulate generation delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    clearInterval(interval);
    setGenerationProgress(100);

    // Save to local store
    const invitation = {
      id: `inv_${Date.now()}`,
      categoryId: selectedCategory?.id || '',
      templateId: selectedTemplate?.id || '',
      formData: formData as Record<string, string>,
      customization,
      title: (formData.title || formData.eventTitle || formData.hostName || 'Dəvət') as string,
      status: 'COMPLETED' as const,
      createdAt: new Date().toISOString(),
    };

    addInvitation(invitation);

    await new Promise((resolve) => setTimeout(resolve, 300));

    setGenerating(false);
    nextStep();
  }, [isGenerating, selectedCategory, selectedTemplate, formData, customization, setGenerating, setGenerationProgress, nextStep, addInvitation]);

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Kartı yaradın</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Dəvət kartınız hazırlanır
        </p>
      </div>

      <Card>
        <CardContent className="flex flex-col items-center gap-5 p-8">
          <div className="rounded-full bg-primary/10 p-4">
            <Sparkles className="h-8 w-8 text-primary" />
          </div>
          <p className="text-center text-sm text-muted-foreground">
            Dəvət kartınız hazırlanır. Bu bir neçə saniyə çəkə bilər.
          </p>

          {(started || isGenerating) && (
            <div className="w-full space-y-3">
              <Progress value={generationProgress} className="h-2" />
              <p className="text-center text-xs text-muted-foreground">
                {generationProgress}%
              </p>
            </div>
          )}

          {!started && (
            <Button size="lg" onClick={handleGenerate} className="w-full">
              Kartı yarat
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

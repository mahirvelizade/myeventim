'use client';

import { useState, useCallback, useRef } from 'react';
import { useAppStore } from '@/store/use-app-store';
import { Button, Card, CardContent, Progress } from '@invitely/ui';
import { Sparkles } from 'lucide-react';
import { renderInvitationToCanvas } from '@invitely/shared';
import templates from '@/schemas/templates';

export function StepGenerate() {
  const {
    selectedCategory, selectedTemplate, formData, customization,
    setGenerating, setGenerationProgress, generationProgress,
    isGenerating, nextStep, addInvitation,
  } = useAppStore();
  const [started, setStarted] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleGenerate = useCallback(async () => {
    if (isGenerating) return;
    setStarted(true);
    setGenerating(true);
    setGenerationProgress(0);

    const template = templates.find(t => t.id === selectedTemplate?.id)
    if (!template || !selectedCategory) {
      setGenerating(false);
      return;
    }

    const progressInterval = setInterval(() => {
      setGenerationProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 150);

    try {
      const canvas = canvasRef.current;
      if (!canvas) throw new Error('Canvas not available');
      canvas.width = 1200;
      canvas.height = 1680;

      await renderInvitationToCanvas(canvas, {
        categoryId: selectedCategory.id,
        templateName: template.name,
        formData: formData as Record<string, string>,
        customization,
        background: template.backgroundVariants[customization.backgroundVariant] || template.background,
        defaultText: template.defaultText,
      });

      clearInterval(progressInterval);
      setGenerationProgress(100);

      await new Promise((r) => setTimeout(r, 200));

      const invitation = {
        id: `inv_${Date.now()}`,
        categoryId: selectedCategory?.id || '',
        templateId: selectedTemplate?.id || '',
        formData: { ...formData } as Record<string, string>,
        customization,
        title: (formData.title || formData.eventTitle || formData.hostName || 'Dəvət') as string,
        status: 'COMPLETED' as const,
        createdAt: new Date().toISOString(),
      };

      addInvitation(invitation);
      setGenerating(false);
      nextStep();
    } catch {
      clearInterval(progressInterval);
      setGenerating(false);
    }
  }, [isGenerating, selectedCategory, selectedTemplate, formData, customization, setGenerating, setGenerationProgress, nextStep, addInvitation]);

  return (
    <div className="space-y-4">
      <canvas ref={canvasRef} className="hidden" />

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

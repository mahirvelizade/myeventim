'use client';

import { useMemo } from 'react';
import { useAppStore } from '@/store/use-app-store';
import templates from '@/schemas/templates';
import { Card, CardContent } from '@invitely/ui';
import { Heart } from 'lucide-react';

export function StepTemplate() {
  const { selectedCategory, selectedTemplate, selectTemplate, nextStep } = useAppStore();

  const filteredTemplates = useMemo(
    () => templates.filter((t) => t.category === selectedCategory?.id),
    [selectedCategory?.id],
  );

  const handleSelect = (tmpl: (typeof filteredTemplates)[0]) => {
    selectTemplate(tmpl as typeof selectedTemplate);
    nextStep();
  };

  if (!filteredTemplates.length) {
    return (
      <div className="pt-4 text-center">
        <p className="text-muted-foreground">Bu kateqoriya üçün hələ şablon yoxdur</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="pt-1">
        <h1 className="text-xl font-bold">Şablon seçin</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Dəvət kartınızın dizaynını seçin
        </p>
      </div>
      <div className="grid grid-cols-2 gap-2.5">
        {filteredTemplates.map((tmpl) => (
          <Card
            key={tmpl.id}
            className={`cursor-pointer overflow-hidden transition-all duration-150 active:scale-[0.97] ${
              selectedTemplate?.id === tmpl.id
                ? 'ring-2 ring-primary border-primary'
                : 'border-border/60 hover:border-primary/40'
            }`}
            onClick={() => handleSelect(tmpl)}
          >
            <div
              className="h-24 flex items-center justify-center p-3"
              style={{ background: tmpl.background }}
            >
              <div className="text-center">
                <p
                  className="text-xs font-bold truncate max-w-[120px]"
                  style={{ color: tmpl.colors.primary }}
                >
                  {tmpl.defaultText.title || tmpl.name}
                </p>
                <p
                  className="text-[10px] mt-0.5 opacity-70"
                  style={{ color: tmpl.colors.primary }}
                >
                  {tmpl.font}
                </p>
              </div>
            </div>
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold truncate">{tmpl.name}</p>
                  <p className="text-[10px] text-muted-foreground/70 truncate">{tmpl.description}</p>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); }}
                  className="ml-2 rounded-full p-1.5 text-muted-foreground/50 hover:text-rose-400 transition-colors"
                >
                  <Heart className="h-3.5 w-3.5" />
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

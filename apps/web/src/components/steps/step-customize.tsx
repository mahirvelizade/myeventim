'use client';

import { useAppStore } from '@/store/use-app-store';
import { Card, CardContent, Label, Button } from '@invitely/ui';
import { Palette, Type, AlignLeft, AlignCenter, AlignRight, Image } from 'lucide-react';

const presetColors = [
  '#e11d48', '#f43f5e', '#be185d', '#f97316', '#f59e0b',
  '#84cc16', '#22c55e', '#06b6d4', '#3b82f6', '#6366f1',
  '#8b5cf6', '#a855f7', '#d946ef', '#ec4899', '#f43f5e',
];

const fontOptions = [
  'Inter', 'Poppins', 'Playfair Display', 'Nunito', 'Quicksand',
  'Georgia', 'Lora', 'Cinzel', 'Great Vibes', 'Dancing Script',
];

export function StepCustomize() {
  const { customization, updateCustomization, selectedTemplate, nextStep, prevStep } = useAppStore();

  const availableFonts = selectedTemplate?.fonts || fontOptions;

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Fərdiləşdirin</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Rəng, şrift və üslubu dəyişin
        </p>
      </div>

      <Card>
        <CardContent className="p-5 space-y-5">
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-sm font-medium">
              <Palette className="h-4 w-4 text-muted-foreground" />
              Əsas rəng
            </Label>
            <div className="flex flex-wrap gap-2">
              {presetColors.map((color) => (
                <button
                  key={color}
                  className={`h-8 w-8 rounded-full border-2 transition-all ${
                    customization.primaryColor === color
                      ? 'border-foreground scale-110 shadow-md'
                      : 'border-transparent hover:scale-110'
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => updateCustomization({ primaryColor: color })}
                />
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-sm font-medium">
              <Palette className="h-4 w-4 text-muted-foreground" />
              İkinci dərəcəli rəng
            </Label>
            <div className="flex flex-wrap gap-2">
              {presetColors.map((color) => (
                <button
                  key={color}
                  className={`h-8 w-8 rounded-full border-2 transition-all ${
                    customization.secondaryColor === color
                      ? 'border-foreground scale-110 shadow-md'
                      : 'border-transparent hover:scale-110'
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => updateCustomization({ secondaryColor: color })}
                />
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-sm font-medium">
              <Type className="h-4 w-4 text-muted-foreground" />
              Şrift
            </Label>
            <div className="grid grid-cols-2 gap-2">
              {availableFonts.map((font) => (
                <button
                  key={font}
                  className={`rounded-xl border px-3 py-2 text-sm transition-all ${
                    customization.font === font
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-border hover:border-muted-foreground'
                  }`}
                  style={{ fontFamily: font }}
                  onClick={() => updateCustomization({ font })}
                >
                  {font}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-sm font-medium">
              Düzləndirmə
            </Label>
            <div className="flex gap-2">
              {[
                { value: 'left' as const, icon: AlignLeft, label: 'Sol' },
                { value: 'center' as const, icon: AlignCenter, label: 'Mərkəz' },
                { value: 'right' as const, icon: AlignRight, label: 'Sağ' },
              ].map((opt) => {
                const Icon = opt.icon;
                return (
                  <button
                    key={opt.value}
                    className={`flex-1 flex items-center justify-center gap-2 rounded-xl border px-3 py-2 text-sm transition-all ${
                      customization.alignment === opt.value
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-border hover:border-muted-foreground'
                    }`}
                    onClick={() => updateCustomization({ alignment: opt.value })}
                  >
                    <Icon className="h-4 w-4" />
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          {selectedTemplate && selectedTemplate.backgroundVariants.length > 1 && (
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-sm font-medium">
                <Image className="h-4 w-4 text-muted-foreground" />
                Fon variantı
              </Label>
              <div className="flex gap-2">
                {selectedTemplate.backgroundVariants.map((bg, i) => (
                  <button
                    key={i}
                    className={`h-12 flex-1 rounded-xl border-2 transition-all ${
                      customization.backgroundVariant === i
                        ? 'border-foreground'
                        : 'border-transparent'
                    }`}
                    style={{ background: bg }}
                    onClick={() => updateCustomization({ backgroundVariant: i })}
                  />
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button variant="outline" className="flex-1" onClick={prevStep}>
          Geri
        </Button>
        <Button className="flex-1" onClick={nextStep}>
          Yarat
        </Button>
      </div>
    </div>
  );
}

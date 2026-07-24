'use client';

import { useAppStore } from '@/store/use-app-store';
import { Card, CardContent, Button } from '@invitely/ui';
import { Calendar, Clock, MapPin, Phone, Mail } from 'lucide-react';

export function StepPreview() {
  const { selectedCategory, selectedTemplate, formData, customization, nextStep, prevStep } = useAppStore();

  const template = selectedTemplate;
  const isWedding = selectedCategory?.id === 'wedding' || selectedCategory?.id === 'engagement';

  return (
    <div className="space-y-3">
      <div className="pt-1">
        <h1 className="text-xl font-bold">Ön baxış</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Dəvət kartınızın görünüşü</p>
      </div>

      <Card className="overflow-hidden border-border/60">
        <div
          className="relative flex items-center justify-center p-5"
          style={{
            minHeight: 340,
            background: template
              ? template.backgroundVariants[customization.backgroundVariant] || template.background
              : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
          }}
        >
          <div
            className="w-full max-w-[260px] rounded-2xl p-5 text-center shadow-lg backdrop-blur-sm"
            style={{
              backgroundColor: `${customization.secondaryColor}15`,
              border: `1px solid ${customization.primaryColor}30`,
            }}
          >
            {template && (
              <p className="text-[10px] font-bold tracking-[0.15em] mb-2" style={{ color: customization.primaryColor }}>
                {template.defaultText.title || 'DƏVƏT'}
              </p>
            )}

            {isWedding && formData.brideName && formData.groomName && (
              <p className="text-base font-bold mb-1.5" style={{ color: customization.primaryColor, textAlign: customization.alignment }}>
                {formData.brideName} & {formData.groomName}
              </p>
            )}

            {formData.hostName && !isWedding && (
              <p className="text-base font-semibold mb-1.5" style={{ color: customization.primaryColor, textAlign: customization.alignment }}>
                {formData.hostName}
              </p>
            )}

            {formData.eventTitle && (
              <p className="text-sm font-medium mb-1" style={{ color: customization.primaryColor, textAlign: customization.alignment }}>
                {formData.eventTitle}
              </p>
            )}

            <div className="space-y-1.5 mt-3 text-xs" style={{ textAlign: customization.alignment }}>
              {formData.date && (
                <span className="flex items-center justify-center gap-1.5">
                  <Calendar className="h-3 w-3" style={{ color: customization.primaryColor }} />
                  <span className="text-foreground/70">{formData.date}</span>
                </span>
              )}
              {formData.time && (
                <span className="flex items-center justify-center gap-1.5">
                  <Clock className="h-3 w-3" style={{ color: customization.primaryColor }} />
                  <span className="text-foreground/70">{formData.time}</span>
                </span>
              )}
              {formData.location && (
                <span className="flex items-center justify-center gap-1.5">
                  <MapPin className="h-3 w-3" style={{ color: customization.primaryColor }} />
                  <span className="text-foreground/70">{formData.location}</span>
                </span>
              )}
              {formData.address && (
                <p className="text-[10px] text-muted-foreground/60 mt-0.5">{formData.address}</p>
              )}
            </div>
          </div>
        </div>
      </Card>

      <div className="flex gap-2.5 pt-1">
        <Button variant="outline" className="flex-1" onClick={prevStep}>Geri</Button>
        <Button className="flex-1" onClick={nextStep}>Fərdiləşdir</Button>
      </div>
    </div>
  );
}

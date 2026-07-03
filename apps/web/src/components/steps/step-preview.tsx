'use client';

import { useAppStore } from '@/store/use-app-store';
import { Card, CardContent, Button } from '@invitely/ui';
import { Calendar, Clock, MapPin, Phone, Mail } from 'lucide-react';

const previewIconMap: Record<string, React.FC<{ className?: string }>> = {
  date: Calendar,
  time: Clock,
  location: MapPin,
  address: MapPin,
  phone: Phone,
  email: Mail,
};

export function StepPreview() {
  const { selectedCategory, selectedTemplate, formData, customization, nextStep, prevStep } = useAppStore();

  const template = selectedTemplate;

  const isWedding = selectedCategory?.id === 'wedding' || selectedCategory?.id === 'engagement';

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Ön baxış</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Dəvət kartınızın görünüşü
        </p>
      </div>

      <Card className="overflow-hidden">
        <div
          className="relative min-h-[320px] flex items-center justify-center p-6"
          style={{
            background: template
              ? template.backgroundVariants[customization.backgroundVariant] || template.background
              : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
          }}
        >
          <div
            className="w-full max-w-xs rounded-2xl p-6 text-center shadow-lg backdrop-blur-sm"
            style={{
              backgroundColor: `${customization.secondaryColor}15`,
              border: `1px solid ${customization.primaryColor}30`,
            }}
          >
            {template && (
              <p
                className="text-xs font-bold tracking-widest mb-3"
                style={{ color: customization.primaryColor }}
              >
                {template.defaultText.title || 'DƏVƏT'}
              </p>
            )}

            {isWedding && formData.brideName && formData.groomName && (
              <p
                className="text-lg font-bold mb-2"
                style={{ color: customization.primaryColor, textAlign: customization.alignment }}
              >
                {formData.brideName} & {formData.groomName}
              </p>
            )}

            {formData.hostName && !isWedding && (
              <p
                className="text-lg font-semibold mb-2"
                style={{ color: customization.primaryColor, textAlign: customization.alignment }}
              >
                {formData.hostName}
              </p>
            )}

            {formData.eventTitle && (
              <p
                className="text-base font-medium mb-2"
                style={{ color: customization.primaryColor, textAlign: customization.alignment }}
              >
                {formData.eventTitle}
              </p>
            )}

            <div
              className="space-y-2 mt-4 text-sm"
              style={{ textAlign: customization.alignment }}
            >
              {formData.date && (
                <div className="flex items-center justify-center gap-2" style={{ justifyContent: customization.alignment === 'center' ? 'center' : customization.alignment === 'left' ? 'flex-start' : 'flex-end' }}>
                  <Calendar className="h-3.5 w-3.5" style={{ color: customization.primaryColor }} />
                  <span>{formData.date}</span>
                </div>
              )}
              {formData.time && (
                <div className="flex items-center justify-center gap-2">
                  <Clock className="h-3.5 w-3.5" style={{ color: customization.primaryColor }} />
                  <span>{formData.time}</span>
                </div>
              )}
              {formData.location && (
                <div className="flex items-center justify-center gap-2">
                  <MapPin className="h-3.5 w-3.5" style={{ color: customization.primaryColor }} />
                  <span>{formData.location}</span>
                </div>
              )}
              {formData.address && (
                <p className="text-xs text-muted-foreground">{formData.address}</p>
              )}
            </div>
          </div>
        </div>
      </Card>

      <div className="flex gap-3">
        <Button variant="outline" className="flex-1" onClick={prevStep}>
          Geri
        </Button>
        <Button className="flex-1" onClick={nextStep}>
          Fərdiləşdir
        </Button>
      </div>
    </div>
  );
}

'use client';

import { useAppStore } from '@/store/use-app-store';
import { Button, Card, CardContent } from '@invitely/ui';
import { CheckCircle, Download, Share2, RotateCcw } from 'lucide-react';

export function StepDownload() {
  const { resetWizard } = useAppStore();

  return (
    <div className="space-y-4">
      <div className="text-center">
        <div className="mb-4 inline-flex items-center justify-center">
          <div className="rounded-full bg-success/10 p-4">
            <CheckCircle className="h-12 w-12 text-success" />
          </div>
        </div>
        <h1 className="text-2xl font-bold">Kart hazırdır!</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Dəvət kartınız uğurla yaradıldı
        </p>
      </div>

      <Card>
        <CardContent className="p-6 space-y-3">
          <Button className="w-full justify-start gap-3 text-base h-12" size="lg">
            <Download className="h-5 w-5" />
            Şəkil kimi endir (PNG)
          </Button>
          <Button className="w-full justify-start gap-3 text-base h-12" size="lg" variant="outline">
            <Download className="h-5 w-5" />
            PDF kimi endir
          </Button>
          <Button className="w-full justify-start gap-3 text-base h-12" size="lg" variant="secondary">
            <Share2 className="h-5 w-5" />
            Paylaş
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <Button
            variant="ghost"
            className="w-full justify-center gap-2 text-muted-foreground"
            onClick={resetWizard}
          >
            <RotateCcw className="h-4 w-4" />
            Yeni dəvət kartı yarat
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 text-center">
          <p className="text-xs text-muted-foreground">
            Dəvətlərinizi "Dəvətlərim" bölməsində tapa bilərsiniz
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

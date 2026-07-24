'use client';

import { useCallback, useRef, useState } from 'react';
import { useAppStore } from '@/store/use-app-store';
import { Button, Card, CardContent } from '@invitely/ui';
import { CheckCircle, Download, Share2, RotateCcw } from 'lucide-react';
import { useTelegram } from '@/providers/telegram-provider';
import { renderInvitationToCanvas } from '@invitely/shared';
import templates from '@/schemas/templates';

export function StepDownload() {
  const { resetWizard, selectedCategory, selectedTemplate, formData, customization } = useAppStore();
  const { showAlert, hapticFeedback } = useTelegram();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [downloading, setDownloading] = useState<'png' | 'pdf' | null>(null);
  const [sharing, setSharing] = useState(false);
  const [success, setSuccess] = useState(false);

  const getRenderData = useCallback(() => {
    const template = templates.find(t => t.id === selectedTemplate?.id)
    if (!template || !selectedCategory) return null
    return {
      categoryId: selectedCategory.id,
      templateName: template.name,
      formData: formData as Record<string, string>,
      customization,
      background: template.backgroundVariants[customization.backgroundVariant] || template.background,
      defaultText: template.defaultText,
    }
  }, [selectedCategory, selectedTemplate, formData, customization])

  const handleDownloadPNG = useCallback(async () => {
    const data = getRenderData()
    if (!data) return
    setDownloading('png')
    try {
      const canvas = canvasRef.current
      if (!canvas) return
      canvas.width = 1200
      canvas.height = 1680
      const blob = await renderInvitationToCanvas(canvas, data)
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `invitely-${Date.now()}.png`
      a.click()
      URL.revokeObjectURL(url)
      hapticFeedback()
      setSuccess(true)
    } catch {
      showAlert('Şəkil yaratma xətası')
    } finally {
      setDownloading(null)
    }
  }, [getRenderData, showAlert, hapticFeedback])

  const handleShare = useCallback(async () => {
    const data = getRenderData()
    if (!data) return
    setSharing(true)
    try {
      const canvas = canvasRef.current
      if (!canvas) return
      canvas.width = 1200
      canvas.height = 1680
      const blob = await renderInvitationToCanvas(canvas, data)
      const file = new File([blob], `invitely-${Date.now()}.png`, { type: 'image/png' })
      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: 'Dəvət kartı',
          files: [file],
        })
      } else if (navigator.clipboard?.write) {
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob }),
        ])
        showAlert('Link kopyalandı')
      } else {
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `invitely-${Date.now()}.png`
        a.click()
        URL.revokeObjectURL(url)
      }
      hapticFeedback()
    } catch {
      showAlert('Paylaşma xətası')
    } finally {
      setSharing(null)
    }
  }, [getRenderData, showAlert, hapticFeedback])

  const handleNew = useCallback(() => {
    resetWizard()
  }, [resetWizard])

  return (
    <div className="space-y-4">
      <canvas ref={canvasRef} className="hidden" />

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
        {success && (
          <p className="mt-2 text-xs text-success">Kart yaddaşa endirildi ✓</p>
        )}
      </div>

      <Card>
        <CardContent className="p-6 space-y-3">
          <Button
            className="w-full justify-start gap-3 text-base h-12"
            size="lg"
            onClick={handleDownloadPNG}
            disabled={downloading === 'png'}
          >
            <Download className="h-5 w-5" />
            {downloading === 'png' ? 'Hazırlanır...' : 'Şəkil kimi endir (PNG)'}
          </Button>
          <Button
            className="w-full justify-start gap-3 text-base h-12"
            size="lg"
            variant="outline"
            disabled={downloading === 'pdf'}
          >
            <Download className="h-5 w-5" />
            PDF kimi endir
          </Button>
          <Button
            className="w-full justify-start gap-3 text-base h-12"
            size="lg"
            variant="secondary"
            onClick={handleShare}
            disabled={sharing}
          >
            <Share2 className="h-5 w-5" />
            {sharing ? 'Paylaşılır...' : 'Paylaş'}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <Button
            variant="ghost"
            className="w-full justify-center gap-2 text-muted-foreground"
            onClick={handleNew}
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

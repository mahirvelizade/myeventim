'use client';

import { useAppStore } from '@/store/use-app-store';
import { Button, Card, CardContent, EmptyState, Badge } from '@invitely/ui';
import { Calendar, MapPin, Clock, Trash2, Copy, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function MyInvitationsPage() {
  const { invitations, addInvitation, resetWizard } = useAppStore();
  const router = useRouter();

  const handleDelete = (id: string | undefined) => {
    if (!id) return;
    useAppStore.setState((s) => ({
      invitations: s.invitations.filter((i) => i.id !== id),
    }));
  };

  const handleDuplicate = (inv: (typeof invitations)[0]) => {
    addInvitation({
      ...inv,
      id: `inv_${Date.now()}`,
      title: `${inv.title || 'Dəvət'} (kopya)`,
      createdAt: new Date().toISOString(),
    });
  };

  const handleNew = () => {
    resetWizard();
    router.push('/');
  };

  if (!invitations.length) {
    return (
      <div className="flex min-h-screen flex-col p-4">
        <h1 className="text-2xl font-bold mb-6">Dəvətlərim</h1>
        <EmptyState
          title="Hələ dəvət kartınız yoxdur"
          description="İlk dəvət kartınızı yaratmaq üçün aşağıdakı düyməyə toxunun"
          action={
            <Button onClick={handleNew} className="gap-2">
              <Plus className="h-4 w-4" />
              Dəvət kartı yarat
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Dəvətlərim</h1>
        <Button size="sm" onClick={handleNew} className="gap-2">
          <Plus className="h-4 w-4" />
          Yeni
        </Button>
      </div>

      <div className="space-y-3">
        {invitations.map((inv) => (
          <Card key={inv.id} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold truncate">{inv.title}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {new Date(inv.createdAt || '').toLocaleDateString('az')}
                    </p>
                  </div>
                  <Badge variant={inv.status === 'COMPLETED' ? 'success' : 'warning'}>
                    {inv.status === 'COMPLETED' ? 'Hazır' : 'Qaralama'}
                  </Badge>
                </div>

                <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mt-2">
                  {inv.formData?.date && (
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {inv.formData.date}
                    </span>
                  )}
                  {inv.formData?.time && (
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {inv.formData.time}
                    </span>
                  )}
                  {inv.formData?.location && (
                    <span className="flex items-center gap-1 truncate max-w-[150px]">
                      <MapPin className="h-3 w-3 shrink-0" />
                      {inv.formData.location}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex border-t border-border divide-x divide-border">
                <button
                  onClick={() => handleDuplicate(inv)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Copy className="h-3.5 w-3.5" />
                  Kopyala
                </button>
                <button
                  onClick={() => handleDelete(inv.id)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs text-destructive hover:text-destructive/80 transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Sil
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

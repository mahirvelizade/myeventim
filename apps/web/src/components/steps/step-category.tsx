'use client';

import { useAppStore } from '@/store/use-app-store';
import { categories } from '@/schemas/categories';
import { Card, CardContent } from '@invitely/ui';
import {
  Heart, Gem, Flower2, Cake, Baby, Briefcase, GraduationCap, BookOpen,
  Music, PartyPopper,
} from 'lucide-react';

const iconMap: Record<string, React.FC<{ className?: string }>> = {
  Heart, Gem, Flower2, Cake, Baby, Briefcase, GraduationCap, BookOpen, Music, PartyPopper,
};

export function StepCategory() {
  const { selectCategory, nextStep } = useAppStore();

  const handleSelect = (cat: (typeof categories)[0]) => {
    selectCategory(cat);
    nextStep();
  };

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Dəvət növünü seçin</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Hansı növ dəvət kartı yaratmaq istəyirsiniz?
        </p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {categories.map((cat) => {
          const Icon = iconMap[cat.icon] || PartyPopper;
          return (
            <Card
              key={cat.id}
              className="cursor-pointer transition-all hover:border-primary hover:shadow-md active:scale-[0.98]"
              onClick={() => handleSelect(cat)}
            >
              <CardContent className="flex flex-col items-center gap-2 p-5">
                <Icon className={`h-8 w-8 ${cat.color}`} />
                <span className="text-sm font-medium">{cat.name}</span>
                <span className="text-[10px] text-muted-foreground text-center leading-tight">
                  {cat.description}
                </span>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

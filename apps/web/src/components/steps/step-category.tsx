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
    <div className="space-y-3">
      <div className="pt-1">
        <h1 className="text-xl font-bold">Dəvət növünü seçin</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Hansı növ dəvət kartı yaratmaq istəyirsiniz?
        </p>
      </div>
      <div className="grid grid-cols-2 gap-2.5">
        {categories.map((cat) => {
          const Icon = iconMap[cat.icon] || PartyPopper;
          return (
            <Card
              key={cat.id}
              className="cursor-pointer border-border/60 hover:border-primary/40 hover:shadow-sm active:scale-[0.97] transition-all duration-150"
              onClick={() => handleSelect(cat)}
            >
              <CardContent className="flex flex-col items-center gap-2 p-4">
                <div className={`rounded-full p-2.5 ${cat.color.replace('text', 'bg')}/10`}>
                  <Icon className={`h-6 w-6 ${cat.color}`} />
                </div>
                <span className="text-sm font-semibold">{cat.name}</span>
                <span className="text-[10px] text-muted-foreground/70 text-center leading-tight line-clamp-2">
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

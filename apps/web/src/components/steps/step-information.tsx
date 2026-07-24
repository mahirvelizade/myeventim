'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAppStore } from '@/store/use-app-store';
import { Input, Label, Button } from '@invitely/ui';
import { Calendar, Clock, MapPin, Phone, Mail, Hash, FileText } from 'lucide-react';
import { useEffect } from 'react';

const iconMap: Record<string, React.FC<{ className?: string }>> = {
  text: FileText, date: Calendar, time: Clock, location: MapPin,
  number: Hash, textarea: FileText, email: Mail, phone: Phone,
};

const typeMap: Record<string, string> = {
  text: 'text', date: 'date', time: 'time', location: 'text',
  number: 'number', textarea: 'textarea', email: 'email', phone: 'tel',
};

export function StepInformation() {
  const { selectedCategory, formData, updateFormData, nextStep } = useAppStore();
  const category = selectedCategory;

  const schemaObj: Record<string, z.ZodTypeAny> = {};
  (category?.fields || []).forEach((field) => {
    let base: z.ZodString = z.string();
    if (field.required) base = base.min(1, `${field.label} tələb olunur`);
    if (field.maxLength) base = base.max(field.maxLength);
    if (field.type === 'email') base = base.email('Düzgün email daxil edin');
    if (field.type === 'number') { schemaObj[field.key] = z.string().optional().or(z.literal('')); return; }
    schemaObj[field.key] = field.required ? base : base.optional().or(z.literal(''));
  });

  const formSchema = z.object(schemaObj);
  type FormData = z.infer<typeof formSchema>;

  const defaultValues: Record<string, string> = {};
  (category?.fields || []).forEach((field) => {
    defaultValues[field.key] = (formData[field.key] as string) || field.defaultValue || '';
  });

  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    resolver: zodResolver(formSchema), defaultValues,
  });

  useEffect(() => { reset(defaultValues); }, [category?.id]);

  const onSubmit = (data: FormData) => {
    updateFormData(data as Record<string, string>);
    nextStep();
  };

  if (!category) return null;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <div className="pt-1">
        <h1 className="text-xl font-bold">Məlumatları daxil edin</h1>
        <p className="text-sm text-muted-foreground mt-0.5">{category.name} üçün məlumatlar</p>
      </div>

      {category.fields.map((field) => {
        const Icon = iconMap[field.type] || FileText;
        const inputType = typeMap[field.type] || 'text';

        return (
          <div key={field.key}>
            <Label htmlFor={field.key} className="flex items-center gap-1.5 text-xs font-medium mb-1.5">
              <Icon className="h-3.5 w-3.5 text-muted-foreground" />
              {field.label}
              {field.required && <span className="text-destructive">*</span>}
            </Label>
            {field.type === 'textarea' ? (
              <textarea
                id={field.key}
                placeholder={field.placeholder}
                {...register(field.key)}
                className="flex min-h-[80px] w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            ) : (
              <Input
                id={field.key}
                type={inputType}
                placeholder={field.placeholder}
                {...register(field.key)}
                error={errors[field.key]?.message as string}
              />
            )}
            {errors[field.key]?.message && (
              <p className="text-xs text-destructive mt-1">{errors[field.key]?.message as string}</p>
            )}
          </div>
        );
      })}

      <Button type="submit" className="w-full mt-2">
        Davam et
      </Button>
    </form>
  );
}

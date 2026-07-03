'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAppStore } from '@/store/use-app-store';
import { Input, Textarea, Label, Button } from '@invitely/ui';
import { Calendar, Clock, MapPin, Phone, Mail, Hash, FileText } from 'lucide-react';
import { useEffect } from 'react';

const iconMap: Record<string, React.FC<{ className?: string }>> = {
  text: FileText,
  date: Calendar,
  time: Clock,
  location: MapPin,
  number: Hash,
  textarea: FileText,
  email: Mail,
  phone: Phone,
};

const typeMap: Record<string, string> = {
  text: 'text',
  date: 'date',
  time: 'time',
  location: 'text',
  number: 'number',
  textarea: 'textarea',
  email: 'email',
  phone: 'tel',
};

export function StepInformation() {
  const { selectedCategory, formData, updateFormData, nextStep } = useAppStore();
  const category = selectedCategory;

  const schemaObj: Record<string, z.ZodTypeAny> = {};
  (category?.fields || []).forEach((field) => {
    let base: z.ZodTypeAny = z.string();
    if (field.required) {
      base = base.min(1, `${field.label} tələb olunur`);
    } else {
      base = base.optional().or(z.literal(''));
    }
    if (field.maxLength) {
      base = base.max(field.maxLength);
    }
    if (field.type === 'email') {
      base = base.email('Düzgün email daxil edin').or(z.literal(''));
    }
    if (field.type === 'number') {
      base = z.string().optional().or(z.literal(''));
    }
    schemaObj[field.key] = base;
  });

  const formSchema = z.object(schemaObj);
  type FormData = z.infer<typeof formSchema>;

  const defaultValues: Record<string, string> = {};
  (category?.fields || []).forEach((field) => {
    defaultValues[field.key] = (formData[field.key] as string) || field.defaultValue || '';
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  useEffect(() => {
    reset(defaultValues);
  }, [category?.id, JSON.stringify(formData)]);

  const onSubmit = (data: FormData) => {
    updateFormData(data as Record<string, string>);
    nextStep();
  };

  if (!category) return null;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Məlumatları daxil edin</h1>
        <p className="mt-1 text-sm text-muted-foreground">{category.name} üçün məlumatlar</p>
      </div>

      {category.fields.map((field) => {
        const Icon = iconMap[field.type] || FileText;
        const inputType = typeMap[field.type] || 'text';
        const isTextarea = field.type === 'textarea';

        return (
          <div key={field.key} className="space-y-2">
            <Label htmlFor={field.key} className="flex items-center gap-2">
              <Icon className="h-3.5 w-3.5 text-muted-foreground" />
              {field.label}
              {field.required && <span className="text-destructive">*</span>}
            </Label>
            {isTextarea ? (
              <Textarea
                id={field.key}
                placeholder={field.placeholder}
                {...register(field.key)}
                error={errors[field.key]?.message as string}
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
          </div>
        );
      })}

      <Button type="submit" className="w-full">
        Davam et
      </Button>
    </form>
  );
}

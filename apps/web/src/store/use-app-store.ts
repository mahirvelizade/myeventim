import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type FormFieldType = 'text' | 'date' | 'time' | 'location' | 'number' | 'textarea' | 'email' | 'phone';

export interface FormField {
  key: string;
  label: string;
  type: FormFieldType;
  required: boolean;
  placeholder?: string;
  maxLength?: number;
  defaultValue?: string;
}

export interface CategorySchema {
  id: string;
  slug: string;
  name: string;
  icon: string;
  description: string;
  color: string;
  fields: FormField[];
}

export interface TemplatePosition {
  x: number;
  y: number;
  width: number;
  height: number;
  fontSize: number;
  align: 'left' | 'center' | 'right';
  color: string;
}

export interface TemplateSchema {
  id: string;
  category: string;
  name: string;
  slug: string;
  description: string;
  thumbnail: string;
  preview?: string;
  background: string;
  backgroundVariants: string[];
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  font: string;
  fonts: string[];
  layout: string;
  positions: Record<string, TemplatePosition>;
  defaultText: Record<string, string>;
}

export interface FormData {
  [key: string]: string;
}

export interface CustomizationState {
  primaryColor: string;
  secondaryColor: string;
  font: string;
  alignment: 'left' | 'center' | 'right';
  backgroundVariant: number;
}

export interface InvitationData {
  id?: string;
  categoryId: string;
  templateId: string;
  formData: FormData;
  customization: CustomizationState;
  title: string;
  status: 'DRAFT' | 'COMPLETED';
  imageUrl?: string;
  pdfUrl?: string;
  createdAt?: string;
}

interface AppStore {
  currentStep: number;
  selectedCategory: CategorySchema | null;
  selectedTemplate: TemplateSchema | null;
  formData: FormData;
  customization: CustomizationState;
  invitations: InvitationData[];
  isGenerating: boolean;
  generationProgress: number;

  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  selectCategory: (cat: CategorySchema) => void;
  selectTemplate: (tmpl: TemplateSchema) => void;
  updateFormData: (data: Partial<FormData>) => void;
  setFormData: (data: FormData) => void;
  updateCustomization: (data: Partial<CustomizationState>) => void;
  resetCustomization: () => void;
  setInvitations: (invitations: InvitationData[]) => void;
  addInvitation: (inv: InvitationData) => void;
  setGenerating: (val: boolean) => void;
  setGenerationProgress: (val: number | ((prev: number) => number)) => void;
  resetWizard: () => void;
}

const DEFAULT_CUSTOMIZATION: CustomizationState = {
  primaryColor: '#e11d48',
  secondaryColor: '#f43f5e',
  font: 'Inter',
  alignment: 'center',
  backgroundVariant: 0,
};

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      currentStep: 1,
      selectedCategory: null,
      selectedTemplate: null,
      formData: {},
      customization: { ...DEFAULT_CUSTOMIZATION },
      invitations: [],
      isGenerating: false,
      generationProgress: 0,

      setStep: (step) => set({ currentStep: step }),
      nextStep: () => set((s) => ({ currentStep: Math.min(s.currentStep + 1, 7) })),
      prevStep: () => set((s) => ({ currentStep: Math.max(s.currentStep - 1, 1) })),
      selectCategory: (cat) => set({ selectedCategory: cat, formData: {}, selectedTemplate: null }),
      selectTemplate: (tmpl) => set({ selectedTemplate: tmpl }),
      updateFormData: (data) => set((s) => ({ formData: { ...s.formData, ...data } })),
      setFormData: (data) => set({ formData: data }),
      updateCustomization: (data) => set((s) => ({ customization: { ...s.customization, ...data } })),
      resetCustomization: () => set({ customization: { ...DEFAULT_CUSTOMIZATION } }),
      setInvitations: (invitations) => set({ invitations }),
      addInvitation: (inv) => set((s) => ({ invitations: [inv, ...s.invitations] })),
      setGenerating: (val) => set({ isGenerating: val }),
      setGenerationProgress: (val) => set({ generationProgress: val }),
      resetWizard: () =>
        set({
          currentStep: 1,
          selectedCategory: null,
          selectedTemplate: null,
          formData: {},
          customization: { ...DEFAULT_CUSTOMIZATION },
          isGenerating: false,
          generationProgress: 0,
        }),
    }),
    {
      name: 'invitely-store',
      partialize: (state) => ({
        invitations: state.invitations,
      }),
    },
  ),
);

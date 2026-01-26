import { create } from 'zustand';
import type { Idea } from '@/types';

interface IdeaState {
  selectedIdea: Idea | null;
  setSelectedIdea: (idea: Idea | null) => void;

  isProcessing: boolean;
  setIsProcessing: (value: boolean) => void;

  currentStep: 'input' | 'collecting' | 'analyzing' | 'reporting' | 'completed';
  setCurrentStep: (step: IdeaState['currentStep']) => void;
}

export const useIdeaStore = create<IdeaState>((set) => ({
  selectedIdea: null,
  setSelectedIdea: (idea) => set({ selectedIdea: idea }),

  isProcessing: false,
  setIsProcessing: (value) => set({ isProcessing: value }),

  currentStep: 'input',
  setCurrentStep: (step) => set({ currentStep: step }),
}));

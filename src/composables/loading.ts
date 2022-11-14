import { Ref } from 'vue';

export const useLoading = (): Ref<boolean> => useState<boolean>('loading', (): boolean => false);

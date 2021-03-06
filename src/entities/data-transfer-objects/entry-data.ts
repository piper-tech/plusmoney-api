import { GetCategoryData } from '@/usecases/get-category';

export interface EntryData {
  id?: number;
  description: string;
  value: number;
  date: string;
  userId?: number;
  categoryId?: number;
  category?: GetCategoryData;
  type?: string;
}

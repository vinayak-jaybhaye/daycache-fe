import type { Media } from './media';

export interface Entry {
  id: number;
  day_id: number;
  content: string;
  created_at: string;
  media?: Media[];
  location: string | null;
  tags: string[] | null;
}

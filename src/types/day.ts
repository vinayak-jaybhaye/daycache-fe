import type { Entry } from './entry';

export interface Day {
  id: string;
  user_id: string;
  date: string;
  latest_summary: string;
  created_at: string;
  entries?: Entry[];
}

export interface Record {
  title: string;
  owner: string;
  url: string;
  start_date: Date;
  duration: number;
  is_recorded: boolean;
  resource_url?: string;
  credentials?: {
    email: string;
    username: string;
    password: string;
  };
}

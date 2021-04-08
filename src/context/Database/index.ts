export interface Database {
  connectionUri: string;
  connect: () => void;
  disconnect: () => void;
}

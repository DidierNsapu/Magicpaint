
export interface ImageState {
  original: string | null;
  edited: string | null;
  isProcessing: boolean;
  error: string | null;
}

export interface EditRequest {
  image: string; // base64
  prompt: string;
}

type MediaType = "image" | "video" | "audio" | "file";

export interface Media {
  id: number;
  url: string;
  type: MediaType;
  description?: string;
}

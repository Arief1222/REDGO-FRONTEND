export type RagDocument = {
  id: number;
  title: string;
  source: string;
  user_id: string;
  created_at: string;
  chunk_count: number;
};

export type UploadRagResponse = {
  id: number;
  title: string;
  source: string;
  user_id: string;
  created_at: string;
};

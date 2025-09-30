export type MediaResponse = {
  id: string;
  title: string;
  altText: string;
  caption: string;
  filePath: string;
  createdAt: string;
  updatedAt: string;
};

export type MediaUploadResponse = {
  status: "SUCCESS" | "ERROR";
  statusCode: number;
  message: string;
  data: MediaResponse | null;
};

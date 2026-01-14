import { api } from "../api";


export interface DocumentAnalysis {
  summary: string;
  keyPoints: string[];
  analyzedAt: Date;
}

export interface DocumentData {
  id: string;
  ownerId: string;

  title: string;
  filename: string;
  size: number;

  rawText: string;
  analysis?: DocumentAnalysis;

  createdAt: Date;
}

export const uploadDocument = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await api.post("/documents/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response;
};

export const listDocuments = async () => {
  const response = await api.get("/documents");
  return response.data;
};

export const getDocument = async (id: string) => {
  const response = await api.get(`/documents/${id}`);
  return response.data;
};

import { api } from "../api";

export const askQuestion = async (documentId: string, question: string) => {
  const response = await api.post(`qa/documents/${documentId}`, { question });
  return response.data;
};

export const getChat = async (documentId: string) => {
  const response = await api.get(`qa/documents/${documentId}`);
  return response.data;
};
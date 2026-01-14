import { api } from "../api";

export interface RequirementEvaluation {
  requirement: string;
  status: "COMPLIANT" | "PARTIAL" | "NON_COMPLIANT";
  rationale: string;
  evidence: string[];
}

export interface DocumentComparison {
  id: string;
  sourceDocumentId: string;
  targetDocumentId: string;
  complianceScore: number;
  summary: {
    compliant: number;
    partial: number;
    nonCompliant: number;
  };
  evaluations: RequirementEvaluation[];
  createdAt: string;
}

export const compareDocuments = async (
  sourceDocumentId: string,
  targetDocumentId: string
): Promise<DocumentComparison> => {
  const response = await api.post("/documents/compare", {
    sourceDocumentId,
    targetDocumentId,
  });

  return response.data;
};

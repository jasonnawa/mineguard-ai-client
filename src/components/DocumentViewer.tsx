import React, { useEffect, useState } from "react";
import { Document as PdfDocument, Page, pdfjs } from "react-pdf";
import { Box, Button, Typography } from "@mui/material";
import { api } from "../api";
import type { DocumentData } from "../services/documents";
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface DocumentViewerProps {
  document: DocumentData;
}

const DocumentViewer: React.FC<DocumentViewerProps> = ({ document }) => {
  const [numPages, setNumPages] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  useEffect(() => {
    let url: string | null = null;

    const fetchPdf = async () => {
      const response = await api.get(
        `/documents/${document.id}/download`,
        { responseType: "blob" }
      );

      const blob = new Blob([response.data], {
        type: "application/pdf",
      });

      url = URL.createObjectURL(blob);
      setPdfUrl(url);
    };

    fetchPdf();

    return () => {
      if (url) URL.revokeObjectURL(url);
    };
  }, [document.id]);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setPageNumber(1);
  };

  if (!pdfUrl) return <div>Loading PDF…</div>;

  return (
    <Box sx={{ height: "100%", p: 2, borderRadius: 2 }}>
      <Box sx={{ overflowY: "auto" }}>
        <PdfDocument file={pdfUrl} onLoadSuccess={onDocumentLoadSuccess}>
          <Page pageNumber={pageNumber} />
        </PdfDocument>
      </Box>

      {/* Navigation */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mt: 2,
        }}
      >
        <Button
          variant="outlined"
          disabled={pageNumber <= 1}
          onClick={() => setPageNumber((p) => p - 1)}
        >
          Previous
        </Button>

        <Typography variant="body2">
          Page {pageNumber} of {numPages}
        </Typography>

        <Button
          variant="outlined"
          disabled={pageNumber >= numPages}
          onClick={() => setPageNumber((p) => p + 1)}
        >
          Next
        </Button>
      </Box>
    </Box>
  );
};

export default DocumentViewer;

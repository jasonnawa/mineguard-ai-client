import React, { useState, useEffect } from "react";
import {
  Typography,
  Box,
  Paper,
  Button,
  Pagination,
  Stack,
} from "@mui/material";

// Import services
import { listDocuments, type DocumentData } from "../services/documents";
import DocumentComparisonSection from "../components/DocumentComparisonSection";

interface DocumentInsightViewProps {
  document: DocumentData;
}

const DocumentInsightView: React.FC<DocumentInsightViewProps> = ({
  document,
}) => {
  const KEY_POINTS_PER_PAGE = 5;
  const [page, setPage] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [files, setFiles] = useState<DocumentData[]>([]);

  const keyPoints = document.analysis?.keyPoints || [];
  const totalPages = Math.ceil(keyPoints.length / KEY_POINTS_PER_PAGE);
  const paginatedKeyPoints = keyPoints.slice(
    page * KEY_POINTS_PER_PAGE,
    page * KEY_POINTS_PER_PAGE + KEY_POINTS_PER_PAGE
  );
  const summary = document.analysis?.summary || "";
  const MAX_CHARS = 200;
  const isLong = summary.length > MAX_CHARS;

  const displayText =
    !expanded && isLong
      ? `${summary.slice(0, MAX_CHARS)}…`
      : summary || "No summary available.";

  // Fetch documents on page load using service
  const fetchFiles = async () => {
    try {
      const docs = await listDocuments();
      console.log(docs);
      setFiles(docs);
    } catch (err) {
      console.error("Failed to fetch files", err);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Make scrollable area */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px" }}>
        
        <Typography sx={{ fontWeight: "900" }} variant="h5" gutterBottom>
          Document Analysis ({document.title})
        </Typography>

        {/* Document Comparison */}
        <DocumentComparisonSection
          sourceDocument={document}
          allDocuments={files}
        />
        
        {/* Summary */}
        <Paper
          sx={{
            p: 3,
            borderRadius: 2,
            border: "1px solid",
            borderColor: "divider",
            mb: 3,
          }}
        >
          <Typography sx={{ fontWeight: "900" }} variant="h5" gutterBottom>
            Summary
          </Typography>

          <Typography color="text.secondary" sx={{ whiteSpace: "pre-line" }}>
            {displayText}
          </Typography>

          {isLong && (
            <Box sx={{ mt: 1 }}>
              <Button
                size="small"
                onClick={() => setExpanded((v) => !v)}
                sx={{ textTransform: "none", px: 0 }}
              >
                {expanded ? "Read less" : "Read more"}
              </Button>
            </Box>
          )}
        </Paper>

        {/* Key Insights */}
        <Paper
          sx={{
            p: 3,
            borderRadius: 2,
            border: "1px solid",
            borderColor: "divider",
            mb: 3,
          }}
        >
          <Typography sx={{ fontWeight: "900" }} variant="h6" gutterBottom>
            Key Insights
          </Typography>

          {paginatedKeyPoints.length > 0 ? (
            <>
              <Stack spacing={1.5}>
                {paginatedKeyPoints.map((point, index) => (
                  <Paper
                    key={index}
                    elevation={0}
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      position: "relative",
                      backgroundColor: "background.paper",
                      borderLeft: "4px solid",
                      borderLeftColor: "primary.main",
                    }}
                  >
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ mb: 0.5, display: "block" }}
                    >
                      Insight {page * KEY_POINTS_PER_PAGE + index + 1}
                    </Typography>

                    <Typography variant="body1">{point}</Typography>
                  </Paper>
                ))}
              </Stack>

              {/* Pagination */}
              <Box
                sx={{
                  mt: 3,
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Pagination
                  count={totalPages}
                  page={page + 1}
                  onChange={(_, value) => setPage(value - 1)}
                  size="small"
                  color="primary"
                />
              </Box>
            </>
          ) : (
            <Typography color="text.secondary">
              No key points available.
            </Typography>
          )}
        </Paper>
      </div>
    </div>
  );
};

export default DocumentInsightView;

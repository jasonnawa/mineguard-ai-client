import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Box, Grid, Typography } from "@mui/material";
import DocumentInsightView from "./DocumentInsightView";
import DocumentViewer from "../components/DocumentViewer";
import { getDocument, type DocumentData } from "../services/documents";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import { IconButton, Tooltip } from "@mui/material";
import DocumentChatModal from "../components/DocumentChatModal";
import Navbar from "../components/NavBar";

const DocumentView = () => {
  const { id } = useParams<{ id: string }>();
  const [document, setDocument] = useState<DocumentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);

  useEffect(() => {
    const fetchDocument = async () => {
      if (!id) return;
      try {
        const doc = await getDocument(id);
        setDocument(doc);
      } catch (err) {
        console.error("Failed to fetch document", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDocument();
  }, [id]);

  if (loading) return <Typography>Loading document...</Typography>;
  if (!document) return <Typography>Document not found</Typography>;

  return (
    <>
    <Navbar />
    <Grid container spacing={2} sx={{ height: "100vh", maxHeight: "100vh"}}>
      {/* Document Viewer */}
      <Grid size={5}>
        <Box
          sx={{
            border: 'none',
            display: "flex",
            flexDirection: "column",
            maxHeight: "100vh",
            borderRadius: 2,
            p: 4
          }}
        >
          <DocumentViewer document={document} />
        </Box>
      </Grid>

      {/* Insights Panel */}
      <Grid size={7}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            maxHeight: "100vh",
            borderRadius: 2,
            overflowY: 'scroll'
          }}
        >
          <DocumentInsightView document={document} />
        </Box>
      </Grid>
    </Grid>

    <Tooltip title="Ask questions about this document">
    <IconButton
        onClick={() => setChatOpen(true)}
        sx={{
        position: "fixed",
        bottom: 24,
        right: 24,
        padding: 2,
        bgcolor: "primary.main",
        color: "primary.contrastText",
        "&:hover": {
            bgcolor: "primary.dark",
        },
        }}
    >
        <ChatBubbleOutlineIcon />
    </IconButton>
    </Tooltip>


    <DocumentChatModal
    open={chatOpen}
    onClose={() => setChatOpen(false)}
    documentId={document.id}
    />

    </>
  );
};

export default DocumentView;

import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Paper,
  List,
  ListItem,
  ListItemText,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { uploadDocument, listDocuments, type DocumentData } from "../services/documents";
import { useNavigate } from "react-router-dom";
import DocumentListItem from "../components/DocumentListItem";
import { toast } from "react-toastify";
import Navbar from "../components/NavBar";


const Home: React.FC = () => {
  const [files, setFiles] = useState<DocumentData[]>([]);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);

  const navigate = useNavigate();

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

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    setSelectedFiles(Array.from(event.target.files));
  };

  const handleConfirmUpload = async () => {
    if (selectedFiles.length === 0) return;

    setUploading(true);

    try {
      for (const file of selectedFiles) {
        const response = await uploadDocument(file);
        setFiles((prev) => [response.data, ...prev]);
      }
      toast.success("File upload successful!");
      setSelectedFiles([]);
      setUploadOpen(false);
    } catch (err: any) {
      if (err.response?.status === 401) {
        toast.error("Sign in before uploading!");
        navigate("/login");
        return;
      }
      toast.error("File upload failed!");

    } finally {
      setUploading(false);
    }
  };

  const viewPage = (id: string) => {
    if (!id) return;
    navigate(`/documents/${id}`);
  };

  return (
    <>
      <Navbar />
      <Container
        maxWidth="md"
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        {/* Header */}
        {files.length > 0 && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
              mb: 3,
            }}
          >
            <Typography variant="h5">Uploaded Files</Typography>

            <Button
              variant="contained"
              startIcon={<UploadFileIcon />}
              onClick={() => setUploadOpen(true)}
            >
              Upload Document
            </Button>
          </Box>
        )}

        {/* Files List */}
        {files.length > 0 ? (
          <Box sx={{ display: "flex", width: "100%" }}>
            <List
              sx={{ display: "flex", width: "100%", flexDirection: "column" }}
            >
              {files.map((file) => (
                <DocumentListItem
                  key={file.id}
                  title={file.title}
                  size={file.size}
                  onClick={() => viewPage(file.id)}
                />
              ))}
            </List>
          </Box>
        ) : (
          <Paper
            elevation={0}
            sx={{
              p: 6,
              border: "2px dashed",
              borderColor: "divider",
              borderRadius: 2,
              textAlign: "center",
              color: "text.secondary",
            }}
          >
            <InsertDriveFileOutlinedIcon
              sx={{ fontSize: 56, mb: 2, color: "text.disabled" }}
            />

            <Typography variant="h6" gutterBottom>
              No documents uploaded
            </Typography>

            <Typography sx={{ mb: 3 }}>
              Upload a PDF document to begin analysis.
            </Typography>

            <Button
              variant="contained"
              startIcon={<UploadFileIcon />}
              onClick={() => setUploadOpen(true)}
            >
              Upload Document
            </Button>
          </Paper>
        )}

        {/* Upload Modal */}
        <Dialog
          open={uploadOpen}
          onClose={() => setUploadOpen(false)}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>Upload Document</DialogTitle>

          <DialogContent>
            <Paper
              elevation={0}
              sx={{
                p: 4,
                mt: 2,
                textAlign: "center",
                border: "2px dashed",
                borderColor: "primary.main",
                cursor: "pointer",
                "&:hover": { backgroundColor: "action.hover" },
              }}
              onClick={() => document.getElementById("file-input")?.click()}
            >
              <UploadFileIcon
                sx={{ fontSize: 48, color: "primary.main", mb: 1 }}
              />
              <Typography>Select PDF files</Typography>

              <input
                id="file-input"
                type="file"
                accept="application/pdf"
                multiple
                hidden
                onChange={handleFileSelect}
              />
            </Paper>

            {/* Selected Files Preview */}
            {selectedFiles.length > 0 && (
              <Box mt={3}>
                <Typography variant="subtitle2" gutterBottom>
                  Files to upload
                </Typography>

                <List dense>
                  {selectedFiles.map((file) => (
                    <ListItem key={file.name}>
                      <ListItemText
                        primary={file.name}
                        secondary={`${(file.size / 1024).toFixed(2)} KB`}
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}
          </DialogContent>

          <DialogActions>
            <Button onClick={() => setUploadOpen(false)} disabled={uploading}>
              Cancel
            </Button>

            <Button
              variant="contained"
              onClick={handleConfirmUpload}
              disabled={selectedFiles.length === 0 || uploading}
              loading={uploading}
            >
              {uploading ? "Uploading..." : "Upload"}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </>
  );
};

export default Home;

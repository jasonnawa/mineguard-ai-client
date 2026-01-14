import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  Paper,
  Stack,
  Chip,
} from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { useState, useRef, useEffect } from "react";
import { askQuestion, getChat } from "../services/qa";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface ChatMessage {
  question: string;
  answer: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  documentId: string;
}

const DocumentChatModal: React.FC<Props> = ({ open, onClose, documentId }) => {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!documentId) return;

    const fetchMessages = async () => {
      try {
        const response = await getChat(documentId);
        setMessages(response);
      } catch (err) {
        console.error("Failed to fetch chat messages", err);
      }
    };

    fetchMessages();
  }, [documentId]);

  const handleSend = async () => {
    if (!question.trim() || loading) return;

    setLoading(true);
    const userMessage = question;

    try {
      const res = await askQuestion(documentId, question);

      setMessages((prev) => [
        ...prev,
        { question: userMessage, answer: res.answer },
      ]);
      setQuestion("");
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { question: userMessage, answer: "Sorry, I couldn't answer that." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Ask about this document</DialogTitle>

      <DialogContent
        dividers
        sx={{ display: "flex", flexDirection: "column", height: 500 }}
      >
        <Stack spacing={2} sx={{ flex: 1, overflowY: "auto" }}>
          {/* Empty State / Info Banner */}
          {messages.length === 0 && (
            <Paper
              elevation={0}
              sx={{
                p: 2,
                borderRadius: 2,
                border: "1px dashed",
                borderColor: "divider",
                backgroundColor: "background.default",
              }}
            >
              <Stack direction="row" spacing={1.5}>
                <InfoOutlinedIcon color="primary" />
                <Box>
                  <Typography fontWeight={600} gutterBottom>
                    Ask questions about this document
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    The assistant answers strictly based on this document’s
                    content.
                  </Typography>
                  <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                    {[
                      "What are the compliance risks?",
                      "Summarize key obligations",
                      "Are penalties mentioned?",
                    ].map((prompt) => (
                      <Chip
                        key={prompt}
                        label={prompt}
                        variant="outlined"
                        size="small"
                        onClick={() => setQuestion(prompt)}
                        sx={{ cursor: "pointer" }}
                      />
                    ))}
                  </Stack>
                </Box>
              </Stack>
            </Paper>
          )}

          {/* Messages */}
          {messages.map((m, i) => (
            <Box key={i}>
              {/* User */}
              <Box
                sx={{ display: "flex", justifyContent: "flex-end", mb: 0.5 }}
              >
                <Paper
                  sx={{
                    p: 1.5,
                    maxWidth: "80%",
                    bgcolor: "primary.main",
                    color: "white",
                    borderRadius: 2,
                  }}
                >
                  {m.question}
                </Paper>
              </Box>

              {/* Assistant */}
              <Box
                sx={{ display: "flex", justifyContent: "flex-start", mb: 1 }}
              >
                <Paper
                  sx={{
                    p: 1.5,
                    maxWidth: "80%",
                    bgcolor: "background.paper",
                    borderRadius: 2,
                  }}
                >
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      p: ({ children }) => (
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          {children}
                        </Typography>
                      ),
                      li: ({ children }) => (
                        <li>
                          <Typography variant="body2">{children}</Typography>
                        </li>
                      ),
                      strong: ({ children }) => (
                        <strong style={{ fontWeight: 600 }}>{children}</strong>
                      ),
                      code: ({ children }) => (
                        <Box
                          component="code"
                          sx={{
                            display: "block",
                            p: 1,
                            my: 1,
                            bgcolor: "grey.100",
                            borderRadius: 1,
                            fontFamily: "monospace",
                            fontSize: "0.85rem",
                            overflowX: "auto",
                          }}
                        >
                          {children}
                        </Box>
                      ),
                    }}
                  >
                    {m.answer}
                  </ReactMarkdown>
                </Paper>
              </Box>
            </Box>
          ))}

          <div ref={messagesEndRef} />
        </Stack>
      </DialogContent>

      <DialogActions sx={{ gap: 1, px: 3, py: 2 }}>
        <TextField
          fullWidth
          placeholder="Ask a question..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <Button
          variant="contained"
          onClick={handleSend}
          disabled={loading}
          loading={loading}
        >
          Ask
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DocumentChatModal;

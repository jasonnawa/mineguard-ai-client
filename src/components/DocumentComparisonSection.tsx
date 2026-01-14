import { useState } from "react";
import {
  Paper,
  Typography,
  Stack,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  CircularProgress,
} from "@mui/material";
import { toast } from "react-toastify";
import type { DocumentData } from "../services/documents";
import {
  compareDocuments,
  type DocumentComparison,
} from "../services/comparison";
import DocumentComparisonView from "./DocumentComparisonView";

interface Props {
  sourceDocument: DocumentData;
  allDocuments: DocumentData[]; // documents user can compare against
}

const DocumentComparisonSection: React.FC<Props> = ({
  sourceDocument,
  allDocuments,
}) => {
  const [targetDocumentId, setTargetDocumentId] = useState<string>("");
  const [comparison, setComparison] = useState<DocumentComparison | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCompare = async () => {
    if (!targetDocumentId) return;
    setLoading(true);
    try {
      const result = await compareDocuments(
        sourceDocument.id,
        targetDocumentId
      );
      console.log(result)
      setComparison(result);
    }catch(err){
        toast.error("An error has occured.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper
      sx={{
        p: 3,
        borderRadius: 2,
        border: "1px solid",
        borderColor: "divider",
        mb: 3,
      }}
    >
      <Typography sx={{ fontWeight: 900 }} variant="h6" gutterBottom>
        Compare Documents (Compliance / Gap Analysis)
      </Typography>

      {/* Select target document */}
      {allDocuments.filter((d) => d.id !== sourceDocument.id).length > 0 ? (
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          sx={{ mb: 2 }}
        >
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel id="target-doc-label">Target Document</InputLabel>
            <Select
              labelId="target-doc-label"
              value={targetDocumentId}
              label="Target Document"
              onChange={(e) => setTargetDocumentId(e.target.value)}
            >
              {allDocuments
                .filter((d) => d.id !== sourceDocument.id)
                .map((doc) => (
                  <MenuItem key={doc.id} value={doc.id}>
                    {doc.title}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>

          <Button
            variant="contained"
            onClick={handleCompare}
            disabled={!targetDocumentId || loading}
          >
            {loading ? <CircularProgress size={24} /> : "Compare"}
          </Button>
        </Stack>
      ) : (
        <Typography color="text.secondary" sx={{ mb: 2 }}>
          No other documents available to compare.
        </Typography>
      )}

      {/* Render comparison */}
      {comparison && <DocumentComparisonView comparison={comparison} />}
    </Paper>
  );
};

export default DocumentComparisonSection;

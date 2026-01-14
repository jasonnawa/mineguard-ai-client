import {
  Paper,
  Typography,
  Box,
  Stack,
  Chip,
  LinearProgress,
  Divider,
} from "@mui/material";
import type { DocumentComparison } from "../services/comparison";

interface Props {
  comparison: DocumentComparison;
}

const statusColor = (status: string) => {
  switch (status) {
    case "COMPLIANT":
      return "success";
    case "PARTIAL":
      return "warning";
    case "NON_COMPLIANT":
      return "error";
    default:
      return "default";
  }
};

const DocumentComparisonView: React.FC<Props> = ({ comparison }) => {
  const summary = comparison.evaluations.reduce(
    (acc, curr) => {
      if (curr.status === "COMPLIANT") acc.compliant += 1;
      if (curr.status === "PARTIAL") acc.partial += 1;
      if (curr.status === "NON_COMPLIANT") acc.nonCompliant += 1;
      return acc;
    },
    { compliant: 0, partial: 0, nonCompliant: 0 }
  );

  return (
    <Box
      sx={{
        p: 3,
        borderRadius: 2,
        border: "none",
        borderColor: "divider",
      }}
    >
      {/* Header */}
      <Typography variant="h6" fontWeight={900} gutterBottom>
        Compliance Gap Analysis
      </Typography>

      {/* Score */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Compliance Score
        </Typography>
        <LinearProgress
          variant="determinate"
          value={comparison.complianceScore * 100}
          sx={{ height: 8, borderRadius: 5 }}
        />
        <Typography variant="caption" color="text.secondary">
          {(comparison.complianceScore * 100).toFixed(0)}% compliant
        </Typography>
      </Box>

      {/* Summary */}
      <Stack direction="row" spacing={1} sx={{ mb: 3 }}>
        <Chip color="success" label={`Compliant: ${summary.compliant}`} />
        <Chip color="warning" label={`Partial: ${summary.partial}`} />
        <Chip color="error" label={`Non-compliant: ${summary.nonCompliant}`} />
      </Stack>

      <Divider sx={{ mb: 3 }} />

      {/* Evaluations */}
      <Stack spacing={2}>
        {comparison.evaluations.map((item, index) => (
          <Paper
            key={index}
            elevation={0}
            sx={{
              p: 2,
              borderRadius: 2,
              borderLeft: "4px solid",
              borderLeftColor: `${statusColor(item.status)}.main`,
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <Stack spacing={1}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography fontWeight={600}>{item.requirement}</Typography>
                <Chip
                  size="small"
                  color={statusColor(item.status)}
                  label={item.status.replace("_", " ")}
                />
              </Stack>

              <Typography variant="body2" color="text.secondary">
                {item.rationale}
              </Typography>

              {item.evidence.length > 0 && (
                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    fontWeight={600}
                  >
                    Evidence
                  </Typography>
                  <Stack spacing={0.5}>
                    {item.evidence.map((e, i) => (
                      <Typography
                        key={i}
                        variant="body2"
                        sx={{
                          pl: 1.5,
                          borderLeft: "2px solid",
                          borderColor: "divider",
                        }}
                      >
                        {e}
                      </Typography>
                    ))}
                  </Stack>
                </Box>
              )}
            </Stack>
          </Paper>
        ))}
      </Stack>
    </Box>
  );
};

export default DocumentComparisonView;

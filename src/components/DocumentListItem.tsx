import {
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  IconButton,
  Box,
} from "@mui/material";
import FolderIcon from "@mui/icons-material/Folder";
import DeleteIcon from "@mui/icons-material/Delete";

interface DocumentListItemProps {
  title: string;
  size: number;
  onClick?: () => void;
  onDelete?: () => void;
}

const DocumentListItem: React.FC<DocumentListItemProps> = ({
  title,
  size,
  onClick,
  onDelete,
}) => {
  return (
<ListItem
  disablePadding
  sx={{
    mb: 1.5,
  }}
>
  <Box
    onClick={onClick}
    sx={{
      width: "100%",
      display: "flex",
      alignItems: "center",
      px: 2,
      py: 1.5,
      borderRadius: 2,
      backgroundColor: "background.paper",
      boxShadow: 1,
      cursor: "pointer",
      transition: "all 0.2s ease",
      "&:hover": {
        boxShadow: 4,
        backgroundColor: "action.hover",
      },
    }}
  >
    {/* Avatar */}
    <ListItemAvatar>
      <Avatar
        sx={{
          bgcolor: "primary.main",
          width: 40,
          height: 40,
        }}
      >
        <FolderIcon />
      </Avatar>
    </ListItemAvatar>

    {/* Text */}
    <ListItemText
      primary={title}
      secondary={`${(size / 1024).toFixed(2)} KB`}
      primaryTypographyProps={{ fontWeight: 500 }}
    />

    {/* Actions */}
    {onDelete && (
      <IconButton
        edge="end"
        aria-label="delete"
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
      >
        <DeleteIcon />
      </IconButton>
    )}
  </Box>
</ListItem>

  );
};

export default DocumentListItem;

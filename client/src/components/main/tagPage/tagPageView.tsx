import React from "react";
import { useTagPage } from "../../../hooks/useTagPage";
import {
  VoidFunctionType,
  ClickTagFunctionType,
} from "../../../types/functionTypes";
import { 
  Box, 
  Typography, 
  Button, 
  Container, 
  Chip,
  Paper,
  Divider,
  useTheme
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";

// Assuming this is your TagResponseType structure based on errors
interface TagResponseType {
  name: string;
  // If count doesn't exist on your TagResponseType, we'll need to adjust
  // the display to only show what's available
  id?: string; // Adding as an assumed property, adjust based on your actual type
}

// The type definition for the props of the TagPage component
interface TagPageProps {
  clickTag: ClickTagFunctionType;
  handleNewQuestion: VoidFunctionType;
}

/**
 * The component that renders all the tags in the application.
 * It composed of Material UI Chip components replacing the custom Tag component.
 * @param param0 containing the functions to render the questions of a tag and to add a new question
 * @returns the TagPage component with Material UI styling
 */
const TagPage = ({ clickTag, handleNewQuestion }: TagPageProps) => {
  const { tlist } = useTagPage();
  const theme = useTheme();

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={1} sx={{ p: 3, mb: 4 }}>
        <Box sx={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center", 
          mb: 2 
        }}>
          <Box>
            <Typography variant="h5" component="h1" fontWeight="bold">
              {tlist.length} Tags
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Browse all available tags
            </Typography>
          </Box>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />} 
            onClick={handleNewQuestion}
            sx={{
              borderRadius: theme.shape.borderRadius,
              textTransform: "none",
            }}
          >
            Ask a Question
          </Button>
        </Box>
        
        <Divider sx={{ my: 2 }} />

        <Box sx={{ 
          display: "flex", 
          flexWrap: "wrap", 
          gap: 2,
          mt: 2 
        }}>
          {tlist.map((t, idx) => (
            <Chip
              key={idx}
              icon={<LocalOfferIcon />}
              label={t.name}
              onClick={() => clickTag(t.name)}
              clickable
              color="primary"
              variant="outlined"
              sx={{ 
                px: 1, 
                borderRadius: "16px",
                "&:hover": {
                  backgroundColor: theme.palette.primary.light,
                  color: theme.palette.primary.contrastText,
                },
              }}
            />
          ))}
        </Box>
      </Paper>
    </Container>
  );
};

export default TagPage;

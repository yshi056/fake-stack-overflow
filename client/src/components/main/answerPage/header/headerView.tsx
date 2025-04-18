import React from "react";
import {
  Box,
  Typography,
  Button,
  Chip,
  Divider,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import AddIcon from "@mui/icons-material/Add";
import { VoidFunctionType } from "../../../../types/functionTypes";

// The props for the AnswerHeader component
interface AnswerHeaderProps {
  ansCount: number;
  title: string;
  handleNewQuestion: VoidFunctionType;
}

/**
 * The header of the answer page
 * @param props contains the number of answers, the title of the question and the function to post a new question
 * @returns the AnswerHeader component
 */
const AnswerHeader = ({
  ansCount,
  title,
  handleNewQuestion,
}: AnswerHeaderProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box sx={{ mb: 3 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", md: "center" },
          gap: 2,
          mb: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Chip
            icon={<QuestionAnswerIcon />}
            label={`${ansCount} ${ansCount === 1 ? "answer" : "answers"}`}
            color="primary"
            variant="outlined"
            sx={{
              fontWeight: "bold",
              fontSize: "0.9rem",
              height: 32,
            }}
          />
        </Box>

        <Typography
          variant="h5"
          component="h1"
          sx={{
            fontWeight: "bold",
            color: "text.primary",
            flexGrow: 1,
            textAlign: { xs: "left", md: "center" },
          }}
        >
          {title}
        </Typography>

        <Button
          variant="contained"
          color="primary"
          size={isMobile ? "medium" : "large"}
          startIcon={<AddIcon />}
          onClick={handleNewQuestion}
          sx={{
            whiteSpace: "nowrap",
            alignSelf: { xs: "flex-end", md: "center" },
          }}
        >
          Ask a Question
        </Button>
      </Box>

      <Divider sx={{ mb: 3 }} />
    </Box>
  );
};

export default AnswerHeader;

import React from "react";
import { Typography, Box, Chip, Stack, Paper } from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PersonIcon from "@mui/icons-material/Person";
import CommentIcon from "@mui/icons-material/Comment";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  ClickTagFunctionType,
  IdFunctionType,
} from "../../../../types/functionTypes";

// Import your existing types
import { QuestionResponseType } from "../../../../types/entityTypes";

interface QuestionProps {
  q: QuestionResponseType;
  clickTag: ClickTagFunctionType;
  handleAnswer: IdFunctionType;
}

const Question = ({ q, clickTag, handleAnswer }: QuestionProps) => {
  // Format date if needed
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (e) {
      return dateString;
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        "&:hover": {
          bgcolor: "rgba(0, 0, 0, 0.03)",
        },
        transition: "background-color 0.3s",
      }}
    >
      <Box>
        <Typography
          variant="h6"
          sx={{
            fontWeight: "bold",
            mb: 1,
            color: "primary.main",
            cursor: "pointer",
            "&:hover": {
              textDecoration: "underline",
            },
          }}
          onClick={() => handleAnswer(q._id)}
        >
          {q.title}
        </Typography>

        <Typography variant="body1" sx={{ mb: 2, color: "text.secondary" }}>
          {q.text.length > 200 ? `${q.text.substring(0, 200)}...` : q.text}
        </Typography>

        <Stack
          direction="row"
          spacing={1}
          sx={{ mb: 2, flexWrap: "wrap", gap: 1 }}
        >
          {q.tags.map((tag, idx) => (
            <Chip
              key={idx}
              label={tag.name}
              size="small"
              onClick={() => clickTag(tag.name)}
              sx={{
                bgcolor: "primary.light",
                color: "primary.contrastText",
                "&:hover": {
                  bgcolor: "primary.main",
                },
              }}
            />
          ))}
        </Stack>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Stack direction="row" spacing={3}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <PersonIcon
                fontSize="small"
                sx={{ mr: 0.5, color: "text.secondary" }}
              />
              <Typography variant="body2" color="text.secondary">
                {q.asked_by}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center" }}>
              <AccessTimeIcon
                fontSize="small"
                sx={{ mr: 0.5, color: "text.secondary" }}
              />
              <Typography variant="body2" color="text.secondary">
                {formatDate(q.ask_date_time)}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center" }}>
              <CommentIcon
                fontSize="small"
                sx={{ mr: 0.5, color: "text.secondary" }}
              />
              <Typography variant="body2" color="text.secondary">
                {q.answers.length}{" "}
                {q.answers.length === 1 ? "answer" : "answers"}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center" }}>
              <VisibilityIcon
                fontSize="small"
                sx={{ mr: 0.5, color: "text.secondary" }}
              />
              <Typography variant="body2" color="text.secondary">
                {q.views} {q.views === 1 ? "view" : "views"}
              </Typography>
            </Box>
          </Stack>
        </Box>
      </Box>
    </Paper>
  );
};

export default Question;

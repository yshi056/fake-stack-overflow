import React from "react";
import { Box, Typography, Paper, Avatar, Divider } from "@mui/material";

// The type definition for the props of the Answer component
interface AnswerProps {
  text: string;
  ansBy: string;
  meta: string;
}

/**
 * The component to render an answer in the answer page
 * @param props containing the answer text, the author of the answer and the meta data of the answer
 * @returns the Answer component
 */
const Answer = ({ text, ansBy, meta }: AnswerProps) => {
  return (
    <Box sx={{ width: "100%" }}>
      <Typography
        variant="body1"
        component="div"
        sx={{
          mb: 3,
          whiteSpace: "pre-wrap",
          lineHeight: 1.6,
        }}
      >
        {text}
      </Typography>

      <Divider sx={{ mb: 2 }} />

      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
        }}
      >
        <Box sx={{ textAlign: "right", mr: 2 }}>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ fontWeight: "medium" }}
          >
            {ansBy}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {meta}
          </Typography>
        </Box>
        <Avatar
          sx={{
            bgcolor: "primary.main",
            width: 40,
            height: 40,
          }}
        >
          {ansBy.charAt(0).toUpperCase()}
        </Avatar>
      </Box>
    </Box>
  );
};

export default Answer;

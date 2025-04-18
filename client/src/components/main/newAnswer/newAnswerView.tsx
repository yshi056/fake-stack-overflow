import React from "react";
import {
  Box,
  Button,
  Paper,
  TextField,
  Typography,
  Stack,
  Divider,
} from "@mui/material";
import { useNewAnswer } from "../../../hooks/useNewAnswer";
import { QuestionIdFunctionType } from "../../../types/functionTypes";

// The type definition for the props of the NewAnswer component
interface NewAnswerProps {
  qid: string;
  handleAnswer: QuestionIdFunctionType;
}

/**
 * The component renders a form to post a new answer to a question.
 * It uses a hook to manage the state of the form and the submission of the answer.
 * When the form is submitted, the answer is saved to the database
 * and the handleAnswer function is called to render the new answer.
 * Username is now handled automatically via JWT authentication.
 * @param props contains the question id and the handleAnswer function to render the newly created answer
 * @returns the NewAnswer component
 */
const NewAnswer = ({ qid, handleAnswer }: NewAnswerProps) => {
  const { text, setText, textErr, postAnswer } = useNewAnswer(qid, handleAnswer);

  return (
    <Paper elevation={2} sx={{ p: 3, borderRadius: 2, mb: 3 }}>
      <Typography
        variant="h5"
        component="h2"
        gutterBottom
        sx={{ fontWeight: "bold", color: "primary.main" }}
      >
        Your Answer
      </Typography>
      <Divider sx={{ mb: 3 }} />
      <Stack spacing={3}>
        <TextField
          fullWidth
          id="answerTextInput"
          label="Answer Text"
          variant="outlined"
          value={text}
          onChange={(e) => setText(e.target.value)}
          error={!!textErr}
          helperText={textErr}
          multiline
          rows={5}
          required
          InputLabelProps={{ shrink: true }}
        />
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 2,
            mt: 2,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            * indicates mandatory fields
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={postAnswer}
            sx={{
              minWidth: 130,
              fontWeight: "bold",
            }}
          >
            Post Answer
          </Button>
        </Box>
      </Stack>
    </Paper>
  );
};

export default NewAnswer;

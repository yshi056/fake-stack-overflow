import React from "react";
import {
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
  Stack,
  Divider,
} from "@mui/material";
import { useNewQuestion } from "../../../hooks/useNewQuestion";
import { VoidFunctionType } from "../../../types/functionTypes";

// Type definition for props passed to NewQuestion component
interface NewQuestionProps {
  handleQuestions: VoidFunctionType;
}

/**
 * The component renders the form for posting a new question.
 * It uses the useNewQuestion hook to manage the state of the form
 * and to save the new question to the database. After saving the
 * question, it calls the handleQuestions function to update the view.
 * The username is now taken from the authenticated user session.
 * @param props contains the handleQuestions function to update the view which renders the new question
 * @returns the NewQuestion component.
 */
const NewQuestion = ({ handleQuestions }: NewQuestionProps) => {
  const {
    title,
    setTitle,
    text,
    setText,
    tag,
    setTag,
    titleErr,
    textErr,
    tagErr,
    postQuestion,
  } = useNewQuestion(handleQuestions);

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={2} sx={{ p: 4, borderRadius: 2 }}>
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{ fontWeight: "bold", color: "primary.main" }}
        >
          Ask a Question
        </Typography>
        <Divider sx={{ mb: 3 }} />

        <Stack spacing={3}>
          <TextField
            fullWidth
            id="formTitleInput"
            label="Question Title"
            variant="outlined"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            error={!!titleErr}
            helperText={titleErr || "Limit title to 100 characters or less"}
            required
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            fullWidth
            id="formTextInput"
            label="Question Text"
            variant="outlined"
            value={text}
            onChange={(e) => setText(e.target.value)}
            error={!!textErr}
            helperText={textErr || "Add details"}
            multiline
            rows={6}
            required
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            fullWidth
            id="formTagInput"
            label="Tags"
            variant="outlined"
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            error={!!tagErr}
            helperText={tagErr || "Add keywords separated by whitespace"}
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
              size="large"
              onClick={postQuestion}
              sx={{
                minWidth: 150,
                fontWeight: "bold",
              }}
            >
              Post Question
            </Button>
          </Box>
        </Stack>
      </Paper>
    </Container>
  );
};

export default NewQuestion;

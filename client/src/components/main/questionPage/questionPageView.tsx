import React from "react";
import {
  Typography,
  Box,
  Paper,
  Divider,
  Container,
  Alert,
  Stack,
} from "@mui/material";
import { useQuestionPage } from "../../../hooks/useQuestionPage";
import {
  ClickTagFunctionType,
  VoidFunctionType,
  IdFunctionType,
  OrderFunctionType,
} from "../../../types/functionTypes";
import QuestionHeader from "./header/headerView";
import Question from "./question/questionView";

// Import your existing types if needed
// import { QuestionResponseType } from "../../../types/entityTypes";

export interface QuestionPageProps {
  title_text?: string;
  order: string;
  search: string;
  setQuestionOrder: OrderFunctionType;
  clickTag: ClickTagFunctionType;
  handleAnswer: IdFunctionType;
  handleNewQuestion: VoidFunctionType;
}

const QuestionPage = ({
  title_text = "All Questions",
  order,
  search,
  setQuestionOrder,
  clickTag,
  handleAnswer,
  handleNewQuestion,
}: QuestionPageProps) => {
  const { qlist } = useQuestionPage({ order, search });

  return (
    <Box sx={{ py: 3 }}>
      <Container maxWidth="xl">
        <Paper elevation={1} sx={{ p: 3, borderRadius: 1 }}>
          <QuestionHeader
            title_text={title_text}
            qcnt={qlist.length}
            setQuestionOrder={setQuestionOrder}
            handleNewQuestion={handleNewQuestion}
          />
          <Divider sx={{ my: 2 }} />

          {qlist.length > 0 ? (
            <Stack spacing={2} sx={{ mt: 2 }}>
              {qlist.map((q, idx) => (
                <Box key={idx}>
                  <Question
                    q={q}
                    clickTag={clickTag}
                    handleAnswer={handleAnswer}
                  />
                  {idx < qlist.length - 1 && <Divider sx={{ mt: 2 }} />}
                </Box>
              ))}
            </Stack>
          ) : (
            title_text === "Search Results" && (
              <Alert
                severity="info"
                sx={{
                  mt: 2,
                  fontWeight: "medium",
                  fontSize: "1rem",
                }}
              >
                No Questions Found
              </Alert>
            )
          )}
        </Paper>
      </Container>
    </Box>
  );
};

export default QuestionPage;

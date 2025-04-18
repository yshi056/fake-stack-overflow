import React from "react";
import {
  Typography,
  Box,
  Button,
  FormControl,
  Select,
  MenuItem,
  SelectChangeEvent,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SortIcon from "@mui/icons-material/Sort";
import {
  VoidFunctionType,
  OrderFunctionType,
} from "../../../../types/functionTypes";

interface QuestionHeaderProps {
  title_text: string;
  qcnt: number;
  setQuestionOrder: OrderFunctionType;
  handleNewQuestion: VoidFunctionType;
}

const QuestionHeader = ({
  title_text,
  qcnt,
  setQuestionOrder,
  handleNewQuestion,
}: QuestionHeaderProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleOrderChange = (event: SelectChangeEvent) => {
    setQuestionOrder(event.target.value);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        justifyContent: "space-between",
        gap: 2,
      }}
    >
      <Box>
        <Box sx={{ display: "flex", alignItems: "baseline", gap: 1 }}>
          <Typography variant="h5" component="h1" sx={{ fontWeight: "bold" }}>
            {title_text}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {qcnt} {qcnt === 1 ? "question" : "questions"}
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: isMobile ? "flex-start" : "flex-end",
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <Select
            value={title_text === "Search Results" ? "relevance" : "newest"}
            onChange={handleOrderChange}
            displayEmpty
            sx={{
              "& .MuiSelect-select": {
                paddingLeft: "8px",
                display: "flex",
                alignItems: "center",
              },
            }}
          >
            <MenuItem value="newest">
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <SortIcon
                  sx={{ mr: 1, fontSize: "1rem", color: "action.active" }}
                />
                Newest
              </Box>
            </MenuItem>
            <MenuItem value="active">
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <SortIcon
                  sx={{ mr: 1, fontSize: "1rem", color: "action.active" }}
                />
                Active
              </Box>
            </MenuItem>
            <MenuItem value="unanswered">
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <SortIcon
                  sx={{ mr: 1, fontSize: "1rem", color: "action.active" }}
                />
                Unanswered
              </Box>
            </MenuItem>
            {title_text === "Search Results" && (
              <MenuItem value="relevance">
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <SortIcon
                    sx={{ mr: 1, fontSize: "1rem", color: "action.active" }}
                  />
                  Relevance
                </Box>
              </MenuItem>
            )}
          </Select>
        </FormControl>

        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleNewQuestion}
          size={isMobile ? "small" : "medium"}
        >
          Ask Question
        </Button>
      </Box>
    </Box>
  );
};

export default QuestionHeader;

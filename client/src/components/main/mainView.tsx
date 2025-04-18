import React from "react";
import {
  Box,
  Container,
  Paper,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  useTheme,
  useMediaQuery,
} from "@mui/material";

import { alpha } from "@mui/material/styles";

import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import PageClass from "./routing";

interface MainProps {
  page: PageClass;
  handleQuestions: () => void;
  handleTags: () => void;
}

const Main = ({ page, handleQuestions, handleTags }: MainProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const selected = page.getSelected();

  const MaterialSidebar = () => (
    <List component="nav" sx={{ width: "100%", p: 0 }}>
      {/* Questions item */}
      <ListItemButton
        onClick={handleQuestions}
        selected={selected === "questions"}
        sx={{
          borderLeft:
            selected === "questions"
              ? `4px solid ${theme.palette.primary.main}`
              : "4px solid transparent",
          backgroundColor:
            selected === "questions"
              ? alpha(theme.palette.primary.main, 0.1)
              : "transparent",
          "&:hover": {
            backgroundColor:
              selected === "questions"
                ? alpha(theme.palette.primary.main, 0.2)
                : alpha(theme.palette.action.hover, 0.1),
          },
          mb: 1,
        }}
      >
        <ListItemIcon
          sx={{
            minWidth: 40,
            color:
              selected === "questions" ? theme.palette.primary.main : "inherit",
          }}
        >
          <QuestionAnswerIcon />
        </ListItemIcon>
        <ListItemText
          primary="Questions"
          primaryTypographyProps={{
            fontWeight: selected === "questions" ? "bold" : "normal",
            color:
              selected === "questions" ? theme.palette.primary.main : "inherit",
          }}
        />
      </ListItemButton>

      {/* Tags item */}
      <ListItemButton
        onClick={handleTags}
        selected={selected === "tags"}
        sx={{
          borderLeft:
            selected === "tags"
              ? `4px solid ${theme.palette.primary.main}`
              : "4px solid transparent",
          backgroundColor:
            selected === "tags"
              ? alpha(theme.palette.primary.main, 0.1)
              : "transparent",
          "&:hover": {
            backgroundColor:
              selected === "tags"
                ? alpha(theme.palette.primary.main, 0.2)
                : alpha(theme.palette.action.hover, 0.1),
          },
        }}
      >
        <ListItemIcon
          sx={{
            minWidth: 40,
            color: selected === "tags" ? theme.palette.primary.main : "inherit",
          }}
        >
          <LocalOfferIcon />
        </ListItemIcon>
        <ListItemText
          primary="Tags"
          primaryTypographyProps={{
            fontWeight: selected === "tags" ? "bold" : "normal",
            color: selected === "tags" ? theme.palette.primary.main : "inherit",
          }}
        />
      </ListItemButton>

      {!isMobile && (
        <>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ p: 2, color: "text.secondary", fontSize: "0.875rem" }}>
            <Box sx={{ fontWeight: "bold", mb: 1 }}>PUBLIC</Box>
            <Box sx={{ pl: 2, mb: 0.5 }}>Stack Overflow</Box>
            <Box sx={{ pl: 2, mb: 0.5 }}>Tags</Box>
            <Box sx={{ pl: 2, mb: 0.5 }}>Users</Box>
            <Box sx={{ pl: 2 }}>Companies</Box>
          </Box>
        </>
      )}
    </List>
  );

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 3,
        bgcolor: "background.default",
        minHeight: "calc(100vh - 64px)",
      }}
    >
      <Container maxWidth="xl">
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: 2,
          }}
        >
          {/* Sidebar */}
          <Box
            sx={{
              width: { xs: "100%", sm: "240px" },
              minWidth: { sm: "240px" },
              mb: { xs: 2, sm: 0 },
            }}
          >
            <Paper
              elevation={1}
              sx={{
                p: 0,
                position: { sm: "sticky" },
                top: { sm: "84px" },
                bgcolor: "background.paper",
                borderRadius: 1,
                overflow: "hidden",
              }}
            >
              {isMobile ? (
                <Box
                  sx={{ display: "flex", justifyContent: "space-around", p: 1 }}
                >
                  <MaterialSidebar />
                </Box>
              ) : (
                <MaterialSidebar />
              )}
            </Paper>
          </Box>

          {/* Main content */}
          <Box sx={{ flexGrow: 1 }}>
            <Paper
              elevation={1}
              sx={{
                p: 3,
                minHeight: "70vh",
                bgcolor: "background.paper",
                borderRadius: 1,
              }}
            >
              {page.getContent()}
            </Paper>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Main;

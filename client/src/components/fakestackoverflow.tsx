import { useState } from "react";
import {
  Container,
  Box,
  Button,
  ThemeProvider,
  createTheme,
  CssBaseline,
  Typography,
} from "@mui/material";
import { ArrowBack as ArrowBackIcon } from "@mui/icons-material";

import Header from "./header";
import Main from "./main/mainView";
import SignUp from "./main/signUpPage/signUpView";
import Login from "./main/logInPage/logInView";
import Profile from "./main/profilePage/profileView";
import HomePageClass from "./main/routing/home";
import TagPageClass from "./main/routing/tag";
import AnswerPageClass from "./main/routing/answer";
import NewQuestionPageClass from "./main/routing/newQuestion";
import NewAnswerPageClass from "./main/routing/newAnswer";

// Create a theme with orange as the primary color
const theme = createTheme({
  palette: {
    primary: {
      main: "#f48024", // Stack Overflow orange as primary
      dark: "#d2691e", // Darker orange for hover states
      light: "#ff9d45", // Lighter orange for backgrounds
      contrastText: "#ffffff", // White text on orange background
    },
    secondary: {
      main: "#1976d2", // Stack Overflow blue now as secondary
    },
    background: {
      default: "#f8f9f9", // Light gray background
      paper: "#ffffff", // White for Paper components
    },
    text: {
      primary: "#242729", // Dark gray for primary text
      secondary: "#6a737c", // Medium gray for secondary text
    },
  },
  typography: {
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
    ].join(","),
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
    button: {
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 4,
        },
        containedPrimary: {
          "&:hover": {
            backgroundColor: "#d2691e", // Darker orange on hover
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
  },
});

/**
 * The root component for the Fake Stack Overflow application.
 *
 * It is composed of a Header and a Main component.
 *
 * It uses the following state variables:
 * - search: the search string
 * - mainTitle: the title of the main page
 * - questionOrder: the order of the questions
 * - qid: the question id
 * - pageInstance: the current page object rendered in the Main component
 * - currentView: controls which main view is displayed (main content or signup)
 *
 * It defines functions to set the page the user has requested to see.
 * @returns the Fake Stack Overflow component
 */
const FakeStackOverflow = () => {
  const [search, setSearch] = useState<string>("");
  const [mainTitle, setMainTitle] = useState<string>("All Questions");
  const [questionOrder, setQuestionOrder] = useState("newest");
  const [qid, setQid] = useState("");
  const [currentView, setCurrentView] = useState<string>("main");

  // Handle sign up button click
  const handleSignUp = () => {
    setCurrentView("signup");
  };

  const handleLogin = () => {
    setCurrentView("login");
  };

  const handleMyProfile = () => {
    setCurrentView("profile");
  };

  // Return to main view after signup or cancellation
  const handleBackToMain = () => {
    setCurrentView("main");
  };

  // Set the page to display the questions based on the search string
  const setQuestionPage = (search = "", title = "All Questions"): void => {
    setSearch(search);
    setMainTitle(title);
    setPageInstance(
      new HomePageClass({
        search,
        title,
        setQuestionPage,
        questionOrder,
        setQuestionOrder,
        qid,
        handleQuestions,
        handleTags,
        handleAnswer,
        clickTag,
        handleNewQuestion,
        handleNewAnswer,
      })
    );
  };

  // Set the page to display all questions
  const handleQuestions = () => {
    setSearch("");
    setMainTitle("All Questions");
    setPageInstance(
      new HomePageClass({
        search: "",
        title: "All Questions",
        setQuestionPage,
        questionOrder,
        setQuestionOrder,
        qid,
        handleQuestions,
        handleTags,
        handleAnswer,
        clickTag,
        handleNewQuestion,
        handleNewAnswer,
      })
    );
  };

  // Set the page to display the tags
  const handleTags = () => {
    setPageInstance(
      new TagPageClass({
        search,
        title: mainTitle,
        setQuestionPage,
        questionOrder,
        setQuestionOrder,
        qid,
        handleQuestions,
        handleTags,
        handleAnswer,
        clickTag,
        handleNewQuestion,
        handleNewAnswer,
      })
    );
  };

  // Set the page to display the answers to a question
  const handleAnswer = (questionId: string) => {
    setQid(questionId);
    setPageInstance(
      new AnswerPageClass({
        search,
        title: mainTitle,
        setQuestionPage,
        questionOrder,
        setQuestionOrder,
        qid: questionId, // Use the parameter directly to ensure it's updated immediately
        handleQuestions,
        handleTags,
        handleAnswer,
        clickTag,
        handleNewQuestion,
        handleNewAnswer,
      })
    );
  };

  // Handle navigation from profile to question
  const handleNavigateToQuestion = (questionId: string) => {
    // Set current view to main first to ensure proper rendering
    setCurrentView("main");
    
    // Use setTimeout to ensure state updates have completed
    setTimeout(() => {
      // Navigate to the question
      handleAnswer(questionId);
    }, 0);
  };

  // Set the page to display the questions based on the selected tag name
  const clickTag = (tname: string) => {
    setSearch("[" + tname + "]");
    setMainTitle(tname);
    setPageInstance(
      new HomePageClass({
        search: "[" + tname + "]",
        title: tname,
        setQuestionPage,
        questionOrder,
        setQuestionOrder,
        qid,
        handleQuestions,
        handleTags,
        handleAnswer,
        clickTag,
        handleNewQuestion,
        handleNewAnswer,
      })
    );
  };

  // Set the page to display the form to create a new question
  const handleNewQuestion = () => {
    setPageInstance(
      new NewQuestionPageClass({
        search,
        title: mainTitle,
        setQuestionPage,
        questionOrder,
        setQuestionOrder,
        qid,
        handleQuestions,
        handleTags,
        handleAnswer,
        clickTag,
        handleNewQuestion,
        handleNewAnswer,
      })
    );
  };

  // Set the page to display the form to create a new answer
  const handleNewAnswer = () => {
    setPageInstance(
      new NewAnswerPageClass({
        search,
        title: mainTitle,
        setQuestionPage,
        questionOrder,
        setQuestionOrder,
        qid,
        handleQuestions,
        handleTags,
        handleAnswer,
        clickTag,
        handleNewQuestion,
        handleNewAnswer,
      })
    );
  };

  // The current page object used to render the Main component
  const [pageInstance, setPageInstance] = useState(
    new HomePageClass({
      search: "",
      title: "All Questions",
      setQuestionPage,
      questionOrder,
      setQuestionOrder,
      qid,
      handleQuestions,
      handleTags,
      handleAnswer,
      clickTag,
      handleNewQuestion,
      handleNewAnswer,
    })
  );

  /**
   * set relevant properties in the pageInstance object
   * to be used when rendering the relevant component in Main.
   * This is bad practice as mutating the object directly is not recommended.
   * Must be refactored at some point.
   */
  pageInstance.search = search;
  pageInstance.questionOrder = questionOrder;
  pageInstance.qid = qid;
  pageInstance.title = mainTitle;

  // Render back button
  const renderBackButton = () => (
    <Box
      sx={{
        mb: 3,
        position: "absolute",
        left: { xs: 16, sm: 24, md: 32 },
        top: { xs: 72, sm: 80 },
        zIndex: 1,
      }}
    >
      <Button
        variant="outlined"
        color="primary"
        startIcon={<ArrowBackIcon />}
        onClick={handleBackToMain}
        sx={{ borderRadius: 2 }}
      >
        Back to Questions
      </Button>
    </Box>
  );

  // Render the appropriate content based on the current view
  const renderContent = () => {
    switch (currentView) {
      case "main":
        return (
          <Main
            page={pageInstance}
            handleQuestions={handleQuestions}
            handleTags={handleTags}
          />
        );
      case "signup":
        return (
          <Box sx={{ maxWidth: 600, mx: "auto" }}>
            {renderBackButton()}
            <SignUp handleLogin={() => setCurrentView("login")} />
          </Box>
        );
      case "login":
        return (
          <Box sx={{ maxWidth: 600, mx: "auto" }}>
            {renderBackButton()}
            <Login
              handleSignUp={() => setCurrentView("signup")}
              handleBackToMain={handleBackToMain}
            />
          </Box>
        );
      case "profile":
        return (
          <Box>
            {renderBackButton()}
            <Profile 
              handleBackToMain={handleBackToMain} 
              handleNavigateToQuestion={handleNavigateToQuestion}
            />
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "background.default",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Header
          search={search}
          setQuestionPage={setQuestionPage}
          onSignUpClick={handleSignUp}
          onLoginClick={handleLogin}
          onMyProfileClick={handleMyProfile}
        />

        <Container maxWidth="xl" sx={{ py: 3, flexGrow: 1 }}>
          {renderContent()}
        </Container>

        <Box
          component="footer"
          sx={{
            p: 3,
            bgcolor: "background.paper",
            borderTop: 1,
            borderColor: "divider",
            textAlign: "center",
          }}
        >
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} Fake Stack Overflow
          </Typography>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default FakeStackOverflow;
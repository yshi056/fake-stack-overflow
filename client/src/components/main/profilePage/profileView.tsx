import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Container,
  Paper,
  Button,
  TextField,
  List,
  ListItemText,
  ListItemButton,
  Divider,
  Card,
  CardContent,
  Stack,
  Chip,
  Avatar,
  CircularProgress
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
import EditIcon from "@mui/icons-material/Edit";
import LogoutIcon from "@mui/icons-material/Logout";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { VoidFunctionType } from "../../../types/functionTypes";
import { useLogout } from "../../../hooks/useLogout";

// Define interfaces for our data types
interface Question {
  id: string;
  title: string;
  votes: number;
  answers: number;
  views: number;
}

interface Answer {
  id: string;
  questionId: string;
  qid?: string; // Optional field that might be in the API response
  questionTitle: string;
  text?: string;
  votes: number;
}

// Define the API response shape
interface ApiAnswer {
  id: string;
  questionId?: string;
  qid?: string;
  questionTitle?: string;
  text?: string;
  votes?: number;
  question?: {
    id: string;
    title: string;
  };
  [key: string]: any; // For other fields that might be in the response
}

interface UserData {
  username: string;
  email: string;
  joinDate: string;
  questions: Question[];
  answers: Answer[];
}

interface ProfileProps {
  handleBackToMain: VoidFunctionType;
  handleNavigateToQuestion?: (questionId: string) => void;
}

const Profile = ({ handleBackToMain, handleNavigateToQuestion }: ProfileProps) => {
  const [activeSection, setActiveSection] = useState<string>("profile");
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // Use the logout hook
  const { logout, isLoggingOut, logoutError } = useLogout(() => {
    // After successful logout, redirect to home page
    window.location.href = "/";
  });

  // Initialize user data with proper types
  const [userData, setUserData] = useState<UserData>({
    username: "",
    email: "",
    joinDate: "",
    questions: [],
    answers: [],
  });

  // Function to handle question navigation via props instead of direct routing
  const navigateToQuestion = (questionId: string) => {
    if (handleNavigateToQuestion) {
      // Add debugging
      console.log("Profile - navigating to question:", questionId);
      handleNavigateToQuestion(questionId);
    } else {
      console.warn("Navigation handler not provided to Profile component");
    }
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      setIsLoading(true);
      try {
        const res = await fetch("http://localhost:8000/user/profile", {
          method: "GET",
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to fetch profile");
        const data = await res.json();
        
        console.log("API Response from profile:", data);
        
        // Format the join date if available, otherwise use a placeholder
        const formattedJoinDate = data.joinDate 
          ? new Date(data.joinDate).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })
          : "January 15, 2023"; // fallback
          
        // Fetch question IDs and titles for all answers
        const processedAnswers: Answer[] = [];
        
        // If answers array exists
        if (Array.isArray(data.answers)) {
          // Create a map to store question IDs and their titles
          const questionCache = new Map<string, string>();
          
          // First, get all unique question IDs from answers
          const questionIds = new Set<string>();
          
          for (const answer of data.answers) {
            // Get the question ID from the answer
            const qid = answer.qid || answer.questionId || (answer.question && answer.question.id);
            if (qid) {
              questionIds.add(qid);
            }
          }
          
          // Fetch question titles in parallel
          await Promise.all(Array.from(questionIds).map(async (qid) => {
            try {
              const questionRes = await fetch(`http://localhost:8000/question/getQuestionById/${qid}`, {
                credentials: "include",
              });
              if (questionRes.ok) {
                const questionData = await questionRes.json();
                if (questionData && questionData.title) {
                  questionCache.set(qid, questionData.title);
                }
              }
            } catch (err) {
              console.error(`Error fetching question ${qid}:`, err);
            }
          }));
          
          // Now process each answer with the cached question titles
          for (const answer of data.answers) {
            // If the answer is just an ID string, we need to fetch the answer details
            if (typeof answer === 'string') {
              try {
                const answerRes = await fetch(`http://localhost:8000/answers/${answer}`, {
                  credentials: "include",
                });
                if (answerRes.ok) {
                  const answerData = await answerRes.json();
                  const qid = answerData.qid || "";
                  
                  processedAnswers.push({
                    id: answer,
                    questionId: qid,
                    questionTitle: questionCache.get(qid) || "Question Title Not Available",
                    text: answerData.text || "",
                    votes: answerData.votes || 0
                  });
                }
              } catch (err) {
                console.error(`Error fetching answer ${answer}:`, err);
              }
            } else {
              // If the answer is an object
              const qid = answer.qid || answer.questionId || (answer.question && answer.question.id) || "";
              
              processedAnswers.push({
                id: answer._id || answer.id || "",
                questionId: qid,
                questionTitle: questionCache.get(qid) || answer.questionTitle || "Question Title Not Available",
                text: answer.text || "",
                votes: answer.votes || 0
              });
            }
          }
        }
          
        console.log("Processed Answers with titles:", processedAnswers);
        
        // Process questions
        const processedQuestions: Question[] = [];
        
        if (Array.isArray(data.questions)) {
          for (const question of data.questions) {
            if (typeof question === 'string') {
              // If question is just an ID, fetch the details
              try {
                const questionRes = await fetch(`http://localhost:8000/questions/${question}`, {
                  credentials: "include",
                });
                if (questionRes.ok) {
                  const questionData = await questionRes.json();
                  processedQuestions.push({
                    id: question,
                    title: questionData.title || "Unknown Question",
                    votes: questionData.votes || 0,
                    answers: Array.isArray(questionData.answers) ? questionData.answers.length : 0,
                    views: questionData.views || 0
                  });
                }
              } catch (err) {
                console.error(`Error fetching question ${question}:`, err);
              }
            } else {
              // If question is an object
              processedQuestions.push({
                id: question._id || question.id || "",
                title: question.title || "Unknown Question",
                votes: question.votes || 0,
                answers: Array.isArray(question.answers) ? question.answers.length : 0,
                views: question.views || 0
              });
            }
          }
        }
        
        console.log("Processed Questions:", processedQuestions);
        
        setUserData({
          username: data.username || "",
          email: data.email || "",
          joinDate: formattedJoinDate,
          questions: processedQuestions,
          answers: processedAnswers,
        });
      } catch (err) {
        console.error("Error loading profile:", err);
        // Keep default mock data in case of error
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  // Edit form state
  const [editForm, setEditForm] = useState({
    username: userData.username,
  });

  // Update edit form when userData changes
  useEffect(() => {
    setEditForm({ username: userData.username });
  }, [userData.username]);

  // Handle edit form changes
  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditForm({ ...editForm, [name]: value });
  };

  // Handle form submission
  const handleSaveProfile = async () => {
    try {
      // Call API to update profile
      const res = await fetch("http://localhost:8000/user/profile", {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: editForm.username }),
      });
      
      if (!res.ok) throw new Error("Failed to update profile");
      
      // Update user data with edited values
      setUserData({ ...userData, username: editForm.username });
      // Exit edit mode
      setIsEditing(false);
    } catch (err) {
      console.error("Error updating profile:", err);
      // Handle error (could show an error message to the user)
    }
  };

  // Render the profile section content
  const renderProfileSection = () => {
    if (isLoading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      );
    }
    
    if (isEditing) {
      return (
        <Paper elevation={1} sx={{ p: 3, borderRadius: 2 }}>
          <Typography
            variant="h5"
            component="h3"
            sx={{ mb: 3, fontWeight: "bold", color: "primary.main" }}
          >
            Edit Profile
          </Typography>
          <Box component="form" sx={{ mb: 3 }}>
            <Stack spacing={3}>
              <TextField
                fullWidth
                id="username"
                name="username"
                label="Username"
                variant="outlined"
                value={editForm.username}
                onChange={handleEditChange}
              />

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography
                  variant="body1"
                  component="span"
                  sx={{ fontWeight: "medium" }}
                >
                  Email:
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Typography variant="body1" sx={{ mr: 1 }}>
                    {userData.email}
                  </Typography>
                  <Chip
                    label="Cannot be changed"
                    size="small"
                    color="default"
                    variant="outlined"
                  />
                </Box>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography
                  variant="body1"
                  component="span"
                  sx={{ fontWeight: "medium" }}
                >
                  Joined:
                </Typography>
                <Typography variant="body1">{userData.joinDate}</Typography>
              </Box>
            </Stack>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSaveProfile}
              startIcon={<EditIcon />}
            >
              Save Changes
            </Button>
          </Box>
        </Paper>
      );
    }

    return (
      <Paper elevation={1} sx={{ p: 3, borderRadius: 2 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography
            variant="h5"
            component="h3"
            sx={{ fontWeight: "bold", color: "primary.main" }}
          >
            My Profile
          </Typography>
          <Avatar sx={{ bgcolor: "primary.main", width: 50, height: 50 }}>
            {userData.username ? userData.username.charAt(0).toUpperCase() : "U"}
          </Avatar>
        </Box>

        <Divider sx={{ mb: 3 }} />

        <Stack spacing={2} sx={{ mb: 4 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography
              variant="body1"
              component="span"
              sx={{ fontWeight: "medium" }}
            >
              Username:
            </Typography>
            <Typography variant="body1">{userData.username}</Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography
              variant="body1"
              component="span"
              sx={{ fontWeight: "medium" }}
            >
              Email:
            </Typography>
            <Typography variant="body1">{userData.email}</Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography
              variant="body1"
              component="span"
              sx={{ fontWeight: "medium" }}
            >
              Joined:
            </Typography>
            <Typography variant="body1">{userData.joinDate}</Typography>
          </Box>
        </Stack>

        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setIsEditing(true)}
            startIcon={<EditIcon />}
          >
            Edit Profile
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={logout}
            startIcon={<LogoutIcon />}
            disabled={isLoggingOut}
          >
            {isLoggingOut ? "Logging out..." : "Logout"}
          </Button>
        </Box>
        
        {/* Display logout error if any */}
        {logoutError && (
          <Typography color="error" sx={{ mt: 2, textAlign: "right" }}>
            {logoutError}
          </Typography>
        )}
      </Paper>
    );
  };

  // Render the questions section
  const renderQuestionsSection = () => (
    <Paper elevation={1} sx={{ p: 3, borderRadius: 2 }}>
      <Typography
        variant="h5"
        component="h3"
        sx={{ mb: 3, fontWeight: "bold", color: "primary.main" }}
      >
        My Questions
      </Typography>

      <Divider sx={{ mb: 3 }} />

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : userData.questions && userData.questions.length > 0 ? (
        <Stack spacing={2}>
          {userData.questions.map((question) => (
            <Card
              key={question.id}
              variant="outlined"
              sx={{ 
                "&:hover": { boxShadow: 2, cursor: 'pointer' },
                transition: 'all 0.2s' 
              }}
              onClick={() => {
                // Only navigate if id exists
                if (question.id && handleNavigateToQuestion) {
                  console.log("Clicked on question:", question);
                  handleNavigateToQuestion(question.id);
                } else {
                  console.warn("Cannot navigate: Missing questionId or navigation handler");
                }
              }}
            >
              <CardContent>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ color: "primary.main" }}
                >
                  {question.title}
                </Typography>
                <Box sx={{ display: "flex", gap: 3, mt: 2 }}>
                  <Chip
                    icon={<ThumbUpIcon />}
                    label={`${question.votes} votes`}
                    size="small"
                    variant="outlined"
                  />
                  <Chip
                    icon={<QuestionAnswerIcon />}
                    label={`${question.answers} answers`}
                    size="small"
                    variant="outlined"
                  />
                  <Chip
                    icon={<VisibilityIcon />}
                    label={`${question.views} views`}
                    size="small"
                    variant="outlined"
                  />
                </Box>
              </CardContent>
            </Card>
          ))}
        </Stack>
      ) : (
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ textAlign: "center", py: 4 }}
        >
          You haven't asked any questions yet.
        </Typography>
      )}
    </Paper>
  );

  // Render the answers section
  const renderAnswersSection = () => (
    <Paper elevation={1} sx={{ p: 3, borderRadius: 2 }}>
      <Typography
        variant="h5"
        component="h3"
        sx={{ mb: 3, fontWeight: "bold", color: "primary.main" }}
      >
        My Answers
      </Typography>

      <Divider sx={{ mb: 3 }} />

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : userData.answers && userData.answers.length > 0 ? (
        <Stack spacing={2}>
          {userData.answers.map((answer) => (
            <Card
              key={answer.id}
              variant="outlined"
              sx={{ 
                "&:hover": { boxShadow: 2, cursor: 'pointer' },
                transition: 'all 0.2s'
              }}
              onClick={() => {
                // Only navigate if questionId is available
                if (answer.questionId && handleNavigateToQuestion) {
                  console.log("Clicked on answer, navigating to question:", answer.questionId);
                  handleNavigateToQuestion(answer.questionId);
                } else {
                  console.warn("Cannot navigate: Missing questionId or navigation handler for answer", answer);
                }
              }}
            >
              <CardContent>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ color: "text.primary" }}
                >
                  {answer.questionTitle && answer.questionTitle !== "Question Title Not Available" 
                    ? `Question: ${answer.questionTitle}` 
                    : "Question: (Title not available)"}
                </Typography>
                <Typography 
                  variant="subtitle1"
                  sx={{ mb: 2, fontWeight: "medium", color: "primary.main" }}
                >
                  Your Answer:
                </Typography>
                {answer.text && (
                  <Typography 
                    variant="body1" 
                    sx={{ mb: 2, color: "text.secondary" }}
                  >
                    {answer.text.length > 100 
                      ? `${answer.text.substring(0, 100)}...` 
                      : answer.text}
                  </Typography>
                )}
                <Box sx={{ display: "flex", gap: 3, mt: 2 }}>
                  <Chip
                    icon={<ThumbUpIcon />}
                    label={`${answer.votes || 0} votes`}
                    size="small"
                    variant="outlined"
                  />
                </Box>
              </CardContent>
            </Card>
          ))}
        </Stack>
      ) : (
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ textAlign: "center", py: 4 }}
        >
          You haven't answered any questions yet.
        </Typography>
      )}
    </Paper>
  );

  // Render the active section content
  const renderSection = () => {
    switch (activeSection) {
      case "profile":
        return renderProfileSection();
      case "questions":
        return renderQuestionsSection();
      case "answers":
        return renderAnswersSection();
      default:
        return <Typography>Select a section from the sidebar</Typography>;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 3,
        }}
      >
        {/* Sidebar */}
        <Box
          sx={{ width: { xs: "100%", md: "25%" }, minWidth: { md: "250px" } }}
        >
          <Paper elevation={2} sx={{ borderRadius: 2 }}>
            <List component="nav" sx={{ p: 0 }}>
              <ListItemButton
                selected={activeSection === "profile"}
                onClick={() => setActiveSection("profile")}
                sx={{
                  borderLeft:
                    activeSection === "profile"
                      ? "4px solid #1976d2"
                      : "4px solid transparent",
                  py: 2,
                }}
              >
                <PersonIcon
                  sx={{
                    mr: 2,
                    color:
                      activeSection === "profile" ? "primary.main" : "inherit",
                  }}
                />
                <ListItemText
                  primary="My Profile"
                  primaryTypographyProps={{
                    fontWeight: activeSection === "profile" ? "bold" : "normal",
                    color:
                      activeSection === "profile" ? "primary.main" : "inherit",
                  }}
                />
              </ListItemButton>

              <Divider />

              <ListItemButton
                selected={activeSection === "questions"}
                onClick={() => setActiveSection("questions")}
                sx={{
                  borderLeft:
                    activeSection === "questions"
                      ? "4px solid #1976d2"
                      : "4px solid transparent",
                  py: 2,
                }}
              >
                <QuestionMarkIcon
                  sx={{
                    mr: 2,
                    color:
                      activeSection === "questions"
                        ? "primary.main"
                        : "inherit",
                  }}
                />
                <ListItemText
                  primary="My Questions"
                  primaryTypographyProps={{
                    fontWeight:
                      activeSection === "questions" ? "bold" : "normal",
                    color:
                      activeSection === "questions"
                        ? "primary.main"
                        : "inherit",
                  }}
                />
              </ListItemButton>

              <Divider />

              <ListItemButton
                selected={activeSection === "answers"}
                onClick={() => setActiveSection("answers")}
                sx={{
                  borderLeft:
                    activeSection === "answers"
                      ? "4px solid #1976d2"
                      : "4px solid transparent",
                  py: 2,
                }}
              >
                <QuestionAnswerIcon
                  sx={{
                    mr: 2,
                    color:
                      activeSection === "answers" ? "primary.main" : "inherit",
                  }}
                />
                <ListItemText
                  primary="My Answers"
                  primaryTypographyProps={{
                    fontWeight: activeSection === "answers" ? "bold" : "normal",
                    color:
                      activeSection === "answers" ? "primary.main" : "inherit",
                  }}
                />
              </ListItemButton>

              <Divider />

            </List>
          </Paper>

          <Box sx={{ mt: 3 }}>
            <Button
              variant="outlined"
              fullWidth
              color="primary"
              onClick={handleBackToMain}
              sx={{ py: 1.5 }}
            >
              Back to Main
            </Button>
          </Box>
        </Box>

        {/* Main content */}
        <Box sx={{ flexGrow: 1 }}>{renderSection()}</Box>
      </Box>
    </Container>
  );
};

export default Profile;
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Divider,
  Button,
  TextField,
  Card,
  CardContent,
  IconButton,
  Avatar,
  Chip,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  Container,
} from "@mui/material";
import {
  ThumbUp as ThumbUpIcon,
  ThumbDown as ThumbDownIcon,
  Comment as CommentIcon,
  Send as SendIcon,
  Cancel as CancelIcon,
  AddComment as AddCommentIcon,
  Visibility as VisibilityIcon,
  HowToVote as HowToVoteIcon,
} from "@mui/icons-material";
import { getMetaData } from "../../../utils";
import { VoidFunctionType } from "../../../types/functionTypes";
import { useAnswerPage } from "../../../hooks/useAnswerPage";
import { useComment } from "../../../hooks/useComment";
import { CommentType } from "../comment/commentSection";

// Add the missing AnswerType interface
interface AnswerType {
  _id?: string;
  text: string;
  ans_by: string;
  ans_date_time: string;
}

// The type of the props for the AnswerPage component
interface AnswerPageProps {
  qid: string;
  handleNewQuestion: VoidFunctionType;
  handleNewAnswer: VoidFunctionType;
}

// Interface for vote data
interface VoteData {
  user: string;
  vote: "up" | "down";
}

// Type for storing votes by question and answer index
interface VoteStore {
  [questionId: string]: {
    [answerIndex: number]: VoteData[];
  };
}

// Extending the AnswerType to include upVotes and downVotes properties
// that might be returned from the backend
interface ExtendedAnswerType extends AnswerType {
  upVotes?: string[];
  downVotes?: string[];
}

/**
 * The component renders all the answers for a question.
 * It uses a hook to fetch the question and its answers.
 * @param props contains the qid, handleNewQuestion and handleNewAnswer functions
 * which are used by the new question and answer forms
 * @returns the AnswerPage component
 */
const AnswerPage = ({
  qid,
  handleNewQuestion,
  handleNewAnswer,
}: AnswerPageProps) => {
  const { question, refetchQuestion } = useAnswerPage(qid);

  // Comment state
  const [activeCommentForm, setActiveCommentForm] = useState<number | null>(null);
  const [commentsByAnswer, setCommentsByAnswer] = useState<{[answerId: string]: CommentType[]}>({});
  
  // Vote state
  const [answerVotes, setAnswerVotes] = useState<{
    [answerIndex: number]: VoteData[];
  }>({});
  const [currentUser, setCurrentUser] = useState<{id: string, username: string} | null>(null);
  const [voteDialogOpen, setVoteDialogOpen] = useState<boolean>(false);
  const [currentAnswerIndex, setCurrentAnswerIndex] = useState<number | null>(null);
  const [currentAnswerId, setCurrentAnswerId] = useState<string | null>(null);
  
  // Comment hook for the active answer
  const commentHook = useComment({
    entityId: currentAnswerId || "",
    entityType: "answer",
  });

  // Fetch current user on component mount
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await fetch("http://localhost:8000/user/profile", {
          credentials: "include"
        });
        
        if (response.ok) {
          const userData = await response.json();
          setCurrentUser({
            id: userData._id,
            username: userData.username
          });
          
          // Set username for comment hook as well
          commentHook.setUsername(userData.username);
        } else {
          console.log("User not authenticated");
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };
    
    fetchCurrentUser();
  }, []);
  
  // Load initial votes from backend on component mount
  useEffect(() => {
    const fetchInitialVotes = async () => {
      if (!question) return;
      
      try {
        // Initialize temporary votes storage
        const initialVotes: {[answerIndex: number]: VoteData[]} = {};
        
        // For each answer, we can fetch its votes from the backend or use any other source
        // This assumes the backend returns the upvotes and downvotes for each answer
        question.answers.forEach((answer, index) => {
          if (answer._id) {
            // Cast the answer to our extended type to access upVotes and downVotes
            const extendedAnswer = answer as unknown as ExtendedAnswerType;
            const upVotes = extendedAnswer.upVotes || [];
            const downVotes = extendedAnswer.downVotes || [];
            
            // Convert to our VoteData format
            const votes: VoteData[] = [
              ...upVotes.map((userId: string) => ({ user: userId, vote: "up" as const })),
              ...downVotes.map((userId: string) => ({ user: userId, vote: "down" as const }))
            ];
            
            initialVotes[index] = votes;
          }
        });
        
        setAnswerVotes(initialVotes);
      } catch (error) {
        console.error("Error fetching initial votes:", error);
      }
    };
    
    fetchInitialVotes();
  }, [question]);

  // Update our commentsByAnswer whenever the comments from the hook change
  useEffect(() => {
    if (currentAnswerId && commentHook.comments.length > 0) {
      setCommentsByAnswer(prev => ({
        ...prev,
        [currentAnswerId]: commentHook.comments
      }));
    }
  }, [commentHook.comments, currentAnswerId]);

  // Fetch comments for all answers when question loads
  useEffect(() => {
    const fetchAllAnswerComments = async () => {
      if (!question || !question.answers) return;
      
      const commentsMap: {[answerId: string]: CommentType[]} = {};
      
      for (const answer of question.answers) {
        if (answer._id) {  // Only process answers that have an _id
          try {
            const response = await fetch(`http://localhost:8000/answer/${answer._id}/comment`, {
              credentials: 'include'
            });
            
            if (response.ok) {
              const comments = await response.json();
              console.log(`Fetched comments for answer ${answer._id}:`, comments);
              
              commentsMap[answer._id] = comments.map((comment: any) => {
                // Safeguard against missing or malformed data
                if (!comment) {
                  return {
                    _id: 'temp-' + Math.random().toString(36).substring(7),
                    text: 'Error loading comment',
                    username: 'Unknown',
                    timestamp: 'Unknown',
                    comment_date_time: new Date().toISOString()
                  };
                }
                
                // Handle the case where we might have received a string instead of an object
                let parsedComment = comment;
                if (typeof comment === 'string') {
                  try {
                    parsedComment = JSON.parse(comment);
                  } catch (e) {
                    console.error('Failed to parse comment string:', e);
                    // If it's a string but not valid JSON, we'll try to extract data using regex
                    const textMatch = comment.match(/text: '([^']*)'/) || comment.match(/text: "([^"]*)"/);
                    const userMatch = comment.match(/user: '([^']*)'/) || comment.match(/user: "([^"]*)"/);
                    
                    parsedComment = {
                      _id: 'parsed-' + Math.random().toString(36).substring(7),
                      text: textMatch ? textMatch[1] : 'Unparseable content',
                      user: userMatch ? userMatch[1] : 'Unknown',
                      comment_date_time: new Date().toISOString()
                    };
                  }
                }
                
                // Ensure required fields exist and are the right type
                const commentId = parsedComment._id?.toString() || ('temp-' + Math.random().toString(36).substring(7));
                
                // Special handling for text field to ensure it's a string
                let commentText = 'No content';
                if (parsedComment.text !== undefined) {
                  if (typeof parsedComment.text === 'string') {
                    commentText = parsedComment.text;
                  } else if (parsedComment.text !== null) {
                    // Try to convert non-string text to string
                    commentText = String(parsedComment.text);
                  }
                }
                
                const commentUser = parsedComment.user || '';
                const commentUsername = parsedComment.user || 'Anonymous';
                const commentDate = parsedComment.comment_date_time ? new Date(parsedComment.comment_date_time) : new Date();
                
                return {
                  _id: commentId,
                  text: commentText,
                  username: commentUsername,
                  timestamp: getMetaData(commentDate),
                  comment_date_time: commentDate.toISOString()
                };
              });
            }
          } catch (error) {
            console.error(`Error fetching comments for answer ${answer._id}:`, error);
          }
        }
      }
      
      console.log('Initial comments map:', commentsMap);
      setCommentsByAnswer(commentsMap);
    };
    
    fetchAllAnswerComments();
  }, [question]);

  // Save votes to localStorage whenever they change
  useEffect(() => {
    if (Object.keys(answerVotes).length === 0) return;

    // Get current votes from localStorage
    const savedVotesString = localStorage.getItem("answerVotes");
    let savedVotes: VoteStore = {};

    if (savedVotesString) {
      try {
        savedVotes = JSON.parse(savedVotesString);
      } catch (error) {
        console.error("Error parsing saved votes:", error);
      }
    }

    // Update with new votes
    savedVotes[qid] = answerVotes;
    localStorage.setItem("answerVotes", JSON.stringify(savedVotes));
  }, [answerVotes, qid]);

  if (!question) {
    return null;
  }

  // Function to handle showing comment form for a specific answer
  const handleShowCommentForm = (answerIndex: number, aid: string) => {
    setActiveCommentForm(answerIndex);
    setCurrentAnswerId(aid);
    commentHook.setCommentText("");
    
    // Fetch existing comments for this answer when opening the form
    commentHook.fetchComments();
  };

  // Function to handle adding a comment
  const handleAddComment = async () => {
    if (!currentAnswerId) return;
    
    await commentHook.postComment();
    
    // After successful comment creation, the hook already fetches the updated comments
    if (!commentHook.commentErr && !commentHook.usernameErr) {
      // Directly update the commentsByAnswer with the hook's comments
      setCommentsByAnswer(prev => ({
        ...prev,
        [currentAnswerId]: commentHook.comments
      }));
      
      // Call refetchQuestion to refresh all data
      refetchQuestion();
      
      setActiveCommentForm(null);
    }
  };

  // Function to open vote dialog
  const handleOpenVoteDialog = (answerIndex: number, aid: string) => {
    setCurrentAnswerIndex(answerIndex);
    setCurrentAnswerId(aid);
    setVoteDialogOpen(true);
  };

  // Function to calculate vote count for an answer
  const getVoteCount = (answerIndex: number) => {
    if (!answerVotes[answerIndex]) return 0;

    return answerVotes[answerIndex].reduce((count, vote) => {
      return count + (vote.vote === "up" ? 1 : -1);
    }, 0);
  };

  // Function to handle voting
  const handleVote = (voteType: "up" | "down") => {
    if (currentAnswerIndex === null || !currentAnswerId || !currentUser) {
      // If no user is logged in, show login dialog or redirect to login
      if (!currentUser) {
        alert("Please log in to vote");
        return;
      }
      return;
    }

    // Check if user already voted
    const existingVotes = answerVotes[currentAnswerIndex] || [];
    const existingVote = existingVotes.find((v) => v.user === currentUser.id);

    // Handle vote logic on the frontend
    let updatedVotes;
    if (existingVote) {
      // User already voted, update their vote
      if (existingVote.vote === voteType) {
        // Remove the vote if clicking the same button
        updatedVotes = {
          ...answerVotes,
          [currentAnswerIndex]: existingVotes.filter(
            (v) => v.user !== currentUser.id
          ),
        };
      } else {
        // Change vote if clicking different button
        updatedVotes = {
          ...answerVotes,
          [currentAnswerIndex]: existingVotes.map((v) =>
            v.user === currentUser.id ? { ...v, vote: voteType } : v
          ),
        };
      }
    } else {
      // New vote
      updatedVotes = {
        ...answerVotes,
        [currentAnswerIndex]: [
          ...existingVotes,
          { user: currentUser.id, vote: voteType },
        ],
      };
    }

    // Update the state immediately to reflect the change in UI
    setAnswerVotes(updatedVotes);

    // Also call the API to update votes in the database
    const apiEndpoint = `http://localhost:8000/answer/${currentAnswerId}/${voteType === "up" ? "upvote" : "downvote"}`;
    
    fetch(apiEndpoint, {
      method: 'PATCH',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      // We don't need to check if the response is ok or try to parse it
      // Just log that we made the request
      console.log('Vote request sent to server');
    })
    .catch(error => {
      console.error('Error sending vote request:', error);
      // If there's a network error, revert the local state
      setAnswerVotes(answerVotes);
      // Don't show an alert as the vote is likely still saved
    });

    setVoteDialogOpen(false);
  };

  // Function to check if user has already voted
  const getUserVote = (answerIndex: number) => {
    if (!answerVotes[answerIndex] || !currentUser) return null;
    const userVote = answerVotes[answerIndex].find((v) => v.user === currentUser.id);
    return userVote ? userVote.vote : null;
  };

  // Get vote color based on count
  const getVoteColor = (count: number) => {
    if (count > 0) return "success";
    if (count < 0) return "error";
    return "default";
  };

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      {/* Question Header and Body */}
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
              icon={<CommentIcon />}
              label={`${question.answers.length} ${
                question.answers.length === 1 ? "answer" : "answers"
              }`}
              color="primary"
              variant="outlined"
              sx={{ fontWeight: "bold", fontSize: "0.9rem", height: 32 }}
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
            {question.title}
          </Typography>

          <Button
            variant="contained"
            color="primary"
            onClick={handleNewQuestion}
          >
            Ask a Question
          </Button>
        </Box>

        <Divider sx={{ mb: 3 }} />
      </Box>

      <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 1, gap: 1 }}>
          <Chip
            icon={<VisibilityIcon />}
            label={`${question.views} views`}
            variant="outlined"
            size="small"
          />
        </Box>

        <Typography variant="body1" sx={{ whiteSpace: "pre-wrap", mb: 3 }}>
          {question.text}
        </Typography>

        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            mt: 2,
          }}
        >
          <Box sx={{ textAlign: "right" }}>
            <Typography variant="body2" color="text.secondary">
              Asked by {question.asked_by}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {getMetaData(new Date(question.ask_date_time))}
            </Typography>
          </Box>
          <Avatar sx={{ ml: 2, bgcolor: "primary.main" }}>
            {question.asked_by.charAt(0).toUpperCase()}
          </Avatar>
        </Box>
      </Paper>

      <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
        {question.answers.length}{" "}
        {question.answers.length === 1 ? "Answer" : "Answers"}
      </Typography>

      {/* Answers List */}
      {question.answers.map((a, idx) => {
        const voteCount = getVoteCount(idx);
        const voteColor = getVoteColor(voteCount);
        const answerId = a._id || `temp-${idx}`;  // Provide a fallback ID if _id is undefined
        const answerComments = commentsByAnswer[answerId] || [];

        return (
          <Paper
            key={idx}
            elevation={1}
            sx={{
              mb: 3,
              borderRadius: 2,
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                p: 2,
                bgcolor: "background.default",
                borderBottom: "1px solid",
                borderColor: "divider",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Tooltip
                    title={
                      voteCount === 0
                        ? "No votes yet"
                        : `${voteCount} ${voteCount === 1 ? "vote" : "votes"}`
                    }
                  >
                    <Chip
                      icon={<HowToVoteIcon />}
                      label={voteCount}
                      color={voteColor}
                      size="small"
                      variant={voteCount === 0 ? "outlined" : "filled"}
                      sx={{ minWidth: 70 }}
                    />
                  </Tooltip>

                  <Button
                    size="small"
                    variant="text"
                    color="primary"
                    onClick={() => handleOpenVoteDialog(idx, answerId)}
                    startIcon={
                      getUserVote(idx) === "up" ? (
                        <ThumbUpIcon color="success" />
                      ) : getUserVote(idx) === "down" ? (
                        <ThumbDownIcon color="error" />
                      ) : null
                    }
                    disabled={!currentUser}
                  >
                    {!currentUser ? "Login to Vote" : (getUserVote(idx) ? "Change Vote" : "Vote")}
                  </Button>
                </Box>

                <Typography variant="body2" color="text.secondary">
                  Answered by {a.ans_by} •{" "}
                  {getMetaData(new Date(a.ans_date_time))}
                </Typography>
              </Box>
            </Box>

            {/* Answer content */}
            <Box sx={{ p: 3 }}>
              <Typography
                variant="body1"
                sx={{ whiteSpace: "pre-wrap", mb: 3 }}
              >
                {a.text}
              </Typography>

              <Divider sx={{ my: 2 }} />

              {/* Comments section */}
              <Box>
                <Typography
                  variant="subtitle2"
                  sx={{ display: "flex", alignItems: "center", mb: 1 }}
                >
                  <CommentIcon fontSize="small" sx={{ mr: 1 }} />
                  Comments ({answerComments.length || 0})
                </Typography>

                {answerComments.length > 0 && (
                  <Box sx={{ mb: 2 }}>
                    {answerComments.map((comment) => {
                      // Extra log to confirm the data is present at render time
                      console.log(`Rendering comment ${comment._id}:`, comment);
                      
                      return (
                        <Card
                          key={comment._id}
                          variant="outlined"
                          sx={{ mb: 1, bgcolor: "grey.50" }}
                        >
                          <CardContent
                            sx={{ py: 1, px: 2, "&:last-child": { pb: 1 } }}
                          >
                            <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
                              {typeof comment.text === 'string' && comment.text.trim() 
                                ? comment.text 
                                : "No text available"}
                            </Typography>
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "flex-end",
                                alignItems: "center",
                                mt: 1,
                              }}
                            >
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {comment.username || "Anonymous"} • {comment.timestamp || "Unknown time"}
                              </Typography>
                            </Box>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </Box>
                )}

                {activeCommentForm === idx ? (
                  <Box sx={{ mt: 2 }}>
                    <TextField
                      fullWidth
                      multiline
                      rows={2}
                      placeholder="Write your comment here..."
                      value={commentHook.commentText}
                      onChange={(e) => commentHook.setCommentText(e.target.value)}
                      variant="outlined"
                      size="small"
                      sx={{ mb: 1 }}
                      error={!!commentHook.commentErr}
                      helperText={commentHook.commentErr}
                    />

                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: 1,
                      }}
                    >
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => setActiveCommentForm(null)}
                        startIcon={<CancelIcon />}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="contained"
                        size="small"
                        onClick={handleAddComment}
                        startIcon={<SendIcon />}
                        disabled={commentHook.isLoading}
                      >
                        {commentHook.isLoading ? "Posting..." : "Post"}
                      </Button>
                    </Box>
                  </Box>
                ) : (
                  <Button
                    variant="text"
                    size="small"
                    onClick={() => handleShowCommentForm(idx, answerId)}
                    startIcon={<AddCommentIcon />}
                    sx={{ mt: 1 }}
                  >
                    Add a comment
                  </Button>
                )}
              </Box>
            </Box>
          </Paper>
        );
      })}

      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={handleNewAnswer}
          sx={{ px: 4, py: 1 }}
        >
          Answer This Question
        </Button>
      </Box>

      {/* Vote Dialog */}
      <Dialog open={voteDialogOpen} onClose={() => setVoteDialogOpen(false)}>
        <DialogTitle>Vote on this answer</DialogTitle>
        <DialogContent>
          <Box sx={{ p: 1 }}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 2, mb: 1 }}
            >
              {currentUser ? 
                `Voting as ${currentUser.username}. What do you think about this answer?` : 
                "You must be logged in to vote"
              }
            </Typography>

            <Box
              sx={{ display: "flex", justifyContent: "space-around", mt: 2 }}
            >
              <Button
                variant="outlined"
                color="success"
                startIcon={<ThumbUpIcon />}
                onClick={() => handleVote("up")}
                sx={{ px: 3 }}
                size="large"
                disabled={!currentUser}
              >
                Helpful
              </Button>

              <Button
                variant="outlined"
                color="error"
                startIcon={<ThumbDownIcon />}
                onClick={() => handleVote("down")}
                sx={{ px: 3 }}
                size="large"
                disabled={!currentUser}
              >
                Not Helpful
              </Button>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setVoteDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AnswerPage;
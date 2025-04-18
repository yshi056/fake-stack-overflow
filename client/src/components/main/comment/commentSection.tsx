import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Card, 
  CardContent,
  Stack,
  CircularProgress,
  Collapse
} from '@mui/material';
import { 
  Send as SendIcon, 
  Cancel as CancelIcon,
  AddComment as AddCommentIcon
} from '@mui/icons-material';
import { getMetaData } from "../../../utils";
import axios from 'axios';

// Define comment type to match your schema
export interface CommentType {
  _id: string;
  text: string;
  user?: string;  // User ID
  username?: string; // Display name, set by server from JWT
  comment_date_time: string;
  timestamp: string; 
}

interface CommentSectionProps {
  answerId: string;
  comments?: CommentType[];
}

const CommentSection: React.FC<CommentSectionProps> = ({ 
  answerId,
  comments = []
}) => {
  const [commentsList, setCommentsList] = useState<CommentType[]>(comments);
  const [newComment, setNewComment] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddComment = async () => {
    // Validate input
    if (!newComment.trim()) {
      setError('Comment cannot be empty');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Prepare data - username is determined by JWT on server
      const commentData = {
        text: newComment,
        comment_date_time: new Date().toISOString()
      };
      
      // Submit to API with withCredentials for JWT cookies
      const response = await axios.post(
        `/api/answers/${answerId}/comment`, 
        commentData,
        { withCredentials: true } // This ensures cookies are sent with the request
      );
      
      if (response.data) {
        // Add new comment to list
        setCommentsList([...commentsList, response.data]);
        
        // Reset form
        setNewComment('');
        setShowForm(false);
      }
    } catch (err: any) {
      console.error('Failed to add comment:', err);
      
      // Handle authentication errors specifically
      if (err.response && err.response.status === 401) {
        setError('Please log in to add a comment');
      } else {
        setError('Failed to add comment. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box>
      {/* Comments section header */}
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: 2
        }}
      >
        <Typography 
          variant="subtitle2" 
          sx={{ 
            display: 'flex', 
            alignItems: 'center',
            fontWeight: 'medium',
            color: 'text.primary'
          }}
        >
          <AddCommentIcon 
            fontSize="small" 
            sx={{ mr: 1, color: 'primary.main' }} 
          />
          Comments ({commentsList.length})
        </Typography>
        
        {!showForm && (
          <Button
            variant="text"
            size="small"
            onClick={() => setShowForm(true)}
            sx={{ 
              textTransform: 'none',
              fontWeight: 'normal',
              fontSize: '0.875rem'
            }}
          >
            Add a comment
          </Button>
        )}
      </Box>
      
      {/* Comments list */}
      {commentsList.length > 0 ? (
        <Stack spacing={1} sx={{ mb: 2 }}>
          {commentsList.map((comment) => (
            <Card 
              key={comment._id} 
              variant="outlined" 
              sx={{ 
                boxShadow: 'none', 
                border: '1px solid',
                borderColor: 'divider',
                bgcolor: 'background.paper'
              }}
            >
              <CardContent sx={{ py: 1.5, px: 2, '&:last-child': { pb: 1.5 } }}>
                <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                  {comment.text}
                </Typography>
                
                <Box 
                  sx={{ 
                    display: 'flex', 
                    justifyContent: 'flex-end', 
                    alignItems: 'center', 
                    mt: 1 
                  }}
                >
                  <Typography 
                    variant="caption" 
                    color="text.secondary"
                    sx={{ fontStyle: 'italic' }}
                  >
                    {comment.username || 'Anonymous'} • {getMetaData(new Date(comment.comment_date_time))}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Stack>
      ) : (
        <Typography 
          variant="body2" 
          color="text.secondary" 
          sx={{ 
            fontStyle: 'italic', 
            mb: 2, 
            textAlign: 'center',
            py: 2
          }}
        >
          No comments yet
        </Typography>
      )}
      
      {/* Add comment form (collapsible) */}
      <Collapse in={showForm}>
        <Box sx={{ mt: 2 }}>
          {error && (
            <Typography 
              variant="caption" 
              color="error" 
              sx={{ display: 'block', mb: 1 }}
            >
              {error}
            </Typography>
          )}
          
          <TextField
            fullWidth
            placeholder="Write your comment here..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            multiline
            rows={2}
            size="small"
            variant="outlined"
            disabled={isSubmitting}
            sx={{ 
              mb: 2,
              '& .MuiOutlinedInput-root': {
                borderRadius: 1
              }
            }}
          />
          
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
            <Button
              variant="outlined"
              size="small"
              startIcon={<CancelIcon />}
              onClick={() => {
                setShowForm(false);
                setNewComment('');
                setError(null);
              }}
              disabled={isSubmitting}
              sx={{ textTransform: 'none' }}
            >
              Cancel
            </Button>
            
            <Button
              variant="contained"
              size="small"
              color="primary"
              onClick={handleAddComment}
              disabled={isSubmitting}
              sx={{ textTransform: 'none' }}
            >
              {isSubmitting ? (
                <CircularProgress size={16} color="inherit" sx={{ mr: 1 }} />
              ) : (
                <SendIcon fontSize="small" sx={{ mr: 1 }} />
              )}
              Post Comment
            </Button>
          </Box>
        </Box>
      </Collapse>
    </Box>
  );
};

export default CommentSection;
import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Divider, 
  Button, 
  Avatar, 
  Chip,
  IconButton,
  Badge
} from '@mui/material';
import {
  ThumbUp as ThumbUpIcon,
  ThumbDown as ThumbDownIcon,
  Comment as CommentIcon
} from '@mui/icons-material';
import { getMetaData } from "../../../utils";
import axios from 'axios';
import CommentSection, { CommentType } from './commentSection'; // Import CommentType from CommentSection

// Import or define the IComment interface
interface IComment {
  _id: string;
  text: string;
  user: string;
  comment_date_time: string;
  username?: string;
}

// Use the IAnswer interface
interface IAnswer {
  _id?: string;
  text: string;
  ans_by: string;
  ans_date_time: string;
  comments: IComment[];
  upVotes: string[];
  downVotes: string[];
}

// Map IComment to CommentType
const mapToCommentType = (comments: IComment[]): CommentType[] => {
  return comments.map(comment => ({
    _id: comment._id,
    text: comment.text,
    user: comment.user,
    username: comment.username,
    comment_date_time: comment.comment_date_time,
    timestamp: comment.comment_date_time // Add the timestamp field required by CommentType
  }));
};

interface AnswerComponentProps {
  answer: IAnswer;
  index: number;
  onVoteSuccess?: () => void;
}

const AnswerComponent: React.FC<AnswerComponentProps> = ({ 
  answer, 
  index,
  onVoteSuccess
}) => {
  // Calculate initial vote count from upVotes and downVotes arrays
  const initialVoteCount = (answer.upVotes?.length || 0) - (answer.downVotes?.length || 0);
  const [voteCount, setVoteCount] = useState(initialVoteCount);
  const [showComments, setShowComments] = useState(false);
  const [isVoting, setIsVoting] = useState(false);

  // JWT authentication doesn't need to manually store user ID in localStorage
  // The server will determine the user from the JWT cookie
  // For UI purposes, we can still check if the user has voted
  const currentUserId = localStorage.getItem('userId');
  const hasUpvoted = answer.upVotes?.includes(currentUserId || '');
  const hasDownvoted = answer.downVotes?.includes(currentUserId || '');

  const handleVote = async (voteType: 'up' | 'down') => {
    if (isVoting) return; // Prevent multiple clicks
    setIsVoting(true);
    
    try {
      // Call the API endpoint with withCredentials for JWT cookies
      const url = `/api/answers/${answer._id}/${voteType}vote`;
      const response = await axios.patch(url, {}, {
        withCredentials: true // This ensures cookies are sent with the request
      });
      
      if (response.data) {
        // Update local vote count
        const updatedUpvotes = response.data.upVotes || [];
        const updatedDownvotes = response.data.downVotes || [];
        setVoteCount(updatedUpvotes.length - updatedDownvotes.length);
        
        // Notify parent component of successful vote
        if (onVoteSuccess) {
          onVoteSuccess();
        }
      }
    } catch (error: any) {
      console.error("Voting failed:", error);
      
      // Handle authentication errors
      if (error.response && error.response.status === 401) {
        alert("Please log in to vote");
      }
    } finally {
      setIsVoting(false);
    }
  };

  // Get color based on vote count
  const getVoteColor = () => {
    if (voteCount > 0) return 'success';
    if (voteCount < 0) return 'error';
    return 'default';
  };

  // Handle comment count based on array length
  const commentCount = answer.comments?.length || 0;

  return (
    <Box 
      sx={{ 
        mb: 3, 
        borderRadius: 2, 
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        border: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper'
      }}
    >
      {/* Answer content area */}
      <Box sx={{ p: 3 }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2 
        }}>
          {/* Vote controls */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Chip
              label={voteCount}
              color={getVoteColor()}
              size="small"
              variant={voteCount === 0 ? "outlined" : "filled"}
              sx={{ fontWeight: 'bold', minWidth: 50 }}
            />
            
            <Box sx={{ display: 'flex', ml: 1 }}>
              <IconButton 
                size="small" 
                color={hasUpvoted ? 'success' : 'default'}
                onClick={() => handleVote('up')}
                disabled={isVoting}
                sx={{ 
                  border: hasUpvoted ? 1 : 0, 
                  borderColor: 'success.main',
                  p: 1
                }}
              >
                <ThumbUpIcon fontSize="small" />
              </IconButton>
              
              <IconButton 
                size="small" 
                color={hasDownvoted ? 'error' : 'default'}
                onClick={() => handleVote('down')}
                disabled={isVoting}
                sx={{ 
                  border: hasDownvoted ? 1 : 0, 
                  borderColor: 'error.main',
                  p: 1
                }}
              >
                <ThumbDownIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>
          
          {/* Comment toggle button */}
          <Button
            variant="text"
            size="small"
            startIcon={<CommentIcon />}
            onClick={() => setShowComments(!showComments)}
            color="primary"
            sx={{ textTransform: 'none' }}
          >
            <Badge 
              badgeContent={commentCount} 
              color="primary"
              sx={{ mr: 1 }}
            >
              <Typography variant="body2">
                {showComments ? 'Hide Comments' : 'Show Comments'}
              </Typography>
            </Badge>
          </Button>
        </Box>
        
        {/* Answer text */}
        <Typography 
          variant="body1" 
          sx={{ 
            whiteSpace: 'pre-wrap',
            lineHeight: 1.6 
          }}
        >
          {answer.text}
        </Typography>
        
        {/* Answer metadata/author */}
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'flex-end', 
            alignItems: 'center',
            mt: 3
          }}
        >
          <Box sx={{ textAlign: 'right' }}>
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{ fontWeight: 'medium' }}
            >
              {answer.ans_by}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              answered {getMetaData(new Date(answer.ans_date_time))}
            </Typography>
          </Box>
          
          <Avatar 
            sx={{ 
              ml: 2, 
              bgcolor: 'primary.main',
              width: 32,
              height: 32
            }}
          >
            {answer.ans_by.charAt(0).toUpperCase()}
          </Avatar>
        </Box>
      </Box>
      
      {/* Use the standalone CommentSection component */}
      {showComments && (
        <Box 
          sx={{ 
            borderTop: 1, 
            borderColor: 'divider',
            bgcolor: 'grey.50',
            p: 2
          }}
        >
          <CommentSection 
            answerId={answer._id || ''}
            comments={mapToCommentType(answer.comments || [])}
          />
        </Box>
      )}
    </Box>
  );
};

export default AnswerComponent;
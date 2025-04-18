import { useState, useEffect, useCallback } from 'react';
import { CommentType } from '../components/main/comment/commentSection';
import { getMetaData } from '../utils';

interface UseCommentProps {
  entityId: string;
  entityType: 'question' | 'answer';
}

export const useComment = ({ entityId, entityType }: UseCommentProps) => {
  const [username, setUsername] = useState('');
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState<CommentType[]>([]);
  const [usernameErr, setUsernameErr] = useState<string | undefined>(undefined);
  const [commentErr, setCommentErr] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);

  // Define fetchComments with useCallback to avoid infinite loops
  const fetchComments = useCallback(async () => {
    if (!entityId) return;
    
    setIsLoading(true);
    console.log(`Fetching comments for ${entityType}/${entityId}`);
    
    try {
      // Make a real API call to fetch comments
      const response = await fetch(`http://localhost:8000/${entityType === 'answer' ? 'answer' : 'question'}/${entityId}/comment`, {
        method: 'GET',
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch comments');
      }
      
      const data = await response.json();
      console.log(`Received ${data.length} comments:`, data);
      
      // Map the API response to our CommentType
      const fetchedComments: CommentType[] = data.map((comment: any) => {
        console.log('Processing comment:', comment);
        
        // Safeguard against missing or malformed data
        if (!comment) {
          console.error('Received null or undefined comment');
          return {
            _id: 'temp-' + Math.random().toString(36).substring(7),
            text: 'Error loading comment',
            user: '',
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
        
        console.log('Mapped field text:', commentText);
        
        return {
          _id: commentId,
          text: commentText,
          user: commentUser,
          username: commentUsername,
          timestamp: getMetaData(commentDate),
          comment_date_time: commentDate.toISOString()
        };
      });
      
      console.log('Mapped comments:', fetchedComments);
      setComments(fetchedComments);
    } catch (error) {
      console.error('Error fetching comments:', error);
      // Handle error state here
    } finally {
      setIsLoading(false);
    }
  }, [entityId, entityType]);

  // Refetch comments when the entityId changes
  useEffect(() => {
    if (entityId) {
      fetchComments();
    }
  }, [entityId, fetchComments]);

  // Function to post a new comment
  const postComment = async () => {
    // Reset errors
    setUsernameErr(undefined);
    setCommentErr(undefined);
    
    let hasError = false;
    
    if (!username.trim()) {
      setUsernameErr("Username cannot be empty");
      hasError = true;
    }
    
    if (!commentText.trim()) {
      setCommentErr("Comment cannot be empty");
      hasError = true;
    }
    
    if (hasError) return;
    
    setIsLoading(true);
    
    try {
      console.log(`Posting comment to ${entityType}/${entityId}/comment:`, commentText);
      const response = await fetch(`http://localhost:8000/${entityType === 'answer' ? 'answer' : 'question'}/${entityId}/comment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          text: commentText,
          comment_date_time: new Date().toISOString()
        })
      });

      if (!response.ok) {
        throw new Error('Failed to post comment');
      }

      // The server doesn't send a response body anymore, just a 200 status
      console.log('Comment posted successfully');
      
      // Clear comment text
      setCommentText('');
      
      // After successfully posting a comment, fetch the updated comments
      await fetchComments();
    } catch (error) {
      console.error('Error posting comment:', error);
      // Handle error state here
    } finally {
      setIsLoading(false);
    }
  };

  return {
    username,
    setUsername,
    commentText,
    setCommentText,
    comments,
    usernameErr,
    commentErr,
    isLoading,
    postComment,
    fetchComments
  };
};
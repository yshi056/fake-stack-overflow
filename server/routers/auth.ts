import express from 'express';
import { Request, Response } from 'express';

const router = express.Router();

/**
 * Logout user by clearing authentication cookie
 */
router.post('/logout', async (req: Request, res: Response) => {
  try {
    // First check if we actually have a token cookie to clear
    if (req.cookies && (req.cookies.token || req.cookies.jwt)) {
      // Clear the token cookie (the one set during login)
      if (req.cookies.token) {
        res.clearCookie('token', {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict'
        });
      }
      
      // Clear the jwt cookie if it exists (for backward compatibility)
      if (req.cookies.jwt) {
        res.clearCookie('jwt', {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict'
        });
      }
    }

    // After clearing cookies, send success response
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Error during logout:', error);
    
    // Only send error response if headers haven't been sent
    if (!res.headersSent) {
      res.status(500).json({ message: 'Internal server error during logout' });
    }
  }
});

export default router;
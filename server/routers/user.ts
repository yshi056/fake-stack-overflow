import mongoose from "mongoose";
import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/users'; // Ensure User model is registered
import { Request, Response } from 'express';
import { authenticateJWT } from '../middleware/authenticate'; // Import the middleware

//import { body, validationResult } from 'express-validator';
const router = express.Router();

/**
 * API endpoint to create a new user.
 */
router.post(
    '/signup',
    // [
    //     body('username').trim().isAlphanumeric().withMessage('Username must be alphanumeric').escape(),
    //     body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long').escape(),
    //     body('email').isEmail().withMessage('Invalid email address').normalizeEmail(),
    // ],
    async (req: Request, res: Response) => {
        // const errors = validationResult(req);
        // if (!errors.isEmpty()) {
        //     return res.status(400).json({ errors: errors.array() });
        // }

        const { username, password, email } = req.body;

        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            // Add your database logic to save the user, e.g.:
            // Check if username or email already exists
            const existingUser = await User.findOne({ 
                $or: [{ username }, { email }] 
            });

            if (existingUser) {
                res.status(400).json({ message: 'Username or email already exists' });
                return;
            }

            // Create new user
            const newUser = await User.create({ 
                username, 
                email, 
                password: hashedPassword,
                questions: [],
                answers: [],
                comments: []
            });

            // Generate JWT, ensure you have JWT_SECRET defined in environment variables
            const token = jwt.sign({ userId: newUser._id, username: username }, process.env.JWT_SECRET as string, {
                expiresIn: '1h',
            });
            res
              .cookie("token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 60 * 60 * 1000,
              })
              .status(201).json({ message: 'User created successfully' });
            return;
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
);

/**
 * API endpoint to login a user.
 */
router.post(
    '/login',
    // [
    //     body('username').trim().isAlphanumeric().withMessage('Username must be alphanumeric').escape(),
    //     body('password').notEmpty().withMessage('Password is required').escape(),
    // ],
    async (req: Request, res: Response) => {
        // const errors = validationResult(req);
        // if (!errors.isEmpty()) {
        //     return res.status(400).json({ errors: errors.array() });
        // }

        const { email, password } = req.body;

        try {
            // Find user by email
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(400).json({ message: 'Invalid email or password' });
            }

            // Compare passwords
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: 'Invalid email or password' });
            }

            // Generate JWT
            const token = jwt.sign({ userId: user._id, username: user.username }, process.env.JWT_SECRET as string, {
                expiresIn: '1h',
            });

            res
              .cookie("token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 60 * 60 * 1000,
              })
              .status(200).json({ message: 'Login successful' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
);

/**
 * API endpoint to logout a user.
 * Clears the authentication cookie.
 */
router.post('/logout', (req: Request, res: Response) => {
    // Log the request for debugging
    console.log("Logout request received");
    
    try {
        // Check if headers have already been sent
        if (res.headersSent) {
            console.error('Headers already sent, cannot clear cookies or send response');
            return;
        }
        
        // Log cookie info for debugging
        console.log("Cookies present:", req.cookies ? Object.keys(req.cookies) : 'none');
        
        // Clear token cookie if present
        if (req.cookies && req.cookies.token) {
            try {
                res.clearCookie('token', {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "strict",
                    path: '/'  // Ensure path matches cookie creation path
                });
                console.log("Token cookie cleared");
            } catch (error) {
                console.error("Error clearing token cookie:", error);
            }
        }
        
        // Check again if headers have been sent
        if (res.headersSent) {
            console.error('Headers sent during cookie clearing, cannot send response');
            return;
        }
        
        // Send response after all cookies have been cleared
        console.log("Sending successful logout response");
        res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        console.error('Error during logout:', error);
        
        // Only try to send error response if headers haven't been sent
        if (!res.headersSent) {
            res.status(500).json({ message: 'Internal server error during logout' });
        } else {
            console.error('Headers already sent, cannot send error response');
        }
    }
});

/**
 * API endpoint to get user profile by user ID.
 * This endpoint is protected and requires a valid JWT token.
 */
router.get(
  '/profile',
  authenticateJWT, // Apply the middleware
  async (req: Request, res: Response) => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized: No user ID provided' });
      }
      // Fetch user profile by ID
      //convert userID to objectId
      const userIdObject = new mongoose.Types.ObjectId(userId);
      const profile = await User.getProfileById(userIdObject);
      if (!profile) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.status(200).json(profile);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
);

export default router;
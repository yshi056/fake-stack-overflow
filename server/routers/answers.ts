import express from 'express';
import Answer from '../models/answers';
import Question from '../models/questions';
import Comment from "../models/comments";
import User from '../models/users';
import { authenticateJWT } from "../middleware/authenticate";
import mongoose from 'mongoose';

const router = express.Router();

/**
 * Add a new answer
 */
router.post("/addAnswer", authenticateJWT, async (req, res) => {
    try {
        const qid = req.body.qid;
        const text = req.body.ans.text;
        const ans_date_time = req.body.ans.ans_date_time;
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const userId = req.user.userId;
        const ans_by = req.user.username;

        const newAnswer = new Answer({
            qid,
            text,
            ans_by,
            ans_date_time
        });

        //save to user
        await User.findByIdAndUpdate(userId, { $push: { answers: newAnswer._id } }).exec();
        //save to question
        await Question.findByIdAndUpdate(qid, { $push: { answers: newAnswer._id } }).exec();

        await newAnswer.save();
        res.status(200).json(newAnswer.toJSON());
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

router.post("/:aid/comment", authenticateJWT, async (req, res) => {
    try {
        const { text, comment_date_time } = req.body;
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const userId = req.user.userId;
        const username = req.user.username;
        const answerId = req.params.aid;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const comment = await new Comment({ text, user: username, comment_date_time }).save();
        const objectId = new mongoose.Types.ObjectId(answerId);
        await Answer.findByIdAndAddComment(objectId, comment._id);
        await User.findByIdAndUpdate(userId, { $push: { comments: comment._id } }).exec();
        
        res.status(200).send();
        console.log("Comment added successfully");
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

router.patch("/:aid/upvote", authenticateJWT, async (req, res) => {
    try {
        const answerId = req.params.aid;
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const objectId = new mongoose.Types.ObjectId(answerId);
        const updated = await Answer.findByIdAndAddUpvote(objectId, userId);
        res.status(200).json(updated);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

router.patch("/:aid/downvote", authenticateJWT, async (req, res) => {
    try {
        const answerId = req.params.aid;
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const objectId = new mongoose.Types.ObjectId(answerId);
        const updated = await Answer.findByIdAndAddDownvote(objectId, userId);
        res.status(200).json(updated);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

/**
 * Get comments for a specific answer
 */
router.get("/:aid/comment", async (req, res) => {
    try {
        const answerId = req.params.aid;
        const objectId = new mongoose.Types.ObjectId(answerId);
        
        // Find the answer and populate its comments with user information
        const answer = await Answer.findById(objectId)
            .populate('comments')
            .exec();
        
        if (!answer) {
            return res.status(404).json({ message: "Answer not found" });
        }
        
        // Extract comment data and format it
        const comments = answer.comments.map((comment) => {
            // Check if it's just an ID or a full document
            // A better check than isValidObjectId, which returns true for stringified objects too
            if (!comment || typeof comment !== 'object' || !('text' in comment)) {
                return {
                    _id: comment.toString(),
                    text: "Comment not loaded properly",
                    user: "Unknown",
                    comment_date_time: new Date().toISOString()
                };
            } else {
                // It's a populated comment document
                
                // Get the comment document properties
                const commentDoc = comment as {
                    _id: mongoose.Types.ObjectId;
                    text: unknown;
                    user: { username: string } | string;
                    comment_date_time: Date;
                };
                
                // Safely access the username property
                let username = "";
                if (typeof commentDoc.user === 'object' && commentDoc.user !== null) {
                    username = commentDoc.user.username || "";
                } else if (typeof commentDoc.user === 'string') {
                    username = commentDoc.user;
                }
                
                // Ensure text is properly extracted
                const text = commentDoc.text ? String(commentDoc.text).trim() : "";
                
                return {
                    _id: commentDoc._id.toString(),
                    text: text,
                    user: username,
                    comment_date_time: commentDoc.comment_date_time
                };
            }
        });
        
        // Set Content-Type to ensure it's treated as JSON
        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json(comments);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});

export default router;
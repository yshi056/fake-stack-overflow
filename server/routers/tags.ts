import express from 'express';
import Question from '../models/questions'; // Ensure Question model is registered
const router = express.Router();

/**
 * Get all tags with count of questions
 */
router.get("/getTagsWithQuestionNumber", async (req, res) => {
  try {
    const result = await Question.getQuestionCountByTag();
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export default router;
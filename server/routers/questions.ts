import express from 'express';
import Question from '../models/questions';
import { IQuestion, ITag } from '../types/types';
import Tag from '../models/tags';
import User from '../models/users';
import { authenticateJWT } from '../middleware/authenticate';

/**
 * The router for handling questions-related requests.
 */
const router = express.Router();

// Define validation error type
interface ValidationErrorItem {
  path: string;
  message: string;
  errorCode: string;
}

// Custom error class for validation errors
class ValidationError extends Error {
    status: number;
    errors: ValidationErrorItem[];

    constructor(message: string, errors: ValidationErrorItem[]) {
        super(message);
        this.name = 'ValidationError';
        this.status = 400;
        this.errors = errors;
    }
}

/**
 * Add a new question
 */
router.post('/addQuestion', authenticateJWT, async (req, res) => {
    try {
        const { title, text, tags, ask_date_time } = req.body;
        
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const userId = req.user.userId;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
    
        const asked_by = req.user.username;
        validateRequestBody(req.body);
        const tagArr = await processTags(tags);
        const question = createQuestionObject(title, text, asked_by, ask_date_time, tagArr);
        const newQuestion = await Question.create(question);
        question._id = newQuestion._id.toString();
        //save to user
        await User.findByIdAndUpdate(userId, { $push: { questions: question._id } }).exec();
        return res.status(200).json(question);
    } catch (error) {
        console.error(error);
        if (error instanceof ValidationError) {
            return res.status(error.status).json({
                message: error.message,
                errors: error.errors
            });
        }
        return res.status(500).json({
            message: 'Internal Server Error',
        });
    }
});

/**
 * Get a question by its ID
 */
router.get('/getQuestionById/:qid', async (req, res) => {
    try {
        const qid = req.params.qid;
        const result = await Question.findByIdAndIncrementViews(qid);
        if (!result) {
            return res.status(404).json({
                message: 'Question not found'
            });
        } else {
            return res.status(200).json(result);
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Internal Server Error',
        });
    }
});

/**
 * Get the questions associated with search in given order
 */
router.get('/getQuestion', async (req, res) => {
    try {
        const search = req.query.search;
        const order = req.query.order;
        let result: IQuestion[] = [];
        if (order === 'active') {
            result = await Question.getActiveQuestions();
        } else if (order === 'unanswered') {
            result = await Question.getUnansweredQuestions();
        } else {
            result = await Question.getNewestQuestions();
        }
        if (search) {
            result = filterQuestionsBySearch(result, search.toString());
        }
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Internal Server Error',
        });
    }
});

/**
 * Get the number of questions associated with search
 * This is used to determine if there are any questions that match the search criteria
 * and to display the questions found.
 * Tags surrounded by square brackets will be seperately searched.
 * If at least one of the search words is found in the title or text of a question,
 * the question will be included in the search results.
 */
function filterQuestionsBySearch(questions: IQuestion[], search: string): IQuestion[] {
    const searchWords = search.toLowerCase().split(/\s+/);
    const excludeTags = searchWords.filter(word => !word.startsWith('[') && !word.endsWith(']'));
    return questions.filter(q => {
        const titleWords = q.title.toLowerCase().split(/\s+/);
        const textWords = q.text.toLowerCase().split(/\s+/);
        const titleMatches = excludeTags.some(word => titleWords.includes(word));
        const textMatches = excludeTags.some(word => textWords.includes(word));
        const tagsMatches = q.tags?.some(tag => searchWords.includes(`[${tag.name.toLowerCase()}]`));
        return titleMatches || tagsMatches || textMatches;
    });
}

/**
 * Validate the request body for adding a new question
 * This function only throws errors and doesn't send responses directly
 */
function validateRequestBody(body: { title: string; text: string; ask_date_time: string; tags?: string[] }) {
    const { title, text, ask_date_time, tags } = body;
    if (!title || !text || !ask_date_time) {
        throw new ValidationError('Validation failed', [
            {
                path: ".body",
                message: "must not be empty",
                errorCode: "type.openapi.validation"
            }
        ]);
    }
    if (tags && !Array.isArray(tags)) {
        throw new ValidationError('Validation failed', [
            {
                path: ".body.tags",
                message: "must be array",
                errorCode: "type.openapi.validation"
            }
        ]);
    }
}

/**
 * Process tags and return an array of tag objects
 */
async function processTags(tags: (string | { name: string })[]): Promise<ITag[]> {
    if (!tags) return [];
    const tagNames = tags.map((tag) => typeof tag === "object" && tag.name ? tag.name : tag);
    return await Tag.findOrCreateMany(tagNames as string[]);
}

/**
 * Create a question object
 */
function createQuestionObject(title: string, text: string, asked_by: string, ask_date_time: string, tags: ITag[]): IQuestion {
    return {
        title: title.toString(),
        text: text.toString(),
        ask_date_time: ask_date_time.toString(),
        asked_by,
        views: 0,
        tags: tags,
        answers: []
    };
}
export default router;
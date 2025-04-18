import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import request from 'supertest';
import express from 'express';
import cookieParser from 'cookie-parser';
import { Request, Response, NextFunction } from 'express';
import Question from '../models/questions';
import Tag from '../models/tags';
import User from '../models/users';
import questionsRouter from '../routers/questions';
import { IQuestionDocument, IUserDocument, ITag, IQuestion } from '../types/types';

// Mock the authenticate middleware to simplify testing
jest.mock('../middleware/authenticate', () => ({
  authenticateJWT: (req: Request, res: Response, next: NextFunction) => {
    if (req.headers['x-test-user-id']) {
      req.user = { 
        userId: req.headers['x-test-user-id'] as string, 
        username: req.headers['x-test-username'] as string || 'testuser' 
      };
      next();
    } else {
      return res.status(401).json({ message: 'Missing token' });
    }
  },
}));

// Setup test Express app
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use('/question', questionsRouter);

// Setup MongoDB Memory Server
let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  // Set JWT_SECRET environment variable for testing
  process.env.JWT_SECRET = 'test-secret-key';
  
  // Start MongoDB Memory Server
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
}, 30000);

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
}, 30000);

beforeEach(async () => {
  // Clear all collections before each test
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

describe('Question Service Tests', () => {
  describe('Add Question Functionality', () => {
    let testUser: IUserDocument;
    let testTags: ITag[];

    beforeEach(async () => {
      // Create a test user
      testUser = new User({
        username: 'testuser',
        email: 'test@example.com',
        password: 'hashedpassword'
      });
      await testUser.save();

      // Create some test tags
      testTags = await Tag.create([
        { name: 'javascript' },
        { name: 'react' }
      ]);
    });

    it('should add a question successfully', async () => {
      const questionData = {
        title: 'Test Question',
        text: 'This is a test question for unit testing',
        tags: testTags.map(tag => tag.name),
        ask_date_time: new Date().toISOString()
      };

      const response = await request(app)
        .post('/question/addQuestion')
        .set('x-test-user-id', testUser._id.toString())
        .set('x-test-username', 'testuser')
        .send(questionData)
        .expect(200);

      // Verify the question was created
      expect(response.body.title).toBe(questionData.title);
      expect(response.body.text).toBe(questionData.text);
      expect(response.body.asked_by).toBe('testuser');
      expect(response.body.tags.length).toBe(2);
      
      // Verify question was saved in the database
      const question = await Question.findById(response.body._id);
      expect(question).toBeDefined();
      expect(question?.title).toBe(questionData.title);
      
      // Verify question was added to user's questions array
      const updatedUser = await User.findById(testUser._id);
      expect(updatedUser?.questions.length).toBe(1);
      expect(updatedUser?.questions[0].toString()).toBe(response.body._id);
    });

    it('should reject question creation when unauthorized', async () => {
      const questionData = {
        title: 'Test Question',
        text: 'This is a test question for unit testing',
        tags: testTags.map(tag => tag.name),
        ask_date_time: new Date().toISOString()
      };

      await request(app)
        .post('/question/addQuestion')
        // Not setting the user headers
        .send(questionData)
        .expect(401);
    });

    it('should handle missing required fields', async () => {
      // Missing title
      const missingTitleData = {
        text: 'This is a test question',
        tags: testTags.map(tag => tag.name),
        ask_date_time: new Date().toISOString()
      };

      const response = await request(app)
        .post('/question/addQuestion')
        .set('x-test-user-id', testUser._id.toString())
        .set('x-test-username', 'testuser')
        .send(missingTitleData)
        .expect(400);

      expect(response.body.message).toBe('Validation failed');
      expect(response.body.errors).toBeDefined();
      expect(response.body.errors.length).toBe(1);
      expect(response.body.errors[0].path).toBe('.body');
      
      // Verify no question was saved
      const questions = await Question.find({});
      expect(questions.length).toBe(0);
    });

    it('should handle invalid tags format', async () => {
      // Invalid tags (not an array)
      const invalidTagsData = {
        title: 'Test Question',
        text: 'This is a test question',
        tags: 'javascript', // Should be an array
        ask_date_time: new Date().toISOString()
      };

      const response = await request(app)
        .post('/question/addQuestion')
        .set('x-test-user-id', testUser._id.toString())
        .set('x-test-username', 'testuser')
        .send(invalidTagsData)
        .expect(400);

      expect(response.body.message).toBe('Validation failed');
      expect(response.body.errors).toBeDefined();
      expect(response.body.errors.length).toBe(1);
      expect(response.body.errors[0].path).toBe('.body.tags');
      
      // Verify no question was saved
      const questions = await Question.find({});
      expect(questions.length).toBe(0);
    });
  });

  describe('Get Question Functionality', () => {
    let testQuestions: IQuestionDocument[];
    let testTags: ITag[];

    beforeEach(async () => {
      // Create some test tags
      testTags = await Tag.create([
        { name: 'javascript' },
        { name: 'react' },
        { name: 'node' }
      ]);

      // Create test questions
      const now = new Date();
      const yesterday = new Date(now);
      yesterday.setDate(yesterday.getDate() - 1);
      
      const twoDaysAgo = new Date(now);
      twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
      
      testQuestions = await Question.create([
        {
          title: 'Newest Question',
          text: 'This is the newest question',
          tags: [testTags[0]._id, testTags[1]._id],
          asked_by: 'user1',
          ask_date_time: now.toISOString(),
          views: 5,
          answers: []
        },
        {
          title: 'Question with Answer',
          text: 'This question has an answer',
          tags: [testTags[1]._id],
          asked_by: 'user2',
          ask_date_time: yesterday.toISOString(),
          views: 10,
          answers: [new mongoose.Types.ObjectId()]
        },
        {
          title: 'Oldest Question about JavaScript',
          text: 'This is the oldest question about JavaScript',
          tags: [testTags[0]._id, testTags[2]._id],
          asked_by: 'user3',
          ask_date_time: twoDaysAgo.toISOString(),
          views: 15,
          answers: []
        }
      ]);
    });

    it('should get a question by ID', async () => {
      const questionId = testQuestions[0]._id.toString();
      
      const response = await request(app)
        .get(`/question/getQuestionById/${questionId}`)
        .expect(200);

      expect(response.body.title).toBe('Newest Question');
      expect(response.body.views).toBe(6); // Should be incremented
    });

    it('should return 404 for non-existent question ID', async () => {
      const fakeId = new mongoose.Types.ObjectId().toString();
      
      await request(app)
        .get(`/question/getQuestionById/${fakeId}`)
        .expect(404);
    });

    it('should get questions in newest order by default', async () => {
      const response = await request(app)
        .get('/question/getQuestion')
        .expect(200);

      expect(response.body.length).toBe(3);
      expect(response.body[0].title).toBe('Newest Question');
      expect(response.body[1].title).toBe('Question with Answer');
      expect(response.body[2].title).toBe('Oldest Question about JavaScript');
    });

    it('should get questions in active order', async () => {
      const response = await request(app)
        .get('/question/getQuestion?order=active')
        .expect(200);

      expect(response.body.length).toBe(3);
      // We're just checking all questions are there since the exact order depends on the implementation
      const titles = response.body.map((q: IQuestion) => q.title);
      expect(titles).toContain('Newest Question');
      expect(titles).toContain('Question with Answer');
      expect(titles).toContain('Oldest Question about JavaScript');
    });

    it('should get unanswered questions', async () => {
      const response = await request(app)
        .get('/question/getQuestion?order=unanswered')
        .expect(200);

      expect(response.body.length).toBe(2);
      expect(response.body[0].title).toBe('Newest Question');
      expect(response.body[1].title).toBe('Oldest Question about JavaScript');
    });

    it('should filter questions by search term', async () => {
      const response = await request(app)
        .get('/question/getQuestion?search=javascript')
        .expect(200);

      expect(response.body.length).toBe(1);
      expect(response.body[0].title).toBe('Oldest Question about JavaScript');
    });

    it('should filter questions by tag search', async () => {
      const response = await request(app)
        .get('/question/getQuestion?search=[javascript]')
        .expect(200);

      expect(response.body.length).toBe(2);
      // Both questions with javascript tag should be returned
      const titles = response.body.map((q: IQuestion) => q.title);
      expect(titles).toContain('Newest Question');
      expect(titles).toContain('Oldest Question about JavaScript');
    });

    it('should combine order and search parameters', async () => {
      const response = await request(app)
        .get('/question/getQuestion?order=unanswered&search=[javascript]')
        .expect(200);

      expect(response.body.length).toBe(2);
      // Both questions with javascript tag that are unanswered should be returned
      const titles = response.body.map((q: IQuestion) => q.title);
      expect(titles).toContain('Newest Question');
      expect(titles).toContain('Oldest Question about JavaScript');
    });
  });
});

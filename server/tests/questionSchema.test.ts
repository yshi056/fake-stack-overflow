import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import Question from '../models/questions';
import Tag from '../models/tags';
import { IQuestionDocument, ITag } from '../types/types';

// Setup in-memory MongoDB for testing
let mongoServer: MongoMemoryServer;

// Add longer timeout for the MongoDB setup
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
}, 15000); // 15 seconds timeout

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
}, 10000); // 10 seconds timeout

beforeEach(async () => {
  // Clear all collections before each test
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

describe('Question Schema Tests', () => {
  // Test schema validation
  describe('Schema Validation', () => {
    it('should create a valid question', async () => {
      // First create tags
      const createdTags = await Tag.create([{ name: 'javascript' }, { name: 'react' }]);
      
      const questionData = {
        title: 'Test Question',
        text: 'This is a test question for unit testing',
        tags: createdTags.map(tag => tag._id),
        asked_by: 'testuser',
        ask_date_time: new Date().toISOString(),
        views: 0,
        answers: []
      };
      
      const question = new Question(questionData);
      const savedQuestion = await question.save();
      
      expect(savedQuestion._id).toBeDefined();
      expect(savedQuestion.title).toBe(questionData.title);
      expect(savedQuestion.text).toBe(questionData.text);
      expect(savedQuestion.tags.length).toBe(2);
      expect(savedQuestion.asked_by).toBe(questionData.asked_by);
      expect(savedQuestion.views).toBe(0);
      expect(savedQuestion.answers).toEqual([]);
    });
    
    it('should fail when required fields are missing', async () => {
      const invalidQuestion = new Question({
        // Missing required fields
      });
      
      // Using a try-catch to validate Mongoose validation errors
      try {
        await invalidQuestion.save();
        // If it reaches here, validation didn't fail
        expect(true).toBe(false); // Force the test to fail
      } catch (error: unknown) {
        const validationError = error as mongoose.Error.ValidationError;
        expect(validationError).toBeDefined();
        expect(validationError.name).toBe('ValidationError');
        expect(validationError.errors.title).toBeDefined();
        expect(validationError.errors.text).toBeDefined();
        expect(validationError.errors.asked_by).toBeDefined();
        expect(validationError.errors.ask_date_time).toBeDefined();
      }
    });
    
    it('should find a question by ID', async () => {
      // First create a question
      const createdTags = await Tag.create([{ name: 'javascript' }]);
      
      const question = new Question({
        title: 'Find by ID Test',
        text: 'This is a test for finding by ID',
        tags: createdTags.map(tag => tag._id),
        asked_by: 'testuser',
        ask_date_time: new Date().toISOString(),
        views: 0,
        answers: []
      });
      
      const savedQuestion = await question.save();
      
      // Now find the question by ID
      const foundQuestion = await Question.findById(savedQuestion._id);
      
      expect(foundQuestion).toBeDefined();
      expect(foundQuestion?._id.toString()).toBe(savedQuestion._id.toString());
      expect(foundQuestion?.title).toBe('Find by ID Test');
    });
  });

  // Instance methods test
  describe('Instance Methods', () => {
    let question: IQuestionDocument;
    let createdTags: ITag[];
    
    beforeEach(async () => {
      createdTags = await Tag.create([{ name: 'javascript' }, { name: 'react' }]);
      
      question = new Question({
        title: 'Test Question',
        text: 'This is a test question for unit testing',
        tags: createdTags.map(tag => tag._id),
        asked_by: 'testuser',
        ask_date_time: new Date().toISOString(),
        views: 0,
        answers: []
      });
      
      await question.save();
    });
    
    it('should increment views', async () => {
      const initialViews = question.views;
      await question.incrementViews();
      
      // Fetch the question from DB to verify changes were saved
      const updatedQuestion = await Question.findById(question._id);
      expect(updatedQuestion?.views).toBe(initialViews + 1);
    });
    
    it('should add an answer', async () => {
      const answerId = new mongoose.Types.ObjectId();
      await question.addAnswer(answerId);
      
      // Fetch the question from DB to verify changes were saved
      const updatedQuestion = await Question.findById(question._id);
      expect(updatedQuestion?.answers.length).toBe(1);
      expect(updatedQuestion?.answers[0].toString()).toBe(answerId.toString());
    });
  });

  // Test static methods
  describe('Static Methods', () => {
    let questionIds: mongoose.Types.ObjectId[] = [];
    let createdTags: ITag[];
    
    beforeEach(async () => {
      createdTags = await Tag.create([{ name: 'javascript' }, { name: 'react' }, { name: 'node' }]);
      
      // Create test questions
      const now = new Date();
      const yesterday = new Date(now);
      yesterday.setDate(yesterday.getDate() - 1);
      
      const twoDaysAgo = new Date(now);
      twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
      
      const questions = [
        {
          title: 'Newest Question',
          text: 'This is the newest question',
          tags: [createdTags[0]._id, createdTags[1]._id],
          asked_by: 'user1',
          ask_date_time: now.toISOString(),
          views: 5,
          answers: []
        },
        {
          title: 'Question with Answer',
          text: 'This question has an answer',
          tags: [createdTags[1]._id],
          asked_by: 'user2',
          ask_date_time: yesterday.toISOString(),
          views: 10,
          answers: [new mongoose.Types.ObjectId()]
        },
        {
          title: 'Oldest Question',
          text: 'This is the oldest question',
          tags: [createdTags[2]._id],
          asked_by: 'user3',
          ask_date_time: twoDaysAgo.toISOString(),
          views: 15,
          answers: []
        }
      ];
      
      const savedQuestions = await Question.create(questions);
      questionIds = savedQuestions.map(q => q._id);
    });
    
    it('should get newest questions in correct order', async () => {
      const questions = await Question.getNewestQuestions();
      
      expect(questions.length).toBe(3);
      expect(questions[0].title).toBe('Newest Question');
      expect(questions[1].title).toBe('Question with Answer');
      expect(questions[2].title).toBe('Oldest Question');
    });
    
    it('should get unanswered questions', async () => {
      const questions = await Question.getUnansweredQuestions();
      
      expect(questions.length).toBe(2);
      expect(questions[0].title).toBe('Newest Question');
      expect(questions[1].title).toBe('Oldest Question');
    });
    
    it('should get active questions', async () => {
      const questions = await Question.getActiveQuestions();
      
      expect(questions.length).toBe(3);
      // Just check that we get all questions without checking the order
      const titles = questions.map(q => q.title);
      expect(titles).toContain('Newest Question');
      expect(titles).toContain('Question with Answer');
      expect(titles).toContain('Oldest Question');
    });
    
    it('should find by id and increment views', async () => {
      const questionId = questionIds[0];
      const initialQuestion = await Question.findById(questionId);
      const initialViews = initialQuestion?.views || 0;
      
      const updatedQuestion = await Question.findByIdAndIncrementViews(questionId.toString());
      
      expect(updatedQuestion).toBeDefined();
      expect(updatedQuestion?.views).toBe(initialViews + 1);
    });
    
    it('should get question count by tag', async () => {
      const tagCounts = await Question.getQuestionCountByTag();
      
      expect(tagCounts.length).toBe(3);
      
      // Find the count for each tag
      const jsTag = tagCounts.find(tag => tag.name === 'javascript');
      const reactTag = tagCounts.find(tag => tag.name === 'react');
      const nodeTag = tagCounts.find(tag => tag.name === 'node');
      
      expect(jsTag?.qcnt).toBe(1);
      expect(reactTag?.qcnt).toBe(2);
      expect(nodeTag?.qcnt).toBe(1);
    });
  });
});

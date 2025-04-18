import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import Answer from "../models/answers";
import Question from "../models/questions";
import Comment from "../models/comments";
import User from "../models/users";

// Set up in-memory database for testing
let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("Answer Schema", () => {
  beforeEach(async () => {
    // Clear collections before each test
    await Answer.deleteMany({});
    await Question.deleteMany({});
    await Comment.deleteMany({});
    await User.deleteMany({});
  });

  describe("Schema Validation", () => {
    it("should create a valid answer", async () => {
      // Create a question to reference
      const question = new Question({
        title: "Test Question",
        text: "This is a test question",
        asked_by: "testuser",
        ask_date_time: new Date(),
        tags: []
      });
      
      await question.save();
      
      const answerData = {
        qid: question._id,
        text: "This is a test answer",
        ans_by: "testuser",
        ans_date_time: new Date(),
        upVotes: [],
        downVotes: []
      };

      const answer = new Answer(answerData);
      const savedAnswer = await answer.save();
      
      expect(savedAnswer._id).toBeDefined();
      expect(savedAnswer.qid.toString()).toBe(question._id.toString());
      expect(savedAnswer.text).toBe(answerData.text);
      expect(savedAnswer.ans_by).toBe(answerData.ans_by);
      expect(savedAnswer.ans_date_time).toStrictEqual(answerData.ans_date_time);
      expect(savedAnswer.upVotes).toEqual([]);
      expect(savedAnswer.downVotes).toEqual([]);
      expect(savedAnswer.comments).toEqual([]);
    });

    it("should throw an error if required fields are missing", async () => {
      const invalidAnswer = new Answer({});
      
      await expect(invalidAnswer.save()).rejects.toThrow();
    });

    it("should throw an error if qid is missing", async () => {
      const invalidAnswer = new Answer({
        text: "This is a test answer",
        ans_by: "testuser",
        ans_date_time: new Date(),
        upVotes: [],
        downVotes: []
      });
      
      await expect(invalidAnswer.save()).rejects.toThrow();
    });

    it("should throw an error if text is missing", async () => {
      const invalidAnswer = new Answer({
        ans_by: "testuser",
        ans_date_time: new Date(),
        upVotes: [],
        downVotes: []
      });
      
      await expect(invalidAnswer.save()).rejects.toThrow();
    });

    it("should throw an error if ans_by is missing", async () => {
      const invalidAnswer = new Answer({
        text: "This is a test answer",
        ans_date_time: new Date(),
        upVotes: [],
        downVotes: []
      });
      
      await expect(invalidAnswer.save()).rejects.toThrow();
    });

    it("should throw an error if ans_date_time is missing", async () => {
      const invalidAnswer = new Answer({
        text: "This is a test answer",
        ans_by: "testuser",
        upVotes: [],
        downVotes: []
      });
      
      await expect(invalidAnswer.save()).rejects.toThrow();
    });
  });

  describe("Static Methods", () => {
    describe("getMostRecent", () => {
      it("should return answers sorted by ans_date_time in descending order", async () => {
        // Create test answers with different dates
        const answer1 = await new Answer({
          text: "Answer 1",
          ans_by: "user1",
          ans_date_time: new Date("2023-01-01"),
          upVotes: [],
          downVotes: []
        }).save();

        const answer2 = await new Answer({
          text: "Answer 2",
          ans_by: "user2",
          ans_date_time: new Date("2023-02-01"),
          upVotes: [],
          downVotes: []
        }).save();

        const answer3 = await new Answer({
          text: "Answer 3",
          ans_by: "user3",
          ans_date_time: new Date("2023-03-01"),
          upVotes: [],
          downVotes: []
        }).save();

        const answerIds = [answer1._id, answer2._id, answer3._id];
        
        const recentAnswers = await Answer.getMostRecent(answerIds);
        
        expect(recentAnswers).toHaveLength(3);
        expect(recentAnswers[0]._id.toString()).toBe(answer3._id.toString());
        expect(recentAnswers[1]._id.toString()).toBe(answer2._id.toString());
        expect(recentAnswers[2]._id.toString()).toBe(answer1._id.toString());
      });

      it("should return an empty array if no answer IDs are provided", async () => {
        const recentAnswers = await Answer.getMostRecent([]);
        expect(recentAnswers).toHaveLength(0);
      });

      it("should only return answers that match the provided IDs", async () => {
        // Create test answers
        const answer1 = await new Answer({
          text: "Answer 1",
          ans_by: "user1",
          ans_date_time: new Date("2023-01-01"),
          upVotes: [],
          downVotes: []
        }).save();

        const answer2 = await new Answer({
          text: "Answer 2",
          ans_by: "user2",
          ans_date_time: new Date("2023-02-01"),
          upVotes: [],
          downVotes: []
        }).save();

        await new Answer({
          text: "Answer 3",
          ans_by: "user3",
          ans_date_time: new Date("2023-03-01"),
          upVotes: [],
          downVotes: []
        }).save();

        // Only request answers 1 and 2
        const answerIds = [answer1._id, answer2._id];
        
        const recentAnswers = await Answer.getMostRecent(answerIds);
        
        expect(recentAnswers).toHaveLength(2);
        expect(recentAnswers[0]._id.toString()).toBe(answer2._id.toString());
        expect(recentAnswers[1]._id.toString()).toBe(answer1._id.toString());
      });
    });

    describe("getLatestAnswerDate", () => {
      it("should return the date of the latest answer", async () => {
        // Create test answer objects
        const answer1 = {
          _id: new mongoose.Types.ObjectId(),
          text: "Answer 1",
          ans_by: "user1",
          ans_date_time: new Date("2023-01-01"),
          comments: [],
          upVotes: [],
          downVotes: []
        };

        const answer2 = {
          _id: new mongoose.Types.ObjectId(),
          text: "Answer 2",
          ans_by: "user2",
          ans_date_time: new Date("2023-02-01"),
          comments: [],
          upVotes: [],
          downVotes: []
        };

        const answer3 = {
          _id: new mongoose.Types.ObjectId(),
          text: "Answer 3",
          ans_by: "user3",
          ans_date_time: new Date("2023-03-01"),
          comments: [],
          upVotes: [],
          downVotes: []
        };

        const answers = [answer1, answer2, answer3];
        
        const latestDate = await Answer.getLatestAnswerDate(answers);
        
        expect(latestDate).toStrictEqual(answer3.ans_date_time);
      });

      it("should return undefined if no answers are provided", async () => {
        const latestDate = await Answer.getLatestAnswerDate([]);
        expect(latestDate).toBeUndefined();
      });
    });

    describe("findByIdAndAddComment", () => {
      it("should add a comment to an answer", async () => {
        // Create a test answer
        const answer = await new Answer({
          text: "Test answer",
          ans_by: "testuser",
          ans_date_time: new Date(),
          upVotes: [],
          downVotes: []
        }).save();

        // Create a test comment
        const comment = await new Comment({
          text: "Test comment",
          user: "testuser",
          comment_date_time: new Date()
        }).save();

        // Add the comment to the answer
        const updatedAnswer = await Answer.findByIdAndAddComment(answer._id, comment._id);
        
        expect(updatedAnswer).toBeDefined();
        expect(updatedAnswer!.comments).toHaveLength(1);
        expect(updatedAnswer!.comments[0].toString()).toBe(comment._id.toString());
      });

      it("should return null if answer ID does not exist", async () => {
        const nonExistentId = new mongoose.Types.ObjectId();
        const comment = await new Comment({
          text: "Test comment",
          user: "testuser",
          comment_date_time: new Date()
        }).save();

        const result = await Answer.findByIdAndAddComment(nonExistentId, comment._id);
        
        expect(result).toBeNull();
      });
    });

    describe("Voting Methods", () => {
      describe("findByIdAndAddUpvote", () => {
        it("should add an upvote to an answer", async () => {
          // Create a test answer
          const answer = await new Answer({
            text: "Test answer",
            ans_by: "testuser",
            ans_date_time: new Date(),
            upVotes: [],
            downVotes: []
          }).save();

          const userId = "user123";

          // Add an upvote
          const updatedAnswer = await Answer.findByIdAndAddUpvote(answer._id, userId);
          
          expect(updatedAnswer).toBeDefined();
          expect(updatedAnswer!.upVotes).toContain(userId);
          expect(updatedAnswer!.downVotes).not.toContain(userId);
        });

        it("should remove an upvote if user already upvoted", async () => {
          // Create a test answer with an existing upvote
          const userId = "user123";
          const answer = await new Answer({
            text: "Test answer",
            ans_by: "testuser",
            ans_date_time: new Date(),
            upVotes: [userId],
            downVotes: []
          }).save();

          // Toggle the upvote (should remove it)
          const updatedAnswer = await Answer.findByIdAndAddUpvote(answer._id, userId);
          
          expect(updatedAnswer).toBeDefined();
          expect(updatedAnswer!.upVotes).not.toContain(userId);
        });

        it("should remove a downvote and add an upvote if user had previously downvoted", async () => {
          // Create a test answer with an existing downvote
          const userId = "user123";
          const answer = await new Answer({
            text: "Test answer",
            ans_by: "testuser",
            ans_date_time: new Date(),
            upVotes: [],
            downVotes: [userId]
          }).save();

          // Add an upvote (should remove the downvote)
          const updatedAnswer = await Answer.findByIdAndAddUpvote(answer._id, userId);
          
          expect(updatedAnswer).toBeDefined();
          expect(updatedAnswer!.upVotes).toContain(userId);
          expect(updatedAnswer!.downVotes).not.toContain(userId);
        });

        it("should return null if answer ID does not exist", async () => {
          const nonExistentId = new mongoose.Types.ObjectId();
          const userId = "user123";

          const result = await Answer.findByIdAndAddUpvote(nonExistentId, userId);
          
          expect(result).toBeNull();
        });
      });

      describe("findByIdAndAddDownvote", () => {
        it("should add a downvote to an answer", async () => {
          // Create a test answer
          const answer = await new Answer({
            text: "Test answer",
            ans_by: "testuser",
            ans_date_time: new Date(),
            upVotes: [],
            downVotes: []
          }).save();

          const userId = "user123";

          // Add a downvote
          const updatedAnswer = await Answer.findByIdAndAddDownvote(answer._id, userId);
          
          expect(updatedAnswer).toBeDefined();
          expect(updatedAnswer!.downVotes).toContain(userId);
          expect(updatedAnswer!.upVotes).not.toContain(userId);
        });

        it("should remove a downvote if user already downvoted", async () => {
          // Create a test answer with an existing downvote
          const userId = "user123";
          const answer = await new Answer({
            text: "Test answer",
            ans_by: "testuser",
            ans_date_time: new Date(),
            upVotes: [],
            downVotes: [userId]
          }).save();

          // Toggle the downvote (should remove it)
          const updatedAnswer = await Answer.findByIdAndAddDownvote(answer._id, userId);
          
          expect(updatedAnswer).toBeDefined();
          expect(updatedAnswer!.downVotes).not.toContain(userId);
        });

        it("should remove an upvote and add a downvote if user had previously upvoted", async () => {
          // Create a test answer with an existing upvote
          const userId = "user123";
          const answer = await new Answer({
            text: "Test answer",
            ans_by: "testuser",
            ans_date_time: new Date(),
            upVotes: [userId],
            downVotes: []
          }).save();

          // Add a downvote (should remove the upvote)
          const updatedAnswer = await Answer.findByIdAndAddDownvote(answer._id, userId);
          
          expect(updatedAnswer).toBeDefined();
          expect(updatedAnswer!.downVotes).toContain(userId);
          expect(updatedAnswer!.upVotes).not.toContain(userId);
        });

        it("should return null if answer ID does not exist", async () => {
          const nonExistentId = new mongoose.Types.ObjectId();
          const userId = "user123";

          const result = await Answer.findByIdAndAddDownvote(nonExistentId, userId);
          
          expect(result).toBeNull();
        });
      });
    });
  });
});

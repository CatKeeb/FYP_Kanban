const mongoose = require("mongoose");
const { faker } = require("@faker-js/faker");
const Board = require("./__mocks__/Board");
const User = require("./__mocks__/User");
const { GET, POST } = require("./__mocks__/boardsRoute");

// Mock the database connection
jest.mock("@/config/database", () => jest.fn());

describe("Board API", () => {
  let user;
  let req, res;

  beforeEach(async () => {
    // Create a test user
    user = new User({
      _id: new mongoose.Types.ObjectId(), // This will generate a valid ObjectId
      email: faker.internet.email(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      password: faker.internet.password(),
      image: faker.image.avatar(),
    });
    await user.save();

    // Set up request and response objects
    req = {
      method: "",
      body: {},
      cookies: { token: user._id.toString() },
    };
    res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };
  });

  afterEach(async () => {
    // Clean up the database after each test
    await Board.deleteMany({});
    await User.deleteMany({});
  });

  describe("GET /api/boards", () => {
    it("should return boards for the user", async () => {
      // Create a test board
      const board = new Board({
        title: "Test Board",
        description: "This is a test board",
        owner: user._id,
        members: [user._id],
      });
      await board.save();

      req.method = "GET";
      await GET(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            title: "Test Board",
            description: "This is a test board",
          }),
        ]),
      );
    });

    it("should return an empty array if user has no boards", async () => {
      req.method = "GET";
      await GET(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([]);
    });
  });

  describe("POST /api/boards", () => {
    it("should create a new board", async () => {
      req.method = "POST";
      req.body = {
        title: "New Test Board",
        description: "This is a new test board",
        members: user.email,
      };

      await POST(req, res);

      expect(res.status).toHaveBeenCalledWith(201);

      // Capture the response
      const response = res.json.mock.calls[0][0];
      expect(response).toHaveProperty("boardId");
      expect(typeof response.boardId).toBe("string");

      // Verify the board was created in the database
      const board = await Board.findById(response.boardId);
      expect(board).not.toBeNull();
      expect(board.title).toBe("New Test Board");
      expect(board.description).toBe("This is a new test board");
      expect(board.owner.toString()).toBe(user._id.toString());
      expect(board.members.map((m) => m.toString())).toContain(
        user._id.toString(),
      );
    });

    it("should return 400 if member email is not found", async () => {
      req.method = "POST";
      req.body = {
        title: "New Test Board",
        description: "This is a new test board",
        members: "nonexistent@example.com",
      };

      await POST(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: expect.stringContaining(
            "The following emails were not found:",
          ),
        }),
      );
    });

    it("should return 401 if user is not authenticated", async () => {
      req.method = "POST";
      req.cookies.token = null;
      req.body = {
        title: "New Test Board",
        description: "This is a new test board",
      };

      await POST(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: "Unauthorized",
        }),
      );
    });
  });
});

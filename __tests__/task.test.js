const {
  POST,
  PATCH,
  DELETE,
  isBoardMember,
} = require("./__mocks__/tasksRoutes");
const { ObjectId } = require("mongodb");

// Mock the external dependencies
jest.mock("@/config/database", () => jest.fn());
jest.mock("mongodb", () => ({
  ObjectId: jest.fn((id) => id),
}));

describe("Task API", () => {
  let mockUserId;

  beforeEach(() => {
    mockUserId = new ObjectId().toString();
    jest.clearAllMocks();
    isBoardMember.mockResolvedValue(true);
  });

  describe("POST /api/tasks", () => {
    it("should create a new task", async () => {
      const mockTaskData = {
        boardId: new ObjectId().toString(),
        title: "Test Task",
        description: "Test Description",
        priority: "High",
        dueDate: new Date().toISOString(),
        assignee: {
          _id: new ObjectId().toString(),
          firstName: "John",
        },
      };

      const response = await POST({ ...mockTaskData, userId: mockUserId });

      expect(response.status).toBe(201);
      const responseBody = await response.json();
      expect(responseBody).toEqual(
        expect.objectContaining({
          title: mockTaskData.title,
          description: mockTaskData.description,
          priority: mockTaskData.priority,
          dueDate: mockTaskData.dueDate,
          assignee: expect.objectContaining(mockTaskData.assignee),
          comments: [],
          attachments: [],
        }),
      );
    });
  });

  describe("PATCH /api/tasks", () => {
    it("should update an existing task", async () => {
      const mockUpdateData = {
        boardId: new ObjectId().toString(),
        taskId: new ObjectId().toString(),
        title: "Updated Task",
        description: "Updated Description",
        stage: "Doing",
      };

      const response = await PATCH({ ...mockUpdateData, userId: mockUserId });

      expect(response.status).toBe(200);
      const responseBody = await response.json();
      expect(responseBody).toEqual(
        expect.objectContaining({
          title: mockUpdateData.title,
          description: mockUpdateData.description,
          stage: mockUpdateData.stage,
        }),
      );
    });
  });

  describe("DELETE /api/tasks", () => {
    it("should delete an existing task", async () => {
      const mockDeleteData = {
        boardId: new ObjectId().toString(),
        taskId: new ObjectId().toString(),
      };

      const response = await DELETE({ ...mockDeleteData, userId: mockUserId });

      expect(response.status).toBe(200);
      expect(await response.text()).toBe("Task deleted successfully");
    });
  });
});

const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");
const { Server } = require("socket.io");
const { MongoClient, ObjectId } = require("mongodb");

const port = process.env.PORT || 3000;
const dev = process.env.NODE_ENV !== "production";
// Initialize Next.js app
const app = next({ dev });
const handle = app.getRequestHandler();

// Prepare the Next.js app
app.prepare().then(() => {
  // Create a server
  const server = createServer((req, res) => {
    // Parse the URL
    const parsedUrl = parse(req.url, true);
    // Let Next.js handle the request
    handle(req, res, parsedUrl);
  });

  // Initialize Socket.IO
  const io = new Server(server);

  // handle new socket connections
  io.on("connection", (socket) => {
    console.log("New client connected");

    // Handle 'watchBoard' events from clients
    socket.on("watchBoard", async (boardId) => {
      console.log("Watching board:", boardId);

      // Connect to MongoDB
      const client = new MongoClient(process.env.MONGODB_URI);
      await client.connect();
      const db = client.db();
      const collection = db.collection("boards");

      // Set up a change stream to watch for changes to the specific board
      const changeStream = collection.watch([
        {
          $match: {
            // Match changes to the specific board
            "documentKey._id": ObjectId.createFromHexString(boardId),
            // Match only update, replace, or delete operations
            operationType: { $in: ["update", "replace", "delete"] },
          },
        },
      ]);

      // When a change occurs, emit it to all connected clients
      changeStream.on("change", (change) => {
        io.emit("boardUpdate", { boardId, change });
      });

      changeStream.on("error", (error) => {
        console.error("Change stream error:", error);
      });

      // Clean up when the socket disconnects
      socket.on("disconnect", () => {
        changeStream.close();
        client.close();
      });
    });
  });

  // Start the server
  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});

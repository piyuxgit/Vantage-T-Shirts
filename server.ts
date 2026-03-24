import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import Stripe from "stripe";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { Server } from "socket.io";
import { createServer } from "http";
import cors from "cors";

dotenv.config();

let stripeInstance: Stripe | null = null;
function getStripe() {
  if (!stripeInstance) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key || key.startsWith('sk_test_mock')) {
      throw new Error("STRIPE_SECRET_KEY is missing or invalid. Please set a valid Stripe Secret Key in the environment variables.");
    }
    stripeInstance = new Stripe(key);
  }
  return stripeInstance;
}

// MongoDB User Schema
interface IUser extends mongoose.Document {
  uid: string;
  email?: string;
  displayName?: string;
  photoURL?: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new mongoose.Schema({
  uid: { type: String, required: true, unique: true },
  email: String,
  displayName: String,
  photoURL: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const User = mongoose.models.User || mongoose.model<IUser>("User", userSchema);

async function connectDB() {
  if (mongoose.connection.readyState >= 1) return;
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.warn("MONGODB_URI is not defined. MongoDB features will be disabled.");
    return;
  }
  try {
    await mongoose.connect(uri);
    console.log("MongoDB connected successfully");
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
}

async function startServer() {
  const app = express();
  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // Request logging
  app.use((req, res, next) => {
    if (req.url.startsWith('/api')) {
      console.log(`${req.method} ${req.url}`);
    }
    next();
  });

  // Connect to DB lazily
  await connectDB();

  // Real-time user updates
  io.on("connection", (socket) => {
    console.log("Client connected to real-time updates:", socket.id);
    
    socket.on("subscribe_user", (uid) => {
      socket.join(`user_${uid}`);
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });

  // API Routes
  const apiRouter = express.Router();

  // Ensure all API responses are JSON
  apiRouter.use((req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    next();
  });

  // API: Sync User Data
  apiRouter.post("/users/sync", async (req, res) => {
    console.log("Sync request received for UID:", req.body?.uid);
    const { uid, email, displayName, photoURL } = req.body || {};
    if (!uid) return res.status(400).json({ error: "UID required" });

    try {
      if (mongoose.connection.readyState < 1) {
        return res.status(503).json({ error: "Database not connected" });
      }

      const user = await User.findOneAndUpdate(
        { uid },
        { 
          email, 
          displayName, 
          photoURL, 
          updatedAt: new Date() 
        },
        { upsert: true, new: true }
      );

      // Broadcast update to the specific user's room
      io.to(`user_${uid}`).emit("user_updated", user);
      
      res.json(user);
    } catch (error: any) {
      console.error("Sync error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // API: Get User Data
  apiRouter.get("/users/:uid", async (req, res) => {
    const { uid } = req.params;
    try {
      if (mongoose.connection.readyState < 1) {
        return res.status(503).json({ error: "Database not connected" });
      }
      const user = await User.findOne({ uid });
      if (!user) return res.status(404).json({ error: "User not found" });
      res.json(user);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Stripe Checkout Session API
  apiRouter.post("/create-checkout-session", async (req, res) => {
    const { items, userId } = req.body || {};
    
    try {
      const stripe = getStripe();
      const lineItems = items.map((item: any) => ({
        price_data: {
          currency: "usd",
          product_data: {
            name: item.name,
            images: [item.image],
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      }));

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: lineItems,
        mode: "payment",
        success_url: `${process.env.APP_URL}/profile?success=true`,
        cancel_url: `${process.env.APP_URL}/?canceled=true`,
        metadata: {
          userId,
          orderItems: JSON.stringify(items.map((i: any) => i.id)),
        },
      });

      res.json({ id: session.id, url: session.url });
    } catch (error: any) {
      console.error("Stripe error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Catch-all for missing API routes (must be at the end of apiRouter)
  apiRouter.all("*", (req, res) => {
    res.status(404).json({ error: `API route not found: ${req.method} ${req.originalUrl}` });
  });

  app.use("/api", apiRouter);

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // Global Error Handler (must be last)
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error("Unhandled error:", err);
    res.status(err.status || 500).json({ 
      error: err.message || "Internal Server Error",
      path: req.url
    });
  });

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

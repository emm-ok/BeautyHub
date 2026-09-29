import express from "express";
import type { Application } from "express";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";

import { env } from "./config/env.js";
import { prisma } from "./lib/prisma.js";

import webhookRoutes from "./routes/webhook.routes.js";
import userRoutes from "./routes/user.routes.js";
import productDiscoveryRoutes from "./modules/product-discovery/product-discovery.route.js";
import productRoutes from "./modules/product/product.route.js";
import cartRoutes from "./modules/cart/cart.route.js";

const app: Application = express();

app.use(cors({
    origin: [env.CLIENT_URL, env.ADMIN_URL],
    credentials: true,
}));

app.use("/api/webhooks", webhookRoutes)

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(clerkMiddleware())

app.use("/api/users", userRoutes);
app.use("/api/products/discover", productDiscoveryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);

app.get("/users", async(req, res) => {
    const users = await prisma.user.findMany();
    res.status(200).json({ 
        success: true,
        message: "Users endpoint",
        data: users
    });
})

// app.get("/", (req, res) => {
//     res.status(200).json({ message: "Server is running successfully" });
// });

const PORT = env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});
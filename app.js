import express from "express"
import { config } from "dotenv"
import http from "http"
import { Server } from "socket.io"
import connectDB from "./src/config/db.js"
import authRoutes from "./src/routes/auth.routes.js"
import chatRoutes from "./src/routes/chat.routes.js"
import cookieParser from "cookie-parser";
import { saveMessageToDB, updateUserStatus } from "./src/controllers/chat.controller.js";
import statusRoutes from "./src/routes/status.routes.js";
import { receiveMessageOnPort } from "worker_threads"
import { log } from "console"
import Chat from "./src/models/chat.js"




config()

const app = express()
const server = http.createServer(app)
const io = new Server(server)
const port = process.env.PORT || 5001


app.get("/test-chat", async (req, res) => {
    const chat = await Chat.create({
        sender: "65a000000000000000000001",
        receiver: "65a000000000000000000002",
        message: "Hello MongoDB 👋",
    });

    res.json(chat);
});


app.use(express.static("public"))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.set("view engine", "ejs")
app.use(cookieParser());


// routes 
app.use("/auth", authRoutes)
app.use("/", chatRoutes)
app.use("/chat", chatRoutes)
app.use("/status", statusRoutes);
app.get("/favicon.ico", (req, res) => res.status(204));


let onlineUser = {};


io.on("connection", (socket) => {
    const userId = socket.handshake.auth.userId;

    if (userId) {
        onlineUser[userId] = socket.id;
        socket.join(userId);


        updateUserStatus(userId, true);


        io.emit("updateUserStatus", {
            userId,
            online: true
        });
    }

    socket.on("joinRoom", ({ roomId }) => {
        socket.join(roomId);
    });




    socket.on("sendImage", async (data) => {      
        io.to(data.roomId).emit("sendImage", data);
        
        await saveMessageToDB({
            senderId: data.senderId,
            receiverId: data.to,
            message: null,
            imageUrl: data.imageUrl,
            time: data.time
        });
    });


    socket.on("message", async (data) => {
        io.to(data.roomId).emit("message", data);

        await saveMessageToDB({
            senderId: data.senderId,
            receiverId: data.to,
            message: data.message,
            imageUrl: null,
            time: data.time
        });

    });


    socket.on("disconnect", () => {
        const uid = Object.keys(onlineUser)
            .find(key => onlineUser[key] === socket.id);

        if (uid) {
            delete onlineUser[uid];

            updateUserStatus(uid, false);

            io.emit("updateUserStatus", {
                userId: uid,
                online: false
            });
        }
    });
});




const startServer = async () => {
    await connectDB();     // ⬅️ wait here

    server.listen(port, () => {
        console.log("port start at ", port);

    })
};
startServer()


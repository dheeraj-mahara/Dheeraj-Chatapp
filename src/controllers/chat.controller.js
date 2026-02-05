import { time } from "console";
import fs from "fs"
import path from "path"
import { uploadeImage } from "../utils/uploadToCloudinary.js";
import { getChatData } from "../services/chat.service.js";
import { getAllUsers } from "../controllers/auth.controller.js";
import { fetchAllStatuses } from "../services/status.service.js";
import User from "../models/user.js";
import Chat from "../models/chat.js";



export const openchatPage = async (req, res) => {
  const sender = req.user;
  const receiverId = req.params.receiverId;
  
 if (receiverId === "favicon.ico") {
    return res.sendStatus(204);
  }


  const users = await getAllUsers();
  const lastMessages = await getLastMessagesForUser(sender.userid);
  const statuses = await fetchAllStatuses();

  const Currentuser = users.find(u => String(u.id) === String(sender.userid));

  let chatData = null;
  if (receiverId) {
    chatData = await getChatData(sender, receiverId);
  }
  




  res.render("users", {
    Currentuser,
    users,
    lastMessages,
    statuses,
    chatData
  });
};



export const getLastMessagesForUser = async (currentUserId) => {
  try {
    const chats = await Chat.find({
      chatKey: { $regex: currentUserId.toString() }
    }).lean();

    const lastMessages = {};

    chats.forEach(chat => {
      if (!chat.messages || chat.messages.length === 0) return;

      const lastMsg = chat.messages[chat.messages.length - 1];

      // Extract user IDs from chatKey
      const [user1, user2] = chat.chatKey.split("_");
      const otherUserId = user1 === currentUserId.toString() ? user2 : user1;

      lastMessages[otherUserId] = {
        message: lastMsg.message,
        imageUrl: lastMsg.imageUrl,
        time: lastMsg.time
      };
    });

    return lastMessages;
  } catch (error) {
    console.error("❌ Error fetching last messages:", error);
    return {};
  }
};



export const sendMessage = async (req, res) => {
  const senderId = req.user.userid;
  const receiverId = req.params.receiverId
  const { message } = req.body;

  let time = new Date().toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  })

  
  const chats = await Chat.find({
    $or: [
      { senderId: currentUserId, receiverId: otherUserId },
      { senderId: otherUserId, receiverId: currentUserId }
    ]
  }).sort({ createdAt: 1 });


  const chatKey = senderId < receiverId
    ? `${senderId}_${receiverId}`
    : `${receiverId}_${senderId}`;


  if (!chats[chatKey]) {
    chats[chatKey] = []
  }

  chats[chatKey].push({
    senderId,
    message,
    time: time
  })


}



export const saveMessageToDB = async ({
  senderId,
  receiverId,
  message,
  imageUrl,
  time
}) => {
  try {
    
    const chatKey =
      senderId < receiverId
        ? `${senderId}_${receiverId}`
        : `${receiverId}_${senderId}`;

    let chat = await Chat.findOne({ chatKey });

    

    if (!chat) {
      chat = new Chat({
        chatKey,
        messages: []
      });
    }

    chat.messages.push({
      senderId,
      message,
      imageUrl,
      time
    });

    await chat.save();
    return true;
  } catch (error) {
    console.error("❌ Save message error:", error);
    return false;
  }
};



export const updateUserStatus = async (userId, status) => {
  try {
    const updatedUser = await User.findOneAndUpdate(
      { id: userId }, // user id se find
      {
        online: status.online,
        lastSeen: status.lastSeen
      },
      { new: true } // updated document return kare
    );

    return updatedUser ? true : false;

  } catch (error) {
    console.error("❌ Error updating user status:", error);
    return false;
  }
};


export const imagework = async (req, res) => {
  try {
    const { roomId, senderId } = req.body;
    let time = new Date().toLocaleTimeString([], {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
    let imageUrl;

    if (req.file) {
      imageUrl = await uploadeImage(req.file, "whatsnew/chat");
    }

    // data Ke ander ye sab hai
    res.json({
      senderId,
      imageUrl,
      roomId,
      time: time,
    });

  } catch (err) {
    console.log(err,);
    res.status(500).json({ success: false })
  }

}



import Status from "../models/Status.js";
import { uploadeImage } from "../utils/uploadToCloudinary.js";
import { fetchAllStatuses } from "../services/status.service.js";

// export const addStatus = async (req, res) => {
//     try {
//         const userId = req.user.userid;
//         const text = req.body.text;

//         let imageUrl;
//         if (req.file) {
//             imageUrl = await uploadeImage(req.file, "whatsnew/status");
//         }

//         const status = await Status.create({
//             userId,
//             image: imageUrl || null,
//             text: text || null,
//             expireAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
//             seenBy: []
//         });

//         res.status(201).json({
//             success: true,
//             status
//         });

//     } catch (err) {
//         console.error("❌ addStatus error:", err);
//         res.status(500).json({ success: false });
//     }
// };


export const addStatus = async (req, res) => {
  try {
    const userId = req.user.userid;
    const { text } = req.body;

    let imageUrl = null;
    if (req.file) {
      imageUrl = await uploadeImage(req.file, "whatsnew/status");
    }

    const expireAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const status = await Status.findOneAndUpdate(
      { userId },
      {
        $push: {
          statuses: {
            $each: [
              {
                text: text || null,
                image: imageUrl || null,
                expireAt,
                seenBy: []
              }
            ],
            $position: 0
          }
        }

      },
      {
        new: true,
        upsert: true   // 🔥 agar document nahi hai to bana dega
      }
    );

    res.status(201).json({
      success: true,
      status
    });
    

  } catch (err) {
    console.error("❌ addStatus error:", err);
    res.status(500).json({ success: false });
  }
};



export const getAllStatus = async (req, res) => {
  try {
    const statuses = await fetchAllStatuses();

    res.status(200).json({
      success: true,
      statuses
    });

  } catch (err) {
    console.error("❌ getAllStatus error:", err);
    res.status(500).json({ success: false });
  }
};







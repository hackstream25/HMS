import express from "express";
import db from "../config/db.js";

const router = express.Router();

router.put("/team-members", async (req, res) => {
  try {
    const { teamId, members } = req.body;

    if (!teamId || !Array.isArray(members)) {
      return res.status(400).json({ error: "Invalid data" });
    }

    await db.query(
      "UPDATE user SET team_members = ? WHERE teamid = ?",
      [JSON.stringify(members), teamId]
    );

    res.json({ success: true });
  } catch (err) {
    console.error("TEAM MEMBER SAVE ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;

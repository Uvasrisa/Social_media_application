import { db } from "../connect.js";
import jwt from "jsonwebtoken";

export const getUser = (req, res) => {
  const userId = req.params.userId;
  const q = "SELECT id, name, city, website, profilePic, coverPic FROM users WHERE id=?";

  db.query(q, [userId], (err, data) => {
    if (err) return res.status(500).json({ error: "Internal server error" });
    if (!data || !data[0]) return res.status(404).json({ error: "User not found" });

    const { id, ...info } = data[0];
    return res.json({ id, ...info });
  });
};

export const updateUser = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json({ error: "Not authenticated!" });

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json({ error: "Token is not valid!" });
    if (userInfo.id !== req.params.userId) return res.status(403).json({ error: "Unauthorized access" });

    const q =
      "UPDATE users SET `name`=?, `city`=?, `website`=?, `profilePic`=?, `coverPic`=? WHERE id=? ";

    db.query(
      q,
      [
        req.body.name,
        req.body.city,
        req.body.website,
        req.body.profilePic,
        req.body.coverPic,
        userInfo.id,
      ],
      (err, data) => {
        if (err) return res.status(500).json({ error: "Internal server error" });
        if (data.affectedRows > 0) return res.json({ message: "Updated!" });
        return res.status(403).json({ error: "You can update only your own information!" });
      }
    );
  });
};

const User = require("../models/user");

exports.changeUserRole = async (req, res) => {
  const { uid } = req.params;
  try {
    const user = await User.findById(uid);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.role = user.role === "user" ? "premium" : "user";
    await user.save();

    res.status(200).json({ message: "User role updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

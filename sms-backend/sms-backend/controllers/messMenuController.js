const MessMenu = require("../models/MessMenu");

// GET /api/mess-menu
const getMessMenu = async (req, res) => {
  try {
    const { day } = req.query;
    if (day) {
      // Case-insensitive search for day
      const menu = await MessMenu.findOne({ day: new RegExp(`^${day}$`, "i") });
      return res.json(menu || {});
    }
    const allMenu = await MessMenu.find({});
    res.json(allMenu);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// PUT /api/mess-menu/:id
const updateMessMenu = async (req, res) => {
  try {
    const updated = await MessMenu.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Menu entry not found" });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { getMessMenu, updateMessMenu };

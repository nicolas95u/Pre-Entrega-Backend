const mongoose = require("mongoose");

function validateObjectId(ids) {
  if (!Array.isArray(ids)) {
    throw new Error("Invalid input: IDs must be an array");
  }

  for (const id of ids) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error(`Invalid ObjectId: ${id}`);
    }
  }
}

module.exports = {
  validateObjectId,
};

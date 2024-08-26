import mongoose from 'mongoose';

export const validateObjectId = (ids) => {
  ids.forEach(id => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error(`Invalid ObjectId: ${id}`);
    }
  });
};

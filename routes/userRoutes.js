import express from 'express';
import multer from 'multer';
import path from 'path';
import { 
  changeUserRole, 
  uploadUserDocuments, 
  getAllUsers, 
  deleteInactiveUsers 
} from '../controllers/userController.js';
import isAdmin from '../middlewares/validation/isAdmin.middleware.js';
import isUser from '../middlewares/validation/isUser.middleware.js';

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = 'uploads/documents';
    if (file.fieldname === 'profile') {
      uploadPath = 'uploads/profiles';
    } else if (file.fieldname === 'product') {
      uploadPath = 'uploads/products';
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${Date.now()}${ext}`);
  }
});

const upload = multer({ storage });

router.put('/premium/:uid', isAdmin, changeUserRole);

router.post('/:uid/documents', isUser, upload.array('documents', 10), uploadUserDocuments);

router.get('/', isAdmin, getAllUsers);

router.delete('/', isAdmin, deleteInactiveUsers);

export default router;

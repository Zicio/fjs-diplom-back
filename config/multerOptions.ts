import multer, { diskStorage } from 'multer';
import { extname } from 'path';

const multerOptions: multer.Options = {
  storage: diskStorage({
    destination: './uploads',
    filename: (req, file, cb) => {
      const ext = extname(file.originalname);
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const filename = `${uniqueSuffix}-${ext}}`;
      cb(null, filename);
    },
  }),
  fileFilter: (req, file, cb) => {
    if (file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  },
};

export default multerOptions;

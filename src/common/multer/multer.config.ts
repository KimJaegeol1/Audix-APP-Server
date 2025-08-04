import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { v4 as uuidv4 } from 'uuid';

export const multerConfig = {
    storage: diskStorage({
        destination: (req, file, cb) => {
            const uploadPath = join(process.cwd(), 'public', 'images');
            cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
            // 고유한 파일명 생성 (UUID + 확장자)
            const filename = `${uuidv4()}${extname(file.originalname)}`;
            cb(null, filename);
        },
    }),
    fileFilter: (req, file, cb) => {
        // 이미지 파일만 허용
        if (file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
            cb(null, true);
        } else {
            cb(new Error('지원하지 않는 파일 형식입니다.'), false);
        }
    },
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB 제한
    }
}
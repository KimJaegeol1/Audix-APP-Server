import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { mkdirSync, existsSync } from 'fs';

export const multerConfig = {
    storage: diskStorage({
        destination: (req, file, cb) => {
            const uploadPath = join(process.cwd(), 'public', 'images');

            // 디버깅 로그 추가
            console.log('📁 Multer destination path:', uploadPath);
            console.log('📁 Directory exists:', existsSync(uploadPath));

            // 디렉토리가 없으면 생성
            if (!existsSync(uploadPath)) {
                console.log('📁 Creating directory:', uploadPath);
                mkdirSync(uploadPath, { recursive: true });
            }

            cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
            // 고유한 파일명 생성 (UUID + 확장자)
            const filename = `${uuidv4()}${extname(file.originalname)}`;
            console.log('📝 Generated filename:', filename);
            console.log('📝 Original filename:', file.originalname);
            cb(null, filename);
        },
    }),
    fileFilter: (req, file, cb) => {
        console.log('🔍 File filter - mimetype:', file.mimetype);
        // 이미지 파일만 허용
        if (file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
            console.log('✅ File accepted:', file.originalname);
            cb(null, true);
        } else {
            console.log('❌ File rejected:', file.originalname);
            cb(new Error('지원하지 않는 파일 형식입니다.'), false);
        }
    },
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB 제한
    }
}
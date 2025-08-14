import multer, { diskStorage } from "multer";
import { nanoid } from "nanoid";

export function uploadFile(){
    const storage = diskStorage({
        
    })
    const fileFilter = (req, file, cb) => {
        if(file.mimetype != "image/jpeg" && file.mimetype != "image/png" && file.mimetype != "image/jpg"){
            return cb(new Error("Invalid file format", { cause: 409 }));
        }

        cb(null, true);
    }
    return multer({ fileFilter,storage,limits:{fileSize: 1024 * 1024 * 2} })
}
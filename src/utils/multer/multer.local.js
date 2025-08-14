import multer, { diskStorage } from "multer";
import { nanoid } from "nanoid";
import fs from "node:fs";

export function uploadFile(){
    const storage = diskStorage({
        destination: (req, file, cb) => {
            let dest = `uploads/${req.user._id}`;
            if(!fs.existsSync(dest)){
                fs.mkdirSync(dest, { recursive: true });
            }
            cb(null, dest);
        },

        filename: (req, file, cb) => {
            cb(null, nanoid(5) + '-' + file.originalname);
        }
    })
    const fileFilter = (req, file, cb) => {
        if(file.mimetype != "image/jpeg" && file.mimetype != "image/png" && file.mimetype != "image/jpg"){
            return cb(new Error("Invalid file format", { cause: 409 }));
        }

        cb(null, true);
    }
    return multer({ fileFilter,storage,limits:{fileSize: 1024 * 1024 * 2} })
}
import multer from "multer";
import path from "path";
import { HttpError } from "../helpers/index.js";

const destination = path.resolve("temp");//абсолютний шлях до тимчасової папки
const storage = multer.diskStorage({
    destination,//де зберігати
    filename: (req, file, cb ) => {// під яким ім'ям(визначення іншого імені для файлу)
        const uniquePrefix = `${Date.now()}_${Math.round(Math.random() * 1E9)}`;
        const filename = `${uniquePrefix}_${file.originalname}`;
        cb(null, filename);//якщо помилка не сталася
    }   
});

const limits = {//обмеження розміру файлу -5 Мб
    fileSize: 5 * 1024 * 1024,
};

const fileFilter = (req, file, cb) => {//виконується до збереження
    const extention = file.originalname.split('.').pop();
    if(extention === "jpg") { //фільтр файлів за розширенням
        return cb(HttpError(400, 'Invalid file extention'));        
    }
    cb(null, true);
};

const upload = multer({
    storage,
    limits,
    // fileFilter
});

export default upload;
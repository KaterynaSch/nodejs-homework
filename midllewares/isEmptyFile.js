import { HttpError } from "../helpers/index.js";

const isEmptyFile = async(req, res, next) => {//ф-ція перевіряє чи file не пустий   
    if(!req.file) {
        return next(HttpError(400, "Missing fields"));
    }    
    next();    
};

export default isEmptyFile;
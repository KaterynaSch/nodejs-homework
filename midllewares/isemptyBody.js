import { HttpError } from "../helpers/index.js";

const isEmptyBody = async(req, res, next) => {//ф-ція перевіряє чи тіло не пусте    
    const keys = Object.keys(req.body);    
    if(!keys.length) {
        return next(HttpError(400, "Missing fields"));
    }
    next();    
};

export default isEmptyBody;
import { isValidObjectId } from "mongoose";
import { HttpError } from "../helpers/index.js";

// для всіх маршрутів з id
const isValidId =(req, res, next) => {
    const {id} = req.params;
    //якщо це взагалі не може бути id
    if(!isValidObjectId(id)){
        return next(HttpError(404, `${id} is not valid id`));
    }
    next();
}
export default isValidId;
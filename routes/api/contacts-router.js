import express from "express";

import contactsController from "../../controllers/contacts-controller.js";
import {isEmptyBody, isEmptyBodyForFavorite, isValidId, authenticate, upload} from "../../midllewares/index.js";
import {validateBody} from '../../decorators/index.js';
import {contactAddSchema, contactFavoriteSchema, contactUpdateSchema } from "../../models/Contact.js";

const contactsRouter = express.Router();

contactsRouter.use(authenticate);//приватні маршрути проходять через цю middleware і тільки при умові правильного токена обробляється запит

contactsRouter.get('/', contactsController.getAll);

contactsRouter.get('/:id', isValidId, contactsController.getById);
// upload.fields([{name: 'poster, maxCount: 1}]) - кілька полів
// upload.array('poster', 8) - кілька файлів
contactsRouter.post('/', upload.single('avatar'), isEmptyBody, validateBody(contactAddSchema), contactsController.add);

contactsRouter.put('/:id', isValidId, isEmptyBody, validateBody(contactUpdateSchema), contactsController.updateById);

contactsRouter.patch('/:id/favorite', isValidId, isEmptyBodyForFavorite, validateBody(contactFavoriteSchema), contactsController.updateById);

contactsRouter.delete('/:id', isValidId, contactsController.deleteById);

export default contactsRouter;
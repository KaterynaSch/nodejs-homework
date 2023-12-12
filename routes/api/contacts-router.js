import express from "express";

import contactsController from "../../controllers/contacts-controller.js";
//ф-ція перевіряє чи тіло не пусте
import {isEmptyBody} from "../../midllewares/index.js"

const contactsRouter = express.Router()

contactsRouter.get('/', contactsController.getAllContacts);

contactsRouter.get('/:id', contactsController.getById);

contactsRouter.post('/', isEmptyBody, contactsController.add)


contactsRouter.get('/:contactId', async (req, res, next) => {
  res.json({ message: 'template message' })
})

contactsRouter.post('/', async (req, res, next) => {
  res.json({ message: 'template message' })
})

contactsRouter.delete('/:contactId', async (req, res, next) => {
  res.json({ message: 'template message' })
})

contactsRouter.put('/:contactId', async (req, res, next) => {
  res.json({ message: 'template message' })
})

export default contactsRouter;

import express from "express";

import logger from "morgan";//для логування запитів

import cors from "cors";

import dotenv from 'dotenv';// import dotenv from 'dotenv/config'; скорочений варіант


import contactsRouter from "./routes/api/contacts-router.js";

dotenv.config();//знаходить .env файл і додає його вміст до глобального об'єкту process.env в момент запуску проекту
const app = express();

// налаштування логування
const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short';

// додавання логувння як middleware
app.use(logger(formatsLogger));

app.use(cors());

app.use(express.json());//middleware що перевідяє чи є у об'єкті що надходить contentType

app.use("/api/contacts", contactsRouter);

// обробник ситуації якщо запит прийшов на адресу, якої немає
app.use((req, res) => {
  res.status(404).json({ message: 'Not found' })
})

app.use((err, req, res, next) => {
  const {status = 500, message = "Server error"} = err;
  res.status(status).json({
     message, })
})

export default app
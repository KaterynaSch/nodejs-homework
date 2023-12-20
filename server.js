import mongoose from "mongoose";
import app from "./app.js";

const {DB_HOST, PORT = 3000} = process.env;//  налаштування хостингу
 
mongoose.connect(DB_HOST)
.then(() => {
// запуск додатку-сервера при успішному підключенні до бази
  app.listen(PORT, () => {
    console.log(`Database connection successful`)
  })
})
.catch(error => {
  console.log(error.message);
  process.exit(1);//метод, який закриває усі раніше запущені процеси в рамках проекту
})


import mongoose from "mongoose";
import request from "supertest";//пакет для запитів на запущений сервер

import app from '../../app.js';
import dotenv from 'dotenv/config';

import User from "../../models/User.js";


const {DB_TEST_HOST, PORT = 3000} = process.env;//налаштування хойстингу

describe('test /users.login route', () => {
    let server = null;
    beforeAll(async() => {//передусім
        await mongoose.connect(DB_TEST_HOST);//підключ. до бази
        server = app.listen(PORT);//і запуск веб-сервера
    })
    afterAll(async()=> {//після
        await mongoose.connection.close();//відкл. від бази
        server.close()//відкл. сервера
    })
    afterEach(async() => {//після кожного 
    await User.deleteMany();//видаляти всі об'єкти з бази щоб не заважати послідуючим тестам
    })
    // beforeEach() щоб зробити щось перед кожним тестом
    // ----------------------------------------------------
    test('test/login with correct response status-code', async() =>{
        const registerData = {
            email: "avatar18@ukr.net",
            password: "123456"                                  
        };
        await request(app).post('/users/register').send(registerData);
       
    //     // expect(statusCode).toBe(201);
    //     // expect(body.email).toBe(registerData.email);      

    //     // const user = await User.findOne({email: registerData.email});//запит до бази        
    //     // expect(user.email).toBe(registerData.email);// перевірка чи вірно email збережений в базі
        const loginData = {
            email: "avatar18@ukr.net",
            password: "123456"                                  
        };
        const {statusCode} = await request(app).post('/users/login').send(loginData); 
       expect(statusCode).toBe(200);
    })
    // --------------------------------------------------------
    test('test/login with token in response', async() =>{
        const registerData = {
            email: "avatar18@ukr.net",
            password: "123456"                                  
        };
        await request(app).post('/users/register').send(registerData);

        const loginData = {
            email: "avatar18@ukr.net",
            password: "123456"                                  
        };
        const {body} = await request(app).post('/users/login').send(loginData);
        expect(body.token).toBeDefined();
    })
    // -----------------------------------------------------------
    test('test/login response with correct fields in obj', async() => {
        const registerData = {
            email: "avatar18@ukr.net",
            password: "123456"                                  
        };
        await request(app).post('/users/register').send(registerData);

        const loginData = {
            email: "avatar18@ukr.net",
            password: "123456"                                  
        };
        const {body} = await request(app).post('/users/login').send(loginData);
        // console.log(body);
        expect(body.token).toBeDefined();
        expect(body).toHaveProperty('user');
        expect(body.user).toHaveProperty('email');
        expect(body.user).toHaveProperty('subscription');
        expect(body.user).toEqual(expect.objectContaining({
            'email': expect.any(String),
            'subscription': expect.any(String),
          }))
    })
})
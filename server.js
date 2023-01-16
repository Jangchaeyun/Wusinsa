// importing packages
const express = require('express');
const admin = require('firebase-admin');
const bcrypt = require('bcrypt');
const path = require('path');

// declare static path
let staticPath = path.join(__dirname, "public");

// intializing express.js

const app = express();

// middlewares
app.use(express.static(staticPath));
app.use(express.json());

// routes
// home route
app.get("/", (req, res) => {
     res.sendFile(path.join(staticPath, "index.html"));
})

// signup router
app.get('/signup', (req, res) => {
     res.sendFile(path.join(staticPath, "signup.html"));
})

app.post('/signup', (req, res) => {
     let { name, email, password, number, tac, notification } = req.body;

     // form validations
     if (name.length < 3) {
          return res.json({ 'alert': '이름은 반드시 3글자 이상이여야 합니다.' })
     } else if (!email.length) {
          return res.json({ 'alert': '이메일 입력은 필수입니다.' })
     } else if (password.length < 8) {
          return res.json({ 'alert': '비밀번호는 8글자 이상 입력해야 합니다.' })
     } else if (!number.length) {
          return res.json({ 'alert': '휴대폰 번호를 입력해주세요.' })
     } else if (!Number(number.value) || number.length < 10) {
          return res.json({ 'alert': '잘못된 번호입니다. 유효한 번호를 입력하세요.' })
     } else if (!tac.checked) {
          return res.json({ 'alert': '이용 약관에 동의해야 합니다.' });
     } else {
          // store user in db
     }
})

// 404 route
app.get('/404', (req, res) => {
     res.sendFile(path.join(staticPath, "404.html"));
})

app.use((req, res) => {
     res.redirect('/404');
})

app.listen(3000, () => {
     console.log('listening on port 3000......')
})
// importing packages
const express = require('express');
const admin = require('firebase-admin');
const bcrypt = require('bcrypt');
const path = require('path');

// firebase admin setup
var serviceAccount = require("./wusinsa-firebase-adminsdk-zi5om-345fa90dfe.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

let db = admin.firestore();

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
     } else if (!Number(number) || number.length < 10) {
          return res.json({ 'alert': '잘못된 휴대폰 번호입니다. 유효한 번호를 입력하세요.' })
     } else if (!tac) {
          return res.json({ 'alert': '이용 약관에 동의해야 합니다.' });
     }

     // store user in db
     db.collection('users').doc(email).get()
     .then(user => {
          if (user.exists) {
               return res.json({'alert' : '이메일이 이미 존재합니다.'})
          } else {
               // encrypt the password before storing it.
               bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(password, salt, (err, hash) => {
                         req.body.password = hash;
                         db.collection('users').doc(email).set(req.body)
                         .then(data => {
                              res.json({
                                   name: req.body.name,
                                   email: req.body.email,
                                   seller: req.body.seller,
                              })
                         })
                    })
               })
          }
     })
})

// login route
app.get('/login', (req, res) => {
     res.sendFile(path.join(staticPath, "login.html"))
})

app.post('/login', (req, res) => {
     let { email, password } = req.body;

     if (!email.length || !password.length) {
          return res.json({'alert': '이메일과 비밀번호를 모두 입력하시오'})
     }

     db.collection('users').doc(email).get()
     .then(user => {
          if (!user.exists) {
               return res.json({'alert': '이메일이 존재하지 않습니다.'})
          } else {
               bcrypt.compare(password, user.data().password, (err, result) => {
                    if (result) {
                         let data = user.data();
                         return res.json({
                              name: data.name,
                              email: data.email,
                              seller: data.seller,
                         })
                    } else {
                         return res.json({'alert': '비밀번호가 올바르지 않습니다.'})
                    }
               })
          }
     })
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
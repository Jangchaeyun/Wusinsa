// importing packages
const express = require('express');
const admin = require('firebase-admin');
const bcrypt = require('bcrypt');
const path = require('path');
const nodemailer = require('nodemailer');

// firebase admin setup
let serviceAccount = require("./wusinsa-firebase-adminsdk-zi5om-345fa90dfe.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

let db = admin.firestore();

// aws config
const aws = require('aws-sdk');
const dotenv = require('dotenv');

dotenv.config();

// aws parameters
const region = "ap-northeast-2";
const bucketName = "wusinsaweb";
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_KEY;

aws.config.update({
     region, 
     accessKeyId, 
     secretAccessKey
 })

// init s3
const s3 = new aws.S3();

// generate image upload link
async function generateUrl() {
     let date = new Date();
     let id = parseInt(Math.random() * 1000000000);

     const imageName = `${id}${date.getTime()}.jpg`;

     const params = ({
          Bucket: bucketName,
          Key: imageName,
          Expires: 300,
          ContentType: 'image/jpeg'
     })
     const uploadUrl = await s3.getSignedUrlPromise('putObject', params);
     return uploadUrl;
}

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

// seller route
app.get('/seller', (req, res) => { 
     res.sendFile(path.join(staticPath, "seller.html"))
})

app.post('/seller', (req, res) => {
     let { name, about, address, number, tac, legit, email } = req.body;
     if (!name.length || !address.length || !about.length || number.length < 10 || !Number(number)) {
          return res.json({ 'alert': '일부 정보는 유효하지 않습니다.' });
     } else if (!tac || !legit) {
          return res.json({'alert' : '이용 약관에 동의해야 합니다.'})
     } else {
          // update users seller status here.
          db.collection('sellers').doc(email).set(req.body)
          .then(data => {
               db.collection('users').doc(email).update({
                    seller: true
               }).then(data => {
                    res.json(true);
               })
          })
     }
})

// add product
app.get('/add-product', (req, res) => {
     res.sendFile(path.join(staticPath, "addProduct.html"))
})

app.get('/add-product/:id', (req, res) => {
     res.sendFile(path.join(staticPath, "addProduct.html"))
})

// get the upload link
app.get('/s3url', (req, res) => {
     generateUrl().then(url => res.json(url));
})

// add product
app.post('/add-product', (req, res) => {
     let { name, shortDes, des, images, sizes, actualPrice, discount, sellPrice, stock, tags, tac, email, draft, id } = req.body;

     // validation
     if (!draft) {
          if (!name.length) {
               return res.json({ 'alert' : '제품 이름을 입력'});
          } else if (shortDes.length > 100 || shortDes.length < 2) {
               return res.json({'alert': '짧은 제품 설명은 2 ~ 100자 사이로 작성.'});
          } else if (!des.length) {
               return res.json({'alert' : '제품에 대한 상세 설명 입력'});
          } else if (!images.length) { // image link array
               return res.json({ 'alert' : '하나 이상의 제품 이미지 업로드'});
          } else if (!sizes.length) { // size array
               return res.json({'alert' : '하나 이상의 크기를 선택'})
          } else if (!actualPrice.length || !discount.length || !sellPrice.length) {
               return res.json({'alert' : '가격을 추가'});
          } else if (stock < 20) {
               return res.json({'alert' : '재고가 20개 이상 있어야 합니다.'});
          } else if (!tags.length) {
               return res.json({'alert' : '검색에서 제품 순위를 지정하는 데 도움이 되는 몇 가지 태그를 입력'});
          } else if (!tac) {
               return res.json({'alert' : '이용 약관에 동의해야 합니다.'});
          }
    }

     // add product
     let docName = id == undefined ? `${name.toLowerCase()}-${Math.floor(Math.random() * 5000)}` : id;
     db.collection('products').doc(docName).set(req.body)
     .then(data => {
          res.json({ 'product': name });
     })
     .catch(err => {
          return res.json({ 'alert': '일부 오류가 발생했습니다. 다시 시도하십시오' });
     })
})

// get products
app.post('/get-products', (req, res) => {
     let { email, id, tag } = req.body;

     if (id) {
          docRef = db.collection('products').doc(id)
     } else if (tag) {
          docRef = db.collection('products').where('tags', 'array-contains', tag)
     } else {
          docRef = db.collection('products').where('email', '==', email)
     }

     docRef.get()
     .then(products => {
          if (products.empty) {
               return res.json('제품이 없습니다.')
          }
          let productArr = [];
          if (id) {
               return res.json(products.data());
          } else {
               products.forEach(item => {
                    let data = item.data();
                    data.id = item.id;
                    productArr.push(data);
               })
               res.json(productArr)
          }
     })
})

app.post('/delete-product', (req, res) => {
     let { id } = req.body;

     db.collection('products').doc(id).delete()
     .then(data => {
          res.json('success');
     }).catch(err => {
          res.json('err');
     })
})

// product page
app.get('/products/:id', (req, res) => {
     res.sendFile(path.join(staticPath, "product.html"));
})

app.get('/search/:key', (req, res) => {
     res.sendFile(path.join(staticPath, "search.html"));
})

app.get('/cart', (req, res) => {
     res.sendFile(path.join(staticPath, "cart.html"));
})

app.get('/checkout', (req, res) => {
     res.sendFile(path.join(staticPath, "checkout.html"));
})

app.post('/order', (req, res) => {
     const { order, email, add } = req.body;

     let transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
               user: process.env.EMAIL,
               pass: process.env.PASSWORD
          }
     })

     const mailOption = {
          from: 'wusinsa@gmail.com',
          to: email,
          subject: 'Wusinsa : Order Placed',
          html: `
          <!DOCTYPE html>
          <html lang="en">
          <head>
                    <meta charset="UTF-8">
                    <meta http-equiv="X-UA-Compatible" content="IE=edge">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Document</title>
               
                    <style>
                         body {
                              min-height: 90vh;
                              background: #f5f5f5;
                              font-family: sans-serif;
                              display: flex;
                              justify-content: center;
                              align-items: center;
                         }
                         .heading {
                              text-align: center;
                              font-size: 40px;
                              width: 50%;
                              display: block;
                              line-height: 50px;
                              margin: 30px auto 60px;
                              text-transform: capitalize;    
                         }
                         .heading span {
                              font-weight: 300;
                         }
                         .btn {
                              width: 200px;
                              height: 50px;
                              border-radius: 5px;
                              background: #3f3f3f;
                              color: #fff;
                              display: block;
                              margin: auto;
                              font-size: 18px;
                              text-transform: capitalize;
                         }
                    </style>
               </head>
               <body>
                    <div>
                         <h1 class="heading">${email.split('@')[0]}에게, <span>주문이 성공적으로 완료되었습니다.</span></h1>
                         <button class="btn">상태 확인</button>
                    </div>
               </body>
          </html>
          `
     }
          
     let docName = email + Math.floor(Math.random() * 123719287419824);
     db.collection('order').doc(docName).set(req.body) 
     .then(data => {
          transporter.sendMail(mailOption, (err, info) => {
               if (err) {
                    res.json({ 'alert': '이런! 오류가 발생한 것 같습니다. 다시 시도하십시오' })
               } else {
                    res.json({ 'alert': '주문 접수 완료!', 'type': 'success' });
               }
          })
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
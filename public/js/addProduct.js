let user = JSON.parse(sessionStorage.user || null);
let loader = document.querySelector('.loader');

// checking user is logged in or not
window.onload = () => {
     if (user) {
          if (!compareToken(user.authToken, user.email)) {
               location.replace('/login');
          }
     } else {
          location.replace('/login');
     }
}

// price inputs

const actualPrice = document.querySelector('#actual-price');
const discountPercentage = document.querySelector('#discount');
const sellingPrice = document.querySelector('#sell-price');

discountPercentage.addEventListener('input', () => {
     if (discountPercentage.value > 100) {
          discountPercentage.value = 90;
     } else {
          let discount = actualPrice.value * discountPercentage.value / 100;
          sellingPrice.value = actualPrice.value - discount;
     }
})

sellingPrice.addEventListener('input', () => {
     let discount = (sellingPrice.value / actualPrice.value) * 100;
     discountPercentage.value = discount;
})

// upload image handle
let uploadImages = document.querySelectorAll('.fileupload');
let imagePaths = []; // will store all uploaded imagea paths

uploadImages.forEach((fileupload, index) => {
     fileupload.addEventListener('change', () => {
         const file = fileupload.files[0];
         let imageUrl;
 
         if(file.type.includes('image')){
             // means user uploaded an image
             fetch('/s3url').then(res => res.json())
             .then(url => {
                 fetch(url,{
                     method: 'PUT',
                     headers: new Headers({'Content-Type': 'multipart/form-data'}),
                     body: file
                 }).then(res => {
                     imageUrl = url.split("?")[0];
                     imagePaths[index] = imageUrl;
                     let label = document.querySelector(`label[for=${fileupload.id}]`);
                     label.style.backgroundImage = `url(${imageUrl})`;
                     let productImage = document.querySelector('.product-image');
                     productImage.style.backgroundImage = `url(${imageUrl})`;
                 })
             })
          } else {
               showAlert('이미지만 업로드')
          }
     })
})

// form submission

const productName = document.querySelector('#product-name');
const shortLine = document.querySelector('#short-des');
const des = document.querySelector('#des');

let sizes = []; // will store all th sizes

const stock = document.querySelector('#stock');
const tags = document.querySelector('#tags');
const tac = document.querySelector('#tac');

// buttons
const addProductBtn = document.querySelector('#add-btn');
const saveDraft = document.querySelector('#save-btn');

// store size function
const storeSizes = () => {
     sizes = [];
     let sizeCheckBox = document.querySelectorAll('.size-checkbox');
     sizeCheckBox.forEach(item => {
          if (item.checked) {
               sizes.push(item.value);
          }
     })
}

const validateForm = () => {
     if (!productName.value.length) {
          return showAlert('제품 이름을 입력');
     } else if (shortLine.value.length > 100 || shortLine.value.length < 3) {
          return showAlert('짧은 제품 설명은 10 ~ 1000자 사이로 작성.');
     } else if (!des.value.length) {
          return showAlert('제품에 대한 상세 설명 입력');
     } else if (!imagePaths.length) { // image link array
          return showAlert('하나 이상의 제품 이미지 업로드');
     } else if (!sizes.length) { // size array
          return showAlert('하나 이상의 크기를 선택')
     } else if (!actualPrice.value.length || !discount.value.length || !sellingPrice.value.length) {
          return showAlert('가격을 추가');
     } else if (stock.value < 20) {
          return showAlert('재고가 20개 이상 있어야 합니다.');
     } else if (!tags.value.length) {
          return showAlert('검색에서 제품 순위를 지정하는 데 도움이 되는 몇 가지 태그를 입력');
     } else if (!tac.checked) {
          return showAlert('이용 약관에 동의해야 합니다.');
     }
     return true;
}

const productData = () => {
     let tagArr = tags.value.split(',');
     tagArr.forEach((item, i) => tagArr[i] = tagArr[i].trim());
     return data = {
          name: productName.value,
          shortDes: shortLine.value,
          des: des.value,
          images: imagePaths,
          sizes: sizes,
          actualPrice: actualPrice.value,
          discount: discountPercentage.value,
          sellPrice: sellingPrice.value,
          stock: stock.value,
          tags:tagArr,
          tac: tac.checked,
          email: user.email
     }
}

addProductBtn.addEventListener('click', () => {
     storeSizes();
     // validate form
     if (validateForm()) { // validateForm return true or false while doing validation
          loader.style.display = 'block';
          let data = productData();
          if(productId){
               data.id = productId;
          }
          sendData('/add-product', data);
     }
})

// save draft btn
saveDraft.addEventListener('click', () => {
     // store sizes
     storeSizes();
     // check for product name
     if (!productName.value.length) {
          showAlert('제품명 입력')
     } else { // don't validate the data
          let data = productData();
          data.draft = true;
          sendData('/add-product', data);
     }
})

// existing product detail handle
const setFormsData = (data) => {
     productName.value = data.name;
     shortLine.value = data.shortDes;
     des.value = data.des;
     actualPrice.value = data.actualPrice;
     discountPercentage.value = data.discount;
     sellingPrice.value = data.sellPrice;
     stock.value = data.stock;
     tags.value = data.tags;

     // set up images
     imagePaths = data.images;
     imagePaths.forEach((url, i) => {
          let label = document.querySelector(`label[for=${uploadImages[i].id}]`);
          label.style.backgroundImage = `url(${url})`;
          let productImage = document.querySelector('.product-image');
          productImage.style.backgroundImage = `url(${url})`;
     })

     // setup sizes
     sizes = data.sizes;
     
     let sizeCheckbox = document.querySelectorAll('.size-checkbox');
     sizeCheckbox.forEach(item => {
          if (sizes.includes(item.value)) {
               item.setAttribute('checked', '');
          }
     })
}

const fetchProductData = () => {
     fetch('/get-products', {
          method: 'post',
          headers: new Headers({ 'Content-Type': 'application/json' }),
          body: JSON.stringify({email: user.email, id: productId})
     })
     .then((res) => res.json())
     .then(data => {
          setFormsData(data);
     })
     .catch(err => {
          console.log(err);
     })
}

let productId = null;
if (location.pathname != '/add-product') {
     productId = decodeURI(location.pathname.split('/').pop());

     fetchProductData();
}

let loader = document.querySelector('.loader');

const becomeSellerElement = document.querySelector('.become-seller');
const productListingElement = document.querySelector('.product-listing');
const applyForm = document.querySelector('.apply-form');
const showApplyFormBtn = document.querySelector('#apply-btn');

window.onload = () => {
     if (sessionStorage.user) {
          let user = JSON.parse(sessionStorage.user);
          if (compareToken(user.authToken, user.email)) {
               if (!user.seller) {
                    becomeSellerElement.classList.remove('hide');
               } else {
                    productListingElement.classList.remove('hide');
               }
          } else {
               location.replace('/login');
          }
     } else {
          location.replace('/login');
     }
}

showApplyFormBtn.addEventListener('click', () => {
     becomeSellerElement.classList.add('hide');
     applyForm.classList.remove('hide');
})

// form submission

const applyFormButton = document.querySelector('#apply-form-btn');
const businessName = document.querySelector('#business-name');
const address = document.querySelector('#business-add');
const about = document.querySelector('#about');
const number = document.querySelector('#number');
const tac = document.querySelector('#terms-and-cond');
const legitInfo = document.querySelector('#legitInfo');

applyFormButton.addEventListener('click', () => {
     if (!businessName.value.length || !address.value.length || !about.value.length || !number.value.length) {
          showAlert('모두 입력해야 합니다.')
     } else if (!tac.checked || !legitInfo.checked) {
          showAlert('이용 약관에 동의해야 합니다.')
     } else {
          // making server request
          loader.style.display = 'block';
          sendData('/seller', {
               name: businessName.value,
               address: address.value,
               about: about.value,
               number: number.value,
               tac: tac.checked,
               legit: legitInfo.checked,
               email: JSON.parse(sessionStorage.user).email
          })
     }
})
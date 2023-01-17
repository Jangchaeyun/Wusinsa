// redirect to home page if user logged in
window.onload = () => {
     if (sessionStorage.user) {
          user = JSON.parse(sessionStorage.user);
          if (compareToken(user.authToken, user.email)) {
               location.replace('/');
          }
     }
}

const loader = document.querySelector('.loader');

// select inputs
const submitBtn = document.querySelector('.submit-btn');
const name = document.querySelector('#name') || null;
const email = document.querySelector('#email');
const password = document.querySelector('#password');
const number = document.querySelector('#number') || null;
const tac = document.querySelector('#terms-and-cond') || null;
const notification = document.querySelector('#notification') || null;

submitBtn.addEventListener('click', () => {
     if (name != null) { // sign up page
          if (name.value.length < 3) {
               showAlert('이름은 3글자 이상 필수입니다.');
          } else if (!email.value.length) {
               showAlert('이메일 입력은 필수입니다.')
          } else if (password.value.length < 8) {
               showAlert('비밀번호는 8글자 이상 입력해야 합니다.')
          } else if (!number.value.length) {
               showAlert('휴대폰 번호를 입력해주세요.')
          } else if (!Number(number.value) || number.value.length < 10) {
               showAlert('잘못된 번호입니다. 유효한 번호를 입력하세요.')
          } else if (!tac.checked) {
               showAlert('이용 약관에 동의해야 합니다.');
          } else {
               // submit form
               loader.style.display = 'block';
               sendData('/signup', {
                    name: name.value,
                    email: email.value,
                    password: password.value,
                    number: number.value,
                    tac: tac.checked,
                    notification: notification.checked,
                    seller: false
               })
          }
     } else {
          // login page
          if (!email.value.length || !password.value.length) {
               showAlert('이메일과 비밀번호 모두를 입력해야 합니다.')
          } else {
               loader.style.display = 'block';
               sendData('/login', {
                    email: email.value,
                    password: password.value,
               })
          }
     }
})

const loader = document.querySelector('.loader');

// select inputs
const submitBtn = document.querySelector('.submit-btn');
const name = document.querySelector('#name');
const email = document.querySelector('#email');
const password = document.querySelector('#password');
const number = document.querySelector('#number');
const tac = document.querySelector('#terms-and-cond');
const notification = document.querySelector('#notification');

submitBtn.addEventListener('click', () => {
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
})

// send data function
const sendData = (path, data) => {
     fetch(path, {
          method: 'post',
          headers: new Headers({ 'Content-Type': 'application/json' }),
          body: JSON.stringify(data)
     }).then((res) => res.json())
     .then(response => {
          processData(response)     
     })
}

const processData = (data) => {
     loader.style.display = null;
     if (data.alert) {
          showAlert(data.alert);
     }
}

// alert function
const showAlert = (msg) => {
     let alertBox = document.querySelector('.alert-box');
     let alertMsg = document.querySelector('.alert-msg');
     alertMsg.innerHTML = msg;
     alertBox.classList.add('show');
     setTimeout(() => {
          alertBox.classList.remove('show');
     }, 3000);
}
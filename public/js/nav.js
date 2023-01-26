const createNav = () => {
     let nav = document.querySelector('.navbar');

     nav.innerHTML = `
          <div class="nav">
               <img src="../img/dark-logo.png" class="brand-logo" alt="">
               <div class="nav-items">
                    <div class="search">
                         <input type="text" class="search-box" placeholder="검색">
                         <button class="search-btn">검색</button>
                    </div>
                    <a>
                         <img src="../img/user.png" id="user-img" alt="">
                         <div class="login-logout-popup hide">
                              <p class="account-info">다음으로 로그인, 이름</p>
                              <button class="btn" id="user-btn">로그아웃</button>
                         </div>
                    </a>
                    <a href="/cart"><img src="../img/cart.png" alt=""></a>
               </div>
          </div>
          <ul class="links-container">
               <li class="link-item"><a href="#" class="link">홈</a></li>
               <li class="link-item"><a href="#" class="link">여성</a></li>
               <li class="link-item"><a href="#" class="link">남성</a></li>
               <li class="link-item"><a href="#" class="link">아동</a></li>
               <li class="link-item"><a href="#" class="link">악세서리</a></li>
          </ul>
     `;
}

createNav();

// nav popup
const userImageButton = document.querySelector('#user-img');
const userPop = document.querySelector('.login-logout-popup');
const popupText = document.querySelector('.account-info');
const actionBtn = document.querySelector('#user-btn');

userImageButton.addEventListener('click', () => {
     userPop.classList.toggle('hide');
})

window.onload = () => {
     let user = JSON.parse(sessionStorage.user || null);
     if (user != null) {
          // means user is logged in
          popupText.innerHTML = `다음으로 로그인, ${user.name}`;
          actionBtn.innerHTML = '로그아웃';
          actionBtn.addEventListener('click', () => {
               sessionStorage.clear();
               location.reload();
          })
     } else {
          // user is logged out
          popupText.innerHTML = '로그인 후 주문하기';
          actionBtn.innerHTML = '로그인'
          actionBtn.addEventListener('click', () => {
               location.href = '/login'
          })
     }
}
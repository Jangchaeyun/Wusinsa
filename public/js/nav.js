const createNav = () => {
     let nav = document.querySelector('.navbar');

     nav.innerHTML = `
          <div class="nav">
               <img src="img/dark-logo.png" class="brand-logo" alt="">
               <div class="nav-items">
                    <div class="search">
                         <input type="text" class="search-box" placeholder="검색">
                         <button class="search-btn">검색</button>
                    </div>
                    <a href="#"><img src="img/user.png" alt=""></a>
                    <a href="#"><img src="img/cart.png" alt=""></a>
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
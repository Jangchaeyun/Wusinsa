const createFooter = () => {
     let footer = document.querySelector('footer');

     footer.innerHTML = `
          <div class="footer-content">
               <img src="../img/light-logo.png" class="logo" alt="">
               <div class="footer-ul-container">
                    <ul class="category">
                         <li class="category-title">남성</li>
                         <li><a href="#" class="footer-link">티셔츠</a></li>
                         <li><a href="#" class="footer-link">스웨터</a></li>
                         <li><a href="#" class="footer-link">셔츠</a></li>
                         <li><a href="#" class="footer-link">청바지</a></li>
                         <li><a href="#" class="footer-link">바지</a></li>
                         <li><a href="#" class="footer-link">신발</a></li>
                         <li><a href="#" class="footer-link">캐주얼</a></li>
                         <li><a href="#" class="footer-link">포멀</a></li>
                         <li><a href="#" class="footer-link">스포티</a></li>
                         <li><a href="#" class="footer-link">시계</a></li>
                    </ul>
                    <ul class="category">
                         <li class="category-title">여성</li>
                         <li><a href="#" class="footer-link">티셔츠</a></li>
                         <li><a href="#" class="footer-link">스웨터</a></li>
                         <li><a href="#" class="footer-link">셔츠</a></li>
                         <li><a href="#" class="footer-link">청바지</a></li>
                         <li><a href="#" class="footer-link">바지</a></li>
                         <li><a href="#" class="footer-link">신발</a></li>
                         <li><a href="#" class="footer-link">캐주얼</a></li>
                         <li><a href="#" class="footer-link">포멀</a></li>
                         <li><a href="#" class="footer-link">스포티</a></li>
                         <li><a href="#" class="footer-link">시계</a></li>
                    </ul>
               </div>
          </div>
          <p class="footer-title">회사에 대해서</p>
          <p class="info">의류 뿐만 아니라 가방, 액세서리 등 다양한 상품을 취급한다. 상품도 비교적 저렴한 옷 신발 가방 액세서리 화장품 등을 많이 취급하고 있다. 반면 신사복 따위의 30대 직장 남성 타겟 고급 브랜드상품은 거의 없다. 이는 대부분의 한국 인터넷 패션 쇼핑몰들이 여성의류 판매에 치중하고있는 것과 차별성이 있다.</p>
          <p class="info">문의 이메일 - wusinsa@clothing.com, 고객 지원 이매일 - customersupport@clothing.com</p>
          <p class="info">전화번호 - 02-4789-0976, 02-4567-8765</p>
          <div class="footer-social-container">
               <div>
                    <a href="#" class="social-link">서비스 약관</a>
                    <a href="#" class="social-link">개인 정보 페이지</a>     
               </div>
               <div>
                    <a href="#" class="social-link">인스타그램</a>
                    <a href="#" class="social-link">페이스북</a>
                    <a href="#" class="social-link">트위터</a>
               </div>
          </div>
          <p class="footer-credit">베스트 의류 온라인 쇼핑몰</p>
     `;
}

createFooter();
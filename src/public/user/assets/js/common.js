const galleryCategoryMenu = document.querySelectorAll(
  ".gallery_category_menu li"
);
const galleryMoreBtn = document.querySelector(".gallery_more_btn");
const popupWrap = document.querySelector(".popup_wrap");
const popupCloseBtn = document.querySelector(".icon_close");
const applyBtn = document.querySelector(".apply_btn");
const classListContainer = document.querySelector(".class_category_list");
const pierrotListContainer = document.querySelector(".pierrot_category_list");
const topperListContainer = document.querySelector(".topper_category_list");
const balloonListContainer = document.querySelector(".balloon_category_list");
const ballonMoreBtn = document.querySelector(".ballon_more_btn");

let galleryCategoryImg = [];
let classCategoryImg = [];
let pierrotCategoryImg = [];
let topperCategoryImg = [];
let balloonCategoryImg = [];
let galleryCategoryPopup = [];

// main images 8개  api
const fetchGalleryImages = (id) => {
  fetch("http://localhost:3000/content/gallery", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      page: 1,
      pageSize: 8,
      category: [id],
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      galleryCategoryImg = data;
      galleryImageList(galleryCategoryImg);
    });
};

// 원데이 클래스 api
const fetchClassImages = (id) => {
  fetch("http://localhost:3000/content/gallery", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      page: null,
      pageSize: null,
      category: [4],
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      classCategoryImg = data;
      classImageList(classCategoryImg);
    });
};

// 삐에로/페이스페인팅 api
const fetchPierrotImages = (id) => {
  fetch("http://localhost:3000/content/gallery", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      page: null,
      pageSize: null,
      category: [3],
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      pierrotCategoryImg = data;
      pierrotImageList(pierrotCategoryImg);
    });
};

// 토퍼 api
const fetchTopperImages = (id) => {
  fetch("http://localhost:3000/content/gallery", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      page: null,
      pageSize: null,
      category: [2],
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      topperCategoryImg = data;
      topperImageList(topperCategoryImg);
    });
};

let pageCount = 1;
// 풍선 api
const fetchBalloonImages = (id) => {
  fetch("http://localhost:3000/content/gallery", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      page: pageCount,
      pageSize: 12,
      category: [1],
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      // balloonCategoryImg = data;
      // balloonImageList(balloonCategoryImg);
      const categoryObj = Object.assign({}, data);
      const categoryList = categoryObj.data;

      // if (categoryList.length === 0) {
      //   ballonMoreBtn.classList.add("hidden");
      // } else {
      balloonCategoryImg = balloonCategoryImg.concat(categoryList); // 받아온 이미지를 배열에 추가
      balloonImageList(balloonCategoryImg);
      //}

      /*
      if (categoryList.length === 0) {
        // 더 이상 데이터가 없을 경우
        galleryMoreBtn.style.display = "none"; // 더보기 버튼 숨기기
      } else {
        balloonImages = balloonImages.concat(categoryList); // 받아온 이미지를 배열에 추가
        balloonImageList(balloonImages);
      }
      
      */
    });
};

// 팝업 상세 호출 api
const fetchGalleryPopupDetail = (id) => {
  fetch(`http://localhost:3000/content/select/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      galleryCategoryPopup = data;
      popupAddElement(data); // 수정: data를 전달
    });
};

/* 원데이클래스 호출 */
if (classListContainer) {
  fetchClassImages();
}

/* 삐에로/페이스 페인팅 호출 */
if (pierrotListContainer) {
  fetchPierrotImages();
}

/* 토퍼 호출 */
if (topperListContainer) {
  fetchTopperImages();
}

/* 토퍼 페인팅 호출 */
if (balloonListContainer) {
  fetchBalloonImages();
}

/* 카테고리별 조회 */
if (galleryCategoryMenu) {
  let id = 1;
  const activeCategory = document.querySelector(
    ".gallery_category_menu .active"
  );
  if (activeCategory) {
    id = activeCategory.id;
  }

  fetchGalleryImages(id);

  galleryCategoryMenu.forEach((prElement) => {
    prElement.addEventListener("click", function () {
      galleryCategoryMenu.forEach((element) => {
        element.classList.remove("active");
      });
      this.classList.add("active");
      id = this.id;
      console.log(id);

      fetchGalleryImages(id);
    });
  });

  if (galleryMoreBtn) {
    galleryMoreBtn.addEventListener("click", () => {
      const numericId = parseInt(id);

      if (numericId === 1) {
        location.href = "/balloon";
      } else if (numericId === 2) {
        location.href = "/topper";
      } else if (numericId === 3) {
        location.href = "/pierrot";
      } else if (numericId === 4) {
        location.href = "/class";
      } else {
        location.href = "/balloon";
      }
    });
  }
}

/* 이미지 url 추출 */
const trimFilePath = (filePath) => {
  const startIndex = filePath.indexOf("uploads");
  const trimmedPath = filePath.substring(startIndex + "uploads".length + 1);
  return trimmedPath;
};

/* */
const galleryImageList = (img) => {
  console.log(img);
  const galleryListContainer = document.querySelector(".gallery_category_list");

  galleryListContainer.innerHTML = "";
  const categoryObj = Object.assign({}, img);
  const categoryList = categoryObj.data;

  categoryList.forEach((element) => {
    const mainImgUrl = trimFilePath(element.file_main_id_url);

    galleryListContainer.insertAdjacentHTML(
      "beforeend",
      `
      <li data-id=${element.content_id} style="background:url(http://localhost:3000/img/uploads/${mainImgUrl}) no-repeat center center/cover">
          <div class="gallery_category_list_content">
            <div class="gallery_category_title_area">
              <div class="gallery_category_title">${element.title}</div>
            </div>
          </div>
      </li>
      `
    );
  });
  const galleryCategoryList = document.querySelectorAll(
    ".gallery_category_list li"
  );

  galleryCategoryList.forEach((element) => {
    element.addEventListener("click", () => {
      console.log(element.getAttribute("data-id"));
      console.log(element);
      fetchGalleryPopupDetail(element.getAttribute("data-id"));
      popupWrap.classList.remove("hidden");
    });
  });
};

/* 팝업 추가 이미지 */
const popupAddElement = (data) => {
  console.log("data");
  const content = data.data;
  const popupImagesList = document.querySelector(".popup_images_list");
  if (popupImagesList) {
    // 요소가 존재하는 경우에만 작업 수행
    popupImagesList.innerHTML = "";
    // 나머지 코드 작성
  } else {
    console.log("popup_images_list 요소를 찾을 수 없습니다.");
  }

  const popupTitle = document.querySelector(".popup_title");

  popupImagesList.innerHTML = "";
  console.log(content[0]);

  let detailImg01, detailImg02, detailImg03, detailImg04, mainImg;
  popupTitle.innerText = content[0].title;
  mainImg = trimFilePath(content[0].file_main_id_url);

  popupImagesList.insertAdjacentHTML(
    "beforeend",
    `<div class="swiper-slide"><img src=http://localhost:3000/img/uploads/${mainImg}></div>`
  );

  if (content[0].file_1_id_url) {
    detailImg01 = trimFilePath(content[0].file_1_id_url);
    popupImagesList.insertAdjacentHTML(
      "beforeend",
      `<div class="swiper-slide"><img src=http://localhost:3000/img/uploads/${detailImg01}></div>`
    );
  }
  if (content[0].file_2_id_url) {
    detailImg02 = trimFilePath(content[0].file_2_id_url);
    popupImagesList.insertAdjacentHTML(
      "beforeend",
      `<div class="swiper-slide"><img src=http://localhost:3000/img/uploads/${detailImg02}></div>`
    );
  }
  if (content[0].file_3_id_url) {
    detailImg03 = trimFilePath(content[0].file_3_id_url);
    popupImagesList.insertAdjacentHTML(
      "beforeend",
      `<div class="swiper-slide"><img src=http://localhost:3000/img/uploads/${detailImg03}></div>`
    );
  }
  if (content[0].file_4_id_url) {
    detailImg04 = trimFilePath(content[0].file_4_id_url);
    popupImagesList.insertAdjacentHTML(
      "beforeend",
      `<div class="swiper-slide"><img src=http://localhost:3000/img/uploads/${detailImg04}></div>`
    );
  }
};

/* popup close */
if (popupCloseBtn) {
  popupCloseBtn.addEventListener("click", (event) => {
    popupWrap.classList.add("hidden");
  });
}

if (ballonMoreBtn) {
  ballonMoreBtn.addEventListener("click", () => {
    pageCount++; // 페이지 번호 증가
    fetchBalloonImages();
  });
}

/* 상담문의 신청 */
if (applyBtn) {
  const name = document.querySelector(".name");
  const hp1 = document.querySelector(".phoneNum1");
  const hp2 = document.querySelector(".phoneNum2");
  const hp3 = document.querySelector(".phoneNum3");
  const email = document.querySelector(".email");
  const address = document.querySelector(".address");
  const place = document.querySelector(".place");

  const budget = document.querySelector(".budget");
  const requestSelet = document.querySelector(".request_selet");
  const qnaContent = document.querySelector(".qna_content_detail");

  applyBtn.addEventListener("click", () => {
    fetch("http://localhost:3000/counsel/insertCounsel", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name.value,
        phone_num: hp1.value + hp2.value + hp3.value,
        email: email.value + "@" + address.value,
        location: place.value,
        budget: budget.value,
        purpose: requestSelet.options[requestSelet.selectedIndex].value,
        detail: qnaContent.value,
        agree: "Y",
      }),
    })
      .then((response) => response.text())
      .then((data) => {
        console.log(data);
      });
  });
}

/* 원데이 클래스 리스트 조회 */
const classImageList = (img) => {
  console.log(img);

  classListContainer.innerHTML = "";
  const categoryObj = Object.assign({}, img);
  const categoryList = categoryObj.data;

  categoryList.forEach((element) => {
    const mainImgUrl = trimFilePath(element.file_main_id_url);

    classListContainer.insertAdjacentHTML(
      "beforeend",
      `
      <li data-id=${element.content_id} style="background:url(http://localhost:3000/img/uploads/${mainImgUrl}) no-repeat center center/cover">
          <div class="gallery_category_list_content">
            <div class="gallery_category_title_area">
              <div class="gallery_category_title">${element.title}</div>
            </div>
          </div>
      </li>
      `
    );
  });
  const classCategoryList = document.querySelectorAll(
    ".class_category_list li"
  );

  classCategoryList.forEach((element) => {
    element.addEventListener("click", () => {
      console.log(element.getAttribute("data-id"));
      fetchGalleryPopupDetail(element.getAttribute("data-id"));
      popupWrap.classList.remove("hidden");
    });
  });
};

/* 삐에로/페이스페인팅 리스트 조회 */
const pierrotImageList = (img) => {
  console.log(img);

  pierrotListContainer.innerHTML = "";
  const categoryObj = Object.assign({}, img);
  const categoryList = categoryObj.data;

  categoryList.forEach((element) => {
    const mainImgUrl = trimFilePath(element.file_main_id_url);

    pierrotListContainer.insertAdjacentHTML(
      "beforeend",
      `
      <li data-id=${element.content_id} style="background:url(http://localhost:3000/img/uploads/${mainImgUrl}) no-repeat center center/cover">
          <div class="gallery_category_list_content">
            <div class="gallery_category_title_area">
              <div class="gallery_category_title">${element.title}</div>
            </div>
          </div>
      </li>
      `
    );
  });
  const pierrotCategoryList = document.querySelectorAll(
    ".pierrot_category_list li"
  );

  pierrotCategoryList.forEach((element) => {
    element.addEventListener("click", () => {
      console.log(element.getAttribute("data-id"));
      fetchGalleryPopupDetail(element.getAttribute("data-id"));
      popupWrap.classList.remove("hidden");
    });
  });
};

/* 토퍼 리스트 조회 */
const topperImageList = (img) => {
  console.log(img);

  topperListContainer.innerHTML = "";
  const categoryObj = Object.assign({}, img);
  const categoryList = categoryObj.data;

  categoryList.forEach((element) => {
    const mainImgUrl = trimFilePath(element.file_main_id_url);

    topperListContainer.insertAdjacentHTML(
      "beforeend",
      `
      <li data-id=${element.content_id} style="background:url(http://localhost:3000/img/uploads/${mainImgUrl}) no-repeat center center/cover">
          <div class="gallery_category_list_content">
            <div class="gallery_category_title_area">
              <div class="gallery_category_title">${element.title}</div>
            </div>
          </div>
      </li>
      `
    );
  });
  const topperCategoryList = document.querySelectorAll(
    ".topper_category_list li"
  );

  topperCategoryList.forEach((element) => {
    element.addEventListener("click", () => {
      console.log(element.getAttribute("data-id"));
      fetchGalleryPopupDetail(element.getAttribute("data-id"));
      popupWrap.classList.remove("hidden");
    });
  });

  // 더보기 버튼 숨김 처리
  // if (categoryList.length < pageSize) {
  //   moreButton.style.display = "none";
  // }
};

/* 풍선 리스트 조회 */
const balloonImageList = (imgList) => {
  console.log(imgList);

  balloonListContainer.innerHTML = "";

  imgList.forEach((element) => {
    const mainImgUrl = trimFilePath(element.file_main_id_url);

    balloonListContainer.insertAdjacentHTML(
      "beforeend",
      `
      <li data-id=${element.content_id} style="background:url(http://localhost:3000/img/uploads/${mainImgUrl}) no-repeat center center/cover">
          <div class="gallery_category_list_content">
            <div class="gallery_category_title_area">
              <div class="gallery_category_title">${element.title}</div>
            </div>
          </div>
      </li>
      `
    );
  });

  const balloonCategoryList = document.querySelectorAll(
    ".balloon_category_list li"
  );

  balloonCategoryList.forEach((element) => {
    element.addEventListener("click", () => {
      console.log(element.getAttribute("data-id"));
      fetchGalleryPopupDetail(element.getAttribute("data-id"));
      popupWrap.classList.remove("hidden");
    });
  });

  if (imgList.length < pageCount * 12) {
    // 데이터를 모두 불러왔을 경우
    //galleryMoreBtn.style.display = "none"; // 더보기 버튼 숨기기
    ballonMoreBtn.classList.add("hidden");
  }
};

/* popup swiper  */
const swiper = new Swiper(".mySwiper", {
  spaceBetween: 2,
  direction: "horizontal", // 가로 슬라이드
  slidesPerView: 1,
  centeredSlides: true,
  autoplay: false,
  pagination: false,
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
});

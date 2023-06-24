const galleryCategoryMenu = document.querySelectorAll(
  ".gallery_category_menu li"
);
const galleryCategoryList = document.querySelectorAll(
  ".gallery_category_list li"
);
const popupWrap = document.querySelector(".popup_wrap");
const popupCloseBtn = document.querySelector(".icon_close");
const applyBtn = document.querySelector(".apply_btn");

// const galleryCategory = document.querySelectorAll(".gallery_category_menu li");

// if (galleryCategoryMenu) {
//   galleryCategoryMenu.forEach((prElement) => {
//     prElement.addEventListener("click", () => {
//       galleryCategoryMenu.forEach((element) => {
//         element.classList.remove("active");
//       });
//       prElement.classList.add("active");
//       const id = this.id;
//       console.log(id);
//     });
//   });
// }
// let galleryCategoryImg = [];
// if (galleryCategoryMenu) {
//   let id = 1;

//   galleryCategoryMenu.forEach((prElement) => {
//     prElement.addEventListener("click", function () {
//       galleryCategoryMenu.forEach((element) => {
//         element.classList.remove("active");
//       });
//       this.classList.add("active");
//       id = this.id;
//       console.log(id);

//       fetch("http://localhost:3000/content/gallery", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           page: 1,
//           pageSize: 8,
//           category: [id],
//         }),
//       })
//         .then((response) => response.text())
//         .then((data) => {
//           galleryCategoryImg = JSON.parse(data);
//           console.log(galleryCategoryImg);
//           galleryImageList(galleryCategoryImg);
//         });
//     });
//   });
// }

// const galleryImageList = (img) => {
//   console.log(img);
//   const galleryListContainer = document.querySelector(".gallery_category_list");
//   galleryListContainer.innerHTML = "";
//   const categoryObj = Object.assign({}, img);
//   const categoryList = categoryObj.data;

//   categoryList.forEach((element) => {
//     console.log(element);
//     galleryListContainer.insertAdjacentHTML(
//       "beforeend",
//       `
//       <li style="background:url(${element.url}) no-repeat center center/cover">
//           <div class="gallery_category_list_content">
//             <div class="gallery_category_title_area">
//               <div class="gallery_category_title">${element.title}</div>
//             </div>
//           </div>
//       </li>
//       `
//     );
//   });
// };

let galleryCategoryImg = [];

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
      console.log(galleryCategoryImg);
      galleryImageList(galleryCategoryImg);
    });
};

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
}

const galleryImageList = (img) => {
  console.log(img);
  const galleryListContainer = document.querySelector(".gallery_category_list");
  galleryListContainer.innerHTML = "";
  const categoryObj = Object.assign({}, img);
  const categoryList = categoryObj.data;

  categoryList.forEach((element) => {
    console.log(element);
    galleryListContainer.insertAdjacentHTML(
      "beforeend",
      `
      <li style="background:url(http://localhost:3000/img/uploads/${element.url}) no-repeat center center/cover">
          <div class="gallery_category_list_content">
            <div class="gallery_category_title_area">
              <div class="gallery_category_title">${element.title}</div>
            </div>
          </div>
      </li>
      `
    );
  });
};

if (galleryCategoryList) {
  galleryCategoryList.forEach((element) => {
    element.addEventListener("click", () => {
      console.log(element);
      popupWrap.classList.remove("hidden");
    });
  });
}

if (popupCloseBtn) {
  popupCloseBtn.addEventListener("click", () => {
    popupWrap.classList.add("hidden");
  });
}

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

$(window).on("load", function () {
  load("#js-load", "12");
  $("#gallery_category_more_btn").on("click", function () {
    load("#js-load", "12", "#js-btn-wrap");
  });
});

function load(id, cnt, btn) {
  var girls_list = id + " .js-load:not(.active)";
  var girls_length = $(girls_list).length;
  var girls_total_cnt;
  if (cnt < girls_length) {
    girls_total_cnt = cnt;
  } else {
    girls_total_cnt = girls_length;
    $("#gallery_category_more_btn").hide();
  }
  $(girls_list + ":lt(" + girls_total_cnt + ")").addClass("active");
}
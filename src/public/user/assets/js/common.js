const galleryCategoryMenu = document.querySelectorAll(
  ".gallery_category_menu li"
);
const galleryCategoryList = document.querySelectorAll(
  ".gallery_category_list li"
);
const popupWrap = document.querySelector(".popup_wrap");
const popupCloseBtn = document.querySelector(".icon_close");
const applyBtn = document.querySelector(".apply_btn");

if (galleryCategoryMenu) {
  galleryCategoryMenu.forEach((prElement) => {
    prElement.addEventListener("click", () => {
      galleryCategoryMenu.forEach((element) => {
        element.classList.remove("active");
      });
      prElement.classList.add("active");
    });
  });
}

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

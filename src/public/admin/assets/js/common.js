const lang = {
  decimal: '',
  emptyTable: '데이터가 없습니다.',
  thousands: ',',
  zeroRecords: '검색된 데이터가 없습니다.',
}

$(document).ready(function () {
  $('#top_bar').load('/admin/common/topbar')
  $('#accordion_sidebar').load('/admin/common/sidebar')
  //$('#footer').load('/admin/common/footer')
})

const formatPhone = (origin) => {
  return `${origin.slice(0, 3)}-${origin.slice(3, 7)}-${origin.slice(7)}`;
}

const regexDetail = /^[\s\S]{10,1000}$/; // 국/영문, 숫자, 특수문자 최대 10~1,000자
const regexTitle = /^[^\p{C}]{1,30}$/u;
const regexNote = /^[^\p{C}]{0,300}$/u;
const regexId = /^[a-zA-Z0-9]{4,10}$/;
const regexPwd = /^[\w!@#$%^&*()-+=~]{4,16}$/;

const validInput = (data, rgx, text) => {
  if (!rgx.test(data)) {
    alert(text);
    return false;
  }
  return true;
}

const requireInput = (inputs) => {
  for (const input of inputs) {
    if (!input || (typeof input === 'string' && input.trim() === '') || (input instanceof File && !input.name)) {
      alert('필수값이 입력되지 않았습니다.');
      return false;
    }
  }
  return true;
}

const categoryDecode = (code) => {
  const category = [
    "풍선 장식",
    "토퍼",
    "삐에로/페이스페인팅",
    "클래스"
  ];
  return category[code - 1] || "";
}

const purposeDecode = (code) => {
  const purposes = [
    "풍선 장식",
    "토퍼",
    "부스체험(토퍼,풍선)",
    "삐에로",
    "페이스페인팅",
    "클래스"
  ];
  return purposes[code - 1] || "";
}

const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

//파일 삭제
const deleteFile = async (file_id) => {
  const raw = JSON.stringify({
    file_id
  });

  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };

  try {
    const response = await fetch(`/upload/deleteFile`, requestOptions);
    const { code, message } = await response.json();
    if (code === 200) {

    } else {
    }
  } catch (err) {
    console.log("Err:", err);
  }
};

const onClickLnb = (event, url) => {
  event.preventDefault();

  const currentPage = window.location.pathname;
  const targetUrl = ['/admin/content_register', '/admin/content_edit'];

  let shouldLogout = true;

  if (currentPage === targetUrl[0] || currentPage === targetUrl[1]) {
    if (confirm('등록을 취소하시겠습니까?')) {
      shouldLogout = true;
    } else {
      shouldLogout = false;
    }
  }
  if (shouldLogout) {
    window.location.href = url;
  }
}
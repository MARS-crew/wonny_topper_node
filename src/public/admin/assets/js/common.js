$(document).ready(function () {
  $('#top-bar').load('/admin/common/topbar')
  $('#accordionSidebar').load('/admin/common/sidebar')

})
  
const formatPhone = (origin) =>{
  return `${origin.slice(0, 3)}-${origin.slice(3, 7)}-${origin.slice(7)}`;
}

const regexDetail = /^[\p{L}\p{N}\p{S}\s\n]{10,1000}$/u; // 국/영문, 숫자, 특수문자 최대 10~1,000자
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

const requireInput = (inputs) =>{
  for (const input of inputs) {
    if (!input || (typeof input === 'string' && input.trim() === '') || (input instanceof File && !input.name)) {
      alert('필수값이 입력되지 않았습니다.');
      return false;
    }
  }
  return true;
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
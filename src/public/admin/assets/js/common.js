$(document).ready(function () {
  $('#top-bar').load('/admin/common/topbar')
  $('#accordionSidebar').load('/admin/common/sidebar')

})

const onClickLogout = async () => {
 // event.preventDefault();
  // const raw = JSON.stringify({
  //   id,
  //   pwd,
  // });

  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Cookie", "connect.sid=s%3AJ1YF8vXhf554L2mmcJ5_SAgqhgaQtezX.T3oH00Itci0w8c2pMERC510mlyD6DigniHFBAIfUi3k");

  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    redirect: 'follow'
  };

  try {
    const response = await fetch(`/user/logout`, requestOptions);
    const { code, message } = await response.json();
    if (code === 200) {
      console.log("로그아웃 성공");
      window.location.href = "/admin/index";
      return;
    }
    alert("관리자 정보가 없습니다.");
  } catch (err) {
    console.log('Err:', err);
  }
}
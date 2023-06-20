const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

$(document).ready(function () {
  $('#top-bar').load('/admin/common/topbar')
  $('#accordionSidebar').load('/admin/common/sidebar')

})

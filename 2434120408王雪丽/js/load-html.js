function loadFooter(containerId) {
  // 直接在JS中定义底部的CSS+HTML内容
  var footerStyle = 
    '<style>' +
    '.footer {' +
    '  font-family:"华文行楷";' +
    '  width: 100%;' +
    '  margin: 0 auto;' +
    '  text-align: center;' +
    '  font-size: 24px;' +
    '  color: #999;' +
    '  padding: 30px 0;' +
    '}' +
    '</style>';

  var footerHtml = 
    '<div class="footer">' +
    '  <hr />' +
    '  <p>年级:&nbsp;&nbsp大二&nbsp;&nbsp;&nbsp;&nbsp;专业:&nbsp;&nbsp软件工程&nbsp;&nbsp;&nbsp;&nbsp;班级：&nbsp;&nbsp4班&nbsp;&nbsp;&nbsp;&nbsp;姓名：&nbsp;&nbsp王雪丽</p>' +
    '  <p>注意:本网站仅为河南旅游推荐网站，详细内容请看官网，如有侵权，请联系作者</p>' +
    '</div>';

  var fullContent = footerStyle + footerHtml;
  var container = document.getElementById(containerId);
  if (!container) {
    console.error('容器不存在：', containerId);
    return;
  }
  container.innerHTML = fullContent;
}
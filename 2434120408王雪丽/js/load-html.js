/**
 * 加载页面底部版权信息（适配Dreamweaver CS6，增强容错）
 * @param {string} containerId - 底部容器的ID
 */
function loadFooter(containerId) {
  // 1. 参数校验（兼容ES5）
  if (!containerId || typeof containerId !== 'string') {
    alert('[加载底部错误] 容器ID不能为空且必须为字符串！');
    console.error('[加载底部错误] 容器ID不能为空且必须为字符串！');
    return;
  }

  // 2. 定义底部样式（兼容旧浏览器，补充前缀）
  var footerStyle = 
    '<style type="text/css">' +
    '.footer {' +
    '  font-family:"华文行楷", "Microsoft Yahei", SimHei, sans-serif;' +
    '  width: 100%;' +
    '  margin: 0 auto;' +
    '  text-align: center;' +
    '  font-size: 24px;' +
    '  color: #999;' +
    '  padding: 30px 0;' +
    '  background-color: #f8f9fa;' +
    '  border-top: 1px solid #eee;' +
    '  margin-top: 2rem;' + // 增加顶部间距，避免与内容重叠
    '}' +
    '.footer p {' +
    '  margin: 10px 0;' +
    '  line-height: 1.6;' +
    '  background-color: #f8f9fa;' + // 修复背景色继承问题
    '}' +
    '@media (max-width: 768px) {' +
    '  .footer { font-size: 18px; padding: 20px 0; }' +
    '  .footer p { white-space: normal !important; }' +
    '}' +
    '</style>';

  // 3. 定义底部HTML（优化排版，避免空格错乱）
  var footerHtml = 
    '<div class="footer">' +
    '  <hr style="border: none; border-top: 1px solid #eee; margin: 0 auto; width: 90%;" />' +
    '  <p>年级: 大二&nbsp;&nbsp;专业: 软件工程&nbsp;&nbsp;班级：4班&nbsp;&nbsp;姓名：王雪丽</p>' +
    '  <p>注意:本网站仅为河南旅游推荐网站，详细内容请看官网，如有侵权，请联系作者</p>' +
    '</div>';

  // 4. 拼接内容
  var fullContent = footerStyle + footerHtml;

  // 5. 获取容器元素（容错处理）
  var container = document.getElementById(containerId);
  if (!container) {
    alert('[加载底部警告] 容器ID="' + containerId + '"不存在，已自动创建！');
    console.warn('[加载底部警告] 容器ID="' + containerId + '"不存在，已自动创建！');
    // 自动创建容器
    container = document.createElement('div');
    container.id = containerId;
    document.body.appendChild(container);
  }

  // 6. 写入内容（适配Dreamweaver的HTML解析）
  container.innerHTML = fullContent;
}

// 暴露到全局，确保Dreamweaver中可调用
window.loadFooter = loadFooter;
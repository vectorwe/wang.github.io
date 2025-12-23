// 回到顶部功能实现
document.addEventListener('DOMContentLoaded', function() {
    // 创建回到顶部按钮
    const backToTopBtn = document.createElement('button');
    backToTopBtn.id = 'backToTop';
    backToTopBtn.className = 'back-to-top';
    backToTopBtn.textContent = '↑';
    backToTopBtn.style.display = 'none';
    document.body.appendChild(backToTopBtn);
    
    // 滚动事件监听
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopBtn.style.display = 'block';
        } else {
            backToTopBtn.style.display = 'none';
        }
    });
    
    // 点击事件
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
});
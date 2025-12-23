// 回到顶部按钮：滚动显示，点击回到顶部
(function() {
    // 创建回到顶部按钮
    const backBtn = document.createElement('button');
    backBtn.id = 'back-to-top';
    backBtn.innerText = '↑';
    backBtn.style.cssText = `
        position: fixed;
        bottom: 50px;
        right: 50px;
        width: 40px;
        height: 40px;
        border: none;
        border-radius: 50%;
        background: #333;
        color: white;
        font-size: 20px;
        cursor: pointer;
        display: none;
        z-index: 999;
    `;
    document.body.appendChild(backBtn);

    // 滚动事件：显示/隐藏按钮
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            backBtn.style.display = 'block';
        } else {
            backBtn.style.display = 'none';
        }
    });

    // 点击事件：回到顶部（平滑滚动）
    backBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
})();
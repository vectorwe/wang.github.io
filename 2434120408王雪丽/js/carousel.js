function Carousel(containerSelector, imgList, options) {
    // 处理可选参数，ES5兼容写法
    options = options || {};

    // 校验参数
    if (!containerSelector || !imgList || imgList.length === 0) {
        console.error('轮播图初始化失败：请传入有效的容器选择器和非空的图片列表');
        return;
    }

    // 容器元素
    this.container = document.querySelector(containerSelector);
    if (!this.container) {
        console.error('轮播图初始化失败：未找到选择器为"' + containerSelector + '"的容器');
        return;
    }

    // 配置项（默认值 + 用户自定义）
    this.config = {
        width: options.width || '80%', // 轮播图宽度
        height: options.height || 400, // 轮播图高度（支持数字、百分比、vw等单位）
        autoPlayTime: options.autoPlayTime || 3000, // 自动播放间隔（毫秒）
        borderRadius: options.borderRadius || '8px', // 圆角大小
        boxShadow: options.boxShadow || '0 2px 8px rgba(0,0,0,0.1)' // 阴影效果
    };

    // 图片列表
    this.imgList = imgList;
    // 当前图片索引
    this.currentIndex = 0;
    // 自动播放定时器
    this.autoPlayTimer = null;

    // 初始化轮播图
    this.init();
}

// 初始化轮播图：生成样式、HTML结构、绑定事件
Carousel.prototype.init = function() {
    // 生成并插入CSS样式
    this.injectStyle();
    // 生成HTML结构
    this.renderHtml();
    // 绑定事件
    this.bindEvents();
    // 启动自动播放
    this.startAutoPlay();
};

// 注入轮播图的CSS样式（避免重复注入）
Carousel.prototype.injectStyle = function() {
    // 检查是否已注入样式，避免重复
    if (document.getElementById('carousel-plugin-style')) {
        return;
    }

    var style = document.createElement('style');
    style.id = 'carousel-plugin-style';
    // ES5兼容：使用字符串拼接代替模板字符串
    style.textContent = [
        '/* 轮播图核心样式 */',
        '.carousel-plugin {',
        '    width: var(--carousel-width);',
        '    margin: 20px auto;',
        '    overflow: hidden;',
        '    position: relative;',
        '    border-radius: var(--carousel-border-radius);',
        '    box-shadow: var(--carousel-box-shadow);',
        '}',
        '.carousel-plugin-imgs {',
        '    display: flex;',
        '    transition: transform 0.5s ease;',
        '}',
        '.carousel-plugin-imgs img {',
        '    width: 100%;',
        '    height: var(--carousel-height); /* 直接使用变量，不再加px */',
        '    object-fit: cover;',
        '    flex-shrink: 0; /* 防止图片压缩 */',
        '}',
        '/* 轮播图按钮样式 */',
        '.carousel-plugin-btn {',
        '    position: absolute;',
        '    top: 50%;',
        '    transform: translateY(-50%);',
        '    background: rgba(0,0,0,0.3);',
        '    color: white;',
        '    border: none;',
        '    padding: 15px 10px;',
        '    font-size: 20px;',
        '    cursor: pointer;',
        '    z-index: 10;',
        '    border-radius: 50%;',
        '    transition: background 0.3s ease;',
        '}',
        '.carousel-plugin-btn:hover {',
        '    background: rgba(0,0,0,0.5);',
        '}',
        '.carousel-plugin-btn-prev { left: 10px; }',
        '.carousel-plugin-btn-next { right: 10px; }',
        '/* 轮播图指示器样式 */',
        '.carousel-plugin-indicators {',
        '    position: absolute;',
        '    bottom: 20px;',
        '    left: 50%;',
        '    transform: translateX(-50%);',
        '    display: flex;',
        '    gap: 10px;',
        '}',
        '.carousel-plugin-indicator {',
        '    width: 12px;',
        '    height: 12px;',
        '    border-radius: 50%;',
        '    background: rgba(255,255,255,0.5);',
        '    cursor: pointer;',
        '    transition: background 0.3s ease;',
        '}',
        '.carousel-plugin-indicator.active {',
        '    background: white;',
        '}',
        '/* 响应式适配：小屏幕下调整高度 */',
        '@media (max-width: 768px) {',
        '    .carousel-plugin-imgs img {',
        '        height: 250px;',
        '    }',
        '}'
    ].join('\n');
    document.head.appendChild(style);
};

// 生成轮播图的HTML结构
Carousel.prototype.renderHtml = function() {
    // 处理高度值：如果是数字，加px；如果是字符串（如50vw、80%），直接使用
    var heightValue = typeof this.config.height === 'number' 
        ? this.config.height + 'px' 
        : this.config.height;

    // 设置CSS变量，用于自定义样式
    this.container.style.setProperty('--carousel-width', this.config.width);
    this.container.style.setProperty('--carousel-height', heightValue); // 修复：使用处理后的高度值
    this.container.style.setProperty('--carousel-border-radius', this.config.borderRadius);
    this.container.style.setProperty('--carousel-box-shadow', this.config.boxShadow);

    // 生成图片HTML（ES5循环代替map）
    var imgHtml = '';
    for (var i = 0; i < this.imgList.length; i++) {
        var item = this.imgList[i];
        var altText = item.alt || '轮播图片';
        imgHtml += '<img src="' + item.src + '" alt="' + altText + '" loading="lazy">';
    }

    // 生成指示器HTML（先占位，后续更新状态）
    var indicatorHtml = '';
    for (var j = 0; j < this.imgList.length; j++) {
        var activeClass = j === 0 ? 'active' : '';
        indicatorHtml += '<div class="carousel-plugin-indicator ' + activeClass + '" data-index="' + j + '"></div>';
    }

    // 生成唯一ID（ES5兼容）
    var carouselImgsId = 'carousel-imgs-' + (this.container.id || new Date().getTime());
    // 插入完整HTML（字符串拼接）
    this.container.innerHTML = [
        '<div class="carousel-plugin">',
        '    <div class="carousel-plugin-imgs" id="' + carouselImgsId + '">',
        '        ' + imgHtml,
        '    </div>',
        '    <button class="carousel-plugin-btn carousel-plugin-btn-prev">&lt;</button>',
        '    <button class="carousel-plugin-btn carousel-plugin-btn-next">&gt;</button>',
        '    <div class="carousel-plugin-indicators">',
        '        ' + indicatorHtml,
        '    </div>',
        '</div>'
    ].join('');

    // 缓存DOM元素
    this.carouselImgs = this.container.querySelector('.carousel-plugin-imgs');
    this.prevBtn = this.container.querySelector('.carousel-plugin-btn-prev');
    this.nextBtn = this.container.querySelector('.carousel-plugin-btn-next');
    this.indicators = this.container.querySelectorAll('.carousel-plugin-indicator');
    this.carousel = this.container.querySelector('.carousel-plugin');
};

// 绑定事件（按钮点击、指示器点击、鼠标悬停）
Carousel.prototype.bindEvents = function() {
    var that = this; // 保存this指向，ES5兼容箭头函数的作用

    // 上一张按钮
    this.prevBtn.addEventListener('click', function() {
        that.goToPrev();
        that.resetAutoPlay(); // 手动操作后重置自动播放
    });

    // 下一张按钮
    this.nextBtn.addEventListener('click', function() {
        that.goToNext();
        that.resetAutoPlay();
    });

    // 指示器点击
    for (var i = 0; i < this.indicators.length; i++) {
        var indicator = this.indicators[i];
        indicator.addEventListener('click', function() {
            var index = parseInt(this.getAttribute('data-index'));
            that.goToIndex(index);
            that.resetAutoPlay();
        });
    }

    // 鼠标悬停暂停，离开恢复
    this.carousel.addEventListener('mouseenter', function() {
        that.stopAutoPlay();
    });

    this.carousel.addEventListener('mouseleave', function() {
        that.startAutoPlay();
    });
};

// 切换到上一张
Carousel.prototype.goToPrev = function() {
    this.currentIndex = (this.currentIndex - 1 + this.imgList.length) % this.imgList.length;
    this.updateCarousel();
};

// 切换到下一张
Carousel.prototype.goToNext = function() {
    this.currentIndex = (this.currentIndex + 1) % this.imgList.length;
    this.updateCarousel();
};

// 切换到指定索引的图片
Carousel.prototype.goToIndex = function(index) {
    if (index >= 0 && index < this.imgList.length) {
        this.currentIndex = index;
        this.updateCarousel();
    }
};

// 更新轮播图位置和指示器状态
Carousel.prototype.updateCarousel = function() {
    // 计算偏移量（百分比，适配不同宽度）
    var translateValue = -this.currentIndex * 100 + '%';
    this.carouselImgs.style.transform = 'translateX(' + translateValue + ')';

    // 更新指示器激活状态
    for (var i = 0; i < this.indicators.length; i++) {
        var indicator = this.indicators[i];
        if (i === this.currentIndex) {
            indicator.classList.add('active');
        } else {
            indicator.classList.remove('active');
        }
    }
};

// 启动自动播放
Carousel.prototype.startAutoPlay = function() {
    var that = this;
    this.autoPlayTimer = setInterval(function() {
        that.goToNext();
    }, this.config.autoPlayTime);
};

// 停止自动播放
Carousel.prototype.stopAutoPlay = function() {
    clearInterval(this.autoPlayTimer);
};

// 重置自动播放（清除旧定时器，启动新的）
Carousel.prototype.resetAutoPlay = function() {
    this.stopAutoPlay();
    this.startAutoPlay();
};

// 暴露到全局，方便在页面中使用
window.Carousel = Carousel;
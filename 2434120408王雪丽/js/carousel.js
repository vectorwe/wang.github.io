/**
 * 河南数字文旅轮播图组件（ES5兼容，适配Dreamweaver CS6）
 * 功能：自动播放、手动切换、指示器、图片容错、JS降级
 */
(function(window, document) {
    // 防止多次定义
    if (window.Carousel) return;

    function Carousel(containerSelector, imgList, options) {
        // 处理可选参数，ES5兼容写法
        options = options || {};

        // 校验参数（增强错误提示，适配Dreamweaver调试）
        if (!containerSelector) {
            console.error('[轮播图错误] 请传入有效的容器选择器！');
            alert('[轮播图错误] 请传入有效的容器选择器！');
            return;
        }
        if (!imgList || imgList.length === 0) {
            console.error('[轮播图错误] 图片列表不能为空！');
            alert('[轮播图错误] 图片列表不能为空！');
            return;
        }

        // 容器元素（兼容ID/类选择器）
        this.container = document.querySelector(containerSelector);
        if (!this.container) {
            console.error('[轮播图错误] 未找到选择器为"' + containerSelector + '"的容器');
            alert('[轮播图错误] 未找到选择器为"' + containerSelector + '"的容器');
            return;
        }

        // 配置项（默认值 + 用户自定义）
        this.config = {
            width: options.width || '80%', // 轮播图宽度
            height: options.height || 400, // 轮播图高度（支持数字、百分比、vw等）
            autoPlayTime: options.autoPlayTime || 3000, // 自动播放间隔
            borderRadius: options.borderRadius || '8px', // 圆角
            boxShadow: options.boxShadow || '0 2px 8px rgba(0,0,0,0.1)', // 阴影
            errorImg: options.errorImg || 'images/error-placeholder.jpg' // 自定义错误占位图
        };

        // 核心属性
        this.imgList = imgList;
        this.currentIndex = 0;
        this.autoPlayTimer = null;

        // 初始化
        this.init();
    }

    // 初始化入口
    Carousel.prototype.init = function() {
        try {
            this.injectStyle(); // 注入样式
            this.renderHtml();  // 生成HTML
            this.bindEvents();  // 绑定事件
            this.startAutoPlay(); // 启动自动播放
        } catch (e) {
            console.error('[轮播图初始化异常]', e);
            alert('[轮播图初始化异常]' + e.message);
        }
    };

    // 注入CSS样式（避免重复注入，适配Dreamweaver）
    Carousel.prototype.injectStyle = function() {
        if (document.getElementById('carousel-plugin-style')) return;

        var style = document.createElement('style');
        style.id = 'carousel-plugin-style';
        style.type = 'text/css'; // 适配Dreamweaver CS6

        // ES5字符串拼接，避免模板字符串兼容问题
        var cssText = [
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
            '    display: -webkit-box; /* 兼容旧版webkit */',
            '    display: flex;',
            '    transition: transform 0.5s ease;',
            '}',
            '.carousel-plugin-imgs img {',
            '    width: 100%;',
            '    height: var(--carousel-height);',
            '    object-fit: cover;',
            '    -webkit-flex-shrink: 0; /* 兼容iOS */',
            '    flex-shrink: 0;',
            '}',
            '/* 按钮样式 */',
            '.carousel-plugin-btn {',
            '    position: absolute;',
            '    top: 50%;',
            '    -webkit-transform: translateY(-50%); /* 兼容旧版webkit */',
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
            '    /* 解决Dreamweaver预览按钮点击穿透 */',
            '    -webkit-user-select: none;',
            '    -moz-user-select: none;',
            '    user-select: none;',
            '}',
            '.carousel-plugin-btn:hover {',
            '    background: rgba(0,0,0,0.5);',
            '}',
            '.carousel-plugin-btn-prev { left: 10px; }',
            '.carousel-plugin-btn-next { right: 10px; }',
            '/* 指示器样式 */',
            '.carousel-plugin-indicators {',
            '    position: absolute;',
            '    bottom: 20px;',
            '    left: 50%;',
            '    -webkit-transform: translateX(-50%);',
            '    transform: translateX(-50%);',
            '    display: -webkit-box;',
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
            '/* 响应式适配 */',
            '@media (max-width: 768px) {',
            '    .carousel-plugin-imgs img {',
            '        height: 250px !important; /* 强制生效，适配移动端 */',
            '    }',
            '}',
            '/* JS失效降级样式（兼容旧浏览器） */',
            '.carousel-plugin-nojs {',
            '    display: -webkit-box;',
            '    display: flex;',
            '    overflow-x: auto;',
            '    -webkit-overflow-scrolling: touch; /* iOS顺滑滚动 */',
            '    scroll-snap-type: x mandatory;',
            '}',
            '.carousel-plugin-nojs img {',
            '    scroll-snap-align: center;',
            '    min-width: 100%;',
            '}'
        ].join('\n');

        // 适配IE9-10的style.textContent兼容
        if (style.styleSheet) {
            style.styleSheet.cssText = cssText;
        } else {
            style.textContent = cssText;
        }

        document.head.appendChild(style);
    };

    // 生成HTML结构（增强容错，适配Dreamweaver）
    Carousel.prototype.renderHtml = function() {
        // 处理高度值（数字补px，字符串直接用）
        var heightValue = typeof this.config.height === 'number' 
            ? this.config.height + 'px' 
            : this.config.height;

        // 设置CSS变量（兼容无前缀浏览器）
        this.container.style.setProperty('--carousel-width', this.config.width);
        this.container.style.setProperty('--carousel-height', heightValue);
        this.container.style.setProperty('--carousel-border-radius', this.config.borderRadius);
        this.container.style.setProperty('--carousel-box-shadow', this.config.boxShadow);

        // 生成图片HTML（增强容错，支持自定义错误图）
        var imgHtml = '';
        for (var i = 0; i < this.imgList.length; i++) {
            var item = this.imgList[i];
            // 容错：图片项为空时跳过
            if (!item || !item.src) {
                console.warn('[轮播图警告] 第' + (i+1) + '张图片src为空，已跳过');
                continue;
            }
            var altText = item.alt || '河南文旅轮播图片-' + (i+1);
            // 图片加载容错 + 渐入过渡（适配旧浏览器opacity）
            imgHtml += '<img src="' + item.src + '" alt="' + altText + '" loading="lazy" ' +
                       'onerror="this.src=\'' + this.config.errorImg + '\';this.alt=\'图片加载失败\'" ' +
                       'onload="this.style.opacity=1" ' +
                       'style="opacity:0;filter:alpha(opacity=0);transition:opacity 0.3s;">'; // 兼容IE8 opacity
        }

        // 容错：无有效图片时提示
        if (imgHtml === '') {
            this.container.innerHTML = '<div style="text-align:center;padding:50px;color:#999;">暂无有效轮播图片</div>';
            return;
        }

        // 生成指示器HTML
        var indicatorHtml = '';
        for (var j = 0; j < this.imgList.length; j++) {
            // 跳过无效图片的指示器
            if (!this.imgList[j] || !this.imgList[j].src) continue;
            var activeClass = (j === 0 && this.currentIndex === 0) ? 'active' : '';
            indicatorHtml += '<div class="carousel-plugin-indicator ' + activeClass + '" data-index="' + j + '"></div>';
        }

        // 生成唯一ID（避免重复，适配Dreamweaver多实例）
        var carouselImgsId = 'carousel-imgs-' + (this.container.id || 'id_' + new Date().getTime());

        // 拼接HTML（兼容Dreamweaver的HTML解析）
        var htmlStr = [
            '<div class="carousel-plugin">',
            '    <div class="carousel-plugin-imgs" id="' + carouselImgsId + '">',
            '        ' + imgHtml,
            '    </div>',
            '    <button class="carousel-plugin-btn carousel-plugin-btn-prev">&lt;</button>',
            '    <button class="carousel-plugin-btn carousel-plugin-btn-next">&gt;</button>',
            '    <div class="carousel-plugin-indicators">' + indicatorHtml + '</div>',
            '    <!-- JS失效降级：noscript适配Dreamweaver预览 -->',
            '    <noscript>',
            '        <div class="carousel-plugin-nojs" style="height:' + heightValue + ';">' + imgHtml + '</div>',
            '    </noscript>',
            '</div>'
        ].join('');

        this.container.innerHTML = htmlStr;

        // 缓存DOM元素（容错：元素不存在时不报错）
        this.carouselImgs = this.container.querySelector('#' + carouselImgsId) || null;
        this.prevBtn = this.container.querySelector('.carousel-plugin-btn-prev') || null;
        this.nextBtn = this.container.querySelector('.carousel-plugin-btn-next') || null;
        this.indicators = this.container.querySelectorAll('.carousel-plugin-indicator') || [];
        this.carousel = this.container.querySelector('.carousel-plugin') || null;
    };

    // 绑定事件（增强容错，适配Dreamweaver）
    Carousel.prototype.bindEvents = function() {
        var that = this;

        // 容错：DOM元素不存在时跳过绑定
        if (!this.prevBtn || !this.nextBtn || !this.carouselImgs) return;

        // 上一张按钮
        this.prevBtn.onclick = function() {
            that.goToPrev();
            that.resetAutoPlay();
        };

        // 下一张按钮
        this.nextBtn.onclick = function() {
            that.goToNext();
            that.resetAutoPlay();
        };

        // 指示器点击（容错：空数组不循环）
        for (var i = 0; i < this.indicators.length; i++) {
            (function(index) {
                var indicator = that.indicators[index];
                indicator.onclick = function() {
                    var idx = parseInt(this.getAttribute('data-index'));
                    if (!isNaN(idx)) {
                        that.goToIndex(idx);
                        that.resetAutoPlay();
                    }
                };
            })(i); // 闭包保存索引，适配ES5
        }

        // 鼠标悬停暂停（容错：无carousel元素时跳过）
        if (this.carousel) {
            this.carousel.onmouseenter = function() {
                that.stopAutoPlay();
            };
            this.carousel.onmouseleave = function() {
                that.startAutoPlay();
            };
        }
    };

    // 切换到上一张（容错：索引越界处理）
    Carousel.prototype.goToPrev = function() {
        if (this.imgList.length <= 1) return; // 单张图片不切换
        this.currentIndex = (this.currentIndex - 1 + this.imgList.length) % this.imgList.length;
        this.updateCarousel();
    };

    // 切换到下一张
    Carousel.prototype.goToNext = function() {
        if (this.imgList.length <= 1) return;
        this.currentIndex = (this.currentIndex + 1) % this.imgList.length;
        this.updateCarousel();
    };

    // 切换到指定索引（增强容错）
    Carousel.prototype.goToIndex = function(index) {
        if (index < 0 || index >= this.imgList.length || !this.carouselImgs) return;
        this.currentIndex = index;
        this.updateCarousel();
    };

    // 更新轮播图位置和指示器（适配旧浏览器transform）
    Carousel.prototype.updateCarousel = function() {
        if (!this.carouselImgs || this.indicators.length === 0) return;

        // 计算偏移量（兼容旧浏览器transform）
        var translateValue = -this.currentIndex * 100 + '%';
        this.carouselImgs.style.transform = 'translateX(' + translateValue + ')';
        this.carouselImgs.style.webkitTransform = 'translateX(' + translateValue + ')'; // 兼容iOS

        // 更新指示器状态
        for (var i = 0; i < this.indicators.length; i++) {
            var indicator = this.indicators[i];
            var idx = parseInt(indicator.getAttribute('data-index'));
            if (idx === this.currentIndex) {
                indicator.classList.add('active');
            } else {
                indicator.classList.remove('active');
            }
        }
    };

    // 启动自动播放（增强容错）
    Carousel.prototype.startAutoPlay = function() {
        var that = this;
        // 单张图片不自动播放
        if (this.imgList.length <= 1) return;
        // 清除旧定时器，避免叠加
        this.stopAutoPlay();
        this.autoPlayTimer = setInterval(function() {
            that.goToNext();
        }, this.config.autoPlayTime);
    };

    // 停止自动播放（容错：定时器不存在时不报错）
    Carousel.prototype.stopAutoPlay = function() {
        if (this.autoPlayTimer) {
            clearInterval(this.autoPlayTimer);
            this.autoPlayTimer = null;
        }
    };

    // 重置自动播放
    Carousel.prototype.resetAutoPlay = function() {
        this.stopAutoPlay();
        this.startAutoPlay();
    };

    // 暴露到全局（适配Dreamweaver全局作用域）
    window.Carousel = Carousel;

})(window, document); // 闭包隔离作用域，避免变量污染
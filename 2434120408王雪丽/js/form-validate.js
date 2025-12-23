// 表单动态验证：非空、手机号、密码强度、邮箱格式
window.onload = function() {
    // 获取表单元素
    const username = document.getElementById('username');
    const tel = document.getElementById('tel');
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    const city = document.getElementById('city');
    const form = document.querySelector('.register-form');

    // 错误提示函数
    function showError(el, msg) {
        // 移除原有提示
        let error = el.nextElementSibling;
        if (error && error.classList.contains('error-tip')) {
            error.remove();
        }
        // 创建新提示
        error = document.createElement('span');
        error.className = 'error-tip';
        error.style.color = 'red';
        error.style.fontSize = '12px';
        error.innerText = msg;
        el.parentNode.appendChild(error);
    }

    // 清除错误提示
    function clearError(el) {
        let error = el.nextElementSibling;
        if (error && error.classList.contains('error-tip')) {
            error.remove();
        }
    }

    // 用户名验证（3-8位，字母/数字/下划线）
    username.addEventListener('blur', function() {
        const val = this.value.trim();
        const reg = /^[a-zA-Z0-9_]{3,8}$/;
        if (!val) {
            showError(this, '用户名不能为空！');
        } else if (!reg.test(val)) {
            showError(this, '用户名需为3-8位字母、数字或下划线！');
        } else {
            clearError(this);
        }
    });

    // 手机号验证（11位有效手机号）
    tel.addEventListener('blur', function() {
        const val = this.value.trim();
        const reg = /^1[3-9]\d{9}$/;
        if (!val) {
            showError(this, '手机号不能为空！');
        } else if (!reg.test(val)) {
            showError(this, '请输入有效的11位手机号！');
        } else {
            clearError(this);
        }
    });

    // 邮箱验证
    email.addEventListener('blur', function() {
        const val = this.value.trim();
        const reg = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        if (!val) {
            showError(this, '邮箱不能为空！');
        } else if (!reg.test(val)) {
            showError(this, '请输入有效的邮箱地址！');
        } else {
            clearError(this);
        }
    });

    // 密码强度验证
    password.addEventListener('input', function() {
        const val = this.value;
        let level = '';
        let msg = '';
        if (val.length < 8) {
            msg = '密码长度需至少8位！';
        } else if (/^[a-zA-Z]+$/.test(val) || /^\d+$/.test(val)) {
            level = '弱';
            msg = `密码强度：${level}（建议包含字母+数字+特殊字符）`;
        } else if (/^(?=.*[a-zA-Z])(?=.*\d).+$/.test(val)) {
            level = '中';
            msg = `密码强度：${level}（可添加特殊字符提升强度）`;
        } else {
            level = '强';
            msg = `密码强度：${level}`;
        }
        // 显示提示
        let tip = this.nextElementSibling;
        if (tip && (tip.classList.contains('error-tip') || tip.classList.contains('pwd-tip'))) {
            tip.remove();
        }
        tip = document.createElement('span');
        tip.className = 'pwd-tip';
        tip.style.fontSize = '12px';
        tip.style.marginLeft = '10px';
        // 不同强度不同颜色
        if (level === '弱') tip.style.color = 'orange';
        else if (level === '中') tip.style.color = 'blue';
        else tip.style.color = 'green';
        tip.innerText = msg;
        this.parentNode.appendChild(tip);
    });

    // 城市选择验证
    city.addEventListener('blur', function() {
        if (!this.value) {
            showError(this, '请选择所在城市！');
        } else {
            clearError(this);
        }
    });

    // 表单提交验证
    form.addEventListener('submit', function(e) {
        e.preventDefault(); // 阻止默认提交
        // 触发所有验证
        username.blur();
        tel.blur();
        email.blur();
        password.blur();
        city.blur();
        // 检查是否有错误提示
        const errors = document.querySelectorAll('.error-tip');
        if (errors.length === 0) {
            alert('注册成功！');
            form.reset(); // 重置表单
        } else {

            alert('请修正表单中的错误后提交！');
            errors[0].previousElementSibling.focus(); // 聚焦第一个错误元素
        }
    });
};
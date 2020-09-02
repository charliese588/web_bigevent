$(function () {
    // 点击去注册账号链接
    $('#link_reg').on('click', function () {
        $('.login-box').hide();
        $('.reg-box').show();
    })

    //  点击去登录的链接
    $('#link_login').on('click', function () {
        $('.login-box').show();
        $('.reg-box').hide();
    })

    // 从layui 里面获取 form 对象
    const form = layui.form;
    //  从layui 中获取注册成功的消息
    const layer = layui.layer;
    // 通过 form.verify() 函数自定义校验规则 
    form.verify({
        // 自定义一个叫 pwd 校验规则 
        pwd: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        repwd: function (value) {
            // 通过形参拿到的是确认密码框中的内容
            // 还需要拿到密码框中的内容
            // 然后进行一次等于的判断
            // 如果判断失败，则return一个提示消息即可
            const pwd = $('.reg-box [name=password]').val();
            if (pwd !== value) {
                return '两次密码输入不一致';
            }

        }
    })


    // 监听注册表单提交事件
    $('#form_reg').on('submit', function (e) {
        e.preventDefault();
        $.ajax({
            type: 'post',
            url: '/api/reguser',
            data: {
                username: $('#form_reg [name=username]').val(),
                password: $('#form_reg [name=password]').val()
            },
            success: function (res) {
                if (res.status !== 0) {
                    // return console.log(res.message);
                    return layer.msg(res.message);
                }
                // console.log('注册成功');
                layer.msg('注册成功,请登录');
                // 模拟人点击行为
                $('#link_login').click();
            }
        })
    })

    // 监听登录表单提交事件
    $('#form_login').submit(function (e) {
        e.preventDefault();
        $.ajax({
            url: '/api/login',
            type: 'post',
            //  快速获取表单中数据
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('登录失败！');
                }
                layer.msg('登录成功');
                // 将登录成功得到的 token 字符串，保存到localStorage 中
                localStorage.setItem('token', res.token);
                location.href = '/index.html';

            }
        })
    })
})
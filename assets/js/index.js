$(function () {
    getUserInfo();

    const layer = layui.layer;
    // 点击退出按钮，实现退出功能
    $('#btnLogout').on('click', function () {
        // 提示用户是否退出
        layer.confirm('确定退出登录?', {
            icon: 3,
            title: '提示'
        }, function (index) {
            //do something
            // 1. 清空本地存储
            localStorage.removeItem('token');

            // 2. 重新跳转到登录页面
            location.href = '/login.html';


            // 关闭confirm 询问框
            layer.close(index);
        });
    })
    
})

// 获取用户基本信息
function getUserInfo() {
    $.ajax({
        url: '/my/userinfo',
        type: 'GET',
        // headers: {
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: function (res) {
            // console.log(res);
            renderAvatar(res.data);
        }
    })
}

// 渲染用户的头像
function renderAvatar(user) {
    // 1. 获取用户名称
    const name = user.nickname || user.username;
    // 2. 设置欢迎文本
    $('#welcome').html(`欢迎&nbsp;&nbsp;${name}`);
    //  3. 按需求渲染用户的头像
    if (user.user_pic !== null) {
        //  3.1 渲染用户图片
        $('.layui-nav-img').attr('src', user.user_pic).show();
        $('.text-avatar').hide();
    } else {
        // 3.2 渲染文本头像
        $('.layui-nav-img').hide();
        const first = name[0].toUpperCase();
        $('.text-avatar').html(first).show();
    }
}
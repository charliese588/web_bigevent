$(function () {
    // 1. 初始化图片裁剪器
    const $image = $('#image');

    const layer = layui.layer;
    // 2. 裁剪选项
    const options = {
        aspectRatio: 1,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options);


    // 为上传按钮绑定点击事件
    $('#btnChooseImage').on('click', function () {
        $('#file').click();
    })

    // 为文件选择框绑定 chage 事件
    $('#file').on('change', function (e) {
        const filelist = e.target.files;
        if (filelist.length == 0) {
            return layer.msg('请选择图片');
        }


        // 1. 拿到用户选择的图片
        const file = e.target.files[0];
        // 2. 将图片，转为路径
        const imgURL = URL.createObjectURL(file);
        // 3. 重新初始化裁剪区域
        $image.cropper('destroy') //销毁旧的裁剪区域
            .attr('src', imgURL) // 重新设置图片路径
            .cropper(options); // 重新初始化裁剪区域
    })


    // 为确定绑定点击事件
    $('#btnUpload').on('click', function () {
        // 要拿到用户裁剪之后的头像
        const dataURL = $image
            .cropper('getCroppedCanvas', {
                // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png');

            // 发起ajax请求
        $.ajax({
            url: '/my/update/avatar',
            type: 'post',
            data: {
                avatar: dataURL
            },
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg('更新头像失败 ');
                }

                layer.msg('更新头像成功');
                window.parent.getUserInfo();
            }
        })

    })
})
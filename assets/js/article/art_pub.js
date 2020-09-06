$(function () {

    const layer = layui.layer;

    const form = layui.form;

    initCase();

    // 初始化富文本编辑器
    initEditor();

    // 定义加载文章分类的方法
    function initCase() {
        $.ajax({
            url: '/my/article/cates',
            type: 'GET',
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg('获取文章分类失败');
                }

                const htmlStr = template('tpl-cate', res);

                $('[name=cate_id]').html(htmlStr);

                form.render();
            }
        })
    }

    // 实现基本裁剪效果
    // 1. 初始化图片裁剪器
    const $image = $('#image')

    // 2. 裁剪选项
    const options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)


    // 为选择封面按钮，注册点击事件 触发文件上传选择框
    $('#btnChooseImage').on('click', function () {

        $('#coverFile').click();

    })

    // 为 coverFile 注册 change 事件
    $('#coverFile').on('change', function (e) {

        // 获取到文件列表
        const files = e.target.files;

        // 判断用户有没有选择图片
        if (files.length === 0) {
            return
        }
        // 1. 拿到用户选择的图片
        const file = e.target.files[0];
        // 2. 将图片，转为路径
        const newimgURL = URL.createObjectURL(file);
        // 3. 重新初始化裁剪区域
        $image.cropper('destroy') //销毁旧的裁剪区域
              .attr('src', newimgURL) // 重新设置图片路径
              .cropper(options); // 重新初始化裁剪区域
    })

    // 定义文章的发布状态
  var art_state = '已发布';

    // 为存为草稿按钮，绑定点击事件处理函数
    $('#btnSave2').on('click', function() {
        art_state = '草稿'
    })


    // 为表单绑定 submit 提交事件
    $('#form-pub').on('submit',function(e){
        // 1. 阻止表单默认提交行为
        e.preventDefault();

        // 2. 基于 form 表单，快速创建一个 FormData 对象
        const fd = new FormData($(this)[0]);

        //  将文章发布状态，存放到 fd中
        fd.append('state', art_state);

        $image
        .cropper('getCroppedCanvas', {
          // 创建一个 Canvas 画布
          width: 400,
          height: 280
        })
        .toBlob(function(blob) {
          // 将 Canvas 画布上的内容，转化为文件对象
          // 得到文件对象后，进行后续的操作
          // 5. 将文件对象，存储到 fd 中
          fd.append('cover_img', blob)
          // 6. 发起 ajax 数据请求
          publishArticle(fd);
        })
    })


    function publishArticle(fd) {
        $.ajax({
          method: 'POST',
          url: '/my/article/add',
          data: fd,
          // 注意：如果向服务器提交的是 FormData 格式的数据，
          // 必须添加以下两个配置项
          contentType: false,
          processData: false,
          success: function(res) {
            if (res.status !== 0) {
              return layer.msg('发布文章失败！')
            }
            layer.msg('发布文章成功！')
            // 发布文章成功后，跳转到文章列表页面
            location.href = '/article/art_list.html';

          }
        })
    }
  


})
$(function () {

    const layer = layui.layer;
    const form = layui.form;
    initList();
    // 获取文章列表
    function initList() {
        $.ajax({
            url: '/my/article/cates',
            type: 'GET',
            success: function (res) {
                // console.log(res);
                const strhtml = template('tpl-table', res);
                $('tbody').html(strhtml);
            }
        })
    }

    // 为添加按钮添加点击事件
    $('#btnAddCate').on('click', function () {
        //  点击添加跳出添加文章弹出层
        layer.open({
            type: '1',
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dialog-add').html()
        });

        //   通过代理事件 绑定form表单的ID form-add 的 submit 的点击事件
        $('body').on('submit', '#form-add', function (e) {
            e.preventDefault();
            $.ajax({
                url: '/my/article/addcates',
                type: 'POST',
                data: $(this).serialize(),
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('添加文章失败');
                    }
                    layer.msg('添加文章成功');
                    initList();
                    // 关闭弹出层
                    layer.closeAll();
                }
            })
        })

    })



    //  通过代理事件 为 btn-edit 绑定点击事件
    $('tbody').on('click', '.btn-edit', function () {
        // 弹出一个修改文章分类的弹出层
        layer.open({
            type: '1',
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#dialog-edit').html()
        })

        const id = $(this).attr('data-id');
        //   发起请求获取对应分类的数据
        $.ajax({
            type: 'GET',
            url: `/my/article/cates/ ${id}`,
            success: function(res) {
              form.val('form-edit', res.data)
            }
          })

    })

        //更新文章分类的数据 
    $('body').on('submit', '#form-edit', function(e) {
        e.preventDefault()
        $.ajax({
              type: 'POST',
              url: '/my/article/updatecate',
              data: $(this).serialize(),
              success: function(res) {
                if (res.status !== 0) {
                  return layer.msg('更新分类数据失败！')
                }
                layer.msg('更新分类数据成功！');
                // 关闭弹出层
                layer.closeAll();   
                initList(); 
              }
        })
    })


    // 删除文章分类
    $('tbody').on('click', '.btn-delete', function() {
       const id = $(this).attr('data-id')
        // 提示用户是否要删除
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
          $.ajax({
            type: 'GET',
            url: `/my/article/deletecate/${id}`,
            success: function(res) {
              if (res.status !== 0) {
                return layer.msg('删除分类失败！')
              }
              layer.msg('删除分类成功！');
              // 关闭弹出层
              layer.closeAll();
              initList(); 
            }
          })
        })
    })




})
// 这是登录页面的js
// 总体跳转函数
function jump(ToPage) {
        $(".Thepage").css("display","none")
        let className = "." + ToPage;
        $(className).css("display","block")
        localStorage.setItem("prePage",localStorage.getItem("nowPage"))
        localStorage.setItem("nowPage",ToPage)
}

function jumpL(ToPage) {
    $(".Thepage").css("display","none")
    let className = "." + ToPage;
    $(className).css("display","block")
}


// 为登录按钮绑定事件发送请求
$("#loginform").on("submit",function(e) {
    //阻止默认提交行为
    e.preventDefault()

    // 准备传入数据
    var fd = new FormData()
    fd.append('username',$("#loginName").elements[0].value)
    fd.append('password',$("#loginPassword").elements[0].value)

    $().ajax({
        type: "POST",
        url: "http://175.178.193.182:8080/login",
        data: fd
    }).then((res) => {
        localStorage.setItem('userId',res.userId)
        if(res.status === 200) {
            alert(res.msg)
            jump("main")
            $(".main-bottom").css("display","block")
            // 登录成功后渲染聊天列表
            RenderChatList(localStorage.getItem("userId"))
        } else if(res.status === 406) {
            alert(res.msg);
            jump("main")
            $(".main-bottom").css("display","block")
            // 登录成功后渲染聊天列表
            RenderChatList(localStorage.getItem("userId"))
            // 在跳转之后渲染首页
            var recflag = 0; //声明变量，让其只渲染一次
            if($(".main").css("display") === 'block' && recflag === 0) {
                renderrecommend();
                recflag++;
            }
        } else if(res.status === 400) {
            alert(res.msg + ",请重新输入");
            $("#loginName").elements[0].value = '';
            $("#loginPassword").elements[0].value = '';
        }   
        // 登录成功打开框框，并选中首页
        
        $(".main-bottom-tab").get(0).addClass("main-tab-current")
        $(".main-bottom-tab").get(0).children(".main-tab-word").addClass("main-tab-current")
        $(".main-bottom-tab").get(0).siblings(".main-bottom-tab").removeClass("main-tab-current")
        $(".main-bottom-tab").get(0).siblings(".main-bottom-tab").children(".main-tab-word").removeClass("main-tab-current")
        
    }).catch((res) => {
        console.log(res);
    })


})


















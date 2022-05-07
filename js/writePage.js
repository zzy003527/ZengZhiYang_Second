// 这是写文章页面的js

// 点击返回按钮回到主页面
$(".writePage-back").on("click",() => {
    jumpL("main");
    $(".main-bottom").css("display","block")
})



// 点击#话题按钮弹出输入框
$(".addTag").on("click",() => {
    $(".addTagBox").css("display","block");
    $(".addTag-background").css("display","block");
})
$(".addTagBox-cancle").on("click",() => {
    $(".addTagBox").css("display","none");
    $(".addTag-background").css("display","none");
})
$(".addTagBox-determine").on("click",() => {
    $("#tagword").html($("#addTagBox-ipt").elements[0].value);
    $("#tagword").css("display","block");
    $(".addTagBox").css("display","none");
    $(".addTag-background").css("display","none");
    if($("#addTagBox-ipt").elements[0].value === '') {
        $("#tagword").css("display","none");
    }
})


function objToArr(obj) {
    let arr = []
    for(let i in obj) {
        let arr1 = [i,obj[i]]
        arr.push[arr1]
    }
    return arr;
}



// 上传图片预览
// 声明一个index渲染不同的图片
let index = 0;
let imgInfomation = []
$("#writePage-Picfile").on("change",(e) => {
    let file = e.target.files[0]; //获取图片资源
    let fd1 = new FormData()
    let arr = []
    arr = file;
    fd1.append("image",arr)
    getimage(fd1);
    // 只选择图片文件
    if (file.type.match('image.*')) {
        let reader = new FileReader();
        reader.readAsDataURL(file); // 读取文件
        // 渲染文件
        reader.onload = function() {
        let img = '<img src="' + this.result + '" alt=""/><a index="'+ index +'" class="deletePic-btn iconfont">&#xe668;</a>';
        $(".writePage-addPic").prepend($("<div></div>"));
        $(".writePage-addPic").children("div").get(0).addClass("writePage-Pic").html(img)
        index++;

      }
    }
})



// 注意：append或prepend进入的元素绑定事件要用事件委托
// 为图片右上角删除按钮添加事件
$(".writePage-addPic").on("click",function(e) {
    let target = e.target;
    if(target.nodeName.toLowerCase() === 'a') {
        let theIndex = 0;
        for(let i = 0;i < $(".deletePic-btn").elements.length;i++) {
            if(e.target === $(".deletePic-btn").elements[i]) {
                theIndex = i;
            }
        }
        $(".deletePic-btn").get(theIndex).parent().remove();
        let imglength = imgInfomation.length;
        imgInfomation.splice(imglength - 1 - theIndex,1)
    }
})



// 点击发布笔记提交按钮发送请求
$("#write-form").on("submit",(e) => {
    //阻止默认提交行为
    e.preventDefault()

    // // 准备传入数据
    let title = $("#writePage-title").elements[0].value;
    let content = $("#writePage-content").elements[0].value;
    let userId = localStorage.getItem("userId");
    let tags = $("#tagword").html().split('#').slice(1);
    let fd = new FormData()
    fd.append('userId',userId);
    fd.append('title',title);
    fd.append('content',content);
    fd.append('tags',tags);
    for(let i = 0;i < imgInfomation.length;i++) {
        fd.append("images",imgInfomation[i])
    }
    
    if(title === '') {
        alert("请输入标题!");
    } else if(content === '') {
        alert("请输入内容!");
    } else {
        $().ajax({
            type: "POST",
            url: "http://175.178.193.182:8080/article",
            data: fd
        }).then((res) => {
            // 发送成功后清空上一次填入的内容
            $(".deletePic-btn").parent().remove();
            $("#writePage-title").elements[0].value = '';
            $("#writePage-content").elements[0].value = '';
            $("#tagword").html(' ');
            // 发送成功后清空个人中心-我的文章部分的文章，让其可以再次渲染刷新
            // 当退出登录时，清空上一条账号的我的文章
            $(".main-myArticle-column").empty()
            $(".main-myArticle-column-left").remove()
            alert(res.msg);
        }).catch((res) => {
            console.log(res);
        })
    }
})


// 获取图片路径的函数
function getimage(fd1) {
    $().ajax({
        type: "POST",
        url: "http://175.178.193.182:8080/upload/image",
        data: fd1
    }).then((res) => {
        imgInfomation.push(res.url)
    }).catch((res) => {
        console.log(res);
    })
}













// 这是编辑资料的js

// 点击返回按钮返回个人中心模块
$(".data-edit-back").on("click",function() {
    jump("person-center");
    $(".personal-username").html($(".edit-data-nickname-word").html())
    $(".personal-avator").find("img").attr("src", $(".edit-data-avator").find("img").attr("src"))
    $(".main-bottom").css("display","block")
})


// 获取用户基本信息
function renderUserBaseInfo() {
    $().ajax({
        type: "GET",
        url: "http://175.178.193.182:8080/user/baseInfo",
        data: {
            userId: localStorage.getItem("userId")
        }
    }).then((res) => {
        $(".edit-data-nickname-word").html(res.user.nickname)
        $(".edit-data-gender-word").html(res.user.gender)
        $(".edit-data-birthday-word").html(res.user.birthday)
        $(".edit-data-area-word").html(res.user.area)
        $(".edit-data-description-word").html(res.user.description)
        $(".edit-data-avator").find("img").attr("src",res.user.avatar)
        $(".edit-data-bgpright").find("img").attr("src",res.user.backGroundPicture)
        $(".modify-avator-preview").find("img").attr("src",res.user.avatar);
        $(".modify-bg-pre-father").find("img").attr("src",res.user.backGroundPicture)
    }).catch((res) => {
        console.log(res);
    })
}

// renderUserBaseInfo();





// 按取消按钮绑定事件
$(".modify-infomation-cancle").on("click",function() {
    $(".modify-infomation-Box").css("display","none");
    $(".modify-infomation-background").css("display","none");
    $(".modify-Pic-Box").css("display","none");
    $(".modify-bg-Box").css("display","none");
})
// 封装发送编辑资料请求
function editdata() {
    // 准备数据
    let nickname = $(".edit-data-nickname-word").html()
    let gender = $(".edit-data-gender-word").html()
    let birthday = $(".edit-data-birthday-word").html()
    let area = $(".edit-data-area-word").html().split(" ").join("")
    let description = $(".edit-data-description-word").html()
    let userId = localStorage.getItem("userId")
    let fd = new FormData()
    fd.append("userId",userId);
    fd.append("nickname",nickname);
    fd.append("gender",gender);
    fd.append("birthday",birthday);
    fd.append("area",area);
    fd.append("description",description);
    
    $().ajax({
        type: 'POST',
        url: "http://175.178.193.182:8080/user/edit",
        data: fd
    }).then((res) => {
        alert(res.msg)
    }).catch((res) => {
        console.log(res);
    })

}

// 按确定按钮发送请求
$(".modify-nickname-detbtn").on("click",function() {
    $(".modify-nickname").css("display","none");
    $(".modify-infomation-background").css("display","none");
    let preword = $(".edit-data-nickname-word").html()
    $(".edit-data-nickname-word").html($(".modify-nickname-ipt").elements[0].value);
    // 昵称有修改才发送请求
    if(preword !== $(".edit-data-nickname-word").html()) {
        editdata();
    }
})

$(".modify-gender-detbtn").on("click",function() {
    $(".modify-gender").css("display","none");
    $(".modify-infomation-background").css("display","none");
    let preword = $(".edit-data-gender-word").html()
    $(".edit-data-gender-word").html($(".modify-gender-ipt").elements[0].value);
    // 性别有修改才发送请求
    if(preword !== $(".edit-data-gender-word").html()) {
        editdata();
    }
})

$(".modify-birthday-detbtn").on("click",function() {
    $(".modify-birthday").css("display","none");
    $(".modify-infomation-background").css("display","none");
    let preword = $(".edit-data-birthday-word").html()
    $(".edit-data-birthday-word").html($(".modify-birthday-ipt").elements[0].value);
    // 生日有修改才发送请求
    if(preword !== $(".edit-data-birthday-word").html()) {
        editdata();
    }
})

$(".modify-area-detbtn").on("click",function() {
    $(".modify-area").css("display","none");
    $(".modify-infomation-background").css("display","none");
    let preword = $(".edit-data-area-word").html()
    $(".edit-data-area-word").html($(".modify-area-ipt").elements[0].value);
    // 地区有修改才发送请求
    if(preword !== $(".edit-data-area-word").html()) {
        editdata();
    }
    $(".modify-area-ipt").html(" ")
})

$(".modify-description-detbtn").on("click",function() {
    $(".modify-description").css("display","none");
    $(".modify-infomation-background").css("display","none");
    let preword = $(".edit-data-description-word").html()
    $(".edit-data-description-word").html($(".modify-description-ipt").elements[0].value);
    // 简介有修改才发送请求
    if(preword !== $(".edit-data-description-word").html()) {
        editdata();
    }
})





// 点击名字的>按钮弹出框
$(".edit-data-nickname-btn").on("click",function() {
    $(".modify-nickname").css("display","block");
    $(".modify-infomation-background").css("display","block");
})
// 点击性别的>按钮弹出框
$(".edit-data-gender-btn").on("click",function() {
    $(".modify-gender").css("display","block");
    $(".modify-infomation-background").css("display","block");
})
// 点击生日的>按钮弹出框
$(".edit-data-birthday-btn").on("click",function() {
    $(".modify-birthday").css("display","block");
    $(".modify-infomation-background").css("display","block");
})
// 点击地区的>按钮弹出框
$(".edit-data-area-btn").on("click",function() {
    $(".modify-area").css("display","block");
    $(".modify-infomation-background").css("display","block");
})
// 点击简介的>按钮弹出框
$(".edit-data-description-btn").on("click",function() {
    $(".modify-description").css("display","block");
    $(".modify-infomation-background").css("display","block");
})


// ------------------------------------------------------
// 头像处理

// 点击头像弹出头像修改框
$(".edit-data-avator").on("click",function() {
    $(".modify-Pic-Box").css("display","block");
    $(".modify-infomation-background").css("display","block");
})

// 渲染头像
let avatorInfo = []
$(".modify-avator-ipt").on("change",function(e) {
    let file = e.target.files[0];
    if(avatorInfo.length) {
        avatorInfo = []
    }
    avatorInfo = file;
    // 只选择图片文件
    if (file.type.match('image.*')) {
        let reader = new FileReader();
        reader.readAsDataURL(file); // 读取文件
        // 渲染文件
        reader.onload = function(arg) {
        $(".modify-avator-preview").find("img").attr("src",this.result)
    }
    }
})

// 点击背景图的>
$(".edit-data-backgroundPic-btn").on("click",function() {
    $(".modify-bg-Box").css("display","block");
    $(".modify-infomation-background").css("display","block");
})
// 渲染背景图
let bgPicInfo = []
$(".modify-bg-ipt").on("change",function(e) {
    let file1 = e.target.files[0];
    // 如果再次修改，就把之前的清空
    if(bgPicInfo.length === 1) {
        bgPicInfo = []
    }
    bgPicInfo = file1
    // 只选择图片文件
    if (file1.type.match('image.*')) {
        let reader = new FileReader();
        reader.readAsDataURL(file1); // 读取文件
        // 渲染文件
        reader.onload = function(arg) {
        
        $(".modify-bg-preview").find("img").attr("src",this.result)
      }
    }
})

function editavator() {
    //准备数据
    let userId = localStorage.getItem("userId")
    let avatar = avatorInfo;
    let backGroundPicture = bgPicInfo;
    let fd = new FormData();
    fd.append('userId',userId);
    fd.append("avatar",avatar);
    fd.append("backGroundPicture",backGroundPicture);

    $().ajax({
        type: "POST",
        url: "http://175.178.193.182:8080/user/upload",
        data: fd
    }).then((res) => {
        renderUserBaseInfo();
    }).catch((res) => {
        console.log(res);
    })
}



// 点击确定按钮
$(".modify-avator-detbtn").on("click",function() {
    $(".modify-Pic-Box").css("display","none");
    $(".modify-infomation-background").css("display","none");
    editavator()
})

$(".modify-bg-detbtn").on("click",function() {
    $(".modify-bg-Box").css("display","none");
    $(".modify-infomation-background").css("display","none");
    editavator()
})



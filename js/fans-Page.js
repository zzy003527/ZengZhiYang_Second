// 这是粉丝页面的js

// 点击返回按钮回到个人中心
$(".fans-Page-back").on("click",function() {
    jump("person-center")
    $(".main-bottom").css("display","block")
    // 回来的时候重新渲染一下头像（因为如果进入了他人的主页这玩意会变了，所以要给它改回去）
    renderMybaseInfo(localStorage.getItem("userId"));
    renderPCfollow(localStorage.getItem("userId"))

    // 那就顺便重新渲染一下收藏和赞过的和我的文章吧（因为进到了别人的主页）
    rerender("fans-Page")
})








// -----------------------------------------------------------
// 渲染页面
// 创建每个关注者的盒子
function CreateFansBox(data) {
    var frag = document.createDocumentFragment();
    // 头像
    var img = $("<img/>").attr("src",data.avatar)
    var avatar = $("<div></div>").addClass("fans-avatar").attr("userId",data.userId).append(img)
    // 昵称
    var nickname = $("<div></div>").addClass("fans-nickname").html(data.nickname)
    // 关注按钮
    var followBtn = $("<div></div>").addClass("fans-followBtn").html("未关注")
    if(data.fans.length !== 0) {
        for(let i = 0;i < data.fans.length;i++) {
            if(data.fans[i] == localStorage.getItem('userId')) {
                followBtn.css("width","85px").css("backgroundColor","#a063d4").css("color","white")
                followBtn.html("互相关注")
            }
        }
    }
    frag.appendChild(avatar.elements[0])
    frag.appendChild(nickname.elements[0])
    frag.appendChild(followBtn.elements[0])

    return frag
}


// 获取每个关注者的信息
function renderEveFans(fansId) {
    $().ajax({
        type: "GET",
        url: "http://175.178.193.182:8080/user/fullInfo",
        data: {
            userId: fansId
        }
    }).then((res) => {
        let frag = CreateFansBox(res.user)
        let fansBox = $("<div></div>").addClass("fans-box").attr("fansId",fansId)
        fansBox.elements[0].appendChild(frag)
        $(".fans-Father").append(fansBox)
    }).catch((res) => {
        console.log(res);
    })
}




// 渲染关注页面
function renderFansPerson() {
    $().ajax({
        type: "GET",
        url: "http://175.178.193.182:8080/user/fullInfo",
        data: {
            userId: localStorage.getItem("userId")
        }
    }).then((res) => {
        if(res.user.fans.length !== 0) {
            for(let i = 0;i < res.user.fans.length;i++) {
                renderEveFans(res.user.fans[i])
            }
        }
    }).catch((res) => {
        console.log(res);
    })

}
    
renderFansPerson()

// --------------------------------------------------------------
// 点击未关注按钮，发送关注请求
function followMyfans(fansId) {
    // 准备数据
    let userId = localStorage.getItem("userId")
    let followerId = fansId
    let fd = new FormData() 
    fd.append("userId",userId)
    fd.append("followerId",followerId)
    $().ajax({
        type: "POST",
        url: "http://175.178.193.182:8080/user/follow",
        data: fd
    }).then((res) => {
        alert(res.msg)
        // 清空我的关注，让其下次点进去可以有最新数据
        $(".follow-person-box").remove()
        $(".follow-person-Father").remove()
        // 刷新我的主页的关注数量
        renderPCfollow()
    }).catch((res) => {
        console.log(res);
    })
}


// 取消关注
function cancleFollowMyfans(fansId) {
    // 准备数据
    let userId = localStorage.getItem("userId")
    let followerId = fansId
    let fd = new FormData() 
    fd.append("userId",userId)
    fd.append("followerId",followerId)
    $().ajax({
        type: "POST",
        url: "http://175.178.193.182:8080/user/cancelFollow",
        data: fd
    }).then((res) => {
        alert(res.msg)
        // 清空我的关注，让其下次点进去可以有最新数据
        $(".follow-person-box").remove()
        $(".follow-person-Father").remove()
        // 刷新我的主页的关注数量
        renderPCfollow()
    }).catch((res) => {
        console.log(res);
    })
}

$(".fans-Father").on("click",function(e) {
    let target = e.target;
    if(target.classList.contains("fans-followBtn")) {
        if(target.parentNode.children[2].innerHTML === '未关注') {
            followMyfans(target.parentNode.getAttribute("fansId"))
            // 发送后改变当前样式
            target.style.width = "85px"
            target.style.backgroundColor = "#a063d4"
            target.style.color = "white"
            target.innerHTML = "互相关注"
        } else {
            cancleFollowMyfans(target.parentNode.getAttribute("fansId"))
            // 发送后改变当前样式
            target.style.width = "75px"
            target.style.backgroundColor = "white"
            target.style.color = "#a063d4"
            target.innerHTML = "未关注"
        }
    }
})


// -----------------------------------------------------------------
// 点击粉丝头像进入到它的首页
$(".fans-Page").on("click",function(e) {
    let target = e.target
    // 点击到作者头像
    if(target.parentNode.classList.contains("fans-avatar")) {
        // 跳转到作者的主页
        jumpL("person-center")
        localStorage.setItem("PersonBack",localStorage.getItem("nowPage"))
        // 为粉丝加上一个自定义属性用来表示渲染哪一个人
        $(".fans-Page").attr("TheRenderId",target.parentNode.getAttribute("userId"))
        // 在第一次跳转的时候渲染下方我的文章和个人信息
        renderMybaseInfo(target.parentNode.getAttribute("userId"));
        renderPCfollow(target.parentNode.getAttribute("userId"))
        // ------------------
        // 在个人主页点完要进到别人的主页，要先把自己的删了，再渲染别人的，因为今天写到很乱，都是这不补一下那边补一下，所以我的代码这边一块，那边一块
        rerender("fans-Page")
        // -----------------------------------------
        // 将退出按钮和右上角按钮和编辑资料按钮none掉
        $(".logout-btn").css("display","none")
        $(".person-share-btn").css("display","none")
        $(".editdata-btn").css("display","none")
        // 将返回按钮和发消息按钮block
        $(".sendMessage-btn").css("display","block")
        $(".PCback-btn").css("display","block")
        // 把关注、粉丝、点赞与收藏的事件去除，不让他们绑定事件
        $(".follow-btn").off("click",InFollowperson)
        $(".fans-btn").off("click",InFans)
        $(".likeAndcollect-btn").off("click",InLikeAndCollect)
        // 底框也不要！
        $(".main-bottom").css("display","none")
        // 把进入文章详情的给它禁用了
        $(".person-container").off("click",InPersonDetails)
    }
})































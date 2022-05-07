// 发私信页面的js


// 点击返回按钮，回到我的消息页面
$(".SendprivateMsg-back").on("click",function() {
    jump("MyMessage")
    $(".SendprivateMsg-Father").empty()
    $(".main-bottom").css("display","block")
    $(".MyMessage-container").empty()
    RenderChatList(localStorage.getItem("userId"))
})



// ------------------------------------------------------------
// 创建文档碎片
function CreateSendprivateMsg(data) {
    let frag = document.createDocumentFragment()
    // 头像
    let img = $("<img/>").attr("src",data.avatar)
    let avatar = $("<div></div>").addClass("SendprivateMsg-avatar").attr("userId",data.userId).append(img)
    // 昵称
    let nickname = $("<div></div>").addClass("SendprivateMsg-nickname").html(data.nickname)
    // 进入聊天界面按钮
    let Btn = $("<div></div>").addClass("ToChatPage-btn").addClass("iconfont").html("&#xe617;").attr("userId",data.userId)

    frag.appendChild(avatar.elements[0])
    frag.appendChild(nickname.elements[0])
    frag.appendChild(Btn.elements[0])

    return frag
}





// 发送请求找到互相关照的人并渲染页面
function RenderSendprivateMsgFull(userId) {
    $().ajax({
        type: "GET",
        url: "http://175.178.193.182:8080/user/fullInfo",
        data: {
            userId: userId
        } 
    }).then((res) => {
        let frag1 = CreateSendprivateMsg(res.user)
        let box = $("<div></div>").addClass("SendprivateMsg-Box")
        box.elements[0].appendChild(frag1)
        $(".SendprivateMsg-Father").append(box)
    }).catch((res) => {
        console.log(res);
    })
}


// 发送获取用户关注的人的请求，和获取用户的粉丝，如果有同一个人，就渲染上去
function RenderSendprivateMsg(userId) {
    $().ajax({
        type: "GET",
        url: "http://175.178.193.182:8080/user/fullInfo",
        data: {
            userId: userId
        }
    }).then((res) => {
        // 先声明一个数组储存互相关注的人
        let each = []
        // 然后两次循环遍历粉丝和关注数组，找出相同的
        for(let i = 0;i < res.user.fans.length;i++) {
            for(let j = 0;j < res.user.follows.length;j++) {
                if(res.user.fans[i] === res.user.follows[j]) {
                    each.push(res.user.fans[i])
                }
            }
        }
        // 获取到数组后，分别找到对方的详细消息，渲染页面
        for(let i = 0;i < each.length;i++) {
            RenderSendprivateMsgFull(each[i])
        }
    }).catch((res) => {
        console.log(res);
    })
}

// RenderSendprivateMsg(localStorage.getItem("userId"))

// ----------------------------------------------------------
// 点击关注头像进入到它的首页
$(".SendprivateMsg").on("click",function(e) {
    let target = e.target
    // 点击到作者头像
    if(target.parentNode.classList.contains("SendprivateMsg-avatar")) {
        // 跳转到作者的主页
        jumpL("person-center")
        localStorage.setItem("PersonBack",localStorage.getItem("nowPage"))
        // 为关注的人加上一个自定义属性用来表示渲染哪一个人
        $(".SendprivateMsg").attr("TheRenderId",target.parentNode.getAttribute("userId"))
        // 在第一次跳转的时候渲染下方我的文章和个人信息
        renderMybaseInfo(target.parentNode.getAttribute("userId"));
        renderPCfollow(target.parentNode.getAttribute("userId"))
        // ------------------
        // 在个人主页点完要进到别人的主页，要先把自己的删了，再渲染别人的，因为今天写到很乱，都是这不补一下那边补一下，所以我的代码这边一块，那边一块
        rerender("SendprivateMsg")
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


// ------------------------------------------------------------
// 点击>进入聊天界面
$(".SendprivateMsg").on("click",function(e) {
    let target = e.target
    if(target.classList.contains("ToChatPage-btn")) {
        jump("ChatPage")
        // 给聊天页面加个属性表面聊天对象
        $(".ChatPage").attr("receiverId",target.parentNode.children[0].getAttribute("userId"))
        renderChatBackground(localStorage.getItem("userId"))
        renderReceiverId(target.parentNode.children[0].getAttribute("userId"))
        renderChatRecord(localStorage.getItem("userId"),target.parentNode.children[0].getAttribute("userId"))
    }
})
























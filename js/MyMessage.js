// 我的消息的js



// 点击消息和@进入消息页面
$(".MyMessage-review-btn").on("click",function() {
    jump("receiveReview")
    $(".main-bottom").css("display","none")
    console.log($(".receiveReview-Father").children("receiveReview-Box"));
    if($(".receiveReview-Father").children("receiveReview-Box").elements.length == 0) {
        renderReceiveReview(localStorage.getItem("userId"))
    } else {
        $(".receiveReview-Father").empty()
        renderReceiveReview(localStorage.getItem("userId"))
    }

})


// 点击创建聊天进入发私信页面
$(".MyMessage-createChat").on("click",function() {
    jump("SendprivateMsg")
    $(".main-bottom").css("display","none")
    // if($(".SendprivateMsg-Father").children("SendprivateMsg-Box").elements.length == 0) {
    //     RenderSendprivateMsg(localStorage.getItem("userId"))
    // } else {
    //     $(".SendprivateMsg-Father").empty()
    //     RenderSendprivateMsg(localStorage.getItem("userId"))
    // }
    RenderSendprivateMsg(localStorage.getItem("userId"))
    // 清空聊天列表
    $(".MyMessage-container").empty()

})



// ----------------------------------------------------
//  创建聊天列表文档碎片
function CreateChatList(data) {
    let frag = document.createDocumentFragment();
    // 头像
    let img = $("<img/>").attr("src",data.avatar)
    let avatar = $("<div></div>").addClass("MyChat-avatar").attr("userId",data.userId).append(img)
    // 昵称
    let nickname = $("<div></div>").addClass("MyChat-nickname").html(data.nickname)
    // 简介
    let word = $("<div></div>").addClass("MyChat-word")
    if(data.description) {
        word.html(data.description)
    } else {
        word.html("该用户还没有简介哦~")
    }
    // 进入聊天页面按钮
    let btn = $("<div></div>").addClass("MyToChatPage").addClass("iconfont").html("&#xe617;")

    frag.appendChild(avatar.elements[0])
    frag.appendChild(nickname.elements[0])
    frag.appendChild(word.elements[0])
    frag.appendChild(btn.elements[0])

    return frag
}


// 渲染下方聊天列表
function RenderChatList(userId) {
    $().ajax({
        type: "GET",
        url: "http://175.178.193.182:8080/chat/getList",
        data: {
            userId: userId
        }
    }).then((res) => {
        console.log(res);
        for(let i = 0;i < res.chatList.length;i++) {
            let frag = CreateChatList(res.chatList[i])
            let box = $("<div></div>").addClass("MyChatBox")
            box.elements[0].appendChild(frag)
            $(".MyMessage-container").append(box)
        }
    }).catch((res) => {
        console.log(res);
    })
}

// RenderChatList(localStorage.getItem("userId"))

// -----------------------------
// 点击>进入聊天页面
$(".MyMessage-container").on("click",function(e) {
    let target = e.target
    if(target.classList.contains("MyToChatPage")) {
        jump("ChatPage")
        // 给聊天页面加个属性表面聊天对象
        $(".ChatPage").attr("receiverId",target.parentNode.children[0].getAttribute("userId"))
        renderChatBackground(localStorage.getItem("userId"))
        renderReceiverId(target.parentNode.children[0].getAttribute("userId"))
        renderChatRecord(localStorage.getItem("userId"),target.parentNode.children[0].getAttribute("userId"))
    }
 })



//  -----------------------------------------------
// 点击头像进入个人主页
$(".MyMessage").on("click",function(e) {
    let target = e.target
    // 点击到作者头像
    if(target.parentNode.classList.contains("MyChat-avatar")) {
        // 跳转到作者的主页
        jumpL("person-center")
        localStorage.setItem("PersonBack",localStorage.getItem("nowPage"))
        // 为关注的人加上一个自定义属性用来表示渲染哪一个人
        $(".MyMessage").attr("TheRenderId",target.parentNode.getAttribute("userId"))
        // 在第一次跳转的时候渲染下方我的文章和个人信息
        renderMybaseInfo(target.parentNode.getAttribute("userId"));
        renderPCfollow(target.parentNode.getAttribute("userId"))
        // ------------------
        // 在个人主页点完要进到别人的主页，要先把自己的删了，再渲染别人的
        rerender("MyMessage")
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































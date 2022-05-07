// 收到的评论和@的js

// 点击返回按钮，回到我的消息页面
$(".receiveReview-back").on("click",function() {
    jump("MyMessage")
    // 清空当前的评论
    $(".receiveReview-Father").empty()
    // 底部框出来
    $(".main-bottom").css("display","block")
})




// --------------------------------------------------
// 创建每个评论的盒子
function CreateReceiveReviewBox(data) {
    let frag = document.createDocumentFragment()
    // 头像
    let img1 = $("<img/>").attr("src",data.userInfo.avatar)
    let avatar = $("<div></div>").addClass("receiveReview-avatar").attr("userId",data.userInfo.userId).append(img1)
    // 昵称
    let nickname = $("<div></div>").addClass("receiveReview-nickname").html(data.userInfo.nickname)
    // 文字
    let word = $("<div></div>").addClass("receiveReview-word")
    if(data.reviews.parentReviewId === null) {
        word.html("评论了你的笔记")
    } else {
        word.html("回复了你的评论")
    }
    // 右侧图片
    let img2 = $("<img/>").attr("src",data.articleInfo.images[0])
    let image = $("<div></div>").addClass("receiveReview-image").append(img2)
    // 进入详情按钮
    let details = $("<div></div>").addClass("receiveReview-detailBtn").addClass("iconfont").html("&#xe617;").attr("articleId",data.articleInfo.articleId)

    frag.appendChild(avatar.elements[0])
    frag.appendChild(nickname.elements[0])
    frag.appendChild(word.elements[0])
    frag.appendChild(image.elements[0])
    frag.appendChild(details.elements[0])

    return frag
}


// 发送请求获取数据渲染页面
function renderReceiveReview(userId) {
    $().ajax({
        type: "GET",
        url: "http://175.178.193.182:8080/notice/comment",
        data: {
            userId: userId
        }
    }).then((res) => {
        for(let i = 0;i < res.like.length;i++) {
            let frag = CreateReceiveReviewBox(res.like[i])
            let box = $("<div></div>").addClass("receiveReview-Box")
            box.elements[0].appendChild(frag)
            $(".receiveReview-Father").prepend(box)
        }
    }).catch((res) => {
        console.log(res);
    })
}

// renderReceiveReview(localStorage.getItem("userId"))

// -----------------------------------------------------------------
// 点击关注头像进入到它的首页
$(".receiveReview").on("click",function(e) {
    let target = e.target
    // 点击到作者头像
    if(target.parentNode.classList.contains("receiveReview-avatar")) {
        console.log(target.parentNode);
        // 跳转到作者的主页
        jumpL("person-center")
        localStorage.setItem("PersonBack",localStorage.getItem("nowPage"))
        // 为关注的人加上一个自定义属性用来表示渲染哪一个人
        $(".receiveReview").attr("TheRenderId",target.parentNode.getAttribute("userId"))
        // 在第一次跳转的时候渲染下方我的文章和个人信息
        renderMybaseInfo(target.parentNode.getAttribute("userId"));
        renderPCfollow(target.parentNode.getAttribute("userId"))
        // ------------------
        // 在个人主页点完要进到别人的主页，要先把自己的删了，再渲染别人的，因为今天写到很乱，都是这不补一下那边补一下，所以我的代码这边一块，那边一块
        rerender("receiveReview")
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

// ------------------------------------------------------------------
// 点击>进入文章详情
$(".receiveReview").on("click",function(e) {
    let target = e.target
    if(target.classList.contains("receiveReview-detailBtn")) {
        console.log(target.getAttribute("articleId"));
        // 跳转到文章详情，并渲染
        jump("article-details")
        renderArticleDetails(target.getAttribute("articleId"))
        renderDetailsComment(target.getAttribute("articleId"))
        renderUserAvatar()
    }
})

































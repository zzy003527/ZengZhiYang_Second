// 这是获赞与收藏页面

// 点击返回按钮回到上一页（我的消息或者个人中心）
$(".beLAC-back").on("click",function() {
    jump(localStorage.getItem("LACback"))
    localStorage.removeItem("LACback")
    $(".main-bottom").css("display","block")
    // 回来的时候重新渲染一下头像（因为如果进入了他人的主页这玩意会变了，所以要给它改回去）
    renderMybaseInfo(localStorage.getItem("userId"));
    renderPCfollow(localStorage.getItem("userId"))

    // 那就顺便重新渲染一下收藏和赞过的和我的文章吧（因为进到了别人的主页）
    rerender("belikedAndcollected-Page")
})





// ---------------------------------------------------------
// 点击获赞和收藏，对应的盒子出现
$(".beLiked-Btn").on("click",function() {
    // 转化按钮颜色
    $(".beCollected-Btn").removeClass("LACbtn-current")
    if($(".beLiked-Btn").elements[0].classList.contains("LACbtn-current") !== true) {
        $(".beLiked-Btn").addClass("LACbtn-current")
    }
    // $(".beCollected-Father").css("display","none")
    // 将另一个盒子移走
    $(".beCollected-Father").empty()
    $(".beCollected-Father").remove()
    // 重新渲染
    if($(".beLiked-Father").elements.length == 0) {
        let BelikedFather = $("<div></div>").addClass("beLiked-Father")
        $(".belikedAndcollected-Page").append(BelikedFather)
        renderBelikedArticle(localStorage.getItem('userId'))
    }

    // $(".beLiked-Father").css("display","block")
    
})

$(".beCollected-Btn").on("click",function() {
    // 转化按钮颜色
    $(".beLiked-Btn").removeClass("LACbtn-current")
    if($(".beCollected-Btn").elements[0].classList.contains("LACbtn-current") !== true) {
        $(".beCollected-Btn").addClass("LACbtn-current")
    }
    // $(".beLiked-Father").css("display","none")
    // 将另一个盒子移走
    $(".beLiked-Father").empty()
    $(".beLiked-Father").remove()
    // 重新渲染
    if($(".beCollected-Father").elements.length == 0) {
        let beCollectedFather = $("<div></div>").addClass("beCollected-Father")
        $(".belikedAndcollected-Page").append(beCollectedFather)
        renderBeCollectedArticle(localStorage.getItem("userId"))
    }


    // $(".beCollected-Father").css("display","block")
    // renderBeCollectedArticle(localStorage.getItem('userId'))

})



// ----------------------------------------------------------------
// 创建每个获赞的笔记盒子
function CreateBeLikedBox(data) {
    var frag = document.createDocumentFragment()
    // 头像
    var img1 = $("<img/>").attr("src",data.userInfo.avatar)
    var avatar = $("<div></div>").addClass("beLiked-avatar").append(img1).attr("userId",data.userInfo.userId)
    // 昵称
    var nickname = $("<div></div>").addClass("beLiked-nickname").html(data.userInfo.nickname)
    // 文字
    var word = $("<div></div>").addClass("beLiked-word").html("赞了你的笔记")
    // 右侧图片
    var img2 = $("<img/>").attr("src",data.articleInfo.images[0])
    var image = $("<div></div>").addClass("beLiked-image").append(img2)
    // 进入文章详情按钮
    var detailsBtn = $("<div></div>").addClass("beLiked-detailsBtn").addClass("iconfont").html('&#xe617;').attr("articleId",data.articleInfo.articleId)

    frag.appendChild(avatar.elements[0])
    frag.appendChild(nickname.elements[0])
    frag.appendChild(word.elements[0])
    frag.appendChild(image.elements[0])
    frag.appendChild(detailsBtn.elements[0])

    return frag
}


// 发送获取被赞的笔记的请求
function renderBelikedArticle(userId) {
    $().ajax({
        type: "GET",
        url: "http://175.178.193.182:8080/notice/article/like",
        data: {
            userId: userId
        }
    }).then((res) => {
        if(res.like !== undefined) {
            for(let i = 0;i < res.like.length;i++) {
                let frag = CreateBeLikedBox(res.like[i])
                let box = $("<div></div>").addClass("beLiked-Box")
                box.elements[0].appendChild(frag)
                $(".beLiked-Father").append(box)
            }
        }
    }).catch((res) => {
        console.log(res);
    })
}

renderBelikedArticle(localStorage.getItem('userId'))


// ----------------------------------------------------------------
// 创建每个收藏的笔记盒子
function CreateBeCollectedBox(data) {
    var frag = document.createDocumentFragment()
    // 头像
    var img1 = $("<img/>").attr("src",data.userInfo.avatar)
    var avatar = $("<div></div>").addClass("beCollected-avatar").append(img1).attr("userId",data.userInfo.userId)
    // 昵称
    var nickname = $("<div></div>").addClass("beCollected-nickname").html(data.userInfo.nickname)
    // 文字
    var word = $("<div></div>").addClass("beCollected-word").html("收藏了你的笔记")
    // 右侧图片
    var img2 = $("<img/>").attr("src",data.articleInfo.images[0])
    var image = $("<div></div>").addClass("beCollected-image").append(img2)
    // 进入文章详情按钮
    var detailsBtn = $("<div></div>").addClass("beCollected-detailsBtn").addClass("iconfont").html('&#xe617;').attr("articleId",data.articleInfo.articleId)

    frag.appendChild(avatar.elements[0])
    frag.appendChild(nickname.elements[0])
    frag.appendChild(word.elements[0])
    frag.appendChild(image.elements[0])
    frag.appendChild(detailsBtn.elements[0])

    return frag
}


// 发送获取收藏的笔记的请求
function renderBeCollectedArticle(userId) {
    $().ajax({
        type: "GET",
        url: "http://175.178.193.182:8080/notice/article/star",
        data: {
            userId: userId
        }
    }).then((res) => {
        if(res.star.length !== 0) {
            for(let i = 0;i < res.star.length;i++) {
                let frag = CreateBeCollectedBox(res.star[i])
                let box = $("<div></div>").addClass("beCollected-Box")
                box.elements[0].appendChild(frag)
                $(".beCollected-Father").append(box)
            }
        }
    }).catch((res) => {
        console.log(res);
    })
}

// renderBeCollectedArticle(localStorage.getItem('userId'))

// ------------------------------------------------------------------
// 点击>进入文章详情
$(".belikedAndcollected-Page").on("click",function(e) {
    let target = e.target
    if(target.classList.contains("beLiked-detailsBtn")) {
        console.log(target.getAttribute("articleId"));
        // 跳转到文章详情，并渲染
        jump("article-details")
        renderArticleDetails(target.getAttribute("articleId"))
        renderDetailsComment(target.getAttribute("articleId"))
        renderUserAvatar()
    }
    if(target.classList.contains("beCollected-detailsBtn")) {
        console.log(target.getAttribute("articleId"));
        // 跳转到文章详情，并渲染
        jump("article-details")
        renderArticleDetails(target.getAttribute("articleId"))
        renderDetailsComment(target.getAttribute("articleId"))
        renderUserAvatar()
    }
})

// -----------------------------------------------------------------
// 点击关注头像进入到它的首页
$(".belikedAndcollected-Page").on("click",function(e) {
    let target = e.target
    // 点击到作者头像
    if(target.parentNode.classList.contains("beLiked-avatar") || target.parentNode.classList.contains("beCollected-avatar")) {
        console.log(target.parentNode);
        // 跳转到作者的主页
        jumpL("person-center")
        localStorage.setItem("PersonBack",localStorage.getItem("nowPage"))
        // 为关注的人加上一个自定义属性用来表示渲染哪一个人
        $(".belikedAndcollected-Page").attr("TheRenderId",target.parentNode.getAttribute("userId"))
        // 在第一次跳转的时候渲染下方我的文章和个人信息
        renderMybaseInfo(target.parentNode.getAttribute("userId"));
        renderPCfollow(target.parentNode.getAttribute("userId"))
        // ------------------
        // 在个人主页点完要进到别人的主页，要先把自己的删了，再渲染别人的，因为今天写到很乱，都是这不补一下那边补一下，所以我的代码这边一块，那边一块
        rerender("belikedAndcollected-Page")
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
































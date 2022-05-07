// 这是关注的人页面的js

// 封装一个返回重新渲染的函数
function rerender(TherenderBoxName) {
    let TherenderBox = '.' + TherenderBoxName
    if($(".person-note-btn").elements[0].classList.contains("person-btntwo-current")) {
        if($(".main-myArticle-column-left").elements.length === 0) {
            var myArticleLeftbox = $("<div></div>")
            myArticleLeftbox.addClass("main-column").addClass("main-myArticle-column-left").addClass("main-column-left").addClass("main-myArticle-column")
            $(".main-myArticle-column-right").before(myArticleLeftbox)
            // 如果是从头像点进来的，那就渲染头像的id，如果不是，那么attr自定义属性是null，渲染当前用户的
            if($(TherenderBox).attr("TheRenderId") !== null) {
                // renderMyArticle(target.parentNode.parentNode.getAttribute("userId"))
                rendermyAriticle($(TherenderBox).attr("TheRenderId"));
            } else {
                rendermyAriticle(localStorage.getItem("userId"));
            } 
        }  else if($(".main-myArticle-column-left").elements.length === 1) {
            $(".main-myArticle-column").empty()
            $(".main-myArticle-column-left").remove()
            var myArticleLeftbox = $("<div></div>")
            myArticleLeftbox.addClass("main-column").addClass("main-myArticle-column-left").addClass("main-column-left").addClass("main-myArticle-column")
            $(".main-myArticle-column-right").before(myArticleLeftbox)
            // 如果是从头像点进来的，那就渲染头像的id，如果不是，那么attr自定义属性是null，渲染当前用户的
            if($(TherenderBox).attr("TheRenderId") !== null) {
                // renderMyArticle(target.parentNode.parentNode.getAttribute("userId"))
                rendermyAriticle($(TherenderBox).attr("TheRenderId"));
            } else {
                rendermyAriticle(localStorage.getItem("userId"));
            } 
        }
    }
    
    if($(".person-collect-btn").elements[0].classList.contains("person-btntwo-current")) {
        if($(".main-myCollect-column-left").elements.length === 0) {
            var myCollectLeftbox = $("<div></div>")
            myCollectLeftbox.addClass("main-column").addClass("main-myCollect-column-left").addClass("main-column-left").addClass("main-myCollect-column")
            $(".main-myCollect-column-right").before(myCollectLeftbox)
            // 如果是从头像点进来的，那就渲染头像的id，如果不是，那么attr自定义属性是null，渲染当前用户的
            if($(TherenderBox).attr("TheRenderId") !== null) {
                renderMyCollect($(TherenderBox).attr("TheRenderId"));
            } else {
                renderMyCollect(localStorage.getItem("userId"));
            } 
        } else if($(".main-myCollect-column-left").elements.length === 1) {
            $(".main-myCollect-column").empty()
            $(".main-myCollect-column-left").remove()
            var myCollectLeftbox = $("<div></div>")
            myCollectLeftbox.addClass("main-column").addClass("main-myCollect-column-left").addClass("main-column-left").addClass("main-myCollect-column")
            $(".main-myCollect-column-right").before(myCollectLeftbox)
            // 如果是从头像点进来的，那就渲染头像的id，如果不是，那么attr自定义属性是null，渲染当前用户的
            if($(TherenderBox).attr("TheRenderId") !== null) {
                renderMyCollect($(TherenderBox).attr("TheRenderId"));
            } else {
                renderMyCollect(localStorage.getItem("userId"));
            } 
        }
    }

    if($(".hadliked-btn").elements[0].classList.contains("person-btntwo-current")) {
        if($(".main-myLiked-column-left").elements.length === 0) {
            var myLikedLeftbox = $("<div></div>")
            myLikedLeftbox.addClass("main-column").addClass("main-myLiked-column-left").addClass("main-column-left").addClass("main-myLiked-column")
            $(".main-myLiked-column-right").before(myLikedLeftbox)
            // 如果是从头像点进来的，那就渲染头像的id，如果不是，那么attr自定义属性是null，渲染当前用户的
            if($(TherenderBox).attr("TheRenderId") !== null) {
                renderMyLiked($(TherenderBox).attr("TheRenderId"));
            } else {
                renderMyLiked(localStorage.getItem("userId"));
            } 
        } else if($(".main-myLiked-column-left").elements.length === 1) {
            $(".main-myLiked-column").empty()
            $(".main-myLiked-column-left").remove()
            var myLikedLeftbox = $("<div></div>")
            myLikedLeftbox.addClass("main-column").addClass("main-myLiked-column-left").addClass("main-column-left").addClass("main-myLiked-column")
            $(".main-myLiked-column-right").before(myLikedLeftbox)
            // 如果是从头像点进来的，那就渲染头像的id，如果不是，那么attr自定义属性是null，渲染当前用户的
            if($(TherenderBox).attr("TheRenderId") !== null) {
                renderMyLiked($(TherenderBox).attr("TheRenderId"));
            } else {
                renderMyLiked(localStorage.getItem("userId"));
            } 
        }
    }
}


// ----------------------------------------------------------------------



// 点击返回按钮回到上一页（我的消息或者个人中心）
$(".follow-person-back").on("click",function() {
    jump(localStorage.getItem("prePage"))
    $(".main-bottom").css("display","block")
    // 回来的时候重新渲染一下头像（因为如果进入了他人的主页这玩意会变了，所以要给它改回去）
    renderMybaseInfo(localStorage.getItem("userId"));
    renderPCfollow(localStorage.getItem("userId"))

    // 那就顺便重新渲染一下收藏和赞过的和我的文章吧（因为进到了别人的主页）
    rerender("follow-person")
})



// ------------------------------------------------------------
// 创建每个关注者的盒子
function CreateFollowBox(data) {
    var frag = document.createDocumentFragment();

    // 头像
    var img = $("<img/>").attr("src",data.avatar)
    var avatar = $("<div></div>").addClass("follow-person-avatar").attr("userId",data.userId).append(img)
    // 昵称
    var nickname = $("<div></div>").addClass("follow-person-nickname").html(data.nickname)
    // 关注按钮
    var followBtn = $("<div></div>").addClass("follow-person-followBtn").html("已关注")
    if(data.follows.length !== 0) {
        for(let i = 0;i < data.follows.length;i++) {
            if(data.follows[i] == localStorage.getItem('userId')) {
                followBtn.html("互相关注")
                followBtn.css("width","85px")
            }
        }
    }

    frag.appendChild(avatar.elements[0])
    frag.appendChild(nickname.elements[0])
    frag.appendChild(followBtn.elements[0])

    return frag
}


// 获取每个关注者的信息
function renderEveFollow(followerId) {
    $().ajax({
        type: "GET",
        url: "http://175.178.193.182:8080/user/fullInfo",
        data: {
            userId: followerId
        }
    }).then((res) => {
        let frag = CreateFollowBox(res.user)
        let followBox = $("<div></div>").addClass("follow-person-box")
        followBox.elements[0].appendChild(frag)
        $(".follow-person-Father").append(followBox)
    }).catch((res) => {
        console.log(res);
    })
}




// 渲染关注页面
function renderFollowPerson(userId) {
    $().ajax({
        type: "GET",
        url: "http://175.178.193.182:8080/user/fullInfo",
        data: {
            userId: userId
        }
    }).then((res) => {
        if(res.user.follows.length !== 0) {
            for(let i = 0;i < res.user.follows.length;i++) {
                renderEveFollow(res.user.follows[i])
            }
        }
    }).catch((res) => {
        console.log(res);
    })

}
    
renderFollowPerson(localStorage.getItem("userId"))


// -----------------------------------------------------------------
// 点击关注头像进入到它的首页
$(".follow-person").on("click",function(e) {
    let target = e.target
    // 点击到作者头像
    if(target.parentNode.classList.contains("follow-person-avatar")) {
        // 跳转到作者的主页
        jumpL("person-center")
        localStorage.setItem("PersonBack",localStorage.getItem("nowPage"))
        // 为关注的人加上一个自定义属性用来表示渲染哪一个人
        $(".follow-person").attr("TheRenderId",target.parentNode.getAttribute("userId"))
        // 在第一次跳转的时候渲染下方我的文章和个人信息
        renderMybaseInfo(target.parentNode.getAttribute("userId"));
        renderPCfollow(target.parentNode.getAttribute("userId"))
        // ------------------
        // 在个人主页点完要进到别人的主页，要先把自己的删了，再渲染别人的，因为今天写到很乱，都是这不补一下那边补一下，所以我的代码这边一块，那边一块
        rerender("follow-person")
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



























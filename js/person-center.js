// 这是个人中心的js



// 点击退出登录按钮跳转到login页面
$(".logout-btn").on("click",function() {
    // 准备传入数据
    var fd = new FormData()
    fd.append("userId",localStorage.getItem("userId"))
    $().ajax({
        type: "POST",
        url: "http://175.178.193.182:8080/logout",
        data: fd
    }).then((res) => {
        alert(res.msg);
        localStorage.removeItem("userId");
        localStorage.removeItem("prePage")
        localStorage.removeItem("nowPage")
        jump("login");
        // 当退出登录时，清空上一条账号的我的文章
        $(".main-myArticle-column").empty()
        $(".main-myArticle-column-left").remove()
        // 清空收藏的文章
        $(".main-myCollect-column").empty()
        $(".main-myCollect-column-left").remove()
        // 清空赞过的文章
        $(".main-myLiked-column").empty()
        $(".main-myLiked-column-left").remove()
        // 清空我的关注和我的粉丝
        $(".follow-person-box").remove()
        $(".follow-person-Father").remove()

        $(".fans-box").remove()
        $(".fans-Father").remove()
        // 清空获赞和收藏
        $(".beLiked-Father").empty()
        $(".beLiked-Father").remove()

        $(".beCollected-Father").empty()
        $(".beCollected-Father").remove()
        // 清空我的消息的聊天列表
        $(".MyMessage-container").empty()
        // 将底部框框none掉
        $(".main-bottom").css("display","none")
    }).catch((res) => {
        console.log(res);
    })
})


// 点击编辑资料按钮跳转到编辑资料
$(".editdata-btn").on("click",function() {
    jump("edit-data");
    renderUserBaseInfo()
    $(".main-bottom").css("display","none")
})


// 点击首页返回主页面
$(".To-main").on("click",function() {
    
    jump("main");
    // $(".main-bottom-tab").removeClass("main-tab-current");
    // $(".main-bottom-tab").children(".main-tab-word").removeClass("main-tab-current")
    // $(".main-bottom-tab").get(0).addClass("main-tab-current")
    // $(".main-bottom-tab").get(0).children(".main-tab-word").addClass("main-tab-current")
})

// 点击发消息跳转到发消息页面
$(".sendMessage-btn").on("click",function() {
    jumpL("ChatPage")
    localStorage.setItem("chatBackPerson","chatBackPerson")
    // 给聊天页面加个属性表面聊天对象
    if($(".person-center").attr("TheRenderId")) {
        $(".ChatPage").attr("receiverId",$(".person-center").attr("TheRenderId"))
        renderChatBackground(localStorage.getItem("userId"))
        renderReceiverId($(".person-center").attr("TheRenderId"))
        renderChatRecord(localStorage.getItem("userId"),$(".person-center").attr("TheRenderId"))
    } else if($(".MyMessage").attr("TheRenderId")) {
        $(".ChatPage").attr("receiverId",$(".MyMessage").attr("TheRenderId"))
        renderChatBackground(localStorage.getItem("userId"))
        renderReceiverId($(".MyMessage").attr("TheRenderId"))
        renderChatRecord(localStorage.getItem("userId"),$(".MyMessage").attr("TheRenderId"))
    } else if($(".SendprivateMsg").attr("TheRenderId")) {
        $(".ChatPage").attr("receiverId",$(".SendprivateMsg").attr("TheRenderId"))
        renderChatBackground(localStorage.getItem("userId"))
        renderReceiverId($(".SendprivateMsg").attr("TheRenderId"))
        renderChatRecord(localStorage.getItem("userId"),$(".SendprivateMsg").attr("TheRenderId"))
    }
    
})


// ------------------------------------------------
// 点击关注进入关注的人页面
$(".follow-btn").on("click",InFollowperson)

function InFollowperson() {
    jump("follow-person")
    // 重新渲染(如果不存在，则重新渲染，如果存在，就不再渲染)
    if($(".follow-person-Father").elements.length === 0) {
        let followFather = $("<div></div>").addClass("follow-person-Father")
        $(".follow-person").append(followFather)
        renderFollowPerson(localStorage.getItem("userId"))
    }

    // 跳转顺便把下面none了
    $(".main-bottom").css("display","none")
}

// 点击粉丝进入粉丝页面
$(".fans-btn").on("click",InFans)

function InFans() {
    jump("fans-Page")
    // 重新渲染
    if($(".fans-Father").elements.length === 0) {
        let FansFather = $("<div></div>").addClass("fans-Father")
        $(".fans-Page").append(FansFather)
        renderFansPerson()
    }
    // 跳转顺便把下面none了
    $(".main-bottom").css("display","none")
}


// 点击获赞与收藏进入获赞与收藏页面
$(".likeAndcollect-btn").on("click",InLikeAndCollect)

function InLikeAndCollect() {
    // 储存一个东西让它知道要返回哪里（主要要在jump之前储存）
    localStorage.setItem("LACback",localStorage.getItem("nowPage"))
    jump("belikedAndcollected-Page")
    // 重新渲染
    if($(".beLiked-Father").elements.length === 0) {
        let BelikedFather = $("<div></div>").addClass("beLiked-Father")
        $(".belikedAndcollected-Page").append(BelikedFather)
        renderBelikedArticle(localStorage.getItem('userId'))
    }
    // 跳转顺便把下面none了
    $(".main-bottom").css("display","none")
}




// ------------------------------------------------------------
// 实现关注、粉丝、点赞与收藏的点击变色
$(".person-btnboxone").on("click",function(){
    var index = 0;
    for(let i = 0;i < $(".person-btnboxone").elements.length;i++) {
        if(this === $(".person-btnboxone").elements[i]) {
            index = i;
        }
    }
    // 在没有current的时候再加上去，否则将会叠加
    if($(".person-btnboxone").get(index).elements[0].classList.contains("person-btn-current") !== true) {
        $(".person-btnboxone").get(index).addClass("person-btn-current");
    }
    $(".person-btnboxone").get(index).siblings(".person-btnboxone").removeClass("person-btn-current")
})

// 实现下方笔记、收藏、赞过的点击变色
$(".person-btnboxtwo").on("click",function(){
    var index = 0;
    for(let i = 0;i < $(".person-btnboxtwo").elements.length;i++) {
        if(this === $(".person-btnboxtwo").elements[i]) {
            index = i;
        }
    }
    // 在没有current的时候再加上去，否则将会叠加
    if($(".person-btnboxtwo").get(index).elements[0].classList.contains("person-btntwo-current") !== true) {
        $(".person-btnboxtwo").get(index).addClass("person-btntwo-current");
    }
    $(".person-btnboxtwo").get(index).siblings(".person-btnboxtwo").removeClass("person-btntwo-current")
})




// ---------------------------------------------------------------
// 渲染收藏的文章列表
function renderMyCollect(userId) {
    $().ajax({
        type: "GET",
        url: "http://175.178.193.182:8080/article/getStar",
        data: {
            userId: userId
        }
    }).then((res) => {
        for(let i = 0;i < res.staredArticles.length;i++) {
            if(compareHeight("myCollect") === 'left') {
                mainBoxLeftAdd("myCollect",i,res.staredArticles[i])
            } else {
                mainBoxRightAdd("myCollect",i,res.staredArticles[i]) 
            }
        }
    }).catch((res) => {
        console.log(res);
    })
}
// renderMyCollect(localStorage.getItem("userId"))

// ----------------------------------------------
// 渲染赞过的文章列表
function renderMyLiked(userId) {
    $().ajax({
        type: "GET",
        url: "http://175.178.193.182:8080/article/getLike",
        data: {
            userId: userId
        }
    }).then((res) => {
        for(let i = 0;i < res.likedArticles.length;i++) {
            if(compareHeight("myLiked") === 'left') {
                mainBoxLeftAdd("myLiked",i,res.likedArticles[i])
            } else {
                mainBoxRightAdd("myLiked",i,res.likedArticles[i]) 
            }
        }
    }).catch((res) => {
        console.log(res);
    })
}
// renderMyLiked(localStorage.getItem("userId"))


// -----------------------------------------------------------------------
// 点击笔记、收藏、赞过，切换显示框
// --------------------------
$(".person-note-btn").on("click",function() {
    $(".main-myArticle-column-right").css("display","block")
    // 如果收藏文章和赞过的文章存在，就删除
    if($(".main-myCollect-column-left").elements.length === 1) {
        $(".main-myCollect-column").empty()
        $(".main-myCollect-column-left").remove()
        $(".main-myCollect-column-right").css("display","none")
    } 
    if($(".main-myLiked-column-left").elements.length === 1) {
        $(".main-myLiked-column").empty()
        $(".main-myLiked-column-left").remove()
        $(".main-myLiked-column-right").css("display","none")
    }

    // 如果我的文章不存在，就添加
    // 在之后检查是否有文章(此处因为列盒子内部的文章盒子是动态添加的，我获取不到它的length，所以在退出登录的时候把左列盒子给删了，这里判断的是左列盒子是否存在，若没有，则重新渲染
    if($(".main-myArticle-column-left").elements.length === 0) {
        $(".main-myArticle-column-right").css("display","block")
        var myArticleLeftbox = $("<div></div>")
        myArticleLeftbox.addClass("main-column").addClass("main-myArticle-column-left").addClass("main-column-left").addClass("main-myArticle-column")
        $(".main-myArticle-column-right").before(myArticleLeftbox)
        // 如果是从头像点进来的，那就渲染头像的id，如果不是，那么attr自定义属性是null，渲染当前用户的
        if($(".person-center").attr("TheRenderId") !== null) {
            rendermyAriticle($(".person-center").attr("TheRenderId"));
        } else if ($(".follow-person").attr("TheRenderId") !== null) {
            rendermyAriticle($(".follow-person").attr("TheRenderId"));
        } else if( $(".fans-Page").attr("TheRenderId") !== null) {
            rendermyAriticle($(".fans-Page").attr("TheRenderId"));
        } else if( $(".belikedAndcollected-Page").attr("TheRenderId") !== null) {
            rendermyAriticle($(".belikedAndcollected-Page").attr("TheRenderId"));
        } else if( $(".search").attr("TheRenderId") !== null) {
            rendermyAriticle($(".search").attr("TheRenderId"));
        } else if( $(".receiveReview").attr("TheRenderId") !== null) {
            rendermyAriticle($(".receiveReview").attr("TheRenderId"));
        } else if( $(".SendprivateMsg").attr("TheRenderId") !== null) {
            rendermyAriticle($(".SendprivateMsg").attr("TheRenderId"));
        } else if( $(".MyMessage").attr("TheRenderId") !== null) {
            rendermyAriticle($(".MyMessage").attr("TheRenderId"));
        } else {
            rendermyAriticle(localStorage.getItem("userId"));
        } 
    }
})




// ----------------------------------
$(".person-collect-btn").on("click",function() {
    $(".main-myCollect-column-right").css("display","block")
    // 如果我的文章和赞过的文章存在，就删除
    if($(".main-myArticle-column-left").elements.length === 1) {
        $(".main-myArticle-column").empty()
        $(".main-myArticle-column-left").remove()
        $(".main-myArticle-column-right").css("display","none")
    } 
    if($(".main-myLiked-column-left").elements.length === 1) {
        $(".main-myLiked-column").empty()
        $(".main-myLiked-column-left").remove()
        $(".main-myLiked-column-right").css("display","none")
    }

    // 如果我的文章不存在，就添加
    // 在之后检查是否有文章(此处因为列盒子内部的文章盒子是动态添加的，我获取不到它的length，所以在退出登录的时候把左列盒子给删了，这里判断的是左列盒子是否存在，若没有，则重新渲染
    if($(".main-myCollect-column-left").elements.length === 0) {
        $(".main-myCollect-column-right").css("display","block")
        var myCollectLeftbox = $("<div></div>")
        myCollectLeftbox.addClass("main-column").addClass("main-myCollect-column-left").addClass("main-column-left").addClass("main-myCollect-column")
        $(".main-myCollect-column-right").before(myCollectLeftbox)
        // 如果是从头像点进来的，那就渲染头像的id，如果不是，那么attr自定义属性是null，渲染当前用户的
        if($(".person-center").attr("TheRenderId") !== null) {
            renderMyCollect($(".person-center").attr("TheRenderId"));
        } else if ($(".follow-person").attr("TheRenderId") !== null) {
            renderMyCollect($(".follow-person").attr("TheRenderId"));
        } else if( $(".fans-Page").attr("TheRenderId") !== null) {
            renderMyCollect($(".fans-Page").attr("TheRenderId"));
        } else if( $(".belikedAndcollected-Page").attr("TheRenderId") !== null) {
            renderMyCollect($(".belikedAndcollected-Page").attr("TheRenderId"));
        } else if( $(".search").attr("TheRenderId") !== null) {
            renderMyCollect($(".search").attr("TheRenderId"));
        } else if( $(".receiveReview").attr("TheRenderId") !== null) {
            renderMyCollect($(".receiveReview").attr("TheRenderId"));
        } else if( $(".SendprivateMsg").attr("TheRenderId") !== null) {
            renderMyCollect($(".SendprivateMsg").attr("TheRenderId"));
        } else if( $(".MyMessage").attr("TheRenderId") !== null) {
            renderMyCollect($(".MyMessage").attr("TheRenderId"));
        } else {
            renderMyCollect(localStorage.getItem("userId"));
        } 
    } 
})

// ----------------------------------
$(".hadliked-btn").on("click",function() {
    $(".main-myLiked-column-right").css("display","block")
    // 如果我的文章和收藏文章存在，就删除
    if($(".main-myArticle-column-left").elements.length === 1) {
        $(".main-myArticle-column").empty()
        $(".main-myArticle-column-left").remove()
        $(".main-myArticle-column-right").css("display","none")
    } 
    if($(".main-myCollect-column-left").elements.length === 1) {
        $(".main-myCollect-column").empty()
        $(".main-myCollect-column-left").remove()
        $(".main-myCollect-column-right").css("display","none")
    }

    // 如果我的文章不存在，就添加
    // 在之后检查是否有文章(此处因为列盒子内部的文章盒子是动态添加的，我获取不到它的length，所以在退出登录的时候把左列盒子给删了，这里判断的是左列盒子是否存在，若没有，则重新渲染
    if($(".main-myLiked-column-left").elements.length === 0) {
        $(".main-myLiked-column-right").css("display","block")
        var myLikedLeftbox = $("<div></div>")
        myLikedLeftbox.addClass("main-column").addClass("main-myLiked-column-left").addClass("main-column-left").addClass("main-myLiked-column")
        $(".main-myLiked-column-right").before(myLikedLeftbox)
        // 如果是从头像点进来的，那就渲染头像的id，如果不是，那么attr自定义属性是null，渲染当前用户的
        if($(".person-center").attr("TheRenderId") !== null) {
            renderMyLiked($(".person-center").attr("TheRenderId"));
        } else if ($(".follow-person").attr("TheRenderId") !== null) {
            renderMyLiked($(".follow-person").attr("TheRenderId"));
        } else if( $(".fans-Page").attr("TheRenderId") !== null) {
            renderMyLiked($(".fans-Page").attr("TheRenderId"));
        } else if( $(".belikedAndcollected-Page").attr("TheRenderId") !== null) {
            renderMyLiked($(".belikedAndcollected-Page").attr("TheRenderId"));
        } else if( $(".search").attr("TheRenderId") !== null) {
            renderMyLiked($(".search").attr("TheRenderId"));
        } else if( $(".receiveReview").attr("TheRenderId") !== null) {
            renderMyLiked($(".receiveReview").attr("TheRenderId"));
        } else if( $(".SendprivateMsg").attr("TheRenderId") !== null) {
            renderMyLiked($(".SendprivateMsg").attr("TheRenderId"));
        } else if( $(".MyMessage").attr("TheRenderId") !== null) {
            renderMyLiked($(".MyMessage").attr("TheRenderId"));
        } else {
            renderMyLiked(localStorage.getItem("userId"));
        } 
    } 
})




// --------------------------------------------------------------------
// 点击每一篇文章，进入文章详情
$(".person-container").on("click",InPersonDetails)

function InPersonDetails(e) {
    let target = e.target;
    if(target.parentNode.classList.contains("main-column-box")) {
        // 点击跳转到文章详情，并渲染
        jump("article-details")
        renderArticleDetails(target.parentNode.getAttribute("articleId"))
        renderDetailsComment(target.parentNode.getAttribute("articleId"))
        renderUserAvatar()
    } else if(target.parentNode.parentNode.classList.contains("main-column-box")) {
        // 点击跳转到文章详情，并渲染
        jump("article-details")
        renderArticleDetails(target.parentNode.parentNode.getAttribute("articleId"))
        renderDetailsComment(target.parentNode.parentNode.getAttribute("articleId"))
        renderUserAvatar()
    }
}

// --------------------------------------------------------------
// 点击返回按钮回到上一页
$(".PCback-btn").on("click",function() {
    if(localStorage.getItem("searchUserback")) {
        jumpL("search")
        localStorage.removeItem("searchUserback")
    } else {
        jumpL(localStorage.getItem("PersonBack"))
    }
    
    // 返回后将改变的东西全部改回去
    $(".logout-btn").css("display","block")
    $(".person-share-btn").css("display","block")
    $(".editdata-btn").css("display","block")

    $(".sendMessage-btn").css("display","none")
    $(".PCback-btn").css("display","none")

    $(".follow-btn").on("click",InFollowperson)
    $(".fans-btn").on("click",InFans)
    $(".likeAndcollect-btn").on("click",InLikeAndCollect)
    // 把person-center绑定的那个自定义属性也搞掉
    $(".person-center").removeAttr("TheRenderId")
    // follow-person的自定义属性也搞掉
    $(".follow-person").removeAttr("TheRenderId")
    // fans-Page也一样
    $(".fans-Page").removeAttr("TheRenderId")
    // belikedAndcollected-Page也是
    $(".belikedAndcollected-Page").removeAttr("TheRenderId")
    // search也不能不一样
    $(".search").removeAttr("TheRenderId")
    // receiveReview当然也要搞掉
    $(".receiveReview").removeAttr("TheRenderId")
    // 那SendprivateMsg也不能幸免
    $(".SendprivateMsg").removeAttr("TheRenderId")
    // MyMessage当然
    if($(".MyMessage").attr("TheRenderId")) {
        $(".main-bottom").css("display","block")
        $(".MyMessage").removeAttr("TheRenderId")
    }
    
    // 把存的localStorage也搞掉
    localStorage.removeItem("PersonBack")
    // 把进入文章详情的恢复
    $(".person-container").on("click",InPersonDetails)
    // 出来的时候把收藏和赞过的文章删了，避免到个人中心的时候还残留有别人的文章
    // 如果收藏文章和赞过的文章存在，就删除（退出的时候紫色在哪，就删哪）
    if($(".person-note-btn").elements[0].classList.contains("person-btntwo-current")) {
        if($(".main-myArticle-column-left").elements.length === 1) {
            $(".main-myArticle-column").empty()
            $(".main-myArticle-column-left").remove()
            // $(".main-myArticle-column-right").css("display","none")
        } 
    }

    if($(".person-collect-btn").elements[0].classList.contains("person-btntwo-current")) {
        if($(".main-myCollect-column-left").elements.length === 1) {
            $(".main-myCollect-column").empty()
            $(".main-myCollect-column-left").remove()
            // $(".main-myCollect-column-right").css("display","none")
        } 
    }

    if($(".hadliked-btn").elements[0].classList.contains("person-btntwo-current")) {
        if($(".main-myLiked-column-left").elements.length === 1) {
            $(".main-myLiked-column").empty()
            $(".main-myLiked-column-left").remove()
            // $(".main-myLiked-column-right").css("display","none")
        }
    }
    
   
})




// ----------------------------------------------------------------
// 突然发现忘记加点赞功能了
$(".person-center").on("click",function(e) {
    let target = e.target;
    // 如果点到点赞盒子
    if(target.classList.contains("heart")) {
        var userId = localStorage.getItem("userId")
        var articleId = target.parentNode.parentNode.parentNode.getAttribute("articleId")
        var index = target.parentNode.parentNode.parentNode.getAttribute("index")
        //  如果点赞文字为黑色，就发送点赞请求
        if(window.getComputedStyle(target).color === 'rgb(0, 0, 0)') {
            target.innerHTML = '&#xe60d;'
            target.style.color = 'red'
            Likes(userId,articleId)
            // 将当前点赞数加一
            var nowlikes1 = parseInt(target.parentNode.children[1].innerHTML) + 1
            target.parentNode.children[1].innerHTML = nowlikes1
        } else if(window.getComputedStyle(target).color === 'rgb(255, 0, 0)') {  //为红色，则取消点赞
            target.innerHTML = '&#xe8ab;'
            target.style.color = 'black'
            LikesCancle(userId,articleId)
            // 将当前点赞数减一
            var nowlikes2 = parseInt(target.parentNode.children[1].innerHTML) - 1
            target.parentNode.children[1].innerHTML = nowlikes2
        }
    } 
})





















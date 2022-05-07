// 这是搜索页面的js

// 点击返回按钮回到主页
$(".search-back").on("click",function() {
    jumpL("main");
    $(".main-bottom").css("display","block")
    // 出来的时候全给清空掉
    $(".main-SearchArticle-column").empty()
    $(".search-userBox").empty()
    $(".search-ipt").elements[0].value = ''
})


// ----------------------------

// 为文章按钮和用户按钮添加点击切换样式
$(".search-Btn").on("click",function() {
    var index = 0;
    for(let i = 0;i < $(".search-Btn").elements.length;i++) {
        if(this === $(".search-Btn").elements[i]) {
            index = i;
        }
    }
    // 在没有current的时候再加上去，否则将会叠加
    if($(".search-Btn").get(index).elements[0].classList.contains("searchBtn-current") !== true) {
        $(".search-Btn").get(index).addClass("searchBtn-current")
    }
    $(".search-Btn").get(index).siblings(".search-Btn").removeClass("searchBtn-current")
})


// ----------------------------------------------------------------
// 点击文章和用户，删除另外一个的内容
$(".search-userBtn").on("click",function() {
    $(".main-SearchArticle-column").empty()
    $(".search-bottom").css("display","none")
})

$(".search-articleBtn").on("click",function() {
    $(".search-userBox").empty()
    $(".search-bottom").css("display","none")
})





// ---------------------------------------------------------------
// 发送搜索文章请求,渲染搜索到的文章
function RenderSearchArticle() {
    $().ajax({
        type: "GET",
        url: "http://175.178.193.182:8080/search/byArticle",
        data: {
            keyWord: $(".search-ipt").elements[0].value
        }
    }).then((res) => {
        // 当查找不到的时候，“没有更多了”文字出现
        if(res.articles.length === 0) {
            $(".search-bottom").css("display","block")
        }
        for(let i = 0;i < res.articles.length;i++) {
            if(compareHeight("SearchArticle") === 'left') {
                mainBoxLeftAdd("SearchArticle",i,res.articles[i])
            } else {
                mainBoxRightAdd("SearchArticle",i,res.articles[i]) 
            }
        }
    }).catch((res) => {
        console.log(res);
    })
}

// -----------------------------
// 发送请求用户详细数据来判断查找到的用户与当前用户是否互相关注
function RenderSearchStar(userId,starBtn) {
    $().ajax({
        type: "GET",
        url: "http://175.178.193.182:8080/user/fullInfo",
        data: {
            userId: userId
        }
    }).then((res) => {
        if(res.user.userId == localStorage.getItem("userId")) {
            starBtn.css("width","95px")
            starBtn.html("这就是你自己")
        }
        if(res.user.fans.length !== 0) { //如果对方的粉丝有我，那就是已关注
            for(let i = 0;i < res.user.fans.length;i++) {
                if(res.user.fans[i] == localStorage.getItem('userId')) {
                    starBtn.css("backgroundColor","#a063d4").css("color","white")
                    starBtn.html("已关注")
                }
            }
        } 
        if(res.user.fans.length !== 0 && res.user.follows.length !== 0) {
            // 如果对方的粉丝有我，对方的关注也有我，那么就是互相关注
            // 声明俩变量来判断能不能互相关注
            let hisfans = false;
            let hisfollows = false;
            for(let i = 0;i < res.user.fans.length;i++) {
                if(res.user.fans[i] == localStorage.getItem("userId")) {
                    hisfans = true
                }
            }
            for(let j = 0;j < res.user.follows.length;j++) {
                if(res.user.follows[j] == localStorage.getItem("userId")) {
                    hisfollows = true
                }
            }
            if(hisfans && hisfollows) {
                starBtn.css("width","85px").css("backgroundColor","#a063d4").css("color","white")
                starBtn.html("互相关注")
            }
        }
    }).catch((res) => {
        console.log(res);
    })
}



// 创建搜索用户文档碎片
function CreateSearchUser(data) {
    let frag = document.createDocumentFragment()
    // 头像
    let img = $("<img/>").attr("src",data.avatar)
    let avatar = $("<div></div>").addClass("search-avatar").attr("userId",data.userId).append(img)
    // 昵称
    let nickname = $("<div></div>").addClass("search-nickname").html(data.nickname)
    // 简介
    let word = $("<div></div>").addClass("search-word")
    if(data.description !== '') {
        word.html(data.description)
    } else {
        word.html("这个用户有点懒，还没有简介哦~")
    }
    // 关注按钮
    let starBtn = $("<div></div>").addClass("search-starBtn").html("未关注")
    RenderSearchStar(data.userId,starBtn)


    frag.appendChild(avatar.elements[0])
    frag.appendChild(nickname.elements[0])
    frag.appendChild(word.elements[0])
    frag.appendChild(starBtn.elements[0])

    return frag
}




// 发送搜索用户请求，渲染搜索到的用户
function RenderSearchUser() {
    $().ajax({
        type: "GET",
        url: "http://175.178.193.182:8080/search/byUser",
        data: {
            keyWord: $(".search-ipt").elements[0].value
        }
    }).then((res) => {
        // 当查找不到的时候，“没有更多了”文字出现
        if(res.users.length === 0) {
            $(".search-bottom").css("display","block")
        }
        for(let i = 0;i < res.users.length;i++) {
            let frag = CreateSearchUser(res.users[i])
            let box = $("<div></div>").addClass("search-Box")
            box.elements[0].appendChild(frag)
            $(".search-userBox").append(box)
        }
    }).catch((res) => {
        console.log(res);
    })
}




// -------------------------------------
// 搜索按钮
$(".theSearch-Btn").on("click",function() {
    // 如果当前是在文章部分，那就发送搜索文章请求
    if($(".search-articleBtn").elements[0].classList.contains("searchBtn-current")) {
        // 当搜索框内不为空时，发送请求
        if($(".search-ipt").elements[0].value !== '') {
            // 如果不存在，就渲染
            if($(".main-SearchArticle-column-left").elements.length == 0) {
                let SearchArticleLeft = $("<div></div>").addClass("main-SearchArticle-column-left").addClass("main-column-left").addClass("main-SearchArticle-column")
                $(".main-SearchArticle-column-right").before(SearchArticleLeft)
                RenderSearchArticle()
            } else {  // 如果存在，就清空后再渲染
                $(".main-SearchArticle-column").empty()
                RenderSearchArticle()
            }
            
        }
    }
    // 如果当前是在用户部分，那就发送搜索用户请求
    if($(".search-userBtn").elements[0].classList.contains("searchBtn-current")) {
        if($(".search-ipt").elements[0].value !== '') {
            if($(".search-userBox").children(".search-Box").elements.length == 0) {
                RenderSearchUser()
            } else {
                $(".search-userBox").empty()
                RenderSearchUser()
            }
            
        }
    }
})



// ---------------------------------------------------------------
// 点击进入文章详情               
$(".search").on("click",InSearchDetails)

function InSearchDetails(e) {
    let target = e.target;
    if(target.parentNode.classList.contains("main-column-box")) {
        // 点击跳转到文章详情，并渲染
        jumpL("article-details")
        renderArticleDetails(target.parentNode.getAttribute("articleId"))
        renderDetailsComment(target.parentNode.getAttribute("articleId"))
        renderUserAvatar()
        // 储存一个标记，表示这个文章详情是在搜索文章进入的
        localStorage.setItem("searchArticle","InSearch")
    } else if(target.parentNode.parentNode.classList.contains("main-column-box")) {
        // 点击跳转到文章详情，并渲染
        jump("article-details")
        renderArticleDetails(target.parentNode.parentNode.getAttribute("articleId"))
        renderDetailsComment(target.parentNode.parentNode.getAttribute("articleId"))
        renderUserAvatar()
        // 储存一个标记，表示这个文章详情是在搜索文章进入的
        localStorage.setItem("searchArticle","InSearch")
    }
}

// ---------------------------
// 点赞功能
$(".search").on("click",function(e) {
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

// ------------------------------------------------------------
// 当input文字变动时，“没有更多了”文字消失;当输入框没东西的时候，清除搜索到的文章
$(".search-ipt").on("input",function() {
    $(".search-bottom").css("display","none")
    if($(".search-ipt").elements[0].value === '') {
        $(".main-SearchArticle-column").empty()
        $(".search-userBox").empty()
    }
})



// --------------------------------------------------------------
// 关注功能
// 点击未关注按钮，发送关注请求
function followSearchMyfans(fansId) {
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
        
    }).catch((res) => {
        console.log(res);
    })
}


// 取消关注
function cancleFollowSearchMyfans(fansId) {
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
        
    }).catch((res) => {
        console.log(res);
    })
}

$(".search").on("click",function(e) {
    let target = e.target;
    if(target.classList.contains("search-starBtn")) {
        if(target.parentNode.children[3].innerHTML === '未关注') {
            followSearchMyfans(target.parentNode.children[0].getAttribute("userId"))
            // 发送请求判断是改成互相关注还是已关注
            $(".search-userBox").empty()
            RenderSearchUser()
            alert("关注成功！")
        } else {
            cancleFollowSearchMyfans(target.parentNode.children[0].getAttribute("userId"))
            // 发送后改变当前样式
            $(".search-userBox").empty()
            RenderSearchUser()
            alert("取消关注成功！")
        }
    }
})

// -----------------------------------------------------------
// 点击用户头像进入他的主页
$(".search").on("click",function(e) {
    let target = e.target
    // 点击到作者头像
    if(target.parentNode.classList.contains("search-avatar")) {
        // 跳转到作者的主页
        jumpL("person-center")
        localStorage.setItem("searchUserback","searchUserback")
        // 为粉丝加上一个自定义属性用来表示渲染哪一个人
        $(".search").attr("TheRenderId",target.parentNode.getAttribute("userId"))
        // 在第一次跳转的时候渲染下方我的文章和个人信息
        renderMybaseInfo(target.parentNode.getAttribute("userId"));
        renderPCfollow(target.parentNode.getAttribute("userId"))
        // ------------------
        // 重新渲染一下
        rerender("search")
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



















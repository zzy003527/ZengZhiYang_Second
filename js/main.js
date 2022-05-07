// 这是主页面main的js



// ----------------------------------------------------
// 点击+跳转到writePage发文章页面
$(".main-article").on("click",() => {
    jumpL("writePage");
    $(".main-bottom").css("display","none")
})

// 点击搜索跳转到search搜索页面
$(".main-search").on("click",function() {
    jumpL("search");
    $(".main-bottom").css("display","none")
})


// -----------------------------------------------------------------------
// 获取个人信息并渲染页面
function renderMybaseInfo(userId) {
    $().ajax({
        type: "GET",
        url: "http://175.178.193.182:8080/user/baseInfo",
        data: {
            userId: userId
        }
    }).then((res) => {
        $(".personal-username").html(res.user.nickname)
        $(".personal-avator").find("img").attr("src",res.user.avatar)
    }).catch((res) => {
        console.log(res);
    })
}
// 根据作者id获取文章(渲染到个人中心的我的文章上面)
function rendermyAriticle(userId) {
    var userId = userId
    $().ajax({
        type: "GET",
        url: "http://175.178.193.182:8080/article/byAuthor",
        data: {
            authorId: userId
        }
    }).then((res) => {
        console.log(res);
        for(let i = 0;i < res.articles.length;i++) {           
            if(compareHeight("myArticle") === 'left') {
                mainBoxLeftAdd("myArticle",i,res.articles[i])
            } else {
                mainBoxRightAdd("myArticle",i,res.articles[i]) 
            }
        }
    }).catch((res) => {
        console.log(res);
    })
}
// ---------------------------------------------------------------
// 获取当前用户信息，渲染关注数，粉丝数和点赞与收藏数
function renderPCfollow(userId) {
    $().ajax({
        type: "GET",
        url: "http://175.178.193.182:8080/user/fullInfo",
        data: {
            userId: userId
        }
    }).then((res) => {
        // 渲染关注数
        if(res.user.follows.length == 0) {
            $(".follow-quantity").html('0')
        } else {
            $(".follow-quantity").html(res.user.follows.length)
        }
        // 渲染粉丝数
        if(res.user.fans.length == 0) {
            $(".fans-quantity").html('0')
        } else {
            $(".fans-quantity").html(res.user.fans.length)
        }
        // 渲染获赞和收藏数
        if(res.user.likedArticles.length + res.user.staredArticles.length === 0) {
            $(".likeAndcollect-quantity").html("0")
        } else {
            $(".likeAndcollect-quantity").html(res.user.likedArticles.length + res.user.staredArticles.length)
        }
        
    }).catch((res) => {
        console.log(res);
    })
}


// 点击个人中心跳转到个人中心
var myArticleFlag = 0;
$(".To-person-center").on("click",function() {
    $(".main-myArticle-column-left").css("display","block")
    jump("person-center");
    // 此处因为跳转到个人中心时，首页还是紫色的所以给它消了
    $(".main-bottom-tab").get(0).removeClass("main-tab-current")
    $(".main-bottom-tab").get(0).children(".main-tab-word").removeClass("main-tab-current")
    
    // 在第一次跳转的时候渲染下方我的文章和个人信息
    renderMybaseInfo(localStorage.getItem("userId"));
    renderPCfollow(localStorage.getItem("userId"))
    if(myArticleFlag === 0) {
        rendermyAriticle(localStorage.getItem("userId"))
        myArticleFlag++;
    }
    // 从点击头像的个人主页出来后，我的文章已经被改变，要重新渲染
    if($(".main-myArticle-column-left").elements.length === 1) {
        $(".main-myArticle-column").empty()
        $(".main-myArticle-column-left").remove()
        var myArticleLeftbox = $("<div></div>")
        myArticleLeftbox.addClass("main-column").addClass("main-myArticle-column-left").addClass("main-column-left").addClass("main-myArticle-column")
        $(".main-myArticle-column-right").before(myArticleLeftbox)
        rendermyAriticle(localStorage.getItem("userId"));
    }

    if($(".main-myCollect-column-left").elements.length === 1) {
        $(".main-myCollect-column").empty()
        $(".main-myCollect-column-left").remove()
        var myCollectLeftbox = $("<div></div>")
        myCollectLeftbox.addClass("main-column").addClass("main-myCollect-column-left").addClass("main-column-left").addClass("main-myCollect-column")
        $(".main-myCollect-column-right").before(myCollectLeftbox)
        renderMyCollect(localStorage.getItem("userId"));
    }

    if($(".main-myLiked-column-left").elements.length === 1) {
        $(".main-myLiked-column").empty()
        $(".main-myLiked-column-left").remove()
        var myLikedLeftbox = $("<div></div>")
        myLikedLeftbox.addClass("main-column").addClass("main-myLiked-column-left").addClass("main-column-left").addClass("main-myLiked-column")
        $(".main-myLiked-column-right").before(myLikedLeftbox)
        renderMyLiked(localStorage.getItem("userId"));
    }
    // 在之后检查是否有文章(此处因为列盒子内部的文章盒子是动态添加的，我获取不到它的length，所以在退出登录的时候把左列盒子给删了，这里判断的是左列盒子是否存在，若没有，则重新渲染
    // 在检查之前要保证收藏文章和赞过的文章不存在

    // 那就顺便重新渲染一下收藏和赞过的和我的文章吧（因为进到了别人的主页）
    if($(".person-note-btn").elements[0].classList.contains("person-btntwo-current")) {
        if($(".main-myArticle-column-left").elements.length === 0) {
            var myArticleLeftbox = $("<div></div>")
            myArticleLeftbox.addClass("main-column").addClass("main-myArticle-column-left").addClass("main-column-left").addClass("main-myArticle-column")
            $(".main-myArticle-column-right").before(myArticleLeftbox)
            // 如果是从头像点进来的，那就渲染头像的id，如果不是，那么attr自定义属性是null，渲染当前用户的
            if($(".person-center").attr("TheRenderId") !== null) {
                rendermyAriticle($(".person-center").attr("TheRenderId"));
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
            if($(".person-center").attr("TheRenderId") !== null) {
                renderMyCollect($(".person-center").attr("TheRenderId"));
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
            if($(".person-center").attr("TheRenderId") !== null) {
                renderMyLiked($(".person-center").attr("TheRenderId"));
            } else {
                renderMyLiked(localStorage.getItem("userId"));
            } 
        }
    }
    
})


// ------------------------------------------------------------
// 点击我的消息跳转到我的消息
$(".To-mynews").on("click",function() {
    $(".main-myArticle-column-left").css("display","block")
    jump("MyMessage");
    // 此处因为跳转到个人中心时，首页还是紫色的所以给它消了
    $(".main-bottom-tab").get(0).removeClass("main-tab-current")
    $(".main-bottom-tab").get(0).children(".main-tab-word").removeClass("main-tab-current")
})











// ---------------------------------------------------------
// 为顶部tab栏添加点击切换样式效果
$(".main-top-tab").on("click",function() {
    var index = 0;
    for(let i = 0;i < $(".main-top-tab").elements.length;i++) {
        if(this === $(".main-top-tab").elements[i]) {
            index = i;
        }
    }
    // 在没有current的时候再加上去，否则将会叠加
    if($(".main-top-tab").get(index).elements[0].classList.contains("tab-current") !== true) {
        $(".main-top-tab").get(index).addClass("tab-current")
    }
    $(".main-top-tab").get(index).siblings(".main-top-tab").removeClass("tab-current")
})



// 为底部切换tab栏添加点击切换样式效果
function bottomTab() {
    $(".main-bottom-tab").on("click",function() {
        var index = 0;
        for(let i = 0;i < $(".main-bottom-tab").elements.length;i++) {
            if(this === $(".main-bottom-tab").elements[i]) {
                index = i;
            }
        }
        // 在没有current的时候再加上去，否则将会叠加
        if($(".main-bottom-tab").get(index).elements[0].classList.contains("main-tab-current") !== true && $(".main-bottom-tab").get(index).children(".main-tab-word").elements[0].classList.contains("main-tab-current") !== true) {
            $(".main-bottom-tab").get(index).addClass("main-tab-current")
            $(".main-bottom-tab").get(index).children(".main-tab-word").addClass("main-tab-current")
        }
        $(".main-bottom-tab").get(index).siblings(".main-bottom-tab").removeClass("main-tab-current")
        $(".main-bottom-tab").get(index).siblings(".main-bottom-tab").children(".main-tab-word").removeClass("main-tab-current")
    })
}
bottomTab()




// -----------------------------------------------------
// 获取用户完整信息(用在主页创建文档碎片)
function getUserfullInfo(authorId,avatarbox,nicknamebox) {
    $().ajax({
        type: "GET",
        url: "http://175.178.193.182:8080/user/fullInfo",
        data: {
            userId: authorId
        }
    }).then((res) => {
        avatarbox.attr("src",res.user.avatar)
        nicknamebox.html(res.user.nickname)
    }).catch((res) => {
        console.log(res);
    })
}
// 创建文档碎片
function createbox(data) {
    var likes = data.likes;
    var title = data.title;

    var frag = document.createDocumentFragment();
    var img = $("<img/>")
    if(data.images.length !== 0) {
        img.attr("src",data.images[0])
        frag.appendChild(img.elements[0])
    }
    
    // 在标题为空的时候渲染不出来，所以要判断标题是否存在
    var mcb = $("<div></div>").addClass("main-column-boxtitle")
    if(title) {
        mcb.html(title)
    } else {
        mcb.html("")
    }
   
    var imga = $("<img/>")
    var mca = $("<div></div>").addClass("main-column-avator").append(imga)
    var mcn = $("<div></div>").addClass("main-column-nickname")

    var heart = $("<div></div>").addClass("heart").addClass("iconfont").html("&#xe8ab;")
    // 如果检测到该文章的点赞者有user，则将其颜色改为红色
    let userId =localStorage.getItem("userId")
    for(let i = 0;i < data.likerList.length;i++) {
        if(data.likerList[i] == userId) {
            heart.html("&#xe60d;")
            heart.css("color","red")
            break;
        } else {
            heart.html("&#xe8ab;")
            heart.css("color","black")
        }
    }
    
    
    var clnum = $("<div></div>").addClass("column-likenum")
    if(likes === 0) {
        clnum.html("0")
    } else {
        clnum.html(likes)
    }
    var mcl = $("<div></div>").addClass("main-column-like").append(heart).append(clnum)
    var div = $("<div></div>").addClass("main-column-bottom").append(mcb).append(mca).append(mcn).append(mcl)
    getUserfullInfo(data.authorId,imga,mcn)

    frag.appendChild(div.elements[0])
    return frag;
}


// 比较左右两列盒子高度,返回较短的盒子
function compareHeight(theBox) {
    var boxleft = ".main-"+ theBox +"-column-left"
    var boxright = ".main-"+ theBox +"-column-right"
    // console.log('releft' + $(boxleft).elements[0].clientHeight);
    // console.log('reright' + $(boxright).elements[0].clientHeight);
    if($(boxleft).elements[0].clientHeight <= $(boxright).elements[0].clientHeight) {
        return 'left';
    } else {
        return 'right';
    }
}



// 目标主页盒子左侧添加盒子
// name为主盒子名字，i为index的值，data为要传入的渲染的数据
function mainBoxLeftAdd(name,i,data) {
    let boxnameleft = ".main-" + name + "-column-left";
    
    let frag = createbox(data)
    let div = $("<div></div>").addClass("main-column-box").attr("index",i).attr("articleId",data.articleId)
    
    div.elements[0].appendChild(frag)
    
    $(boxnameleft).append(div)
}


// 目标主页盒子右侧添加盒子
function mainBoxRightAdd(name,i,data) {
    let boxnameright = ".main-" + name + "-column-right";
    let frag = createbox(data)
    let div = $("<div></div>").addClass("main-column-box").attr("index",i).attr("articleId",data.articleId)
    div.elements[0].appendChild(frag)
    $(boxnameright).append(div)

}





// ------------------------------------------------------
// 渲染页面
// ---------------------------------------------------------
// 渲染推荐页面

// 比较左右两列盒子高度,返回较短的盒子
function compareRecommendHeight() {
    var boxleft = ".main-recommend-column-left"
    var boxright = ".main-recommend-column-right"
    if($(boxleft).elements[0].clientHeight <= $(boxright).elements[0].clientHeight+20) {
        return 'left';
    } else {
        return 'right';
    }
}


function renderrecommend() {
    $().ajax({
        type: "GET",
        url: "http://175.178.193.182:8080/article/getHomePage"
    }).then((res) => {
        for(let i = 0;i < res.pages.推荐.length;i++) {           
            if(compareRecommendHeight() === 'left') {
                mainBoxLeftAdd("recommend",i,res.pages.推荐[i])
            } else {
                mainBoxRightAdd("recommend",i,res.pages.推荐[i]) 
            }
        }
    }).catch((res) => {
        console.log(res);
    })
}
//----------------------------------------------------------------------------
// 渲染旅行页面
// 创建文档碎片
function createtravelbox(data) {
    var likes = data.likes
    var frag = document.createDocumentFragment();
    var img = $("<img/>")
    if(data.images.length !== 0) {
        img.attr("src",data.images[0])
        frag.appendChild(img.elements[0])
    }

    var mcb = $("<div></div>").addClass("main-column-boxtitle").html(data.title)

    var imga = $("<img/>")
    var mca = $("<div></div>").addClass("main-column-avator").append(imga)
    var mcn = $("<div></div>").addClass("main-column-nickname")
    var heart = $("<div></div>").addClass("heart").addClass("iconfont").html("&#xe8ab;")
    // 如果检测到该文章的点赞者有user，则将其颜色改为红色
    let userId =localStorage.getItem("userId")
    for(let i = 0;i < data.likerList.length;i++) {
        if(data.likerList[i] == userId) {
            heart.html("&#xe60d;")
            heart.css("color","red")
            break;
        } else {
            heart.html("&#xe8ab;")
            heart.css("color","black")
        }
    }
    
    var clnum = $("<div></div>").addClass("column-likenum")
    // 这里在渲染的时候如果赞为0就渲染不出来，所以这样判断设置
    if(likes === 0) {
        clnum.html("0")
    } else {
        clnum.html(likes)
    }
    var mcl = $("<div></div>").addClass("main-column-like").append(heart).append(clnum)
    
    
    var div = $("<div></div>").addClass("main-column-bottom").append(mcb).append(mca).append(mcn).append(mcl)
    getUserfullInfo(data.authorId,imga,mcn)
    
    frag.appendChild(div.elements[0])
    
    return frag;
}

// 目标主页盒子左侧添加盒子
// name为主盒子名字，i为index的值，data为要传入的渲染的数据
function maintravelBoxLeftAdd(name,i,data) {
    let boxnameleft = ".main-" + name + "-column-left";
    
    let frag = createtravelbox(data)
    let div = $("<div></div>").addClass("main-column-box").attr("index",i).attr("articleId",data.articleId)
    div.elements[0].appendChild(frag)
    $(boxnameleft).append(div)
}


// 目标主页盒子右侧添加盒子
function maintravelBoxRightAdd(name,i,data) {
    let boxnameright = ".main-" + name + "-column-right";
    let frag = createtravelbox(data)
    let div = $("<div></div>").addClass("main-column-box").attr("index",i).attr("articleId",data.articleId)
    div.elements[0].appendChild(frag)
    $(boxnameright).append(div)
}


// 比较左右两列盒子高度,返回较短的盒子
function comparetravelHeight() {
    var boxleft = ".main-travel-column-left"
    var boxright = ".main-travel-column-right"
    // console.log('left' + $(boxleft).elements[0].clientHeight);
    // console.log('right' + $(boxright).elements[0].clientHeight);
    if($(boxleft).elements[0].clientHeight <= $(boxright).elements[0].clientHeight+20) {
        return 'left';
    } else {
        return 'right';
    }
}
// 渲染旅行页面
function rendertravel() {
    $().ajax({
        type: "GET",
        url: "http://175.178.193.182:8080/article/getHomePage"
    }).then((res) => {
        for(let i = 0;i < res.pages.旅行.length;i++) {           
            if(comparetravelHeight() === 'left') {
                maintravelBoxLeftAdd("travel",i,res.pages.旅行[i])
            } else {
                maintravelBoxRightAdd("travel",i,res.pages.旅行[i]) 
            }
        }
    }).catch((res) => {
        console.log(res);
    })
}

// rendertravel()

// -------------------------------------------------------
// 渲染美食页面
function renderfood() {
    $().ajax({
        type: "GET",
        url: "http://175.178.193.182:8080/article/getHomePage"
    }).then((res) => {
        for(let i = 0;i < res.pages.美食.length;i++) {           
            if(compareHeight("food") === 'left') {
                mainBoxLeftAdd("food",i,res.pages.美食[i])
            } else {
                mainBoxRightAdd("food",i,res.pages.美食[i]) 
            }
        }
    }).catch((res) => {
        console.log(res);
    })
}
// renderfood()

// -----------------------------------------------------
// 渲染时尚页面
function renderfashion() {
    $().ajax({
        type: "GET",
        url: "http://175.178.193.182:8080/article/getHomePage"
    }).then((res) => {
        for(let i = 0;i < res.pages.时尚.length;i++) {           
            if(compareHeight("fashion") === 'left') {
                mainBoxLeftAdd("fashion",i,res.pages.时尚[i])
            } else {
                mainBoxRightAdd("fashion",i,res.pages.时尚[i]) 
            }
        }
    }).catch((res) => {
        console.log(res);
    })
}
// renderfashion()

// -----------------------------------------------------
// 渲染彩妆页面
// 比较左右两列盒子高度,返回较短的盒子
function compareMakeupHeight(theBox) {
    var boxleft = ".main-"+ theBox +"-column-left"
    var boxright = ".main-"+ theBox +"-column-right"
    if($(boxleft).elements[0].clientHeight-1 <= $(boxright).elements[0].clientHeight) {
        return 'left';
    } else {
        return 'right';
    }
}

function rendermakeup() {
    $().ajax({
        type: "GET",
        url: "http://175.178.193.182:8080/article/getHomePage"
    }).then((res) => {
        for(let i = 0;i < res.pages.彩妆.length;i++) {           
            if(compareMakeupHeight("makeup") === 'left') {
                mainBoxLeftAdd("makeup",i,res.pages.彩妆[i])
            } else {
                mainBoxRightAdd("makeup",i,res.pages.彩妆[i]) 
            }
        }
    }).catch((res) => {
        console.log(res);
    })
}
// rendermakeup()

// -----------------------------------------------------
// 渲染高效页面
// 比较左右两列盒子高度,返回较短的盒子
function compareEfficientHeight(theBox) {
    var boxleft = ".main-"+ theBox +"-column-left"
    var boxright = ".main-"+ theBox +"-column-right"
    if($(boxleft).elements[0].clientHeight <= $(boxright).elements[0].clientHeight+250) {
        return 'left';
    } else {
        return 'right';
    }
}


function renderefficient() {
    $().ajax({
        type: "GET",
        url: "http://175.178.193.182:8080/article/getHomePage"
    }).then((res) => {
        for(let i = 0;i < res.pages.高效.length;i++) {           
            if(compareEfficientHeight("efficient") === 'left') {
                mainBoxLeftAdd("efficient",i,res.pages.高效[i])
            } else {
                mainBoxRightAdd("efficient",i,res.pages.高效[i]) 
            }
        }
    }).catch((res) => {
        console.log(res);
    })
}
// renderefficient()

// -----------------------------------------------------
// 渲染护肤页面
function renderskincare() {
    $().ajax({
        type: "GET",
        url: "http://175.178.193.182:8080/article/getHomePage"
    }).then((res) => {
        for(let i = 0;i < res.pages.护肤.length;i++) {           
            if(compareHeight("skincare") === 'left') {
                mainBoxLeftAdd("skincare",i,res.pages.护肤[i])
            } else {
                mainBoxRightAdd("skincare",i,res.pages.护肤[i]) 
            }
        }
    }).catch((res) => {
        console.log(res);
    })
}
// renderskincare()




// -----------------------------------------------
// 切换主页上方tag盒子
// 让主页渲染盒子出现
function mainBoxBlock(name) {
    let boxnameleft = ".main-" + name + "-column-left";
    $(boxnameleft).css("display","block")
    let boxnameright = ".main-" + name + "-column-right";
    $(boxnameright).css("display","block")
}

let r = 0,t = 0,fo = 0,fa = 0,m = 0,e = 0,s = 0
$(".main-top-tab").on("click",function() {
    var index = 0;
    for(let i = 0;i < $(".main-top-tab").elements.length;i++) {
        if(this === $(".main-top-tab").elements[i]) {
            index = i;
        }
    }
    var name = $(".main-top-tab").get(index).attr("tab");
    $(".main-column").css("display",'none');
    mainBoxBlock(name);
    if(name === 'travel' && t === 0) {
        rendertravel()
        t+=1
    } else if(name === 'food' && fo === 0) {
        renderfood()
        fo+=1
    } else if(name === 'fashion' && fa === 0) {
        renderfashion();
        fa+=1
    } else if(name=== 'makeup' && m === 0) {
        rendermakeup()
        m+=1
    } else if(name === 'efficient' && e === 0) {
        renderefficient()
        e+=1
    } else if(name === 'skincare' && s === 0) {
        renderskincare()
        s+=1
    }
})


// ----------------------------------------------------
// 点赞功能实现(新添加的元素要用事件委托)
// 发送点赞请求
function Likes(userId,articleId) {
    // 准备数据
    let fd = new FormData()
    fd.append("articleId",articleId)
    fd.append("userId",userId)
    $().ajax({
        type: "POST",
        url: "http://175.178.193.182:8080/article/like",
        data: fd
    }).then((res) => {
        
    }).catch((res) => {
        console.log(res);
    })
}


// 点击取消点赞
function LikesCancle(userId,articleId) {
    // 准备数据
    let fd = new FormData()
    fd.append("articleId",articleId)
    fd.append("userId",userId)
    $().ajax({
        type: "POST",
        url: "http://175.178.193.182:8080/article/unlike",
        data: fd
    }).then((res) => {
        
    }).catch((res) => {
        console.log(res);
    })
}


function TheLikesBox(theBox) {
    var theBoxName = ".main-"+ theBox +"-column"
    $(theBoxName).on("click",function(e) {
        let target = e.target
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
}
TheLikesBox("recommend")
TheLikesBox("travel")
TheLikesBox("food")
TheLikesBox("fashion")
TheLikesBox("makeup")
TheLikesBox("efficient")
TheLikesBox("skincare")
// TheLikesBox("myArticle")

// --------------------------------------------------------------------
// 点击每一篇文章，进入文章详情
$(".main-column").on("click",function(e) {
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
})































































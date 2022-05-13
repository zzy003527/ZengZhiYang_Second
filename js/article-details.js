// 文章详情页面的js

// 点击返回按钮回到主页
$(".article-details-back").on("click",function() {
    // 将删除按钮隐藏
    $(".article-details-deleteBtn").css("display","none")
    // 如果返回search的存储存在，那就返回search，否则再返回别的
    if(localStorage.getItem("searchArticle")) {
        jumpL("search")
        // 重新渲染一下（更新点赞数）
        $(".main-SearchArticle-column").empty()
        RenderSearchArticle()
        localStorage.removeItem("searchArticle")
    } else {
        jump(localStorage.getItem("prePage"))
        if(localStorage.getItem("nowPage") === 'main') {
            // 既然返回首页了那就把下方篮子的首页变紫色吧
            $(".main-bottom").css("display","block")
            $(".main-bottom-tab").removeClass("main-tab-current");
            $(".main-bottom-tab").children(".main-tab-word").removeClass("main-tab-current")
            $(".main-bottom-tab").get(0).addClass("main-tab-current")
            $(".main-bottom-tab").get(0).children(".main-tab-word").addClass("main-tab-current")
        } else if (localStorage.getItem("nowPage") === 'person-center') {
            // 既然返回个人中心了那就把下方篮子的个人中心变紫色吧
            $(".main-bottom").css("display","block")
            $(".main-bottom-tab").removeClass("main-tab-current");
            $(".main-bottom-tab").children(".main-tab-word").removeClass("main-tab-current")
            $(".main-bottom-tab").get(2).addClass("main-tab-current")
            $(".main-bottom-tab").get(2).children(".main-tab-word").addClass("main-tab-current")
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
        } else if (localStorage.getItem("nowPage") === 'belikedAndcollected-Page') {
            $(".main-bottom").css("display","none")
        }
    }

    
    localStorage.removeItem("articleId")
    localStorage.removeItem("authorId")
    // 出去时清空评论区
    $(".article-details-FirstCommentBoxFather").remove()
    // 出去时也要清空轮播图和小圆点，要不然图片会越攒越多
    $(".article-details-rotatemapul").empty()
    $(".article-details-circleul").empty()
    // 回来的时候重新渲染一下头像（因为如果进入了他人的主页这玩意会变了，所以要给它改回去）
    renderMybaseInfo(localStorage.getItem("userId"));
    renderPCfollow(localStorage.getItem("userId"))
})



// ----------------------------------------------------------------
// 获取评论者id渲染评论
function renderCommenterfullInfo(commenterId,avatarbox,nicknamebox) {
    $().ajax({
        type: "GET",
        url: "http://175.178.193.182:8080/user/fullInfo",
        data: {
            userId: commenterId
        }
    }).then((res) => {
        avatarbox.attr("src",res.user.avatar)
        nicknamebox.html(res.user.nickname)
    }).catch((res) => {
        console.log(res);
    })
}


// 根据评论个数创建评论盒子（文档碎片）
function CreateFirstCommentBox(data) {
    console.log(data);
    var frag = document.createDocumentFragment();

    // 头像
    var Favatar = $("<div></div>").addClass("FirstComment-avatar")
    var img = $("<img/>")
    
    // 昵称
    var Fnickname = $("<div></div>").addClass("FirstComment-nickname")
    // 渲染头像和昵称
    renderCommenterfullInfo(data.authorId,img,Fnickname)
    Favatar.append(img)
    
    // 内容
    var Fcontent = $("<div></div>").addClass("FirstComment-content").html(data.content)

    // 日期
    var Fdate = $("<div></div>").addClass("FirstComment-date").html(data.postDate.slice(5,10))
    // 点赞按钮
    var Flikesbtn = $("<div></div>").addClass("FirstComment-LikesBtn").addClass("iconfont").html("&#xe8ab;")
    // 检测该评论的点赞这有user，则将其颜色改为红色
    let userId =localStorage.getItem("userId")
    if(data.likerList !== undefined) {
        for(let i = 0;i < data.likerList.length;i++) {
            if(data.likerList[i] === userId) {
                Flikesbtn.html("&#xe60d;")
                Flikesbtn.css("color","red")
                break;
            } else {
                Flikesbtn.html("&#xe8ab;")
                Flikesbtn.css("color","black")
            }
        }
    }
    // 点赞数
    var Flikesnum = $("<div></div>").addClass("FirstComment-LikesNum")
    if(data.likes === 0) {
        Flikesnum.html("0")
    } else {
        Flikesnum.html(data.likes)
    }

      // 一级评论盒子
      var FcommentBox = $("<div></div>").addClass("article-details-FirstCommentBox").append(Favatar).append(Fnickname).append(Fcontent).append(Fdate).append(Flikesbtn).append(Flikesnum).attr("reviewId",data.reviewId).attr("userId",data.replyToUserId)

    // 删除按钮(检测到评论者是自己才能删除评论)
    if(data.authorId == userId) {
        var Fdelete = $("<div></div>").addClass("FirstComment-Delete").html("删除")
        FcommentBox.append(Fdelete)
    }
    
    
  

    // -----------------------------------
    // 二级评论父盒子
    var ScommentBox = $("<div></div>").addClass("article-details-SecondCommentBoxFather")

    // 如果评论存在二级评论，则创建二级评论文档碎片
    if(data.reviewList.length !== 0) {
        let frags = document.createDocumentFragment();
        for(let i = 0;i < data.reviewList.length;i++) {
            // 头像
            let Savatar = $("<div></div>").addClass("SecondComment-avatar")
            let img1 = $("<img/>")
            
            // 昵称
            let Snickname = $("<div></div>").addClass("SecondComment-nickname")
            // 渲染头像和昵称
            renderCommenterfullInfo(data.reviewList[i].authorId,img1,Snickname)
            Savatar.append(img1)
            
            // 内容
            let p1 = $("<p></p>").addClass("SecondComment-content").html(data.reviewList[i].content)
            let p2 = $("<p></p>").addClass("SecondComment-date").html(data.reviewList[i].postDate.slice(5,10))
            let Scontent = $("<div></div>").addClass("SecondComment-contentBox").append(p1).append(p2)
            // 点赞按钮
            let Slikesbtn = $("<div></div>").addClass("SecondComment-LikesBtn").addClass("iconfont").html("&#xe8ab;")
            if(data.reviewList[i].likerList.length !== 0) {
                for(let j = 0;j < data.reviewList[i].likerList.length;j++) {
                    if(data.reviewList[i].likerList[j] == userId) {
                        Slikesbtn.html("&#xe60d;")
                        Slikesbtn.css("color","red")
                        break;
                    } else {
                        Slikesbtn.html("&#xe8ab;")
                        Slikesbtn.css("color","black")
                    }
                }
            }
            // 点赞数量
            let Slikesnum = $("<div></div>").addClass("SecondComment-LikesNum")
            if(data.reviewList[i].likes === 0) {
                Slikesnum.html("0")
            } else {
                Slikesnum.html(data.reviewList[i].likes)
            }

            // 每个二级评论
            let SecondCommenteve = $("<div></div>").addClass("article-details-SecondCommentBox").append(Savatar).append(Snickname).append(Scontent).append(Slikesbtn).append(Slikesnum).attr("reviewId",data.reviewList[i].reviewId).attr("userId",data.reviewList[i].replyToUserId)

            // 删除按钮(看是否该评论由当前用户发布，若是，则可以删除)
            if(data.reviewList[i].authorId == userId) {
                var Sdelete = $("<div></div>").addClass("SecondComment-Delete").html("删除")
                SecondCommenteve.append(Sdelete)
            }
            frags.appendChild(SecondCommenteve.elements[0])
        }
        ScommentBox.elements[0].append(frags)
        

    }


    frag.appendChild(FcommentBox.elements[0])
    frag.appendChild(ScommentBox.elements[0])
    return frag;
}



// -----------------------------

// 获取评论渲染页面
function renderDetailsComment(articleId) {

    // 准备数据
    // let articleId = localStorage.getItem("articleId")
    let pages = 0
    $().ajax({
        type: "GET",
        url: "http://175.178.193.182:8080/review/byArticle",
        data: {
            articleId: articleId,
            pages: pages
        }
    }).then((res) => {
        console.log(res);
        // 循环渲染一级评论
        if(res.reviews !== undefined) {
            for(let i = 0;i < res.reviews.length;i++) {
                // 创建一个评论的父盒子
                let commentFather = $("<div></div>").addClass("article-details-FirstCommentBoxFather")
                let frag = CreateFirstCommentBox(res.reviews[i])
                commentFather.elements[0].append(frag)
                $(".article-details-commentBox").children(".article-details-CommentEnd").before(commentFather)
            }
        }
    }).catch((res) => {
        console.log(res);
    })
}
// renderDetailsComment(110)




// ---------------------------------------------------------------
// 轮播图的封装函数
function animate(rotateul,distance,callback) {
    rotateul.style.transform = `translateX(${distance}px)`;
}

// 此处封装轮播图函数
//arrowl 左箭头  arrowr 右箭头  slider1width 位移距离   imagesLength:li的个数
//rotateul:轮播图ul     circleul：小圆点ul    rotateulBox：轮播图ul的显示区域
function rotatemap(slider1width,rotateul,circleul,rotateulBox,arrowl,arrowr,imagesLength){
    //内部封装小圆点移动函数
        function circleChange() {
        //排他思想
        for(var i = 0; i < circleul.children.length;i++)
        {
            circleul.children[i].className = '';
        }
      circleul.children[circle].className = 'current';
    }

    // 动态生成小圆圈，有几张图片，就生成几个小圆圈
    for(var i=0;i<imagesLength;i++){
        //创建一个小li，把li插入circleul
        var li=document.createElement('li');
        //记录当前小圆圈索引号，通过自定义属性来做
        li.setAttribute('index',i);
        circleul.appendChild(li);
        circleul.children[0].className='current';
        li.addEventListener('click',function(){
            for(var i=0;i<circleul.children.length;i++){
                circleul.children[i].className=' ';
            }
            this.className='current';
            //点击小圆圈，移动图片，移动的是ul
            //ul的移动距离：小圆圈的索引号乘以图片的宽度（注意是负值）
            //当点击某个li，得到当前li的索引号
            var index=this.getAttribute('index');
            //当点击了某个li，就把这个li的索引号给num
            num = index;
            //当点击了某个li，就把这个li的索引号给circle
            circle = index;
            animate(rotateul,-index*slider1width);
        })
    }
    var num=0;
    // circle控制小圆圈的播放
    var circle=0;
    // 设置节流阀
    // var flag = true;
    arrowr.addEventListener('click',function(){
        // if(flag) {
            // flag = false;
            //如果走到最后复制的图片，此时ul要变为left=0
            if(num==rotateul.children.length - 1){
                // rotateul.style.left=0;
                animate(rotateul,0)
                num=0;
            }
            num++;
            animate(rotateul,-num*(slider1width));
            rotateul.addEventListener("transitionend",function() {
                flag = true;
            })
            // 点击右侧按钮，小圆圈跟随一起变化，circle控制小圆点变化
            circle++;
            //如果circle == 圆圈数，说明走到最后图片了，就复原为0
            if(circle == circleul.children.length) {
                circle=0;
            }
            circleChange();
        // }
        
    })


    arrowl.addEventListener('click',function(){
            if(num==0){
                num=rotateul.children.length-1;
                animate(rotateul,-num*(slider1width))
                rotateul.offsetWidth;
            }
            num--;
            animate(rotateul,-num*slider1width);
            circle--;
             //如果circle<0，说明走到第一张图片了，就改为最后一个小圆圈
            circle = circle < 0 ? circleul.children.length - 1 : circle;
            circleChange();
        })
    //自动播放轮播图
    // var timer = setInterval(function(){
    //     arrowr.click();
    // },5000);
 }

// --------------------------------
//根据图片数量插入li
// images是一个数组

function insertRotatemapLi(images) {
    for(let i = 0;i < images.length;i++) {
        let li = $("<li></li>");
        let img = $("<img/>")
        img.attr("src",images[i])
        li.append(img)
        $(".article-details-rotatemapul").append(li)
    }
}


// 获取当前用户信息渲染头像
function renderUserAvatar() {
    let userId = localStorage.getItem("userId")
    $().ajax({
        type: "GET",
        url: "http://175.178.193.182:8080/user/baseInfo",
        data: {
            userId: userId
        }
    }).then((res) => {
        $(".article-details-userAvatar").find("img").attr("src",res.user.avatar)
    }).catch((res) => {
        console.log(res);
    })
}
// renderUserAvatar()


// --------------------------------------------------------------------------
// 获取文章主人信息并渲染页面
function renderPageUserBaseInfo(userId) {
    $().ajax({
        type: "GET",
        url: "http://175.178.193.182:8080/user/baseInfo",
        data: {
            userId: userId
        }
    }).then((res) => {
        $(".article-details-avatar").attr("userId",res.user.userId)
        $(".article-details-avatar").find("img").attr("src",res.user.avatar)
        $(".article-details-nickname").html(res.user.nickname)
    }).catch((res) => {
        console.log(res);
    })
}
// 获取文章主人详细信息(是否关注)
function renderPageUserfullInfo(PageAuthorId) {
    $().ajax({
        type: "GET",
        url: "http://175.178.193.182:8080/user/fullInfo",
        data: {
            userId: PageAuthorId
        }
    }).then((res) => {
        let userId1 = localStorage.getItem("userId")
        for(let i = 0;i < res.user.fans.length;i++) {
            if(res.user.fans[i] == userId1) {
                $(".article-details-followBtn").css("backgroundColor","white")
                $(".article-details-followBtn").html("已关注")
                break;
            } else {
                $(".article-details-followBtn").css("backgroundColor","orange")
                $(".article-details-followBtn").html("关注")
            }
        }
        console.log(res);
    }).catch((res) => {
        console.log(res);
    })
}


// 请求数据渲染页面
function renderArticleDetails(articleId) {
    $().ajax({
        type: "GET",
        url: "http://175.178.193.182:8080/article/byId",
        data: {
            articleId: articleId
        }
    }).then((res) => {
        console.log(res);
        // 渲染上方头像和用户名
        renderPageUserBaseInfo(res.article.authorId)
        // 渲染是否关注
        renderPageUserfullInfo(res.article.authorId)
        // 如果文章主人是自己，那么显示删除文章按钮
        if(res.article.authorId == localStorage.getItem("userId")) {
            $(".article-details-deleteBtn").css("display","block")
        }
        // 储存authodId和articleId供下方发送评论使用
        localStorage.setItem("articleId",articleId)
        localStorage.setItem("authorId",res.article.authorId)
        // 渲染下方轮播图
        insertRotatemapLi(res.article.images)
        rotatemap(435,$(".article-details-rotatemapul").elements[0],$(".article-details-circleul").elements[0],$(".article-details-rotatemapbox").elements[0],$(".article-details-rotateLeftBtn").elements[0],$(".article-details-rotateRightBtn").elements[0],res.article.images.length)
        // 渲染下方文章标题和内容和tag
        $(".article-details-title").html(res.article.title)
        $(".article-details-content").html(res.article.content)
        // 在此处动态设置评论框的top，以免因为content行数不同造成错位
        $(".article-details-commentBox").css("top",$(".article-details-bottomBox").elements[0].clientHeight + 385 + 'px')

        $(".article-details-Tag").html("#" + res.article.tags.join("#"))
        $(".article-details-date").html(res.article.postDate.slice(5,10))
        // 渲染下方点赞按钮
        // 如果检测到该文章的点赞者有user，则将其颜色改为红色
        let userId =localStorage.getItem("userId")
        for(let i = 0;i < res.article.likerList.length;i++) {
            if(res.article.likerList[i] === userId) {
                $(".article-details-Likes").html("&#xe60d;")
                $(".article-details-Likes").css("color","red")
                break;
            } else {
                $(".article-details-Likes").html("&#xe8ab;")
                $(".article-details-Likes").css("color","black")
            }
        }
        // 渲染点赞数
        if(res.article.likes === 0) {
            $(".article-details-LikeNum").html('0')
        } else {
            $(".article-details-LikeNum").html(res.article.likes)
        }

        // 渲染下方收藏按钮
        for(let i = 0;i < res.article.starerList.length;i++) {
            if(res.article.starerList[i] === userId) {
                $(".article-details-Collect").html("&#xe604;")
                $(".article-details-Collect").css("color","rgb(225, 166, 7)")
                break;
            } else {
                $(".article-details-Collect").html("&#xe601;")
                $(".article-details-Collect").css("color","black")
            }
        }
        // 渲染收藏数
        if(res.article.stars === 0) {
            $(".article-details-CollectNum").html('0')
        } else {
            $(".article-details-CollectNum").html(res.article.stars)
        }

        // 渲染评论数
        if(res.article.reviews === 0) {
            $(".article-details-CommentNum").html('0')
            $(".article-details-commentNum").html('共 0 条评论')
        } else {
            $(".article-details-CommentNum").html(res.article.reviews)
            $(".article-details-commentNum").html('共 ' + res.article.reviews + ' 条评论')
        }
    }).catch((res) => {
        console.log(res);
    })
}

// renderArticleDetails(110)

// ----------------------------------------------------------
// 点击关注按钮，关注文章作者
function followPageAuthor() {
    // 准备数据
    let userId = localStorage.getItem("userId")
    let followerId = localStorage.getItem("authorId")
    let fd = new FormData() 
    fd.append("userId",userId)
    fd.append("followerId",followerId)
    $().ajax({
        type: "POST",
        url: "http://175.178.193.182:8080/user/follow",
        data: fd
    }).then((res) => {
        $(".article-details-followBtn").css("backgroundColor","white")
        $(".article-details-followBtn").html("已关注")
        // 清空个人中心-我的关注，让其下次点进去可以有最新数据
        $(".follow-person-box").remove()
        $(".follow-person-Father").remove()
        // 清空个人中心-粉丝，刷新数据
        $(".fans-Father").empty()
        $(".fans-Father").remove()
        // 刷新个人中心的关注数量
        renderPCfollow(localStorage.getItem("userId"))

        alert(res.msg)
    }).catch((res) => {
        console.log(res);
    })
}

// 取消关注
function cancleFollowPageAuthor() {
    // 准备数据
    let userId = localStorage.getItem("userId")
    let followerId = localStorage.getItem("authorId")
    let fd = new FormData() 
    fd.append("userId",userId)
    fd.append("followerId",followerId)
    $().ajax({
        type: "POST",
        url: "http://175.178.193.182:8080/user/cancelFollow",
        data: fd
    }).then((res) => {
        $(".article-details-followBtn").css("backgroundColor","orange")
        $(".article-details-followBtn").html("关注")
        // 清空个人中心-我的关注，让其下次点进去可以有最新数据
        $(".follow-person-box").remove()
        $(".follow-person-Father").remove()
        // 清空个人中心-粉丝，刷新数据
        $(".fans-Father").empty()
        $(".fans-Father").remove()
        // 刷新个人中心的关注数量
        renderPCfollow(localStorage.getItem("userId"))
        
        alert(res.msg)
    }).catch((res) => {
        console.log(res);
    })
}


$(".article-details-followBtn").on("click",function() {
    if($(".article-details-followBtn").html() === '已关注') {
        cancleFollowPageAuthor();
    } else {
        followPageAuthor();
    }

})


// --------------------------------------------------------
// 发送文章点赞请求
function DetailsLikes(userId,articleId) {
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
function DetailsLikesCancle(userId,articleId) {
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
// 点击下方点赞按钮，点赞文章
$(".article-details-FixedBoxLikesBox").on("click",function() {
    let userId = localStorage.getItem("userId")
    let articleId = localStorage.getItem("articleId")
    // 如果爱心颜色为黑，发送点赞请求，如果为红，发送取消点赞请求
    if($(".article-details-Likes").css("color") === 'rgb(0, 0, 0)') {
        $(".article-details-Likes").html("&#xe60d;")
        $(".article-details-Likes").css("color","red")
        DetailsLikes(userId,articleId)
        // 将当前点赞数加一
        var nowlikes1 = parseInt($(".article-details-LikeNum").html()) + 1
        $(".article-details-LikeNum").html(nowlikes1)
    } else if ($(".article-details-Likes").css("color") === 'rgb(255, 0, 0)') {
        $(".article-details-Likes").html("&#xe8ab;")
        $(".article-details-Likes").css("color","black")
        DetailsLikesCancle(userId,articleId)
        // 将当前点赞数减一
        var nowlikes2 = parseInt($(".article-details-LikeNum").html()) - 1
        $(".article-details-LikeNum").html(nowlikes2.toString())
    }
})

// -----------------------------------------------------
// 发送文章收藏请求
// 发送收藏请求
function DetailsCollect(userId,articleId) {
    // 准备数据
    let fd = new FormData()
    fd.append("articleId",articleId)
    fd.append("userId",userId)
    $().ajax({
        type: "POST",
        url: "http://175.178.193.182:8080/article/star",
        data: fd
    }).then((res) => {

    }).catch((res) => {
        console.log(res);
    })
}


// 点击取消收藏
function DetailsCollectCancle(userId,articleId) {
    // 准备数据
    let fd = new FormData()
    fd.append("articleId",articleId)
    fd.append("userId",userId)
    $().ajax({
        type: "POST",
        url: "http://175.178.193.182:8080/article/unstar",
        data: fd
    }).then((res) => {

    }).catch((res) => {
        console.log(res);
    })
}

// 点击下方收藏按钮，收藏文章
$(".article-details-FixedBoxCollectBox").on("click",function() {
    let userId = localStorage.getItem("userId")
    let articleId = localStorage.getItem("articleId")
    // 如果星星颜色为黑，发送收藏请求，如果为黄，发送取消收藏请求
    if($(".article-details-Collect").css("color") === 'rgb(0, 0, 0)') {
        $(".article-details-Collect").html("&#xe604;")
        $(".article-details-Collect").css("color","rgb(225, 166, 7)")
        DetailsCollect(userId,articleId)
        // 将当前收藏数加一
        var nowCollect1 = parseInt($(".article-details-CollectNum").html()) + 1
        $(".article-details-CollectNum").html(nowCollect1)
    } else if ($(".article-details-Collect").css("color") === 'rgb(225, 166, 7)') {
        $(".article-details-Collect").html("&#xe601;")
        $(".article-details-Collect").css("color","black")
        DetailsCollectCancle(userId,articleId)
        // 将当前收藏数减一
        var nowCollect2 = parseInt($(".article-details-CollectNum").html()) - 1
        $(".article-details-CollectNum").html(nowCollect2.toString())
    }
})


// ----------------------------------------------
// 点击评论，出现评论框
$(".article-details-commentBtn").on("click",function() {
    $(".article-details-commentFixedBox").css("display","none")
    $(".article-details-commentFixedIptBox").css("display","block")
    $(".Comment-background").css("display","block")
})

$(".article-details-commentFixedBtn").on("click",function() {
    $(".article-details-commentFixedBox").css("display","none")
    $(".article-details-commentFixedIptBox").css("display","block")
    $(".Comment-background").css("display","block")
})

// 点击遮盖层，遮盖层消失
$(".Comment-background").on("click",function() {
    $(".article-details-commentFixedBox").css("display","block")
    $(".article-details-commentFixedIptBox").css("display","none")
    $(".Comment-background").css("display","none")
    if(localStorage.getItem("parentReviewId")) {
        localStorage.removeItem("parentReviewId")
    }
})





// --------------------------------------------------------------
// 发布评论
function postComment(parentReviewId) {
    // 准备数据
    let replyToUserId = localStorage.getItem("authorId")
    let replyToArticleId = localStorage.getItem("articleId")
    let authorId = localStorage.getItem("userId")
    let content = $(".article-details-commentIpt").elements[0].value
    var fd = new FormData();
    fd.append("replyToUserId",replyToUserId)
    fd.append("replyToArticleId",replyToArticleId)
    fd.append("authorId",authorId)
    fd.append("content",content)
    if(parentReviewId) {
        fd.append("parentReviewId",parentReviewId)
    }
    

    $().ajax({
        type: "POST",
        url: "http://175.178.193.182:8080/review",
        data: fd
    }).then((res) => {
        $(".article-details-commentIpt").elements[0].value = ''
        // 重新渲染评论(要先把原来的都删了)
        $(".article-details-FirstCommentBoxFather").remove()
        renderDetailsComment(localStorage.getItem("articleId"))
    }).catch((res) => {
        console.log(res);
    })
}

// input若有值，则出现发送按钮
$(".article-details-commentIpt").on("input",function() {
    if($(".article-details-commentIpt").elements[0].value !== '') {
        $(".article-details-greyBox").css("width","350px")
        $(".article-details-commentSend").css("display","block")
    } else {
        $(".article-details-commentSend").css("display","none")
        $(".article-details-greyBox").css("width","425px")
    }
})
$(".article-details-commentSend").on("click",function() {
    postComment(localStorage.getItem("parentReviewId"))
})





// ----------------------------------
// 点击一级评论可以回复(要用事件委托)
$(".article-details-commentBox").on("click",function(e) {
    let target = e.target
    if(target.classList.contains("FirstComment-content")) {
        var parentReviewId = target.parentNode.getAttribute("reviewId");
        $(".article-details-commentFixedBox").css("display","none")
        $(".article-details-commentFixedIptBox").css("display","block")
        $(".Comment-background").css("display","block")
        // 报错reviewId供发送二级评论使用
        localStorage.setItem("parentReviewId",parentReviewId)
        $(".article-details-commentIpt").attr("placeholder",'回复@' + target.parentNode.children[1].innerHTML + ':')
    }

})


// -------------------------------------------------------------------
// 为评论点赞
function CommentLikes(userId,reviewId) {
    // 准备数据
    let fd = new FormData()
    fd.append("userId",userId)
    fd.append("reviewId",reviewId)
    $().ajax({
        type: "POST",
        url: "http://175.178.193.182:8080/review/like",
        data: fd
    }).then((res) => {

    }).catch((res) => {
        console.log(res);
    })
}

// 点击取消评论点赞
function CommentLikesCancle(userId,reviewId) {
    // 准备数据
    let fd = new FormData()
    fd.append("reviewId",reviewId)
    fd.append("userId",userId)
    $().ajax({
        type: "POST",
        url: "http://175.178.193.182:8080/review/unlike",
        data: fd
    }).then((res) => {

    }).catch((res) => {
        console.log(res);
    })
}

$(".article-details-commentBox").on("click",function(e) {
    let target = e.target;
    // 如果点到了一级评论
    if(target.classList.contains("FirstComment-LikesBtn")) {
        let userId = localStorage.getItem("userId")
        let reviewId = target.parentNode.getAttribute("reviewId")
        //  如果点赞文字为黑色，就发送点赞请求
        if(window.getComputedStyle(target).color === 'rgb(0, 0, 0)') {
            target.innerHTML = '&#xe60d;'
            target.style.color = 'red'
            CommentLikes(userId,reviewId)
            // 将当前点赞数加一
            var nowlikes1 = parseInt(target.parentNode.children[5].innerHTML) + 1
            target.parentNode.children[5].innerHTML = nowlikes1
        } else if(window.getComputedStyle(target).color === 'rgb(255, 0, 0)') {  //为红色，则取消点赞
            target.innerHTML = '&#xe8ab;'
            target.style.color = 'black'
            CommentLikesCancle(userId,reviewId)
            // 将当前点赞数减一
            var nowlikes2 = parseInt(target.parentNode.children[5].innerHTML) - 1
            target.parentNode.children[5].innerHTML = nowlikes2
        }
    }

    // 如果点到了二级评论
    if(target.classList.contains("SecondComment-LikesBtn")) {
        let userId = localStorage.getItem("userId")
        let reviewId = target.parentNode.getAttribute("reviewId")
        //  如果点赞文字为黑色，就发送点赞请求
        if(window.getComputedStyle(target).color === 'rgb(0, 0, 0)') {
            target.innerHTML = '&#xe60d;'
            target.style.color = 'red'
            CommentLikes(userId,reviewId)
            // 将当前点赞数加一
            var nowlikes1 = parseInt(target.parentNode.children[4].innerHTML) + 1
            target.parentNode.children[4].innerHTML = nowlikes1
        } else if(window.getComputedStyle(target).color === 'rgb(255, 0, 0)') {  //为红色，则取消点赞
            target.innerHTML = '&#xe8ab;'
            target.style.color = 'black'
            CommentLikesCancle(userId,reviewId)
            // 将当前点赞数减一
            var nowlikes2 = parseInt(target.parentNode.children[4].innerHTML) - 1
            target.parentNode.children[4].innerHTML = nowlikes2
        }
    }
})


// --------------------------------------------------------------------
// 删除评论
function CommentRemove(reviewId) {
    // 准备数据
    let fd = new FormData()
    fd.append("reviewId",reviewId)
    $().ajax({
        type: "POST",
        url: "http://175.178.193.182:8080/review/delete",
        data: fd
    }).then((res) => {
        // 删除后重新渲染评论（同发评论时）
        $(".article-details-FirstCommentBoxFather").remove()
        renderDetailsComment(localStorage.getItem("articleId"))
        renderArticleDetails(localStorage.getItem("articleId"));
    }).catch((res) => {
        console.log(res);
    })
}

$(".article-details-commentBox").on("click",function(e) {
    let target = e.target;
    if(target.classList.contains("FirstComment-Delete") || target.classList.contains("SecondComment-Delete")) {
        // 点击删除按钮，发送删除申请
        CommentRemove(target.parentNode.getAttribute("reviewId"))
    }
})

// ----------------------------------------------------------------
// 点击作者的头像跳到它的个人主页
$(".article-details").on("click",function(e) {
    let target = e.target
    // 点击到作者头像
    if(target.parentNode.classList.contains("article-details-avatar")) {
        // 跳转到作者的主页
        jumpL("person-center")
        localStorage.setItem("PersonBack",localStorage.getItem("nowPage"))
        // 为个人主页加上一个自定义属性用来表示渲染哪一个人
        $(".person-center").attr("TheRenderId",target.parentNode.getAttribute("userId"))
        // 在第一次跳转的时候渲染下方我的文章和个人信息
        renderMybaseInfo(target.parentNode.getAttribute("userId"));
        renderPCfollow(target.parentNode.getAttribute("userId"))
        // 从我的文章出来后，点击头像的个人主页已经被改变，要重新渲染
        if($(".main-myArticle-column-left").elements.length === 1) {
            $(".main-myArticle-column").empty()
            $(".main-myArticle-column-left").remove()
            var myArticleLeftbox = $("<div></div>")
            myArticleLeftbox.addClass("main-column").addClass("main-myArticle-column-left").addClass("main-column-left").addClass("main-myArticle-column")
            $(".main-myArticle-column-right").before(myArticleLeftbox)
            rendermyAriticle(target.parentNode.getAttribute("userId"));
        }
        // 收藏和赞过也一样
        if($(".main-myCollect-column-left").elements.length === 1) {
            $(".main-myCollect-column").empty()
            $(".main-myCollect-column-left").remove()
            var myCollectLeftbox = $("<div></div>")
            myCollectLeftbox.addClass("main-column").addClass("main-myCollect-column-left").addClass("main-column-left").addClass("main-myCollect-column")
            $(".main-myCollect-column-right").before(myCollectLeftbox)
            rendermyAriticle(target.parentNode.getAttribute("userId"));
        }

        if($(".main-myLiked-column-left").elements.length === 1) {
            $(".main-myLiked-column").empty()
            $(".main-myLiked-column-left").remove()
            var myLikedLeftbox = $("<div></div>")
            myLikedLeftbox.addClass("main-column").addClass("main-myLiked-column-left").addClass("main-column-left").addClass("main-myLiked-column")
            $(".main-myLiked-column-right").before(myLikedLeftbox)
            rendermyAriticle(target.parentNode.getAttribute("userId"));
        }
        // ------------------
        // 在个人主页点完要进到别人的主页，要先把自己的删了，再渲染别人的，因为今天写到很乱，都是这不补一下那边补一下，所以我的代码这边一块，那边一块
        if($(".person-note-btn").elements[0].classList.contains("person-btntwo-current")) {
            if($(".main-myArticle-column-left").elements.length === 0) {
                // $(".main-myArticle-column-left").empty()
                // $(".main-myArticle-column-left").remove()
                var myArticleLeftbox = $("<div></div>")
                myArticleLeftbox.addClass("main-column").addClass("main-myArticle-column-left").addClass("main-column-left").addClass("main-myArticle-column")
                $(".main-myArticle-column-right").before(myArticleLeftbox)
                // 如果是从头像点进来的，那就渲染头像的id，如果不是，那么attr自定义属性是null，渲染当前用户的
                if($(".person-center").attr("TheRenderId") !== null) {
                    // renderMyArticle(target.parentNode.parentNode.getAttribute("userId"))
                    rendermyAriticle($(".person-center").attr("TheRenderId"));
                } else {
                    rendermyAriticle(localStorage.getItem("userId"));
                } 
            }  
        }
        
        if($(".person-collect-btn").elements[0].classList.contains("person-btntwo-current")) {
            if($(".main-myCollect-column-left").elements.length === 0) {
                // $(".main-myCollect-column-left").empty()
                // $(".main-myCollect-column-left").remove()
                var myCollectLeftbox = $("<div></div>")
                myCollectLeftbox.addClass("main-column").addClass("main-myCollect-column-left").addClass("main-column-left").addClass("main-myCollect-column")
                $(".main-myCollect-column-right").before(myCollectLeftbox)
                // 如果是从头像点进来的，那就渲染头像的id，如果不是，那么attr自定义属性是null，渲染当前用户的
                if($(".person-center").attr("TheRenderId") !== null) {
                    renderMyCollect($(".person-center").attr("TheRenderId"));
                } else {
                    renderMyCollect(target.parentNode.getAttribute("userId"));
                } 
            } 
        }
    
        if($(".hadliked-btn").elements[0].classList.contains("person-btntwo-current")) {
            if($(".main-myLiked-column-left").elements.length === 0) {
                // $(".main-myLiked-column-left").empty()
                // $(".main-myLiked-column-left").remove()
                var myLikedLeftbox = $("<div></div>")
                myLikedLeftbox.addClass("main-column").addClass("main-myLiked-column-left").addClass("main-column-left").addClass("main-myLiked-column")
                $(".main-myLiked-column-right").before(myLikedLeftbox)
                // 如果是从头像点进来的，那就渲染头像的id，如果不是，那么attr自定义属性是null，渲染当前用户的
                if($(".person-center").attr("TheRenderId") !== null) {
                    renderMyLiked($(".person-center").attr("TheRenderId"));
                } else {
                    renderMyLiked(target.parentNode.getAttribute("userId"));
                } 
            }
        }
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



// ---------------------
// 点击评论者的头像跳到它的个人主页
$(".article-details").on("click",function(e) {
    let target = e.target
    if(target.parentNode.classList.contains("FirstComment-avatar") || target.parentNode.classList.contains("SecondComment-avatar")) {
        // 跳转到作者的主页
        jumpL("person-center")
    localStorage.setItem("PersonBack",localStorage.getItem("nowPage"))
    // 为个人主页加上一个自定义属性用来表示渲染哪一个人
    console.log(target.parentNode.parentNode);
    $(".person-center").attr("TheRenderId",target.parentNode.parentNode.getAttribute("userId"))
    
    // 在第一次跳转的时候渲染下方我的文章和个人信息
    renderMybaseInfo(target.parentNode.parentNode.getAttribute("userId"));
    renderPCfollow(target.parentNode.parentNode.getAttribute("userId"))
    // 从我的文章出来后，点击头像的个人主页已经被改变，要重新渲染
    if($(".main-myArticle-column-left").elements.length === 1) {
        $(".main-myArticle-column").empty()
        $(".main-myArticle-column-left").remove()
        var myArticleLeftbox = $("<div></div>")
        myArticleLeftbox.addClass("main-column").addClass("main-myArticle-column-left").addClass("main-column-left").addClass("main-myArticle-column")
        $(".main-myArticle-column-right").before(myArticleLeftbox)
        rendermyAriticle(target.parentNode.parentNode.getAttribute("userId"));
    }
    // 收藏和赞过也一样
    if($(".main-myCollect-column-left").elements.length === 1) {
        $(".main-myCollect-column").empty()
        $(".main-myCollect-column-left").remove()
        var myCollectLeftbox = $("<div></div>")
        myCollectLeftbox.addClass("main-column").addClass("main-myCollect-column-left").addClass("main-column-left").addClass("main-myCollect-column")
        $(".main-myCollect-column-right").before(myCollectLeftbox)
        rendermyAriticle(target.parentNode.parentNode.getAttribute("userId"));
    }

    if($(".main-myLiked-column-left").elements.length === 1) {
        $(".main-myLiked-column").empty()
        $(".main-myLiked-column-left").remove()
        var myLikedLeftbox = $("<div></div>")
        myLikedLeftbox.addClass("main-column").addClass("main-myLiked-column-left").addClass("main-column-left").addClass("main-myLiked-column")
        $(".main-myLiked-column-right").before(myLikedLeftbox)
        rendermyAriticle(target.parentNode.parentNode.getAttribute("userId"));
    }
    // ------------------
    // 在个人主页点完要进到别人的主页，要先把自己的删了，再渲染别人的，因为今天写到很乱，都是这不补一下那边补一下，所以我的代码这边一块，那边一块
    if($(".person-note-btn").elements[0].classList.contains("person-btntwo-current")) {
        if($(".main-myArticle-column-left").elements.length === 0) {
            // $(".main-myArticle-column-left").empty()
            // $(".main-myArticle-column-left").remove()
            var myArticleLeftbox = $("<div></div>")
            myArticleLeftbox.addClass("main-column").addClass("main-myArticle-column-left").addClass("main-column-left").addClass("main-myArticle-column")
            $(".main-myArticle-column-right").before(myArticleLeftbox)
            // 如果是从头像点进来的，那就渲染头像的id，如果不是，那么attr自定义属性是null，渲染当前用户的
            if($(".person-center").attr("TheRenderId") !== null) {
                // renderMyArticle(target.parentNode.parentNode.getAttribute("userId"))
                rendermyAriticle($(".person-center").attr("TheRenderId"));
            } else {
                rendermyAriticle(localStorage.getItem("userId"));
            } 
        } 
    }
    
    if($(".person-collect-btn").elements[0].classList.contains("person-btntwo-current")) {
        if($(".main-myCollect-column-left").elements.length === 0) {
            // $(".main-myCollect-column-left").empty()
            // $(".main-myCollect-column-left").remove()
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
            // $(".main-myLiked-column-left").empty()
            // $(".main-myLiked-column-left").remove()
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


// ---------------------------------------------------------------
// 删除文章

// 发送删除文章请求
function deleteArticle() {
    // 准备数据
    let fd = new FormData()
    fd.append("articleId",localStorage.getItem("articleId"));
    $().ajax({
        type: "POST",
        url: "http://175.178.193.182:8080/article/delete",
        data: fd
    }).then((res) => {
        console.log(res);
        alert(res.msg);
    }).catch((res) => {
        console.log(res);
    })
}



$(".article-details-deleteBtn").on("click",function() {
    $(".deleteAticleBox").css("display","block");
    $(".deleteArticleBox-background").css("display","block");
})

$(".deleteAticleBox-cancle").on("click",function() {
    $(".deleteAticleBox").css("display","none");
    $(".deleteArticleBox-background").css("display","none");
})

// 点击确定，发送请求
$(".deleteAticleBox-determine").on("click",function() {
    $(".deleteAticleBox").css("display","none");
    $(".deleteArticleBox-background").css("display","none");
    deleteArticle();
    // 手动调用返回按钮点击事件
    let backBtn = document.querySelector(".article-details-back");
    backBtn.click();
})






// 这是聊天页面的js


// 点击返回按钮回到上一页
$(".ChatPage-back").on("click",function() {
    if(localStorage.getItem("chatBackPerson")) {
        jumpL("person-center")
        localStorage.removeItem("chatBackPerson")
    } else {
        jump(localStorage.getItem("prePage"))
    }
    
    if(localStorage.getItem("prePage") === 'MyMessage') {
        $(".main-bottom").css("display","block")
        $(".MyMessage-container").empty()
        RenderChatList(localStorage.getItem("userId"))
    }
    $(".ChatPage").removeAttr("receiverId")
    $(".ChatMsgBox").empty()
})


// ----------------------------------------------------
// 发送请求渲染背景图
function renderChatBackground(userId) {
    $().ajax({
        type: "GET",
        url: "http://175.178.193.182:8080/user/baseInfo",
        data: {
            userId: userId
        }
    }).then((res) => {
        $(".ChatBackground").attr("src",res.user.backGroundPicture)
    }).catch((res) => {
        console.log(res);
    })
}


// 发送请求渲染对方名字
function renderReceiverId(receiverId) {
    $().ajax({
        type: "GET",
        url: "http://175.178.193.182:8080/user/baseInfo",
        data: {
            userId: receiverId
        }
    }).then((res) => {
        $(".ChatPage-title").html(res.user.nickname)
    }).catch((res) => {
        console.log(res);
    })
}





// ----------------------------------------
// 点击按钮发送消息
function SendMsg(userId,receiverId){
    // 准备数据
    let fd = new FormData();
    fd.append("userId",userId)
    fd.append("receiverId",receiverId)
    fd.append("message",$(".ChatPage-ipt").elements[0].value)
    $().ajax({
        type: "POST",
        url: "http://175.178.193.182:8080/chat/send",
        data: fd
    }).then((res => {
        $(".ChatPage-ipt").elements[0].value = ''
         // 发送之后重新渲染页面
         $(".ChatMsgBox").empty()
         renderChatRecord(localStorage.getItem("userId"),$(".ChatPage").attr("receiverId"))
    })).catch((res) => {
        console.log(res);
    })
}

// input若有值，则出现发送按钮
$(".ChatPage-ipt").on("input",function() {
    if($(".ChatPage-ipt").elements[0].value !== '') {
        $(".ChatPage-ipt").css("width","335px")
        $(".MsgSendBtn").css("display","block")
    } else {
        $(".MsgSendBtn").css("display","none")
        $(".ChatPage-ipt").css("width","405px")
    }
})


// ----------------------------------------------------------
// 写一个实时渲染收到的信息的函数
function ontimeRender(userId,message) {
    $().ajax({
        type: "GET",
        url: "http://175.178.193.182:8080/user/fullInfo",
        data: {
            userId: userId
        }
    }).then((res) => {
        let frag = document.createDocumentFragment()
        // 头像
        let img2 = $("<img/>").attr("src",res.user.avatar)
        let Lavatar = $("<div></div>").addClass("LeftMsg-avatar").attr("userId",res.user.userId).append(img2)
        // 消息
        let Lmessage = $("<div></div>").addClass("LeftMsg").html(message)
        // 三角形
        let Ltriangle = $("<div></div>").addClass("Lefttriangle")
        
        frag.append(Lavatar.elements[0])
        frag.append(Lmessage.elements[0])
        frag.append(Ltriangle.elements[0])
        let Lbox = $("<div></div>").addClass("LeftMsgBox")
        Lbox.elements[0].appendChild(frag)
        $(".ChatMsgBox").append(Lbox)

        // 跳转到底部
        window.scroll(0,900)

    }).catch((res) => {
        console.log(res);
    })
    
}



// ws实时聊天
let socket = io.connect("ws://175.178.193.182:8080/chat")

socket.on("connect",() => {
    socket.emit("online",localStorage.getItem("userId"))
    socket.on("receive-message",(res) => {
        ontimeRender(res.userId,res.message)
    })
})

function wsChat() {
    socket.emit("send-message",{
        userId: localStorage.getItem("userId"),
        receiverId: $(".ChatPage").attr("receiverId"),
        message:$(".ChatPage-ipt").elements[0].value
    })
}

$(".MsgSendBtn").on("click",function() {
    if($(".ChatPage-ipt").elements[0].value !== '') {
        wsChat();
        SendMsg(localStorage.getItem("userId"),$(".ChatPage").attr("receiverId"))
        // window.scroll(0,900)
    }
})


// -----------------------------------------------------
// 请求用户数据渲染头像
function ChatUserInfo(userId,img) {
    $().ajax({
        type: "GET",
        url: "http://175.178.193.182:8080/user/fullInfo",
        data: {
            userId: userId
        }
    }).then((res) => {
        img.attr("src",res.user.avatar)
    }).catch((res) => {
        console.log(res);
    })
}


// 创建右边
function CreateRightChatRecord(data,userId,receiverId) {
    let frag1 = document.createDocumentFragment()
     // 头像
     let img1 = $("<img/>")

     let Ravatar = $("<div></div>").addClass("RightMsg-avatar").attr("userId",data.userId).append(img1)
     // 消息
     let Rmessage = $("<div></div>").addClass("RightMsg").html(data.message)
     // 三角形
     let Rtriangle = $("<div></div>").addClass("Righttriangle")
     
    //  渲染头像
     ChatUserInfo(data.userId,img1)


     frag1.appendChild(Ravatar.elements[0])
     frag1.appendChild(Rmessage.elements[0])
     frag1.appendChild(Rtriangle.elements[0])

     return frag1
}

//创建左边
function  CreateLeftChatRecord(data,userId,receiverId) {
    let frag2 = document.createDocumentFragment()
    // 头像
    let img2 = $("<img/>")
    let Lavatar = $("<div></div>").addClass("LeftMsg-avatar").attr("userId",data.userId).append(img2)
    // 消息
    let Lmessage = $("<div></div>").addClass("LeftMsg").html(data.message)
    // 三角形
    let Ltriangle = $("<div></div>").addClass("Lefttriangle")

    ChatUserInfo(data.userId,img2)
    
    frag2.append(Lavatar.elements[0])
    frag2.append(Lmessage.elements[0])
    frag2.append(Ltriangle.elements[0])

    return frag2
}




// 获取聊天记录，渲染页面
function renderChatRecord(userId,receiverId,page) {
    $().ajax({
        type: "GET",
        url: "http://175.178.193.182:8080/chat/getRecord",
        data: {
            userId: userId,
            receiverId:receiverId,
            page: 1
        }
    }).then((res) => {
        if(res.newRecord.length !== 0) {
            for(let i = 0;i < res.newRecord.length;i++) {
                // 如果userId等于当前用户，则加在右边，如果不等于，则加在左边
                if(res.newRecord[i].userId == userId) {
                    let frag1 = CreateRightChatRecord(res.newRecord[i])
                    let Rbox = $("<div></div>").addClass("RightMsgBox")
                    Rbox.elements[0].appendChild(frag1)
                    $(".ChatMsgBox").append(Rbox)
                } else if (res.newRecord[i].userId == receiverId) {
                    let frag2 = CreateLeftChatRecord(res.newRecord[i])
                    let Lbox = $("<div></div>").addClass("LeftMsgBox")
                    Lbox.elements[0].appendChild(frag2)
                    $(".ChatMsgBox").append(Lbox)
                }
            }
        }
        // for(let i = 0;i < res.newRecord.length;i++) {
        //     // 如果userId等于当前用户，则加在右边，如果不等于，则加在左边
        //     if(res.newRecord[i].userId == userId) {
        //         let frag1 = CreateRightChatRecord(res.newRecord[i])
        //         let Rbox = $("<div></div>").addClass("RightMsgBox")
        //         Rbox.elements[0].appendChild(frag1)
        //         $(".ChatMsgBox").append(Rbox)
        //     } else if (res.newRecord[i].userId == receiverId) {
        //         let frag2 = CreateLeftChatRecord(res.newRecord[i])
        //         let Lbox = $("<div></div>").addClass("LeftMsgBox")
        //         Lbox.elements[0].appendChild(frag2)
        //         $(".ChatMsgBox").append(Lbox)
        //     }
        // }
        // 跳转到底部
        window.scroll(0,900);
    }).catch((res) => {
        console.log(res);
    })
}

// function renderChatRecord(userId,receiverId) {
//     for(let i = 3;i > 0;i--) {
//         EverenderChatRecord(userId,receiverId,i);
//     }
// }

// renderChatRecord(localStorage.getItem("userId"),8)




// ------------------------------------------------------------------
function charscroll() {

}








// -------------------------------------
// 背景图
// function slide() {
//     var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    // $(".bjt").css("top",scrollTop + 'px')
// }
// // 当聊天框长度大于屏幕时才滚动
// if($(".ChatMsgBox").elements[0].clientHeight > 634) {
//     window.addEventListener("scroll",slide)
//     window.addEventListener("resize",slide)
// }

























//注意：获取html和text后不能继续链式调用,且只能获取到列表中第一个元素的html和text

    //使用$,返回一个实例对象
    function $(selector) {
        return new Myjq(selector)
    }


    class Myjq {
        constructor(selector) {
            this.selector = selector
            this.init()
        }
        
        //初始选择器
        init() {
            this.elements=[]
            // 初始化选择器
            if(this.selector == null) {
                return this;
            }
            switch(this.selector.charAt(0)) {
                case '<':   //如果第一个是<，则动态创建元素
                    var word = this.selector.split("<").join("").split(">").join("").split("/")[0];
                    var ele = document.createElement(word);
                    this.elements.push(ele);
                    break;
                case '#': //如果第一个是#，则用id选择器
                    var obj = document.getElementById(this.selector.substring(1));           //选择#后面的字符串
                    this.elements.push(obj);
                    break;
                 case '.':    //如果第一个是.，则用类选择器
                     this.elements = document.getElementsByClassName(this.selector.substring(1));
                     break;
                 default:   //如果不是#或.，就用标签选择器
                 this.elements = document.getElementsByTagName(this.selector);
            }           
            return this
        }


        // ------------------------------------------------获取属性/修改属性----------------------------------------------------------
        //获取和修改样式属性
        css(name, value) {// 通过判断参数的个数就能确定css方法要实现什么功能          
            if (arguments.length === 2) {
                // 设置单个样式 
               // 是把获取到的所有元素都设置上这个样式 
               for (var i = 0; i < this.elements.length; i++) {
                 this.elements[i].style[name] = value; 
               }        
             }else if(arguments.length === 1){
                //说明是个对象 设置多个样式
               if (typeof name === "object") { 
                   // 设置多个样式 需要给获取到的所有元素都设置上多个样式
                  for(var i = 0; i < this.elements.length; i++){ 
                       //this.elements[i] ==> 每一个元素  
                      // 循环的是对象，是设置的样式和样式值
                      for(var k in name){  
                          this.elements[i].style[k] = name[k]; 
                       }
                    }
             }else if(typeof name === "string"){ 
                   // 获取样式  注意点： 获取第一个元素对应的值
                    return window.getComputedStyle(this.elements[0], null)[name]; 
                 }
              } 
            return this;
         }


        //  获取和设置自定义属性
        attr(aname,val) {
            if(arguments.length === 2) {// 通过判断参数的个数就能确定attr方法要实现什么功能      
                //有两个参数，设置属性并赋值
                this.each((i,ele) => {
                    ele.setAttribute(aname,val);
                })
            } else {
                return this.elements[0].getAttribute(aname);
            }
            return this;
        }

        // 删除自定义属性
        removeAttr(aname) {
            this.each((i,ele) => {
                ele.removeAttribute(aname)
            })
        }



         //  ---------------------------------------------增-----------------------------------------------------------------------
        //  添加元素到当前元素内部最后
         append(children) {
             this.each((i,ele) => {
                ele.appendChild(children.elements[0]);
             })
            return this;
        }

        // 添加元素到当前元素内部最前
        prepend(children) {
            this.each((i,ele) => {
                ele.insertBefore(children.elements[0],ele.children[0]);
            })
            return this;
        }

        // 添加元素到当前元素前面
        before(theEle) {
            this.each((i,ele) => {
                ele.parentNode.insertBefore(theEle.elements[0],ele);
            })
            return this;
        }

        

         //  ---------------------------------------------删-----------------------------------------------------------------------
        //  删除元素本身
        remove() {
            this.each((i,ele) => {
                ele.parentNode.removeChild(ele);
            })
            return this;
        }

        //删除元素子元素
        empty() {
            this.each((i,ele) => {
                let length = ele.children.length;
                for(let i = length - 1;i >= 0;i--) {        //此处如果i++的话，当i大于length/2的时候，就会报错，因为随着元素被删除，其index也在减小
                        ele.removeChild(ele.children[i]);
                }
            })
            return this;
        }


        //  ---------------------------------------------查-----------------------------------------------------------------------
        //遍历元素each()方法
        // each(fn) {
        //     for (let i = 0; i < this.elements.length; i++) {
        //         fn.call(null, i, this.elements[i]);                 //循环调用每一个元素，对其使用回调函数
        //     }
        //     return this;
        // }
        each(fn) {
            let length = this.elements.length;
            for (let i = length - 1; i >= 0; i--) {
                fn.call(null, i, this.elements[i]);                 //循环调用每一个元素，对其使用回调函数
            }
            return this;
        }


        // 查找元素(用来辅助find方法的)
        findson(ele,selec,arr) {
            switch(selec.charAt(0)) {
                case '#': //如果第一个是#，则用id选择器
                    var obj = ele.getElementById(selec.substring(1));           //选择#后面的字符串
                    arr.push(obj)
                    break;
                 case '.':    //如果第一个是.，则用类选择器
                    var obj = ele.getElementsByClassName(selec.substring(1));
                    arr.push(obj)
                    break;
                 default:   //如果不是#或.，就用标签选择器
                var obj = ele.getElementsByTagName(selec);
                arr.push(obj)
            }
        }


        // 查找元素(用来辅助siblings方法的)
        findsiblings(ele,selec,arr) {
            switch(selec.charAt(0)) {
                case '#': //如果第一个是#，则用id选择器
                    var obj = [...ele.parentNode.getElementById(selec.substring(1))].filter((eve) => {   
                        return eve != ele;
                    }).filter((eve) => {
                        return eve.parentNode == ele.parentNode;
                    }); 
                    arr.push(obj);        
                    break;
                 case '.':    //如果第一个是.，则用类选择器
                     var obj = [...ele.parentNode.getElementsByClassName(selec.substring(1))].filter((eve) => {
                        return eve != ele;
                    }).filter((eve) => {
                        return eve.parentNode == ele.parentNode;
                    });
                    arr.push(obj);      
                     break;
                 default:   //如果不是#或.，就用标签选择器
                 var obj = [...ele.parentNode.getElementsByTagName(selec)].filter((eve) => {
                     return eve !== ele;
                }).filter((eve) => {
                    return eve.parentNode == ele.parentNode
                })
                arr.push(obj);      
            }
        }


        // 查找元素(用来辅助children方法的)
        findchildren(ele,selec,arr) {
            switch(selec.charAt(0)) {
                case '#': //如果第一个是#，则用id选择器
                    var obj = [...ele.getElementById(selec.substring(1))].filter((eve) => {
                        return eve.parentNode == ele;
                    });         
                    arr.push(obj)
                    break;
                 case '.':    //如果第一个是.，则用类选择器
                     var obj = [...ele.getElementsByClassName(selec.substring(1))].filter((eve) => {
                        return eve.parentNode == ele;
                    });    
                    arr.push(obj)
                     break;
                 default:   //如果不是#或.，就用标签选择器
                    var obj = [...ele.getElementsByTagName(selec)].filter((eve) => {
                    return eve.parentNode == ele;
                });    
                    arr.push(obj)
            }
        }




        //查找对应索引的元素
        get(index) {
            const i = this.elements[index];           //找到对应元素
            this.elements = [];                //将元素转到elements中
            this.elements.push(i);
            return this;
        }

        //后代选择器
        find(selector) {
            const arr = []      //声明一个数组储存每个元素的子元素集合
            this.each((i,ele) => {
                this.findson(ele,selector,arr)
            })
            const arr1 = []   // 声明一个数组将多个数组集合为一个
            for(let i = 0;i < arr.length;i++) {
                arr1.push(...arr[i])
            }
            this.elements = arr1
            return this;
        }

        //子代选择器
        children(selector) {
            const arr = []      //声明一个数组储存每个元素的子元素集合
            this.each((i,ele) => {
                this.findchildren(ele,selector,arr)
            })
            const arr1 = []   // 声明一个数组将多个数组集合为一个
            for(let i = 0;i < arr.length;i++) {
                arr1.push(...arr[i])
            }
            this.elements = arr1
            return this;
        }

        // 查找父级节点
        parent() {
            const arr = [];
            this.each((i,ele) => {
                arr.push(ele.parentNode)
            })
            this.elements = [...arr];
            return this;
        }

        // 查找除自己外的兄弟节点
        siblings(selector) {
            const arr = [];      //声明一个数组储存每个元素的子元素集合
            this.each((i,ele) => {
                this.findsiblings(ele,selector,arr);
            })
            const arr1 = []   // 声明一个数组将多个数组集合为一个
            for(let i = 0;i < arr.length;i++) {
                arr1.push(...arr[i]);
            }
            this.elements = arr1;
            return this;
        }





        //  ---------------------------------------------改-----------------------------------------------------------------------
        //添加类的方法
        addClass(name) {
            if(name) {
                //判断该dom有没有class，有则在原class基础上增加，无则直接赋值
                this.each((i,ele) => {
                    ele.className ? ele.className = ele.className + " " + name : ele.className=name;
                })
            }
            return this;
        }
        
        
        //删除类的方法
        removeClass(name){
            this.each((i,ele) => {
                //将className属性转为数组(className是一个字符串)
                let classArr = ele.className.split(" "),
                index = classArr.indexOf(name);
                //将符合条件的class类删除
                index > -1 ? classArr.splice(index,1) : null;
                ele.className = classArr.join(" ");
            })
            return this;
        }

        //修改元素html内容
        html(val) {
            if(val) {                           //如果val存在，则对其赋值
                this.each((i,ele) => {
                    ele.innerHTML = val;
                })
            } else {                     // 如果不存在，就返回当前innerHTML值
                return this.elements[0].innerHTML;
            }
            return this;
        }


        //修改元素文本内容（text）
        text(val) {
            if(val) {                           //如果val存在，则对其赋值
                this.each((i,ele) => {
                    ele.innerText = val;
                })
            } else {                     // 如果不存在，就返回当前innerText值
                return this.elements[0].innerText;
            }
            return this;
        }
        

        //  ---------------------------------------------事件-----------------------------------------------------------------------
        //添加事件
        on(eventName, fn) {
            let eventArray = eventName.split(" ");   //把添加的事件保存到数组中
            this.each((i,ele) => {
                for(let i = 0; i < eventArray.length; i++) {
                    ele.addEventListener(eventArray[i], fn);
                }
            })
            return this;
        }

        //删除事件
        off(eventName,fn) {
            let eventArray = eventName.split(" ");   //把添加的事件保存到数组中
            this.each((i,ele) => {
                for(let i = 0; i < eventArray.length; i++) {
                    ele.removeEventListener(eventArray[i],fn);
                }
            })
            return this;
        }
        

        // --------------------------------------------------封装ajax----------------------------------------------------------------

        ajax(obj) {
            return new Promise((resolve,reject) => {
                var defaults = {
                    type : 'get',
                    data : {},
                    url : '#',
                    datatype: 'FormData'
                }
                // 处理形参，传递参数的时候就覆盖默认参数，不传递就使用默认参数
                for(var key in obj){//把输入的参数与设置的默认数据进行覆盖更新
                    defaults[key] = obj[key];
                }

                //创建xhr对象
                let xhr = new XMLHttpRequest();
                //拼接查询字符串,如： name=zs&age=10
                var theString = this.resolveData(defaults.data)

                // 判断是get请求还是post请求
                if(defaults.type.toUpperCase() === 'GET') {
                    xhr.open(defaults.type,defaults.url + '?' + theString)
                    xhr.send()
                }else if (defaults.type.toUpperCase() === 'POST') {
                    //发起POST请求
                    xhr.open(defaults.type,defaults.url)
                    let header = defaults.datatype === 'FormData' ? 'application/x-www-form-urlencoded' : 'application/json';
                    // xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded")
                    // xhr.setRequestHeader('Content-Type','application/json')
                    // xhr.setRequestHeader("Content-Type","multipart/form-data")
                    // xhr.send(theString)
                    xhr.send(defaults.data)
                }
                

                //监听xhr.onreadystatechange事件
                xhr.onreadystatechange = () => {
                    if(xhr.readyState === 4 && xhr.status === 200) {
                        // 处理成功的结果
                        resolve(JSON.parse(xhr.responseText))
                    } else if(xhr.ready == 4 && xhr.status != 200) {
                        //处理失败的结果
                        reject(xhr.responseText)
                      }
                }
            })
        }

        // 处理data的函数
        resolveData(data) {
            var arr = []
            for(let k in data) {
                arr.push(k + '=' + data[k])
            }
            return arr.join('&')
        }
     }


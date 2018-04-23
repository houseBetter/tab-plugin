/**
 * 第三版：
 * 实现的功能：
 *  插入、删除一个tab页；
 *  设置tab页中header与content区的文字信息，以及样式
 * 存在的问题：
 *  tab页过多时，一行显示不下会显示到下一行，而<div class="tab-wrapper">不能自动调整高度
 * */

(function () {
    var TabPlugin = (function () {
        var TabPlugin = function (selector, context) {

            return new TabPlugin.fn.init(selector, context);
        };
        TabPlugin.fn = TabPlugin.prototype = {
            constructor: TabPlugin,
            init: function (selector, context) {
                if (!selector instanceof Element) return;
                //获取<div class="container">元素
                this.container = selector;
                this.context = context ? 'window' : context;//上下文
                this.wrapper;
                this.tab = [];

                //获取<div class="tab-wrapper">元素，且是container的子元素，如果含有多个tab-wrapper元素，则取第一个
                if (selector.hasChildNodes()) {
                    let children = selector.childNodes;
                    for (let i = 0; i < children.length; i++) {
                        let child = children[i];
                        if (child.nodeType === Node.ELEMENT_NODE && child.getAttribute("class") === "tab-wrapper") {
                            this.wrapper = child;
                            break;
                        }
                    }
                    //获取<input>,<label>,<textarea>元素，顺序是后一个紧跟前一个
                    if (this.wrapper && this.wrapper.hasChildNodes()) {
                        let children = this.wrapper.childNodes;
                        for (let i = 0; i < children.length; i++) {
                            let child = children[i];
                            if (child.nodeType === Node.ELEMENT_NODE &&
                                child.nodeName.toLowerCase() === "input" &&
                                child.nextElementSibling &&
                                child.nextElementSibling.nodeName.toLowerCase() === "label" &&
                                child.nextElementSibling.nextElementSibling &&
                                child.nextElementSibling.nextElementSibling.nodeName.toLowerCase() === "textarea") {
                                this.tab.push({
                                    input: child,
                                    label: child.nextElementSibling,
                                    textarea: child.nextElementSibling.nextElementSibling
                                });

                            }

                        }
                    }
                    TabPlugin.fn.TAB_COUNT = this.tab.length;
                }
                
            }
        }
        TabPlugin.fn.init.prototype = TabPlugin.fn;
        var _JH = TabPlugin;
        var add = function (context) {
            //var _this = this;这样this为什么获取到的是window
            var _this = context;
            var input = document.createElement('input');
            var label = document.createElement('label');
            var textarea = document.createElement('textarea');
            var name;
            input.setAttribute("class", "tab-radio");
            input.setAttribute("type", "radio");
            //input中的属性id值必须与label中的for属性值相等
            input.setAttribute("id", "radio-" + _JH.fn.TAB_COUNT + "-" + (_this.tab.length + 1));
            label.setAttribute("for", "radio-" + _JH.fn.TAB_COUNT + "-" + (_this.tab.length + 1));
            label.innerHTML = "标签 0" + (_this.tab.length + 1);
            //如果增加tab后，只有一个tab，这个tab要默认checked
            if (!_this.tab[0]) {
                name = "tab-header-" + _JH.fn.TAB_COUNT;
                input.checked = true;
            } else {
                name = _this.tab[0].input.getAttribute("name");
            }
            input.setAttribute("name", name);
            textarea.setAttribute("class", "tab-textarea");
            textarea.innerHTML = "标签 0" + (_this.tab.length + 1) + "的内容区";
            _this.wrapper.appendChild(input);
            _this.wrapper.appendChild(label);
            _this.wrapper.appendChild(textarea);
            _this.tab.push({input:input,label:label,textarea:textarea});
            _JH.fn.TAB_COUNT = _this.tab.length;

        };
        var del = function (context) {

            var _this = context;
            //tab一个都没有，直接返回，不作任何操作；
            if (_this.tab.length == 0) return;
            //要删除的当前tab索引
            var i = 0;
            _this.tab.forEach((value, index, arry) => {
                if (value.input) {
                    if (value.input.checked) {
                        i = index;
                    }
                }
            });
            //删除tab中的input，label，textarea
            _this.wrapper.removeChild(_this.tab[i].input);
            _this.wrapper.removeChild(_this.tab[i].label);
            _this.wrapper.removeChild(_this.tab[i].textarea);
            //删除数组中这个tab数据
            _this.tab.splice(i, 1);
            //删除当前选中tab后，选择最后一组为当前tab
            if (i < _this.tab.length) {
                _this.tab[i].input.checked = true;
            } else if ((i == _this.tab.length) && i != 0) {
                _this.tab[i - 1].input.checked = true;
            }
            _JH.fn.TAB_COUNT = _this.tab.length;

        };
        _JH.fn.TAB_COUNT = 0;
        _JH.fn.refresh = function (operation, options) {
            var _this = this;
            // var container = _this.container;
            // var wrapper = _this.wrapper;
            var tab = _this.tab;

            switch (operation) {
                case "add"://增加一个tab
                    add(_this);
                    break;
                case "delete"://删除一个tab
                    del(_this);
                    break;
                default:
                    ;;
            }



        };
        //设置tab头的文本信息
        /**
         * title:要设置的文本内容； index：要设置文本内容的header的索引；context:要设置的header的所属元素
         */
        _JH.fn.setHeader = function(title,index,context){
            //参数类型检验
            if(typeof title !== "string" || typeof index !== "number") return;
            // if(!context instanceof Element) return;
            //判断header的所属元素有效性
            // if(!this.wrapper.contain(context)) return;
            //索引是否有效
            if(index > this.tab.length-1 || index < 0)  return;
            if(this.tab[index]){
                this.tab[index].label.innerHTML = title;
            }
            


            
        };
        //设置tab内容区的文本信息
        /**
         * content:要设置的文本内容； index：要设置文本内容的内容区的索引；context:要设置的内容区的所属元素
         */
        _JH.fn.setContent = function(content,index,context){
            //参数类型判断
            if(typeof content !== "string" || typeof index !== "number") return;
            // if(!context instanceof Element) return;
            //内容区所属元素有效判断
            // if(!this.wrapper.contain(context)) return;
            //索引是否有效
            if(index > this.tab.length-1 || index < 0)  return;
            if(this.tab[index]){
                this.tab[index].textarea.innerHTML = content;
            }
        };
        //设置header样式
        _JH.fn.setHeaderStyle = function(property,value,index){
            if(typeof index !== "number") return;
            if(index > this.tab.length -1 || index < 0) return;
            if(this.tab[index]){
                this.tab[index].label.style[property] = value;
            }
        };
        //设置content区样式
        _JH.fn.setContentStyle = function(property,value,index){
            if(typeof index !== "number") return;
            if(index > this.tab.length -1 || index < 0) return;
            if(this.tab[index]){
                this.tab[index].textarea.style[property] = value;
            }
        }

        return TabPlugin;

    })();
    window.TabPlugin = TabPlugin;//将插件暴露到全局环境中
})(window);

/**
 * Created by imac-ret on 17/11/6.
 */
/*
 Compiler将DOM元素解析，找出指令与占位符，建立Watcher，注册到Observer的监听队列中，在接收到通知后，
 根据不同的指令，进行更新DOM等不同处理
 */
var allowedKeywords = 'Math,Date,this,true,false,null,undefined,Infinity,NaN,' + 'isNaN,isFinite,decodeURI,decodeURIComponent,encodeURI,' + 'encodeURIComponent,parseInt,parseFloat';
var allowedKeywordsRE = new RegExp('^(' + allowedKeywords.replace(/,/g, '\\b|') + '\\b)');

var wsRE = /\s/g;
var newlineRE = /\n/g;
var saveRE = /[\{,]\s*[\w\$_]+\s*:|('(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*\$\{|\}(?:[^`\\]|\\.)*`|`(?:[^`\\]|\\.)*`)|new |typeof |void /g;
var restoreRE = /"(\d+)"/g;
var pathTestRE = /^[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*|\['.*?'\]|\[".*?"\]|\[\d+\]|\[[A-Za-z_$][\w$]*\])*$/;
var identRE = /[^\w$\.](?:[A-Za-z_$][\w$]*)/g;
var literalValueRE$1 = /^(?:true|false|null|undefined|Infinity|NaN)$/;

var saved = [];
function noop() {}

/**
 * Save replacer
 *
 * The save regex can match two possible cases:
 * 1. An opening object literal
 * 2. A string
 * If matched as a plain string, we need to escape its
 * newlines, since the string needs to be preserved when
 * generating the function body.
 *
 * @param {String} str
 * @param {String} isString - str if matched as a string
 * @return {String} - placeholder with index
 */

function save(str, isString) {
    var i = saved.length;
    saved[i] = isString ? str.replace(newlineRE, '\\n') : str;
    return '"' + i + '"';
}

/**
 * Path rewrite replacer
 *
 * @param {String} raw
 * @return {String}
 */

function rewrite(raw) {
    var c = raw.charAt(0);
    var path = raw.slice(1);
    if (allowedKeywordsRE.test(path)) {
        return raw;
    } else {
        path = path.indexOf('"') > -1 ? path.replace(restoreRE, restore) : path;
        return c + 'scope.' + path;
    }
}

/**
 * Restore replacer
 *
 * @param {String} str
 * @param {String} i - matched save index
 * @return {String}
 */

function restore(str, i) {
    return saved[i];
}

/**
 * Rewrite an expression, prefixing all path accessors with
 * `scope.` and generate getter/setter functions.
 *
 * @param {String} exp
 * @return {Function}
 */

function compileGetter(exp) {
    // reset state
    saved.length = 0;
    // save strings and object literal keys
    var body = exp.replace(saveRE, save).replace(wsRE, '');
    // rewrite all paths
    // pad 1 space here because the regex matches 1 extra char
    body = (' ' + body).replace(identRE, rewrite).replace(restoreRE, restore);
    return makeGetterFn(body);
}

/**
 * Build a getter function. Requires eval.
 *
 * We isolate the try/catch so it doesn't affect the
 * optimization of the parse function when it is not called.
 *
 * @param {String} body
 * @return {Function|undefined}
 */

function makeGetterFn(body) {
    try {
        /* eslint-disable no-new-func */
        return new Function('scope', 'return ' + body + ';');
        /* eslint-enable no-new-func */
    } catch (e) {
        return noop;
    }
}
/**
 * Check if an expression is a simple path.
 *
 * @param {String} exp
 * @return {Boolean}
 */

function isSimplePath(exp) {
    return pathTestRE.test(exp) &&
            // don't treat literal values as paths
        !literalValueRE$1.test(exp) &&
            // Math constants e.g. Math.PI, Math.E etc.
        exp.slice(0, 5) !== 'Math.';
}

function parseExpression(exp) {
    exp = exp.trim();
    var res = { exp: exp };
    res.get = isSimplePath(exp) && exp.indexOf('[') < 0
        // optimized super simple getter
        ? makeGetterFn('scope.' + exp)
        // dynamic getter
        : compileGetter(exp);
    return res;
}

var CompileUtil = {
    textUpdater:function(node,newVal,oldVal){
        node.textContent = newVal;
    },
    handleEvent:function(node,vm,event,exp){
        var fn = parseExpression(exp).get;
        node.addEventListener(event,function(){
            if(fn){
                fn(vm);
            }
        });
    },
    valueUpdater:function(node,newVal,oldVal){
        node.value = newVal?newVal:'';
    }
};

let compile = (el, vm) => {
    var el = document.getElementById(el);
    if(!el) return;
    return new Compiler(el, vm);
}

class Compiler {

    constructor (el, vm) {
        let me = this;
        me.$el = el;
        me.vm = vm;
        me.compile(el);
    };

    compile (el) {
        let me = this;
        if(me.isTextElement(el)) {
            me.compileTextElement(el);
        } else {
            me.compileNodeElement(el);
            if(el.childNodes) {
                [].slice.call(el.childNodes).forEach((node) => {
                    me.compile(node);
                });
            }
        }
    };

    isTextElement (node) {
        //是否是纯文字节点
        return node.nodeType == 3;
    };

    isElement (node) {
        //是否是普通节点
        return node.nodeType == 1;
    };

    compileTextElement (el) {
        let reg = /\{\{(.*?)\}\}/g, match;
        //因为TextElement中，可能不只有占位符，而是普通文本与占位符的混合，如下
        //1{{a}}2{{b}}3
        let lastIndex = 0, normalText;
        let content = el.textContent;


        if(!content.match(reg)) return;//没有绑定数据，不处理
        var fragment = document.createDocumentFragment();

        while(match = reg.exec(content)){
            var node;
            if(match.index > lastIndex){
                //普通文本
                normalText = content.slice(lastIndex, match.index);
                node = document.createTextNode(normalText);
                fragment.appendChild(node);
            }
            lastIndex = reg.lastIndex;
            //占位符
            var exp = match[1];
            node = document.createTextNode(' ');
            fragment.appendChild(node);
            //绑定占位符与表达式
            this.bind(node, exp, 'text');
        }
        if(lastIndex < content.length){
            //剩余的普通文本
            normalText = content.slice(lastIndex);
            node = document.createTextNode(normalText);
            fragment.appendChild(node);
        }

        this.replaceElement(el, fragment);
    };

    compileNodeElement (node) {
        let attrs = node.attributes;
        let me = this;

        [].forEach.call(attrs, (attr) => {
            let name = attr.name;
            let exp = attr.value;
            if(me.isDirective(name)) {
                let sendDir = name.substr(2);
                if(me.isEventDirective(sendDir)) {
                    //v-on:click
                    let eventDir = sendDir.substr(3);
                    CompileUtil.handleEvent(node, me.vm, eventDir, exp);

                } else {
                    me[sendDir] && me[sendDir](node, exp);
                }
            }
        });
    };

    isDirective (name) {
        //是否是指令
        return name.indexOf('v-') == 0;
    };

    isEventDirective (name) {
        //是否是事件指令
        return name.indexOf('on') == 0;
    };

    bind (node, exp, type) {
        //绑定view与model
        //添加一个Watcher，监听exp相关的所有字段变化，具体方法可以看Watcher的注释
        let updateFn = type +'Updater';

        new Watcher(exp, this.vm, (newVal, oldVal) => {
            CompileUtil[updateFn] && CompileUtil[updateFn](node, newVal, oldVal);
        })

    };

    replaceElement (el, fragment) {
        let parent = el.parentNode;
        if(parent) {
            parent.replaceChild(fragment, el);
        }
    };

    model (node, exp) {
        let me = this;
        //v-model,exp只能是绑定到一个变量上，不能是表达式
        if(node.tagName.toLowerCase() === 'input') {
            me.bind(node, exp, 'value');
            node.addEventListener('input', (el) => {
                me.vm[exp] = el.target.value;
            })
        };

    };
};
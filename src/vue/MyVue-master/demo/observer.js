/**
 * Created by imac-ret on 17/11/6.
 * Observer是将输入的Plain Object进行处理,利用Object.defineProperty转化为getter与setter,从而在赋值与取值时进行拦截
 * 这是Vue响应式框架的基础
 */

let isObject = (obj) => {
    return obj != null && typeof(obj) == 'object';
};

let isPlainObject = (obj) => {
    return Object.prototype.toString(obj) == '[object Object]';
};

let observer = (obj) => {
    if (!isObject(obj) || !isPlainObject(obj)) {
        return;
    }
    return new Observer(obj);
};

/**
 * 生成访问器
 */
class Observer {

    constructor (obj) {
        this.data = obj;
        this.transform(obj);
    };

    transform (obj) {
        let me = this;
        for (let key in obj) {
            me.observer(obj, key, obj[key]);
        }
    };

    observer (obj, key, value) {
        let dep = new Dep();
        Object.defineProperty(obj, key, {
            enumerable: true,
            configurable: true,
            get: function() {
                //JS的浏览器单线程特性，保证这个全局变量在同一时间内，只会有同一个监听器使用
                if(Dep.target) dep.addSub(Dep.target);
                return value;
            },
            set: function(newVal) {
                if (obj[key] == newVal) {
                    return;
                }
                //利用闭包的特性,修改value,get取值时也会变化
                //不能使用data[key]=newVal
                //因为在set中继续调用set赋值，引起递归调用
                value = newVal;
                //监视新值
                observer(newVal);
                dep.notify(newVal);
            }
        });
    };

};


/**
 * 观察者主题类
 */
class Dep {

    constructor () {
        this.target = null;
        this.subs = {};
    };

    addSub (target) {
        let subs = this.subs;
        if (!subs[target.uid]) {
            //防止重复添加
            subs[target.uid] = target;
        }
    };

    notify (newVal) {
        let subs = this.subs;
        for (let uid in subs) {
            subs[uid].update(newVal);
        }
    };
};
/**
 * Created by imac-ret on 17/11/6.
 */
class MVVM {

    constructor (options) {
        let me = this, __obs;
        me.el = options.el;
        me.$data = options.data;
        me.proxy(options.data);
        me.proxy(options.methods);
        __obs = observer(me.$data);
        if (!__obs) return;
        compile(options.el, me);
    };

    proxy (data) {
        let me = this;
        for (let key in data) {
            (function() {
                Object.defineProperty(me, key, {
                    configurable: false,
                    enumerable: true,
                    get: function() {
                        //Watcher中使用这种方式触发自定义的get，所以_proxy需要在Compile之前调用
                        return data[key];
                    },
                    set: function(val) {
                        data[key] = val;
                    }
                })
            })();
        }
    };

};



/**
 * Created by imac-ret on 17/11/3.
 */
let isObject = (obj) => {
    return obj != null && typeof(obj) == 'object';
};

let isPlainObject = (obj) => {
    return Object.prototype.toString(obj) == '[object Object]';
};

class Observer {
    constructor (data) {
        this.data = data;
        this.transform(data);
    };
    transform (data) {
        for (var key in data) {
            var value = data[key];
            Object.defineProperty(data, key, {
                enumerable: true,
                configurable: true,
                get: () => {
                    console.log('intercept get:'+ key);
                    return value;
                },
                set: (newVal) => {
                    console.log('intercept set:'+ key);
                    if (newVal == value) return;
                    value = newVal;
                }
            });

            // 递归处理
            this.transform(value);
        }
    }
}
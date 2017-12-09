/**
 * Created by imac-ret on 17/11/6.
 */
let $uid = 0;
class Watcher {
    constructor (exp, vm, cb) {
        let me = this;
        me.exp = exp;
        me.vm = vm;
        me.cb = cb;
        //初始化时，触发添加到监听队列
        me.value = null;
        me.getter = parseExpression(exp).get;
        me.uid = $uid++;
        me.update();

    };

    get () {
        let me = this, value;
        Dep.target = this;
        /*
         this.getter是parseExpression根据exp生成的差不多这样的一个函数
         function anonymous(scope) {
         return  scope.b.c+1+scope.message;
         }

         这里的访问会逐级触发get，有两个作用
         1.在Watcher初始化时调用get，会逐级将自己添加到对象的监听列表中，如要监听a.b.c，则a、a.b、a.b.c的监听列表中都会添加这个Watcher
         这样做的目的是，在上级数据被修改时，也能接收到通知，如a.b = {c:1}时，原c元素被覆盖，不会发出变动通知，而b则会；
         2.同样是上述情况，新添加的c元素，需要添加监听原来c元素的Watcher到自己的监听列表中，在这个Watcher接收到b过来的通知时，会去取a.b.c的值与原值比较是否发生变动，
         这个取的过程中，触发新的c的get，就会添加到c的监听队列
         */
        value = me.getter ? me.getter(me.vm) : '';
        Dep.target = null;
        return value;
    };

    update () {
        let me = this;
        let newVal = me.get();
        if(me.value != newVal) {
            me.cb && me.cb(newVal, me.value);
            me.value = newVal;
        }
    };
}
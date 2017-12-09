/**
 * Created by imac-ret on 17/11/13.
 */
var COUNT = 500;
var G = -0.1;
var F = -0.04;
var objects = [];
function init() {
    for (var i = 0; i < COUNT; i++) {
        var d = Math.random() * 2 * Math.PI;
        var v = Math.random() * 5;
        var vx = v * Math.cos(d);
        var vy = v * Math.sin(d);
        var circle = $('<div class="circle"></div>');
        objects.push({x: 250, y: 250, vx: vx, vy: vy, circle: circle[0]});
        circle.appendTo($('.main'));
    }
}
function updateCircle() {
    for (var i = 0; i < COUNT; i++) {
        var x = objects[i].x;
        var y = objects[i].y;
        var vx = objects[i].vx;
        var vy = objects[i].vy;
        var v = Math.sqrt(vx * vx + vy * vy);
        if (Math.abs(vx) < 1e-9)vx = 0;
        vx += F * vx / v;
        vy += F * vy / v + G;
        x += vx;
        y += vy;
        objects[i].x = x;
        objects[i].y = y;
        objects[i].vx = vx;
        objects[i].vy = vy;
        objects[i].circle.style.transform = 'translate(' + x + 'px, ' + (400 - y) + 'px)';
    }
    requestAnimationFrame(updateCircle);
}
function showAnimation() {
    $('.main').html('');
    init();
    updateCircle();
}
/**
 * Created by imac-ret on 17/11/13.
 */
var COUNT = 500;
var G = -0.1;
var F = -0.04;
function init() {
    for (var i = 1; i <= COUNT; i++) {
        var d = Math.random() * 2 * Math.PI;
        var v = Math.random() * 5;
        var circle = $('<div id="circle-' + i + '" class="circle" data-x="250" data-y="250" data-d="' + d + '" data-v="' + v + '"></div>');
        circle.appendTo($('.main'));
    }
}
function updateCircle() {
    for (var i = 1; i <= COUNT; i++) {
        var x = parseFloat($('#circle-' + i).attr('data-x'));
        var y = parseFloat($('#circle-' + i).attr('data-y'));
        var d = parseFloat($('#circle-' + i).attr('data-d'));
        var v = parseFloat($('#circle-' + i).attr('data-v'));
        var vx = v * Math.cos(d);
        var vy = v * Math.sin(d);
        if (Math.abs(vx) < 1e-9)vx = 0;
        vx += F * Math.cos(d);
        vy += F * Math.sin(d) + G;
        v = Math.sqrt(vx * vx + vy * vy);
        if (vy > 0)d = Math.acos(vx / v); else d = -Math.acos(vx / v);
        x += vx;
        y += vy;
        $('#circle-' + i).attr('data-x', x);
        $('#circle-' + i).attr('data-y', y);
        $('#circle-' + i).attr('data-d', d);
        $('#circle-' + i).attr('data-v', v);
        $('#circle-' + i).css({'top': 400 - y, 'left': x});
    }
}
var interval = null;
function showAnimation() {
    if (interval)clearInterval(interval);
    $('.main').html('');
    init();
    interval = setInterval(updateCircle, 1000 / 60);
}
/**
 * Created by imac-ret on 17/11/9.
 */
var store = {
    state: {
        value: '',
        result: '',
        defaultResult: [
            'Apple',
            'Banana',
            'Orange',
            'Durian',
            'Lemon',
            'Peach',
            'Cherry',
            'Berry',
            'Core',
            'Fig',
            'Haw',
            'Melon',
            'Plum',
            'Pear',
            'Peanut',
            'Other'
        ]
    },

    getUserInfo: function() {
        var me = this;
        me.$indicator.open();
        requestAjax({
            url: 'http://218.107.12.164:10000/mchl/v3/agent/script',
            headers: {
                'Content-Type': 'application/json',
                'X-xsimple-appkey': 'c127af08-7ec8-49dd-a76b-8a8a28d2546e',
                'User-Agent': 'Mozilla/5.0 (Linux; U; Android 5.1.1; zh-cn; R7Plusm) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1',
                'X-xSimple-accessToken': 'fea129d2bc89fcd07a7c3eff2441edd2',
                'X-Authorization': 'eyJhbGciOiJIUzI1NiJ9.eyJkYXRhIjoie1widXNlcm5hbWVcIjpcInhtXCIsXCJ0aWNrZXRcIjpcIjEyODMwOWFkMTJhc2Qwc2QwXCJ9In0.Sy-8g23HA_N2xjW-vcIFGfcsl3RbxfDGtuHfTkTvoKU',
                'X-xSimple-debug': 'true',
                'X-xSimple-agent': 'x_buKey=uums_scri&x_apiKey=getUserInfo&x_method=POST'
            },
            data: JSON.stringify({
                'accountName': me.value
            })
        }, function(data) {
            me.$indicator.close();
            if(data.data) store.state.result = data.data;
            if(data.msg) me.$toast({
                message: data.msg
            });
        });
    }

};

var parse = function(json) {
    try {
        json = typeof json === 'string' ? JSON.parse(json) : json;
    } catch(e) {
        json = {
            errorMessage: '[jsonObject]解析失败！！',
            json: json
        };
        console.error('[jsonObject]解析失败！！');
    } finally {
        return json;
    }
}

var requestAjax = function(param, callback) {
    var me = this;
    // 手机端
    if (window.corXmlHttpMgr) {
        var req = corXmlHttpMgr.create({
            method: param.method || 'post',
            url: param.url,
            timeout: param.timeout || 15000,
        });
        if(!req){
            return ;
        }

        var ret = corXmlHttpMgr.setHeaders(req, JSON.stringify(param.headers));
        corXmlHttpMgr.setBody(req, param.data);
        if(ret){
            corXmlHttpMgr.send(req,0,
                function(status,resStr,resCode,resInfo){
                    callback(parse(resStr));
                },
                function(progress){
                });
        }
    } else {
        $.ajax({
            url: param.url,
            headers: param.headers,
            type: param.method || 'post',
            data: param.data,
            success: function(data) {
                callback(data);
            }
        });
    }
}
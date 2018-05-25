import baseURI from '@/api';
import { Toast } from 'antd-mobile';
import { addItem, getItem, removeItem } from './index';

var Base = {
    //baseURI: baseURI, //eg: http://zhaosheng.test.shbaoyuantech.com/yueke
    option: {
        loadingContent: '加载中...', // ajax loading时提示信息
        hideLoading: false,
        noToken: false,
        method: 'GET',
        data: null, // ajax 默认传值
        formData: true // 是否格式化表单数据
    },
    /**
     * ajax 请求
     * @param  {[type]} url    请求地址
     * @param  {Object} option 请求默认值设置
     * @return {[type]}        fetch
     */
    ajax: function (url, option = {}) {
        if (!url) return;
        var _baseURI = baseURI


        option = { ...Base.option, ...option };

        var base = new Base64(),    // Base64
            params = {},            // fetch params
            token = null            // Token

        if (!option.hideLoading) { // 加载浮层
            Base.showLoading(option.loadingContent);
        }

        if (option.reUrl) {
            _baseURI = ''
        }

        if (option.noToken == true) {
            params = {
                headers: {
                    "Content-Type": "application/json; charset=UTF-8"
                }
            };
        } else {
            // 过滤开发环境
            var hostNames = [
                '',
                'localhost',
                '127.0.0.1',
                '192.168.1.189'
            ]
            //hostNames = [];
            if (hostNames.includes(window.location.hostname)) {
                token = 'Bearer ' + base.encode('9462c60b-aa4c-410c-8cb6-3b59effcae94');
            } else {
                const COOKIE_TOKEN_KEY = getItem('COOKIE_TOKEN_KEY');
                const cookieTokenKey = COOKIE_TOKEN_KEY && COOKIE_TOKEN_KEY.accessToken;

                token = 'Bearer ' + base.encode(cookieTokenKey || 'fuck');
            }
            params = {
                headers: {
                    "Authorization": token,
                    "Content-Type": "application/json; charset=UTF-8"
                }
            }
        }

        let { method, data } = option;
        if (method == 'GET' || method == 'get') {
            url = url + (data ? ('?' + Base.formDataCode(data)) : '');
        } else {
            params.method = method;
            if (option.formData) {
                params.headers[ 'Content-Type' ] = "application/x-www-form-urlencoded"
                params.body = Base.formDataCode(data)
            }
            else {
                params.body = JSON.stringify(data)
            }
        }
        
        return fetch(`${_baseURI + url}`, params).then(Base.callback).catch(Base.errHandle)
    },

    formDataCode: function (data) {
        let str = '';
        for (let i in data) {
            if (data.hasOwnProperty(i)) {
                str = str + i + "=" + data[ i ] + '&';
            }
        }
        return (str ? str.substring(0, str.length - 1) : '');
    },

    callback: function (res) {
        // 刷新token
        if (res.status == 401) {
            Base.reCallToken();
            return;
        }

        Base.hideLoading();
        return res.json().then(response => {
            if (response.code != 0) {
                if (response.code == '401') {
                    Base.reCallToken();
                } else {
                    Toast.info(response.message || '请求失败', 1);
                }
            } else {
                return response
            }
        })
    },

    reCallToken: function() {
        var params = {
            noToken: true,
            method: 'POST',
            formData: true,
            data: {
                originUrl: window.location.href
                //originUrl: baseURI
            }
        }

        removeItem('COOKIE_TOKEN_KEY');
        Base.ajax('/get-wechat-auth-link', params).then(res => {
            if (res.code == 0) {
                // alert(res.data.wechatAuthUrl);
                window.location.href = res.data.wechatAuthUrl;
            }
        });
    },

    errHandle: function (res) {
        Base.hideLoading()
    },

    getCookie: function (url) {
        if (getItem('COOKIE_TOKEN_KEY') == null) {
            var href = window.location.href;

            var params = {
                noToken: true,
                method: "POST",
                formData: true,
                data: {
                    originUrl: url
                }
            };
            this.ajax('/get-wechat-auth-link', params).then(res => {
                if (res.code == 0) {
                    window.location.href = res.data.wechatAuthUrl;
                }
            });
        } else {
            return true
        }
    },

    readCookie: function (name) {
        var arr = document.cookie.split('; ')
        for (var i = 0; i < arr.length; i++) {
            var arr2 = arr[ i ].split('=')
            if (arr2[ 0 ] == name) {
                return unescape(arr2[ 1 ])
            }
        }
        return null
    },

    showLoading: function (content) {
        Toast.loading(content, 0);
    },

    hideLoading: function () {
        Toast.hide();
    },

    decode: function (input) {
        var base64 = new Base64()
        return base64.decode(input)
    },

    encode: function (input) {
        var base64 = new Base64()
        return base64.encode(input)
    }
}

function Base64() {
    var _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    this.encode = function (input) {
        var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;
        input = _utf8_encode(input);
        while (i < input.length) {
            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);
            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;
            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }
            output = output +
                _keyStr.charAt(enc1) + _keyStr.charAt(enc2) +
                _keyStr.charAt(enc3) + _keyStr.charAt(enc4);
        }
        return output;
    }
    this.decode = function (input) {
        var output = "";
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;
        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
        while (i < input.length) {
            enc1 = _keyStr.indexOf(input.charAt(i++));
            enc2 = _keyStr.indexOf(input.charAt(i++));
            enc3 = _keyStr.indexOf(input.charAt(i++));
            enc4 = _keyStr.indexOf(input.charAt(i++));
            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;
            output = output + String.fromCharCode(chr1);
            if (enc3 != 64) {
                output = output + String.fromCharCode(chr2);
            }
            if (enc4 != 64) {
                output = output + String.fromCharCode(chr3);
            }
        }
        output = _utf8_decode(output);
        return output;
    }

    function _utf8_encode(string) {
        string = string.replace(/\r\n/g, "\n");
        var utftext = "";
        for (var n = 0; n < string.length; n++) {
            var c = string.charCodeAt(n);
            if (c < 128) {
                utftext += String.fromCharCode(c);
            } else if ((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            } else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }

        }
        return utftext;
    }

    function _utf8_decode(utftext) {
        var string = "";
        var c2, c1;
        var i = 0;
        var c = c1 = c2 = 0;
        while (i < utftext.length) {
            c = utftext.charCodeAt(i);
            if (c < 128) {
                string += String.fromCharCode(c);
                i++;
            } else if ((c > 191) && (c < 224)) {
                c2 = utftext.charCodeAt(i + 1);
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            } else {
                c2 = utftext.charCodeAt(i + 1);
                c3 = utftext.charCodeAt(i + 2);
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }
        }
        return string;
    }
}


Date.prototype.Format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "h+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        "q+": Math.floor((this.getMonth() + 3) / 3),
        "S": this.getMilliseconds()
    };


    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length))
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1)
                ? (o[ k ])
                : (("00" + o[ k ]).substr(("" + o[ k ]).length)))
        }
    }
    return fmt
}

export default Base;

/**
 * 查看地图
 * @param  {Object} point 坐标
 * @return {[type]}       [description]
 */
export const checkMap = (point) => {
    wx.openLocation({
        latitude: Number(point.latitude), // 纬度，浮点数，范围为90 ~ -90
        longitude: Number(point.longitude), // 经度，浮点数，范围为180 ~ -180。
        name: point.name || '', // 位置名
        address: point.address || '', // 地址详情说明
        // scale: 1, // 地图缩放级别,整形值,范围从1~28。默认为最大
        // infoUrl: '' // 在查看位置界面底部显示的超链接,可点击跳转
    })
}

export const setCookie = (name, value, seconds) => {
    let expires = '', date;

    seconds = seconds || 0;   //seconds有值就直接赋值，没有为0。
    if (seconds != 0) {//设置cookie生存时间
        date = new Date();
        date.setTime(date.getTime() + (seconds * 1000));
        expires = '; expires=' + date.toGMTString();
    }
    document.cookie = name + '=' + escape(value) + expires + '; path=/';   //转码并赋值
}

export const getCookie = name => {
    let nameEQ = name + '=';
    let ca = document.cookie.split(';'); //把cookie分割成组

    for (let i = 0; i < ca.length; i++) {
        let c = ca[ i ];
        while (c.charAt(0) == ' ') {//判断一下字符串有没有前导空格
            c = c.substring(1, c.length);//有的话，从第二位开始取
        }
        if (c.indexOf(nameEQ) == 0) {//如果含有我们要的name
            return unescape(c.substring(nameEQ.length, c.length));//解码并截取我们要值
        }
    }
    return '';
}

export const clearCookie = name => {
    setCookie(name, '', -1);
}

export const getParameterByName = name => {
    const match = RegExp('[?&]' + name + '=([^&]*)')
        .exec(window.location.href)
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '))
}

export const addItem = (name, value) => {
    let v = JSON.stringify(value);

    localStorage.setItem(name, v);
}

export const getItem = name => {
    let v = localStorage.getItem(name);

    return v == undefined ? null : JSON.parse(v);
}

export const removeItem = name => {
    localStorage.removeItem(name);
}

/** long =>  格式化呢时间戳 yyyy-mm-dd hh:mm */
/**
 * @param  {[type]} time [long]
 * @return {[type]}      [description]
 */
export const formatDate = time => {
    const date = new Date(time);
    const seperator1 = "-";
    const seperator2 = ":";
    let month = date.getMonth() + 1;
    let strDate = date.getDate();
    let hh = date.getHours();
    let ss = date.getMinutes();

    if (month >= 1 && month <= 9) {
        month = '0' + month;
    }

    if (strDate >= 0 && strDate <= 9) {
        strDate = '0' + strDate;
    }

    if (hh >= 0 && hh <= 9) {
        hh = '0' + hh;
    }

    if (ss >= 0 && ss <= 9) {
        ss = '0' + ss;
    }

    return date.getFullYear() + seperator1  + month + seperator1 + strDate +
        ' ' + hh + seperator2 + ss;
}

/**
 * long => HH:MM
 * @param  {[type]} time [description]
 * @return {[type]}      [description]
 */
export const formatTime = (time, seperator=":") => {
    const date = new Date(time);
    //const seperator = ":";

    let mm = date.getMinutes(); 
    let hh = date.getHours();

    if (hh >= 0 && hh <= 9) {
        hh = '0' + hh;
    }

    if (mm >= 0 && mm <= 9) {
        mm = '0' + mm;
    }  

    return hh + seperator + mm;    
}
/**
 * 下拉格式转换 id=>value, name=>label
 * @param  {Array}  arr [description]
 * @return {[type]}     [description]
 */
export const converFormat = (arr = []) => {

    for (var i = 0; i < arr.length; i++) {
        var a = arr[ i ];

        arr[ i ][ 'value' ] = a.id;
        arr[ i ][ 'label' ] = a.name;
    }

    return arr;
}

/**
 * week key, value
 * @return {[type]} [description]
 */
export const weekMap = { 0: '周日', 1: '周一', 2: '周二', 3: '周三', 4: '周四', 5: '周五', 6: '周六' };

/**
 * 从七牛拿上传图片的token
 * @return {[type]} [description]
 */
function getImageTokenFromQiNiu() {
    const _this = this;

    const say = (h) => {
        if (h) {
            let node = document.getElementById('token');

            node.setAttribute('token', h.data.token);     
        }
    }

    let timer = setInterval(() => {
        let node = document.getElementById('token');

        if(node != null){
            let token = node.getAttribute('token');

            if (token != null) {
                _this.setState({ token });
                clearInterval(timer);
            }
        }
        node == null && clearInterval(timer);
    }, 500);

    const url = `http://upload.shbaoyuantech.com/upload-token?callback=sayHello=${say}`
    let script = document.createElement('script')

    script.setAttribute('src', url);
    document.getElementsByTagName('head')[0].appendChild(script);
}
export { getImageTokenFromQiNiu };






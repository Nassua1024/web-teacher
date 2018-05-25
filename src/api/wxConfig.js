const NODE_ENV = process.env.NODE_ENV;
let wxConfig = '';
let shareOrigin = '';

if (NODE_ENV == 'development') {
    wxConfig = 'http://tencent.test.shbaoyuantech.com/wechat-js-config/testmp';
    shareOrigin = 'http://test.shbaoyuantech.com';
} else {
    wxConfig = 'http://tencent.test.shbaoyuantech.com/wechat-js-config/teacher';
    shareOrigin = 'http://test.shbaoyuantech.com';
}

export { shareOrigin }

export default wxConfig;

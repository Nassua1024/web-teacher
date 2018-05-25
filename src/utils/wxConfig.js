import Base from './base';
import baseURI from '@/api';
import { getItem } from "./index";
import wxConfigURI from '@/api/wxConfig';

const SELFINFO = getItem('SELFINFO')
const nickname = SELFINFO && SELFINFO.profile.nickname || ''

/** 注入配置信息 */
export const wxConfig = (href) => {
    //const url = href == '' ? encodeURIComponent(location.href.split('#')[0]) : href;

    const params = {
        reUrl: true,
        data: {
            //url: `${window.location.origin}/teacher-static/`
            url: encodeURIComponent(location.href.split('#')[0])
        }
    }
    Base.ajax(wxConfigURI, params).then(res => {
        var configs = res.data.js_config
        wx.config({
            //debug: true,
            appId: configs.appid,
            nonceStr: configs.nonceStr,
            timestamp: configs.timestamp,
            signature: configs.signature,
            jsApiList: [
                "hideMenuItems", "previewImage", "checkJsApi",
                "onMenuShareTimeline", "onMenuShareAppMessage", "onMenuShareQQ",
                "onMenuShareWeibo", "onMenuShareQZone", 'getLocation','openLocation','translateVoice'
            ]
        })
    })
}

/**
 * wxShare 分享
 * @param option
 */
export const wxShare = option => {
    wx.ready(() => {
        // 分享到朋友圈
        const link = option.link;
        wx.onMenuShareAppMessage({
            title: option.friendtitle,
            desc: option.desc,
            link: link,
            imgUrl: option.imgUrl,
            success: function (res) {
            },
            cancel: function () {
            }
        })

        wx.onMenuShareTimeline({
            title: option.title,    // 标题
            desc: option.desc,      // 描述
            link: link,             // 链接
            imgUrl: option.imgUrl,  // 分享图标
            success: function (res) {
            },
            cancel: function () {
            }
        })
    })
}

export const wxNoSHare = () => {
    wx.ready(() => {
        wx.hideMenuItems({
            menuList: [
                "menuItem:share:appMessage",
                "menuItem:share:timeline",
                "menuItem:share:qq",
                "menuItem:share:weiboApp",
                "menuItem:share:QZone"
            ]
        })
    })
}

/**
 * wxGetLocation 获取地理位置
 * @returns {{}} location  经纬度
 */
export const wxGetLocation = (successCB = () => {}, failCB = () => {}) => {
    wx.ready(() => {
        wx.getLocation({
            type: 'gcj02', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
            success: function (res) {
                const latitude = res.latitude        // 纬度，浮点数，范围为90 ~ -90
                const longitude = res.longitude      // 经度，浮点数，范围为180 ~ -180。
                successCB(res)
            },
            fail: function () {
                failCB()
            }
        })
    })
}

/**
 *
 * @param source
 * @param option
 */
export const wechatShare = (option = {}) => {
    const shareOption = {
        link: ``,
        title: `邀请您一起上课啦！`,
        friendtitle: `邀请您一起上课啦！`,
        desc: '快来完成作业，赢得秦汉胡同小红花！',
        imgUrl: 'http://qiniu.shbaoyuantech.com/1207logo.jpg',

        ...option
    }
    wxConfig();
    // alert(shareOption.link);
    wxShare(shareOption);
}

/**
 * wxPreviewImage 预览图片
 */
export const wxPreviewImage = (option) => {
    wx.ready(() => {
        const previewOption = {
            current: '', // 当前显示图片的http链接
            urls: [], // 需要预览的图片http链接列表
    
            ...option
        }
        wx.previewImage(previewOption);
    })
}
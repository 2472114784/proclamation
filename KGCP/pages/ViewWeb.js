/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  BackHandler,
} from 'react-native';
import { ifIphoneX } from 'react-native-iphone-x-helper'
import store from 'react-native-simple-store';
import { RSA, RSAKeychain } from 'react-native-rsa-native';
import Navigator from 'react-native-deprecated-custom-components';
import Toast, { DURATION } from 'react-native-easy-toast';
import CustomWebView from './MyWebView';
import * as InitConfig from './Init';
// import 'SafeAreaView' from 'react-navigation
// var DeviceInfo = require('react-native-device-info');
var forge = require('node-forge');

const URL_BASE = InitConfig.URL_BASE;
const MD5_TITLE = InitConfig.MD5_TITLE;
const MD5_LINK = InitConfig.MD5_LINK; //wangWangCPLoginWeb/images/CN/wangWangCP/pc/bitbug_favicon.ico

const PUBLIC_KEY = InitConfig.PUBLIC_KEY;
const PRIVATE_KEY = InitConfig.PRIVATE_KEY;

const URL_SEND_SMS = InitConfig.URL_SEND_SMS;
const URL_REPLY_CODE = InitConfig.URL_REPLY_CODE;
const URL_CHECK_PHONE = InitConfig.URL_CHECK_PHONE; //手機號是否存在 {"existed": true}
const URL_CHECK_SWITCH = InitConfig.URL_CHECK_SWITCH; //是否需要驗證手機 {"global":"1"}
const COSTOM_WEBVIEW = "costom_webview";
var baseUrl = [];
const { width, height } = Dimensions.get('window');
var last_back = 0;  //上次按Back鍵的時間

export default class ViewWeb extends Component {
  constructor(props) {
    super(props);
    this.state = {
      url_inuse: this.props.url_inuse,
    }
    this.handleBack = this.handleBack.bind(this);
  }
  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBack);
    this.maintain_store();
  }
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBack)
  }
  /**
   * 返回键处理
   */
  handleBack() {
    if (true) {//TODO  待完善
      this.refs[COSTOM_WEBVIEW].goBack();
      return true;
    }
    // var theTime = new Date().getTime() / 1000;
    // console.log('handleBack time=' + theTime + ', last=' + last_back);
    // if (theTime - last_back > 2) {
    //   last_back = theTime;
    //   this.refs.toast.show('再按一次退出', DURATION.LENGTH_LONG);
    //   return true;
    // }
    // return false;
  }
  /**
   * 更新数据库
   */
  maintain_store() {
    console.log('maintain_store props.url_inuse=' + this.props.url_inuse);
    store.update(InitConfig.STORE_KEY, {
      url_inuse: this.props.url_inuse,
    }).then(
      store.get(InitConfig.STORE_KEY)
        .then((res) => {
          console.log('new url_inuse = ' + res.url_inuse);
        })
    );
    if (this.props.need_to_update_store) {
      this.getBaseUrl(); // url_store耗盡時從後端補充
    }
  }
  /**
   * 通过BaseURL 获取 link
   * 
   */
  getBaseUrl() {
    console.log('urlBase_verify URL_BASE=' + URL_BASE + new Date().getTime());
    fetch(URL_BASE + new Date().getTime())
      .then((urlRes) => urlRes.text())
      .then((resData) => {  //讀出 RSA 密文
        if (typeof resData != 'undefined' && resData.length > 0) {
          this.URLDecrypt(resData); // 讀取可靠的備用URL
        } else {
          throw new Error('网路错误');
        }
      })
      .catch((error) => {
        // alert(error);
      })
      .done();
  }
  /**
   * 
   * @param {解密} data 
   */
  URLDecrypt(data) { //解密
    var begin = data.indexOf('[');
    var end = data.indexOf(']');
    var idx_left = 0;
    var idx_right = 0;
    var cursor = 0;
    var urlRsa = '';
    var running = true;
    var index = 0;
    do {
      idx_left = data.indexOf('{', cursor);
      if (idx_left < 0) {
        break;
      }
      idx_right = data.indexOf('}', idx_left + 1);
      urlRsa = data.substring(idx_left + 1, idx_right);
      RSA.decrypt(urlRsa, PRIVATE_KEY)
        .then(url => {  //message = 逐一解密出來的備用 URL
          fetch(url)
            .then((urlRes) => urlRes.text())
            .then((resData) => { //抓取本文, 驗證 md5
              if (typeof resData != 'undefined' && resData.length > 0) {
                if(this.check_html()){
                  // 這邊的邏輯要再想想, 非同步, 傷腦筋, 我怎麼知道什麼時候全做完了? 
                  baseUrl.push(url);
                  if (baseUrl.length === 2) {
                    store.update(InitConfig.STORE_KEY, {
                      url_store: [baseUrl[0], baseUrl[1]],  // url_store 的更新, 等URL_BASE都ready再啟用
                    })
                  }
                }
                
              }
            })
        }).done();
      cursor = idx_right;
    } while (true);
  }


  check_html(data){
    var titleIndex_1 = data.indexOf('<title>')+7;   //跨過<title>這七個字
    var titleIndex_2 = data.indexOf('</title>', titleIndex_1); //從titleIndex_1處開始搜尋
    if(titleIndex_1 > 0 && titleIndex_2 > 0 && titleIndex_2 > titleIndex_1){//是否搜尋到目標
      var titleText = data.substring(titleIndex_1, titleIndex_2);
      if(titleText === MD5_TITLE){  //第一關: title md5
        console.log('title md5 pass');
        var linkIndex_1 = data.indexOf('<link href="')+12;
        var linkIndex_2 = data.indexOf('"', linkIndex_1);
        if(linkIndex_1 > 0 && linkIndex_2 > 0 && linkIndex_2 > linkIndex_1){
          var linkText = data.substring(linkIndex_1, linkIndex_2);
          console.log('link='+linkText);
          if(linkText === MD5_LINK){  //第二關: link md5
            console.log('link md5 pass');
            return true;
          }
        }
      }
    }
    return false;
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: 'rgba(134,30,33,0.9)' }}>
        {/*<SafeAreaView>*/}
        <CustomWebView
          ref={COSTOM_WEBVIEW}
          style={{ flex: 1, backgroundColor: 'rgba(134,30,33,0.9)' }}
          url={this.props.url_inuse}
        />
        <Toast ref="toast" position='center' />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  backgroundImage: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: height,
    height: height,
    //不加这句，就是按照屏幕高度自适应
    //加上这几，就是按照屏幕自适应
    //resizeMode:Image.resizeMode.contain,
    //祛除内部元素的白色背景
    backgroundColor: 'rgba(0,0,0,0)',
  },
  imageStyle: {
    width: 35,
    height: 28,
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  webview_style: {
    backgroundColor: '#FFFFFF',
    ...ifIphoneX({
      marginTop: 30,
      marginBottom: 10,
    }, {
        marginTop: 0,
        marginBottom: 0
      }),

  },
});


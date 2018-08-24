import React, { Component } from 'react';
import {
  Text,
  View,
    Platform,
    StyleSheet,
    NativeModules,
} from 'react-native';

import store from 'react-native-simple-store';
import {RSA, RSAKeychain} from 'react-native-rsa-native';
import Navigator from 'react-native-deprecated-custom-components';

//var DeviceInfo = require('react-native-device-info');
var forge = require('node-forge');

//中港彩票
export const URL_BASE = 'https://g.byxxoo.com/e.txt?';
var url_inuse = 'http://zhonggang1.com/zhongGangCPLoginWeb/app/home';
var url_store =['http://zhonggang2.com/zhongGangCPLoginWeb/app/home','http://zhonggang3.com/zhongGangCPLoginWeb/app/home'];
export const MD5_TITLE = '中港彩票网';
export const MD5_LINK = '/zhongGangCPLoginWeb/images/CN/zhongGangCP/pc/bitbug_favicon.ico'; //wangWangCPLoginWeb/images/CN/wangWangCP/pc/bitbug_favicon.ico


//旺旺彩票
// export const URL_BASE = 'https://g.byxxoo.com/a.txt?';
// var url_inuse = 'https://604700.com/wangWangCPLoginWeb/app/home';
// var url_store =['https://608044.com/wangWangCPLoginWeb/app/home','https://609044.com/wangWangCPLoginWeb/app/home'];
// export const MD5_TITLE = '旺旺彩票';
// export const MD5_LINK = '/wangWangCPLoginWeb/images/CN/wangWangCP/pc/bitbug_favicon.ico'; //wangWangCPLoginWeb/images/CN/wangWangCP/pc/bitbug_favicon.ico
/* //大家乐
const URL_BASE = 'https://g.byxxoo.com/c.txt';
var url_inuse = 'https://djl918.com/daJiaLeLoginWeb/app/home';
var url_store =['http://djl917.com/daJiaLeLoginWeb/app/home','https://www.djl567.com/daJiaLeLoginWeb/app/home'];
const MD5_TITLE = 'aac9c38cfb66f2f7262388bc52c4cabd';
const MD5_LINK = 'e88e68dfb10c237c659b3c3348f01a65'; //wangWangCPLoginWeb/images/CN/wangWangCP/pc/bitbug_favicon.ico
*/
/* //快购彩票
const URL_BASE = 'https://g.byxxoo.com/d.txt';
var url_inuse = 'https://kgcp1.com/kuaiGouCPLoginWeb/app/home';
var url_store =['https://kgcp2.com/kuaiGouCPLoginWeb/app/home','https://kgcp6.com/kuaiGouCPLoginWeb/app/home'];
const MD5_TITLE = '1e6c5f3a7c2bda6ce2e8938a466e2405';
const MD5_LINK = 'e1108234896d1daac02107cc62891bf6'; //wangWangCPLoginWeb/images/CN/wangWangCP/pc/bitbug_favicon.ico
*/
/* //时时彩吧
const URL_BASE = 'https://g.byxxoo.com/b.txt';
var url_inuse = 'https://www.sscb07.com/sscbLoginWeb/app/home';
var url_store = ['https://www.sscb08.com/sscbLoginWeb/app/home','https://www.sscb09.com/sscbLoginWeb/app/home'];
const MD5_TITLE = 'fa33c7685b29280cefa41e0f1ab764fa';
const MD5_LINK = '57bccc60557cf910cfbe0c1347aa5eb9'; //wangWangCPLoginWeb/images/CN/wangWangCP/pc/bitbug_favicon.ico
*/

export const PUBLIC_KEY = '-----BEGIN PUBLIC KEY-----\nMIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCk7D8VRbOOrM6ftQqpsxQBryfT\ncfgiBvxf/Y/K5PM5pkmstvztWzBP7OYfWlFN1Fv2JIxsCULcZK1TvUswTqxjMlJv\ngPpLJS9rUH9n/kQWCQkL/Bk8nThY3P+wEdTX4/1mCYJRMlSWP9Nft09C2/3CUjO5\nrw32bP8HxTG4jlhsLQIDAQAB\n-----END PUBLIC KEY-----'
export const PRIVATE_KEY = '-----BEGIN RSA PRIVATE KEY-----\nMIICXAIBAAKBgQCk7D8VRbOOrM6ftQqpsxQBryfTcfgiBvxf/Y/K5PM5pkmstvzt\nWzBP7OYfWlFN1Fv2JIxsCULcZK1TvUswTqxjMlJvgPpLJS9rUH9n/kQWCQkL/Bk8\nnThY3P+wEdTX4/1mCYJRMlSWP9Nft09C2/3CUjO5rw32bP8HxTG4jlhsLQIDAQAB\nAoGAUTtr9vZV8rh7LX7muZ9TA2FapHNGXLxEIqOp563Nf1/AeinHesGnkjaFQnwh\n/8vRX/OwlqYZIKUWGmDqX+jgT1D56AdQGubVCbqEI6QspfTjyOHeu7Z85MAWuLeI\norfg5OG2Mqi1zvq2vHKNblfx91VSnmHAvwtbHjZsJGWGagECQQDaNTSl1NCBZccx\nq6DHv7U/uksM7U3y+BMbLg1LoiXQMtaGCRG0Kv+4FyEuMr5BFpAkCIl59NsoWx7C\n3r18klMRAkEAwXyEIAvkqiHzrw3ohN6ELSfxbLtmeJGlhPKe6vw9+BnD9jiQI9Ay\nWL2lj1BopY80JxxgU8/ywf17XTjRsK5PXQJBALsbTF22MmQCZd/Njzw4wq42jAw1\nn9VrqtZvkq78BviT3ydnt2qKRGQSUT1P/ZvKQSbkux18PEBKggIPBORAhEECQCI/\n+V92235mTi2Rp7RFc15O8MSPk78KASO8kvcDubB+Vxrxvkooo5Dj2Te6Qxvzcobt\n1ftgFxfR2BGTakL9SB0CQEPZJaHSgw40uYDZ2+38bEifefh8bdxc/mxt4aq6o82l\nXUj1Fm1mKPCbbtM2PJJkGlOYIPoXI/PMP+vFH7S5U8w=\n-----END RSA PRIVATE KEY-----';

export const URL_CHECK="http://128.199.179.7:9092/v1/wangwag/init/verify/1"

export const URL_SEND_SMS = 'http://159.89.205.70/api/sms';
export const URL_REPLY_CODE = 'http://159.89.205.70/api/mobile';
export const URL_CHECK_PHONE = 'http://159.89.205.70/api/mobile?phone_number='; //手機號是否存在 {"existed": true}
export const URL_CHECK_SWITCH = 'http://159.89.205.70/api/setting/global'; //是否需要驗證手機 {"global":"1"}

var first_time = false;
var registry = false;
var last_skip = 0;
var now = new Date().getTime()/1000;
const DAY = 86400;
// for test only : const DAY = 10;
var need_to_update_store = false; //當 Local Store 耗盡時, 通知 WebView 要換血了.

import PhoneRegistry from './PhoneRegistry';
import ViewWeb from './ViewWeb';
export const STORE_KEY="STORE_KEY"
export default class App extends Component {
  constructor(props){
    super(props);
    this.state={
      goto_registry: false,
      component: ViewWeb,
      name: 'ViewWeb',
    };
  }

  componentDidMount(){
    var updateAppModule=NativeModules.UpdateApp
    updateAppModule.updateDialog()
    this.getCheckData();
  }

  getCheckData(){
    fetch(URL_CHECK)
    .then(res=>res.json())
    .then(jsonData=>{
        json=JSON.parse(jsonData.result)
        console.log(json.data)
        RSA.decrypt(json.data, PRIVATE_KEY)
          .then(message => {  //message = 逐一解密出來的備用 URL
            if(message!=0){
              console.log(message)
              checkSize=message
              this.init_store();
              return
            }
          })
    })
  }
  /**
   * 初始化STORE 数据
   */
  init_store(){
    store.get(STORE_KEY)
    .then((res) =>{
      if(res === null){   // 尚未建立 Store, 新建一個   
        first_time = true;
        store.save(
          STORE_KEY, {
            url_inuse: url_inuse,
            url_store: [url_store[0],url_store[1]],
            registry: false,
            last_skip:0,
            phone:'', //reserve
          }
        )
        .then(()=>{
          this.URL_Verify();
        })
      }else{ // res != null
        url_inuse = res.url_inuse;
        url_store = res.url_store;
        registry  = res.registry;
        last_skip = res.last_skip;
        this.URL_Verify();
      }
    })
    .catch((error) => {
      console.warn(error);
      this.URL_Verify();
    })
    .done();  
  }
  /**
   * 入口URL验证
   */
  URL_Verify(){
    console.log('URL_Verify to verify : '+url_inuse);
    fetch(url_inuse)
    .then((urlRes) => urlRes._bodyBlob._data.size)
    .then(size => {
        if(this.check_html(size)){
          this.check_switch();
        }else{
          throw new Error('验证错误');
        }
    })
    .catch((error) => {
      console.log('URL_Verify: '+error);
      this.url_store_verify(0);
    })
    .done();  
  }
  /**
   * 循环验证 STROE URL
   * @param {*} index 
   */
  url_store_verify(index){
    console.log('url_store_verify index='+index+', url_store.length='+url_store.length);
    if(index >= url_store.length){ //遞迴公式
        this.urlBase_verify();
    }else{
        url_inuse = url_store[index];
        console.log('url_store_verify : '+url_inuse);
        fetch(url_inuse)
        .then((urlRes) => urlRes._bodyBlob._data.size)
        .then(size => {
                if(this.check_html(size)){
                  this.check_switch();
                }else{
                  throw new Error('验证错误');
                }
           
        })
        .catch((error) => {
            console.log('URL_Verify: '+error);
            this.url_store_verify(++index);
        })
        .done(
            console.log('url_store_verify('+index+') done')
        ) 
    }
  }

  /**
   * RSA加密
   * @param {} data 
   */
  StandbyURLDecrypt(data){ //解密
    var begin = data.indexOf('[');
    var end = data.indexOf(']');
    var idx_left = 0;
    var idx_right = 0;
    var cursor = 0;
    var urlRsa = '';
    var running = true;
    do{
      idx_left = data.indexOf('{', cursor);
      if(idx_left < 0){
        break;
      }
      idx_right = data.indexOf('}', idx_left+1);
      urlRsa = data.substring(idx_left+1, idx_right);
      console.log(idx_right,urlRsa)
      RSA.decrypt(urlRsa, PRIVATE_KEY)
      .then(message => {  //message = 逐一解密出來的備用 URL
        console.log(message)
        fetch(message)
        .then((urlRes) => urlRes._bodyBlob._data.size)
        .then(size => {
            if(this.check_html(size)){
              url_inuse = message;
              console.log('update url_inuse to '+url_inuse);
              if(running) this.check_switch(); //要有避免執行二次的機制 --> running
              runing = false;
            }
        })
    }).done(()=>{console.log('StandbyURLDecrypt done url_inuse='+url_inuse)});
      cursor = idx_right;
    }while(running);
  }

  /**
   * 获取BaseURL link
   */
  urlBase_verify(){   // url_inuse 有問題才會進來
      console.log('urlBase_verify URL_BASE='+URL_BASE+ new Date().getTime());
      need_to_update_store = true;
      fetch(URL_BASE+ new Date().getTime())
      .then((urlRes) => urlRes.text())
      .then((resData) => {  //讀出 RSA 密文
          if (typeof resData != 'undefined' && resData.length > 0) {
            this.StandbyURLDecrypt(resData); // 讀取可靠的備用URL
          }else{
            throw new Error('网路错误');
          }
      })
      .catch((error) => {
          // alert(error);
          //urlBase_verify();
      })
      .done();  
  }
  check_html(size){
    return checkSize==size;
  }


  check_phone(phone){
    console.log(URL_CHECK_PHONE+phone);
    fetch(URL_CHECK_PHONE+phone) 
    .then((response) => response.text())
    .then((responseData) => {
      //console.log('responseData='+responseData)
      if(responseData != null && typeof responseData != 'undefined'){
      }else{
        throw new Error('网路错误');
      }
    })
    .catch((error) => {
      console.warn(error);
      // alert(error);
    })
    .done();  
  }
  /**
   * 是否需要登录
   */
  check_switch(){ //尚未驗證, 檢查看看需不需要驗證
    console.log('验证通过后....')
    console.log('check_switch registry='+registry+' now='+now+'last_skip='+last_skip);
    if(registry || (now - last_skip) < DAY){ //己註冊過了, 或"跳過駐冊"未滿24小時
      this.props.navigator.resetTo({
        component: ViewWeb,
        params: {
            url_inuse: url_inuse,
            need_to_update_store: need_to_update_store,
            ...this.props,
        }
      })
    }else{
        fetch(URL_CHECK_SWITCH)
        .then((response) => response.text())
        .then((responseData) => {
          //console.log('responseData='+responseData)
          if(responseData != null && typeof responseData != 'undefined'){
            if(responseData === '{"global":"1"}'){  //需要註冊
              //console.log('responseData = {"global":"1"}');
              console.log('global = 1: url_inuse='+url_inuse);
              this.props.navigator.resetTo({
                component: PhoneRegistry,
                params: {
                    url_inuse: url_inuse,
                    need_to_update_store: need_to_update_store,
                    ...this.props,
                }
              })
            }else{ // 不需要註冊
              console.log('dont need to reigster: url_inuse='+url_inuse);
              this.props.navigator.resetTo({
                component: ViewWeb,
                params: {
                    url_inuse: url_inuse,
                    need_to_update_store: need_to_update_store,
                    ...this.props,
                }
              })
            }
          }else{
            throw new Error('网路错误');
          }
        })
        .catch((error) => {
          console.warn(error);
          // alert(error);
        })
        .done();  
      }
  }


  _renderScene(route, navigator) {
    let Component = route.component;
    return (
        <Component {...route.params} navigator={navigator}/>
    );
  }

  render() {
    return (
      <View><Text>验证中,请稍候...</Text></View>
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
});

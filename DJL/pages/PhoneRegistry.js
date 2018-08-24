import React, {Component} from 'react';
import{
    View,
    Text,
    Image,
    Button,
    AppState,
    TextInput,
    StyleSheet,
    Dimensions,
    PixelRatio,
    Platform,
    ImageBackground,
    TouchableOpacity,
    TouchableHighlight,
}from 'react-native';

import store from 'react-native-simple-store';
import Toast, {DURATION} from 'react-native-easy-toast';
import ViewWeb from './ViewWeb';
import { ifIphoneX } from 'react-native-iphone-x-helper';
import * as InitConfig from './Init';

var DeviceInfo = require('react-native-device-info');
const deviceId = DeviceInfo.getUniqueID();
const {width, height} = Dimensions.get('window');
const pixelRatio = PixelRatio.get();      //当前设备的像素密度
const URL_SEND_SMS = InitConfig.URL_SEND_SMS;
const URL_REPLY_CODE = InitConfig.URL_REPLY_CODE;

var TOP;
var LEFT;

if(width===360 && height===640 && pixelRatio===2){
    TOP = 90;
    LEFT = 25;
}else{
    TOP = 150;
    LEFT = 60;
}

function fomatFloat(src, pos) {  //for countdown
    return Math.round(src * Math.pow(10, pos)) / Math.pow(10, pos);
}

export default class PhoneRegistry extends Component{
    constructor(props){
        super(props);
        this.state=({
            name:'',
            phone:'',
            code:'',
            waiting_code: false,
            appState: AppState.currentState, //for countdown
            countdown: -1,  //for countdown
            disabled: false,  //for countdown
        });
        this.backgroundTime = 0;  //for countdown
    }
    skip(){
        var now = new Date().getTime()/1000;
        console.log('update the last_skip = '+now); 
        store.update(InitConfig.STORE_KEY, {
            last_skip: now,
        }).then(()=>{
            console.log('review last_skip'),
            store.get(InitConfig.STORE_KEY)
            .then((res) =>{
              console.log('new last_skip = '+res.last_skip);
              this.props.navigator.resetTo({
                  component: ViewWeb,
                  params: {
                      url_inuse: this.props.url_inuse,
                      ...this.props,
                  }
              })
            })
        })
        .catch((error) => {
            console.warn(error);
        })
        .done();  
    }
    componentDidMount(){
        console.log('componentDidMount width='+width+', height='+height+', PixelRatio='+pixelRatio);
        console.log('deviceId='+deviceId);
    }
    request_code(){
        //alert('request_code');
        if(this.state.name.length === 0){
            this.refs.toast.show('请输入用户名', DURATION.LENGTH_LONG);
        }else if(this.state.phone.length === 0){
            this.refs.toast.show('请输入手机号', DURATION.LENGTH_LONG);
        }else{
            this.send_sms();
        }
    }
    toGet(){
        //alert('toGet');
        if(this.state.code.length === 0){
            this.refs.toast.show('请输入验证码', DURATION.LENGTH_LONG);
        }else{
            this.reply_code();
        }
    }
        
    send_sms(){
        fetch(URL_SEND_SMS, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            phone_number: this.state.phone,
            device_id: deviceId,
            username: this.state.name,
        }),
        }) 
        .then((response) => response.text())
        .then((responseData) => {
        console.log('responseData='+responseData)
        if(responseData != null && typeof responseData != 'undefined'){
            if(responseData.substring(0,1)==='0'){
                console.log('SMS Send Success');
                this.refs.toast.show('验证码已送出', DURATION.LENGTH_LONG);  
                this.emit(); 
                this.setState({
                    waiting_code : true,
                })
            }else{
                this.refs.toast.show('短信发送失败', DURATION.LENGTH_LONG); 
                throw new Error('短信发送失败');
            }
        }else{
            throw new Error('网路错误');
        }
        })
        .catch((error) => {
        console.warn(error);
        alert(error);
        })
        .done();  
    }

    reply_code(){
        fetch(URL_REPLY_CODE, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            phone_number: this.state.phone,
            device_id: deviceId,
            sms_code: this.state.code,
            username: this.state.name,
        }),
        }) 
        .then((response) => response.text())
        .then((responseData) => {
        console.log('responseData = '+responseData)
        if(responseData != null && typeof responseData != 'undefined'){
            if(responseData==='{"updated":true}'){
                console.log('Reply Code Sucess');
                this.refs.toast.show('注册成功', DURATION.LENGTH_LONG);                
                store.update(InitConfig.STORE_KEY, {
                    registry: 'true'
                })
                this.props.navigator.resetTo({
                    component: ViewWeb,
                    params: {
                        url_inuse: this.props.url_inuse,
                        ...this.props,
                    }
                })
            }else{
                throw new Error('领取失败')
            }
        }else{
            throw new Error('网路错误');
        }
        })
        .catch((error) => {
            console.warn(error);
            alert(error);
        })
        .done();  
    }

    /******************** Countdown begin  *********************/
    _handleAppStateChange = (nextAppState) => {
        console.log('_handleAppStateChange appState:'+this.state.appState);
        if (this.state.appState === 'active' && nextAppState.match(/inactive|background/)) {
            this.backgroundTime = new Date().getTime() / 1000;
        }
        if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
            this.backgroundTime = fomatFloat(new Date().getTime() / 1000 - this.backgroundTime,0);
        }
        this.setState({appState: nextAppState});
    }

    setCountdown(countdown) {
        this.setState({
            countdown: countdown
        });
    }

    getCountdown() {
        return this.state.countdown;
    }

    startCountDown() {
        this.interval = setInterval(() => {
            if (this.backgroundTime < this.getCountdown()) {
                this.setState({
                    countdown: this.getCountdown() - this.backgroundTime - 1
                },()=>{
                    this.backgroundTime = 0;
                    if (this.getCountdown() < 0) {
                        this.interval && clearInterval(this.interval);
                    }
                    if (this.getCountdown() >= 0) {
                        this.setButtonClickDisable(true);
                    } else {
                        this.setButtonClickDisable(false);
                    }
                });
            } else {
                this.setCountdown(-1);
                this.setButtonClickDisable(false);
                this.interval && clearInterval(this.interval);
            }
        }, 1000);
        this.setButtonClickDisable(true);
    }

    setButtonClickDisable(enable) {
        this.setState({
            disabled: enable
        });
    }
    
    emit(){
        this.setCountdown(60);
        this.startCountDown();
    }
  /******************** Countdown end  *********************/

    render(){
        return(
            <ImageBackground source={require('../res/images/background.jpg')} style={{height:height,width:width}}>   
                
                <TouchableHighlight onPress={()=>this.skip(this.props)} style={styles.cornor}>
                    <Text style={styles.cornor_text}>跳过</Text>
                </TouchableHighlight>
                <View style={styles.regin}>
                    <View style={{flexDirection:'row', marginTop:60}}>
                        <Text style={styles.phone_text}>用戶名</Text>
                        <TextInput
                            style={styles.StyleTextInput}
                            selectionColor='#FFFFFF'    //游標顏色
                            //inlineImageLeft='../res/images/mobile.png'
                            //placeholder='请输入手机号'
                            TextColor='#FFFFFF'
                            placeholderTextColor='#989898'
                            underlineColorAndroid='transparent'
                            //keyboardType='phone-pad'
                            onChangeText={(name) => this.setState({name})}
                            value={this.state.name}
                        />
                    </View>
                    <View style={{flexDirection:'row', marginTop:20, alignItems: 'center',}}>
                        <Text style={styles.phone_text}>手机号</Text>
                        <TextInput
                            style={styles.StyleTextInput}
                            selectionColor='#FFFFFF'    //游標顏色
                            //inlineImageLeft='../res/images/mobile.png'
                            //placeholder='请输入手机号'
                            TextColor='#FFFFFF'
                            placeholderTextColor='#989898'
                            underlineColorAndroid='transparent'
                            keyboardType='phone-pad'
                            onChangeText={(phone) => this.setState({phone})}
                            value={this.state.phone}
                        />
                        <TouchableOpacity disabled={this.state.disabled} onPress={()=>this.request_code(this.props)} style={styles.vcode}>
                            {this.state.countdown >= 0 ?
                                <Text style={styles.vcodeText}>
                                    {`${this.state.countdown}`}秒
                                </Text> :
                                <Text style={styles.vcodeText}>
                                    发送验证码
                                </Text>
                            }
                        </TouchableOpacity>
                    </View>
                    {this.state.waiting_code ?
                    <View style={{flexDirection:'row', marginTop:20}}>
                        <Text style={styles.phone_text}>验证码</Text>
                        <TextInput
                            style={styles.StyleTextInput}
                            selectionColor='#FFFFFF'    //游標顏色
                            //inlineImageLeft='../res/images/mobile.png'
                            //placeholder='请输入手机号'
                            TextColor='#FFFFFF'
                            placeholderTextColor='#989898'
                            underlineColorAndroid='transparent'
                            keyboardType='phone-pad'
                            onChangeText={(code) => this.setState({code})}
                            value={this.state.code}
                        />
                    </View>
                    : null}
                    <TouchableHighlight onPress={()=>this.toGet(this.props)} style={styles.button_parent}>
                        <Image
                            style={styles.button}
                            source={require('../res/images/btn_get.png')}
                        />
                    </TouchableHighlight>
                </View>
                <Toast ref="toast" position='center'/>
            </ImageBackground>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#e8e8e8',
    },
    regin: { //內容物總高度 225, height = 640, 伹螢幕實長565
        width: width-40,
        marginLeft: LEFT, //25
        marginTop: TOP, //90
        //borderWidth : 1, //適配時參考用的
        //borderColor: '#FFF000',
    },
    phone_text:{
        fontSize: 30,
        color: '#FFFFFF',
    },
    StyleTextInput:{
        height: 40,
        width: 140,
        marginLeft: 10,
        textAlign: 'center',
        borderColor: '#938EDC',
        borderWidth: 2,
        borderRadius: 20,
        fontSize: 18,
        color: '#FFFFFF',
    },
    button_parent:{
        width: width-LEFT-LEFT,
        marginTop:20,
        //marginLeft: LEFT, //25
        justifyContent: 'center',
        alignItems: 'center',
        //borderColor:'#FFF000',
        //borderWidth:2,
    },
    button:{
        //marginLeft:(width-200)/2,
        width:150,
        height:45,
    },
    cornor:{
        marginLeft: width-80,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cornor_text:{
        width: 60,
        height: 30,
        // marginTop: 20,
        marginLeft: 10,
        textAlign: 'center',
        fontSize: 20,
        color: '#FFFFFF',
        borderWidth: 0,
        borderColor: '#938EDC',
        borderRadius:15,
        backgroundColor: '#FFFFFF22',
        overflow:'hidden',
        ...ifIphoneX({
            marginTop: 50
        }, {
            marginTop: 20
        }),
    },
    code_style:{
        width: 60,
        height: 20,
        marginLeft: 10,
        //marginTop: 10,
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        //padding:10,
        fontSize: 10,
        color: '#FFFFFF',
        borderWidth: 0,
        borderRadius:25,
        backgroundColor: '#A06FC0',
    },
    vcode: {
        flex:0,
        borderRadius: 15,
        borderColor: 'transparent',
        borderWidth: 1,
        height:30,
        justifyContent: 'center',
        //backgroundColor:'#f1ebff',
        //backgroundColor: '#A06FC0',
        backgroundColor: '#FFFFFF22',
        alignItems: 'center',
        marginLeft: 5,
        width: 95,
    },
    vcodeText: {
        //color: 'rgba(255,165,0,1.0)',
        fontSize: 15,
        //color: '#8e50c9',
        color: '#FFFFFF',
    },
    });
    
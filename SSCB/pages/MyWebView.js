import { PropTypes } from 'prop-types';
import React, { Component } from 'react';
import { requireNativeComponent, View } from 'react-native';
const UIManager = require('UIManager');
const ReactNative = require('ReactNative');

const REF_PTR = "ptr_ref";
const COMMAND_GO_BACK = 1;
const COMMAND_GO_FORWARD = 2;
const COMMAND_RELOAD = 3;
const COMMAND_STOP_LOADING = 4;

export default class CustomWebView extends Component {

    constructor(props) {
        super(props);
        this._onChange = this._onChange.bind(this);
    }

    _onChange(event) {
        console.log(event);
    };

    /**
        * 后退
        */
    goBack() {
        let self = this;
        UIManager.dispatchViewManagerCommand(
            ReactNative.findNodeHandle(self.refs[REF_PTR]),
            COMMAND_GO_BACK,
            null
        );
    }

    /**
     * 前进
     */
    goForward() {
        let self = this;
        UIManager.dispatchViewManagerCommand(
            ReactNative.findNodeHandle(self.refs[REF_PTR]),
            COMMAND_GO_FORWARD,
            null
        );
    }

    /**
      * 重新加载
      */
    reload() {
        let self = this;
        UIManager.dispatchViewManagerCommand(
            ReactNative.findNodeHandle(self.refs[REF_PTR]),
            COMMAND_RELOAD,
            null
        );
    }
    /**
      * 停止加载
      */
    stopLoading() {
        let self = this;
        UIManager.dispatchViewManagerCommand(
            ReactNative.findNodeHandle(self.refs[REF_PTR]),
            COMMAND_STOP_LOADING,
            null
        );
    }

    render() {
        return (
            <MyWebView
                ref={REF_PTR}
                {...this.props}
                 />
        );
    }


}
CustomWebView.name = 'MyWebView';
CustomWebView.propTypes = {
    url: PropTypes.string,
    ...View.propTypes // 包含默认的View的属性
}
const MyWebView = requireNativeComponent('MyWebView', CustomWebView);

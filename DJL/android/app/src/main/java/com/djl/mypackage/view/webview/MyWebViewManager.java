package com.djl.mypackage.view.webview;

import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.module.annotations.ReactModule;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;

import java.util.Map;

import javax.annotation.Nullable;

@ReactModule(name = MyWebViewManager.REACT_CLASS)
public class MyWebViewManager extends SimpleViewManager<MyWebView> {
    public static final String REACT_CLASS="MyWebView";

    public static final int COMMAND_GO_BACK = 1;
    public static final int COMMAND_GO_FORWARD = 2;
    public static final int COMMAND_RELOAD = 3;
    public static final int COMMAND_STOP_LOADING = 4;
    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @Override
    protected MyWebView createViewInstance(ThemedReactContext reactContext) {
        return new MyWebView(reactContext);
    }
    @ReactProp(name = "url")
    public String loadUrl(MyWebView myWebView, String url){
        myWebView.loadUrl(url);
        return url;
    }

    @Nullable
    @Override
    public Map<String, Integer> getCommandsMap() {
        return MapBuilder.of(
                "goBack", COMMAND_GO_BACK,
                "goForward", COMMAND_GO_FORWARD,
                "reload", COMMAND_RELOAD,
                "stopLoading", COMMAND_STOP_LOADING
        );
    }

    @Override
    public void receiveCommand(MyWebView root, int commandId, @Nullable ReadableArray args) {
        switch (commandId) {
            case COMMAND_GO_BACK:
                root.goBack();
                break;
            case COMMAND_GO_FORWARD:
                root.goForward();
                break;
            case COMMAND_RELOAD:
                root.reload();
                break;
            case COMMAND_STOP_LOADING:
                root.stopLoading();
                break;
        }
    }
    /**
     * 暴露了在JS中定义的方法，例如下面的"onChangeColor"是定义在JS中的方法。
     * 这个在进入App的时候就会运行
     *
     * Returned map should be of the form:
     * {
     *   "onTwirl": {
     *     "registrationName": "onTwirl"
     *   }
     * }
     */
//    @Nullable
//    @Override
//    public Map<String, Object> getExportedCustomDirectEventTypeConstants() {
//        return MapBuilder.<String, Object>builder()
//                .put("goBack", MapBuilder.of("registrationName", "goBack"))
//                .put("goForward", MapBuilder.of("registrationName", "goForward"))
//                .put("reload", MapBuilder.of("registrationName", "reload"))
//                .put("stopLoading", MapBuilder.of("registrationName", "stopLoading"))
//                .put("postMessage", MapBuilder.of("registrationName", "postMessage"))
//                .put("injectJavaScript", MapBuilder.of("registrationName", "injectJavaScript"))
//                .build();
//    }
//    /**
//     * 发射入口，相当于将Native的一些事件也注册给JS。
//     *
//     * 这个在进入App的时候就会运行。
//     */
//    @Override
//    protected void addEventEmitters(final ThemedReactContext reactContext, final MyWebView view) {
//        view.setWebViewClient(new MyWebView.MyWebViewClient());
//        view.setWebChromeClient(new MyWebView.MyWebChromeClient());
//
//    }


}

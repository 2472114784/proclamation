package com.djl.mypackage.view.webview;

import android.content.Context;
import android.graphics.Bitmap;
import android.os.Message;
import android.util.Log;

import com.djl.widget.X5WebView;
import com.tencent.smtt.sdk.WebChromeClient;
import com.tencent.smtt.sdk.WebView;
import com.tencent.smtt.sdk.WebViewClient;

public class MyWebView extends X5WebView {

    private final Context context;
    private WebViewClient mWebViewClient;
    private WebChromeClient mWebChromeClient;


    public MyWebView(Context context) {
        super(context,null);
        this.context =context;
        initView();
    }

    private void initView() {
        mWebViewClient = new MyWebViewClient();
        mWebChromeClient = new MyWebChromeClient();
        setWebViewClient(mWebViewClient);
        setWebChromeClient(mWebChromeClient);

    }

//    private void initWebViewSettings(WebView webView) {
//        WebSettings webSetting = webView.getSettings();
//        webSetting.setJavaScriptEnabled(true);
//        webSetting.setJavaScriptCanOpenWindowsAutomatically(true);
//        webSetting.setAllowFileAccess(true);
//        webSetting.setLayoutAlgorithm(WebSettings.LayoutAlgorithm.NARROW_COLUMNS);
//        webSetting.setSupportZoom(true);
//        webSetting.setBuiltInZoomControls(true);
//        webSetting.setUseWideViewPort(true);
//        webSetting.setSupportMultipleWindows(false);
//        //webSetting.setLoadWithOverviewMode(true);
//        webSetting.setAppCacheEnabled(true);
//        //webSetting.setDatabaseEnabled(true);
//        webSetting.setDomStorageEnabled(true);
//        webSetting.setGeolocationEnabled(true);
//        webSetting.setAppCacheMaxSize(Long.MAX_VALUE);
//        // webSetting.setPageCacheCapacity(IX5WebSettings.DEFAULT_CACHE_CAPACITY);
//        webSetting.setPluginState(WebSettings.PluginState.ON_DEMAND);
//        //webSetting.setRenderPriority(WebSettings.RenderPriority.HIGH);
//        webSetting.setCacheMode(WebSettings.LOAD_NO_CACHE);
//        Log.e("UserAgent",webSetting.getUserAgentString());
//
//
//        // this.getSettingsExtension().setPageCacheCapacity(IX5WebSettings.DEFAULT_CACHE_CAPACITY);//extension
//        // settings 的设计
//    }



    public static class MyWebViewClient extends WebViewClient {
//
        private String webUrl;
        private boolean loadDone;

        @Override
        public void onPageStarted(WebView view, String url, Bitmap arg2) {
            // TODO Auto-generated method stub
            Log.e("simon","onPageStarted");

            super.onPageStarted(view, url, arg2);
            webUrl = url;
            loadDone = false;
        }

        @Override
        public void onPageFinished(WebView view, String url) {
            // TODO Auto-generated method stub
            Log.e("simon","onPageFinished");
//			mWebView.loadUrl("javascript:(" + readJS() + ")()");
            super.onPageFinished(view, url);
            webUrl = url;
            loadDone = true;



        }
        @Override
        public boolean shouldOverrideUrlLoading(WebView view, String url) {
            // TODO Auto-generated method stub
//            WritableMap event = Arguments.createMap();
//            event.putString("message", url);
//            ReactContext reactContext = (ReactContext)getContext();
//            reactContext.getJSModule(RCTEventEmitter.class).receiveEvent(
//                    view.getId(),
//                    "topChange",
//                    event);
            Log.e("RN_Android",url);
            return super.shouldOverrideUrlLoading(view,url);
        }


    }

    public static class MyWebChromeClient extends WebChromeClient {
        @Override
        public void onProgressChanged(WebView view, int progress) {
            // TODO Auto-generated method stub
            super.onProgressChanged(view, progress);

        }


        @Override
        public boolean onCreateWindow(WebView view, boolean isDialog,
                                      boolean isUserGesture, Message resultMsg) {
            Log.e("RN_Android","onCreateWindow");
            return false;		}

        @Override
        public void onReceivedTitle(WebView arg0, String title) {
            // TODO Auto-generated method stub
            super.onReceivedTitle(arg0, title);

        }

        @SuppressWarnings("deprecation")
        @Override
        public void onReceivedIcon(WebView arg0, Bitmap icon) {
            // TODO Auto-generated method stub
            super.onReceivedIcon(arg0, icon);
        }
    }


}

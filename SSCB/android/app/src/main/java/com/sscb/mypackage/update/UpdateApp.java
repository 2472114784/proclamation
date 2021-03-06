package com.sscb.mypackage.update;


import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.loveplusplus.update.UpdateChecker;
import com.sscb.MainActivity;

public class UpdateApp extends ReactContextBaseJavaModule {

    private ReactContext reactContext;

    public UpdateApp(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Override
    public String getName() {
        return "UpdateApp";
    }
    @Override
    public boolean canOverrideExistingModule() {
        return true;
    }
    @ReactMethod
    public void updateDialog (){
        UpdateChecker.checkForDialog(MainActivity.getMainActivity());
    }

}
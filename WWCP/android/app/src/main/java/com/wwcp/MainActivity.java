package com.wwcp;

import com.facebook.react.ReactActivity;

public class MainActivity extends ReactActivity {

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "WWCP";
    }
    public MainActivity() {
        mainActivity = this;
    }
    public static MainActivity getMainActivity() {
        return mainActivity;
    }
    private static MainActivity mainActivity;
}

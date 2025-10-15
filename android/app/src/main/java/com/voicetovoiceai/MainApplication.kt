package com.voicetovoiceai

import android.app.Application
import com.facebook.react.PackageList
import com.facebook.react.ReactApplication
import com.facebook.react.ReactHost
import com.facebook.react.ReactNativeHost
import com.facebook.react.ReactPackage
import com.facebook.react.defaults.DefaultReactHost
import com.facebook.react.defaults.DefaultReactNativeHost
import com.facebook.react.ReactNativeApplicationEntryPoint
import java.io.File

class MainApplication : Application(), ReactApplication {

    // ReactNativeHost with OTA support for bundled JS
    override val reactNativeHost: ReactNativeHost =
        object : DefaultReactNativeHost(this) {

            override fun getPackages(): List<ReactPackage> =
                PackageList(this).packages.apply {
                    // Manually add packages if needed
                }

            override fun getJSMainModuleName(): String = "index"

            override fun getUseDeveloperSupport(): Boolean = BuildConfig.DEBUG

            override val isNewArchEnabled: Boolean = BuildConfig.IS_NEW_ARCHITECTURE_ENABLED
            override val isHermesEnabled: Boolean = BuildConfig.IS_HERMES_ENABLED

            // Custom getter for the JS bundle file to load OTA update if exists
            override fun getJSBundleFile(): String? {
                val path = applicationContext.filesDir.absolutePath + "/update.bundle"
                val file = File(path)
                return if (file.exists()) {
                    path
                } else {
                    super.getJSBundleFile()
                }
            }
        }

    // Provide the react host instance
    override val reactHost: ReactHost
        get() = DefaultReactHost.getDefaultReactHost(applicationContext, reactNativeHost)

    override fun onCreate() {
        super.onCreate()
        ReactNativeApplicationEntryPoint.loadReactNative(this)
    }
}

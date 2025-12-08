# Quick Start

:::caution

The SDK supports arm64-v8a and armeabi-v7a.

:::

## Environment Setup

The SDK uses the following compilation parameters:

* **minSdk:** 21
* **targetSdk:** 31
* **compileSdk:** 31

## Integrate SDK

1. The SDK is provided as an **.aar file**. After downloading, place it in the `libs` folder of your app. Add the following to your `app/build.gradle`:

```kotlin
implementation fileTree(include: [ '*.jar' , '*.aar' ], dir: 'libs' )
```

2. Declare Permissions:

```kotlin
<uses-permission android:name="android.permission.INTERNET" />
```

### Direct Use of Voice Changer

1. **Create the Engine Instance.** This step only creates the instance and does **not** load the necessary voice changer resources.

```kotlin
val engine = VCEngine.Builder(this)
    .log() // Print Log
    .transformLog() // Print Voice Changer Log
    .token("xxx") // 2.x can skip this method to use license authentication
    .inputSampleRate(mSampleRate) // Input sample rate, e.g., 48000
    .outputSampleRate(mSampleRate) // Output sample rate, e.g., 48000
    .thirdRTC(ThirdRTC.TENCENT) // Integrated third-party RTC, optional.
    .engineCallback(object : VCEngineCallback {
        // Resource download progress
        override fun onDownload(percent: Int, index: Int, count: Int) {
            val str = "Downloading resource: $index / $count $percent %"
        }

        // Event callback
        override fun onActionResult(action: VCAction, code: VCEngineCode, msg: String?) {
            if (action == VCAction.PREPARE && code == VCEngineCode.SUCCESS) {
                engine.initEngine()
            }
            Toast.makeText(
                this@TRtcActivity,
                "${action.name} : $code ${msg ?: ""}",
                Toast.LENGTH_SHORT
            ).show()
        }
    })
    .build()
```
2. **Prepare the engine resources.** This operation is time-consuming. Once completed, it will **call back** to the `callback` registered in step 1. This step downloads the resource files to the App's private directory.

```kotlin
engine.prepare()
```

3. **Start the voice changer worker thread** and initialize the engine within the worker thread. The engine can be initialized after the resources are prepared.

3.1. **Check if resources are ready** in the `onActionResult` callback from the first step:

```kotlin
val success = action == VCAction.PREPARE && code == VCEngineCode.SUCCESS
```

3.2. **Initialize the engine** after the engine resources are successfully prepared. The initialization result will also **call back** to the `onActionResult` in step 1:

```kotlin
engine.initEngine()
```

**Note:** The engine's `prepare()` and `initEngine()` are asynchronous, requiring authentication and checking for necessary voice changer resources. The first time the engine is initialized in the **1.x version**, it will take a relatively long time. The **2.x version** loads the model into memory the first time a voice is set, which will also take a relatively long time.

4. **Get the voice list.** The voice list can be queried after the engine is successfully prepared.

```kotlin
engine.getVoiceList() // Returns ArrayList<VCVoice>, which may be null.
```

5. **Set the voice.** Select a voice from the list obtained in step 5 and set it. This is an asynchronous operation, and the result will **call back** to `onActionResult`.

```kotlin
engine.setVoice(voice)
```

6. **Start the voice changer.**

```kotlin
engine.start()
```

7. **Stop the voice changer.** This step clears the data within the worker thread, and the internal Looper will enter hibernation.

```kotlin
engine.stop()
```

8. **Voice Transformation.** After the engine is successfully initialized and the voice is successfully set, you can start voice transformation.

```kotlin
engine.transform(data) // data is a byte array
```

**Note:** Voice transformation will only succeed if the engine status is `VCEngineStatus.STARTED` (after the operation in step 6) and the voice is successfully set; otherwise, the original sound will be returned.

9. **Release the engine.**

```kotlin
engine.releaseEngine()
```

**Note:** After releasing the engine, if you need to use it again, you must restart from step 2 (Prepare Engine Resources).

### Separately Download Voice Changer Resources

If you only need to download the resources, you can perform steps 1 and 2 in Direct Use of Voice Changer.


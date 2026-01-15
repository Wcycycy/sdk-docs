---
sidebar_position: 2
---

# Quick Start

:::caution

The SDK supports arm64-v8a.

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
val engine = DubbingEngine.EngineConfig(this)
    .enableLog() // Print Log
    .enableTransformLog() // Print Voice Changer Log
    .token("xxx")
    .sampleRate(mSampleRate) // Input sample rate, e.g., 48000
    .engineCallback(object : DubbingEngineCallback {
        // Resource download progress
        override fun onDownload(percent: Int, index: Int, count: Int) {
            val str = "Downloading resource: $index / $count $percent %"
        }

        // Event callback
        override fun onActionResult(action: DubbingAction, code: DubbingEngineCode, msg: String?) {
            Toast.makeText(
                context,
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
val success = action == DubbingAction.PREPARE && code == DubbingEngineCode.SUCCESS
```

**Note:** The engine's `prepare()` is asynchronous, requiring authentication and checking for necessary voice changer resources.

4. **Get the voice list.** The voice list can be queried after the engine is successfully prepared.

```kotlin
engine.getVoiceList() // Returns ArrayList<DubbingVoice>, which may be empty.
```

5. **Set the voice.** Select a voice from the list obtained in step 5 and set it. This is an asynchronous operation, and the result will **call back** to `onActionResult`.

```kotlin
engine.setVoice(voice.id)
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

**Note:** Voice transformation will only succeed if the engine status is `DubbingEngineStatus.STARTED` (after the operation in step 6) and the voice is successfully set.

9. **Release the engine.**

```kotlin
engine.releaseEngine()
```

**Note:** After releasing the engine, if you need to use it again, you must restart from step 2 (Prepare Engine Resources).

### Separately Download Voice Changer Resources

If you only need to download the resources, you can perform steps 1 and 2 in Direct Use of Voice Changer.

### Checking if Resource Download is Required

If you only need to **check the required resource files**, you can call the following method.

```kotlin
engine.checkResources()
```

Then, handle the result in the `DubbingEngineCallback`'s `onActionResult` callback. See the example code below.

**Note:** If files need to be downloaded, the `msg` parameter will return a **JSON string**, for example:
`{"fileCount":0,"fileLength":100000}`.
* `fileCount` indicates the number of files that need to be downloaded.
* `fileLength` indicates the total size of the files in **bytes**. This size is not an exact value but can be used for display purposes in the user interface.

```kotlin
if (action == DubbingAction.CHECK_RESOURCES) {
    if (code == DubbingEngineCode.SUCCESS) {
        Log.d("tag", "Resource files already downloaded")
    } else {
        msg?.let {
            val obj = JSONObject(msg)
            var fileCount = 0L
            var fileLength = 0L
            if (obj.has("fileCount") && obj.has("fileLength")) {
                fileCount = obj.getLong("fileCount")
                fileLength = obj.getLong("fileLength")
            }
            Log.d("tag", "Files to download: $fileCount, Size: $fileLength")
        }
    }
}
```

## Self-Capture/Playback/File Conversion

When capturing and playing simultaneously (self-capture/playback) or converting a file, the data length passed when calling `transform` is calculated as follows:

```kotlin
val bufferSize = sampleRate / 100 * 16 * bytes * channels
```

Self-Capture/Playback Example Code:

```kotlin
var audioRecord: AudioRecord // Recording
var audioTrack: AudioTrack // Playback

// When capturing:
val buffer = ByteArray(bufferSize)
val result = audioRecord.read(buffer, 0, buffer.size)

// When playing:
if (result != null && result.isNotEmpty()) {
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
        audioTrack!!.write(
            result,
            0,
            result.size,
            AudioTrack.WRITE_BLOCKING
        )
    } else {
        audioTrack!!.write(result, 0, result.size)
    }
}
```

File Conversion Example Code:

```kotlin
val fin: FileInputStream = FileInputStream(inPath) // Input File
var fot: FileOutputStream = FileOutputStream(outPath) // Output File
val buffer = ByteArray(bufferSize)
val result = fin.read(buffer)
val transform = engine?.transform(buffer)
if (transform != null && transform.isNotEmpty()) {
    fot.write(transform)
}
```

**Note:** The file's sample rate must be the same as the sample rate set for the engine, and the file must contain PCM formatted data. Since the data length inside the file cannot be guaranteed to be an integer multiple of one transformation frame, when converting multiple files sequentially, data missing from the end of the first file needs to be supplemented with data from the beginning of the second file to ensure audio continuity.

For example: With a sample rate of 48000, if `bufferSize = 15360` and the first file length is 20000, after taking the first frame of data, 4640 bytes remain. For the next transformation, you need to take 10720 bytes of data from the beginning of the second file and combine it with the remaining 4640 bytes from the first file to form 15360 bytes of data for transformation, and so on.
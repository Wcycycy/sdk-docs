---
sidebar_position: 3
---

# API Reference

## VCEngine

### prepare()
Prepares the resources required by the engine and performs authentication. The first time it is called, it downloads the voice model files, which takes a longer time.

### initEngine()
**1.x version:** Starts the voice conversion worker thread and initializes the engine. After the engine resources are ready, this step loads the voice model into memory, which is about 300MB.

**2.x version:** Does not load the voice model into memory.

### getVoiceList()
Gets the list of available voice tones. The list of available voice tones will only be returned after the engine is prepared.

**Return value:** `ArrayList <VCVoice>`, the list may be empty.

### getCurrentVoice()
Gets the currently set voice.
**Return value:** `VCVoice`, may be null.

### clearModelFiles()
Deletes the voice model files. After executing this method, the files will be re-downloaded the next time `prepare()` is called.

**Return value:** `int`, the number of files deleted.
**Note:** The engine automatically cleans up unnecessary files. Developers should not store other files in the engine's file directory. The engine folder gets its directory through the following code and creates the "vc_model" directory. E.g.: `/data/user/0/ApplicationPackageName/files/vc_model/`

```kotlin
modelPath: String = " ${activity?.filesDir} /vc_model"
```

### start()
Starts the voice conversion.

### stop()
Stops the voice conversion, but does not exit the voice conversion thread. After executing this method, the data in the thread is cleared, and the thread goes to sleep.

### getEngineStatus()
Gets the current status of the engine.

### setVoice(voice: VCVoice)
**1.x version:** The model is already loaded in `initEngine`, so this method will not load the model again.

**2.x version:** When calling this method, it first checks if the model required for the voice tone has been loaded. If not, it loads the model into memory.

Sets the voice tone. This operation is asynchronous, and the result is returned in the `VCEngineCallback` callback.

**Note:** It can only be set successfully after the engine is initialized. It can be set whether voice conversion is currently active or not. For example, if voice conversion is active, the sound will immediately change to the new voice tone upon successful setting.

### releaseEngine()
Releases the engine resources and terminates the thread.

### transform(originData: ByteArray): ByteArray?
Converts the audio data. Input: `originData: ByteArray`. Returns: `ByteArray?` (converted data).

### transform(buffer: ByteBuffer): ByteArray?
Converts the audio data. Input: `buffer: ByteBuffer`. Returns: `ByteArray?` (converted data).

### checkFile()
Checks if required resource files need to be downloaded.

### setMode (2.x)
Sets the engine's processing mode (e.g., Pro mode). (2.x)

```kotlin
setMode(mode: VCMode, intonation: Float , pitch: Float )
```

| Parameter Name | Parameter Type | Description |
| :--- | :--- | :--- |
| mode | [VCMode] | Mode enumeration |
| intonation | float | Emotional fluctuation / Intonation |
| pitch | float | Pitch |

### getSupportIntonation (2.x)
Checks if the current voice supports intonation adjustment. (2.x)

### getSupportPitch (2.x)
Checks if the current voice supports pitch adjustment. (2.x)

### getMode (2.x)
Gets the current engine mode setting. (2.x)

### getIntonation (2.x)
Gets the current intonation value. (2.x)

### getPitch (2.x)
Gets the current pitch value. (2.x)

### proCalibration (2.x)
Performs calibration for Pro mode. (2.x)

### transformSync(originData: ByteArray): ByteArray?
Synchronously converts the audio data. Input: `originData: ByteArray`. Returns: `ByteArray?` (converted data).

### getDelayMillis(): Int
Gets the processing delay (latency) in milliseconds. Returns: `Int`.

## VCEngine Default Values Description

| Parameter Name | Parameter Type | Default Value | Description |
| :--- | :--- | :--- | :--- |
| callback | VCEngineCallback | null | Engine event callback |
| inputSampleRate | int | 16000 | Input Sample Rate |
| outputSampleRate | int | 16000 | Output Sample Rate |
| samplesPerCall | int | | Sample size for each audio data callback. Default calculated by the engine: samplesPerCall = outputSampleRate / 100 * 16 * 2. |
| mToken | String | null | Authentication token, obtained by the developer. |
| debugHelper | TransformDebugHelper | null | Calculation utility class, can statistical performance data during voice transformation. Only takes effect when transformDebug is true. |
| muteWhenFail | boolean | true | Whether to mute when voice transformation fails. |
| debug | boolean | false | Whether to print engine operation Log |
| transformDebug | boolean | false | Whether to print engine voice transformation process Log. Enabling this will greatly increase the Log output volume. |

## VCEngine.Builder

### Builder(context: Context)
Constructor.

### log() (Optional)
Enables Log printing, which only prints process information during engine operation.

### transformLog() (Optional)
Enables voice transformation Log. Voice transformation is a high-frequency operation, and enabling this will cause the Log information to refresh quickly.

### transformLog(TransformDebugHelper) (Optional)
Effect is the same as transformLog(), and the helper will record various time data of the voice transformation.

### token(tokenStr) (Required in 1.x version)
Authentication token, issued by the server. Required in 1.x version, optional in 2.x.

### inputSampleRate(sampleRate) (Optional)
Input Sample Rate. The default value is 16000. Common optional values include 16000, 24000, and 48000.

### outputSampleRate(sampleRate) (Optional)
Output Sample Rate. The default value is 16000. Common optional values include 16000, 24000, and 48000. The input/output sample rates are generally the same.

### engineCallback(callback) (Optional)
Engine Callback.

| Parameter Name | Parameter Type | Description |
| :--- | :--- | :--- |
| callback | VCEngineCallback Interface | /** Downloads progress * @param percent Current download file progress, integer from 0-100, 100 means current file download is complete * @param index The index of the current file being downloaded, starting from 1 * @param count The total number of files to be downloaded */ fun onDownload(percent: Int , index: Int, count: Int) |
| | | /** Event change * @param action Event * @param code Event result * @param msg Message */ fun onActionResult(action: VCAction, code: VCEngineCode, msg: String? = null ) |

### build()
Builds the VCEngine instance.

### muteWhenFail(muteWhenFail: Boolean)
Whether to mute when voice transformation fails.

### samplesPerCall(samplesPerCall: Int)
Sample size for each audio data callback.

### vadStrategy(strategy: IVadStrategy)
Sets the VAD strategy.

## VCEngineCallback

### onDownload(percent: Int, index: Int, count: Int)
| Parameter Name | Parameter Type | Description |
| :--- | :--- | :--- |
| percent | int | Current file download progress, ranging from 0 to 100. 100 means 100%. |
| index | int | The index of the current file being downloaded, starting from 1. |
| count | int | The total number of files to be downloaded. |

### onActionResult(action: VCAction, code: VCEngineCode, msg: String?)
| Parameter Name | Parameter Type | Description |
| :--- | :--- | :--- |
| action | VCAction Enum | Event type. |
| code | VCEngineCode Enum | Event result. |
| msg | String | Event message, may be null. |

## VCAction
| Enum Value | Description |
| :--- | :--- |
| SET_VOICE | Set voice. |
| LOGIN | Login. |
| PREPARE | Prepare engine. |
| INITIALIZE | Initialize engine. |
| CHECK_FILE | Check file. |
| PRO_CALIBRATION | Pro mode calibration. |

## VCEngineCode
| Enum Value | Description |
| :--- | :--- |
| SUCCESS | Success. |
| SERVER_ERROR | Server error. |
| AUTH_ERROR | Authentication failed. |

## VCEngineStatus
| Enum Value | Description |
| :--- | :--- |
| IDLE | Instance successfully created. |
| PREPARING | Engine resources are being prepared. |
| PREPARED | Engine resources are ready. |
| INITIALIZED | Engine initialization succeeded. |
| STARTED | Voice transformation started. |
| STOPPED | Voice transformation stopped. |
| RELEASED | Engine has been released. |
| ERROR | Engine error. |
| CHECKING | Resource files are being checked. |
| CALIBRATING | Auto calibration is in progress. |

## VCVoice
| Member Variable | Description |
| :--- | :--- |
| id | Voice ID. |
| name | Voice name. |
| cover | Voice icon/cover. |

## VCMode (2.x)
| Enum Value | Description |
| :--- | :--- |
| NORMAL | Normal mode. |
| Pro | Pro mode. |

## IVadStrategy

The Silent Detection Strategy Interface. Developers can implement this interface and pass it in when building the engine.

The following example uses the [android-vad GitHub repository](https://github.com/gkonovalov/android-vad) as a reference:

```kotlin
package com.gerzz.dubbing

import com.gerzz.dubbing.sdk.IVadStrategy
import com.konovalov.vad.webrtc.Vad
import com.konovalov.vad.webrtc.VadWebRTC
import com.konovalov.vad.webrtc.config.FrameSize
import com.konovalov.vad.webrtc.config.Mode
import com.konovalov.vad.webrtc.config.SampleRate

class MyVad : IVadStrategy {
    private var mVad: VadWebRTC? = null
    override fun initVad(sampleRate: Int) {
        var vadSampleRate: SampleRate? = null
        var vadFrameSize: FrameSize? = null

        if (sampleRate == 48000) {
            vadSampleRate = SampleRate.SAMPLE_RATE_48K
            vadFrameSize = FrameSize.FRAME_SIZE_960
        } else if (sampleRate == 16000) {
            vadSampleRate = SampleRate.SAMPLE_RATE_16K
            vadFrameSize = FrameSize.FRAME_SIZE_320
        }
        if (vadSampleRate != null && vadFrameSize != null) {
            mVad = Vad.builder()
                .setSampleRate(vadSampleRate)
                .setFrameSize(vadFrameSize)
                .setMode(Mode.LOW_BITRATE)
                .setSilenceDurationMs(160)
                .setSpeechDurationMs(160)
                .build()
        }

    }

    override fun release() {
        mVad?.close()
        mVad = null
    }

    override fun isSpeech(data: ByteArray): Boolean {
        mVad?.let { vad ->
            val frameSize = vad.frameSize.value * 2
            val count = data.size / frameSize
            var isSpeech = false
            for (i in 0 until count) {
                val buf = data.copyOfRange(
                    i * frameSize,
                    (i + 1) * frameSize
                )
                val speech = vad.isSpeech(buf)
                if (speech) {
                    isSpeech = true
                    break
                }
            }
            return isSpeech
        }
        return false
    }
}
```
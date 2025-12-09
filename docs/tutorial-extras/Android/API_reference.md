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


---
sidebar_position: 3
---

# API Reference

## DubbingEngine

### prepare
Prepares the resources required by the engine and performs authentication. The first time it is called, it downloads the voice model files, which takes a longer time.

### getVoiceList
Gets the list of available voice tones. The list of available voice tones will only be returned after the engine is prepared.

**Return value:** `json:[{"id":10, "name":"xx"},{"id":11, "name":"xxx"}]`, the voice list may be empty.

### getCurrentVoice
Gets the currently set voice.
**Return value:** Voice id, may be 0.

### start
Starts the voice conversion.

### stop
Stops the voice conversion, but does not exit the voice conversion thread. After executing this method, the data in the thread is cleared, and the thread goes to sleep.

### getEngineStatus
Gets the current status of the engine.

### setVoice(voiceId: int)
When calling this method, it first checks if the model required for the voice tone has been loaded. If not, it loads the model into memory.

Sets the voice. This operation is asynchronous, and the result is returned in the `DubbingCallback` callback.

**Note:** It can only be set successfully after the engine is prepared. It can be set whether voice conversion is currently active or not. For example, if voice conversion is active, the sound will immediately change to the new voice tone upon successful setting.

### releaseEngine
Releases the engine resources and terminates the thread.

### transform(originData: char* data, int dataSize): bool?
Converts the audio data. Input: `originData: char* data, int dataSize `. Returns: `bool` (converted data).

### checkResources
Checks if required resource files need to be downloaded.

### setMode
Sets the engine's processing mode (e.g., Pro mode).

```c++
setMode(mode: DubbingMode, intonation: Float, pitch: Float)
```

| Parameter Name | Parameter Type | Description |
| :--- | :--- | :--- |
| mode | [DubbingMode] | Mode enumeration |
| intonation | float | Emotional fluctuation / Intonation |
| pitch | float | Pitch |

### getSupportIntonation
Checks if the current voice supports intonation adjustment.

### getSupportPitch
Checks if the current voice supports pitch adjustment.

### getMode
Gets the current engine mode setting.

### getIntonation
Gets the current intonation value.

### getPitch
Gets the current pitch value.

### proCalibration
Performs calibration for Pro mode.

### getDelayMillis(): int
Gets the processing delay (latency) in milliseconds. Returns: `int`.

## EngineConfig Default Values Description

| Parameter Name | Parameter Type | Default Value | Description |
| :--- | :--- | :--- | :--- |
| m_dubbbingCallBack | IDubbbingCallBack | nullptr | Engine event callback |
| m_sampleRate | int | 48000 | Input Sample Rate |
| m_channel | int | 1 | Default channel count |
| m_format | AudioSampleFormat | AUDIO_PCM_S16 | Default audio format. |
| m_token | std::string | "" | Authentication token, obtained by the developer. |
| m_resourcePath | std::string | dubbing_resource | The default value is obtained via the following code: "${context?.filesDir}/dubbing_resource". |
| m_muteOnFail | bool | true | Whether to mute when voice transformation fails. |
| m_enableLog | bool | false | Whether to print engine operation Log. |
| m_enableTransformLog | bool | false | Whether to print engine voice transformation process Log. Enabling this will greatly increase the Log output volume. |
| m_isSync | bool | false | Whether to perform synchronous transform. |


### EngineConfig(context: Context)
Constructor.

### enableLog (Optional)
Enables Log printing, which only prints process information during engine operation.

### enableTransformLog (Optional)
Enables voice transformation Log. Voice transformation is a high-frequency operation, and enabling this will cause the Log information to refresh quickly.

### enableTransformLog(TransformDebugHelper) (Optional)
Effect is the same as transformLog(), and the helper will record various time data of the voice transformation.

### token
Authentication token, issued by the server.

### sampleRate (Optional)
Sample Rate. The default value is 48000. Common optional values include 16000, 24000, and 48000.

### DubbingCallback(callback) (Optional)
Dubbing Callback.

| Parameter Name | Parameter Type | Description |
| :--- | :--- | :--- |
| callback | DubbingCallback Interface | /** Downloads progress * @param percent Current download file progress, integer from 0-100, 100 means current file download is complete * @param index The index of the current file being downloaded, starting from 1 * @param count The total number of files to be downloaded */ fun onDownload(percent: Int , index: Int, count: Int) |
| | | /** Event change * @param action Event * @param code Event result * @param msg Message */ fun onActionResult(action: DubbingAction, code: DubbingRetCode, msg: std::string) |

### muteOnFail
Whether to mute when voice transformation fails.

## DubbingEngineCallback

### onDownload(percent: Int, index: Int, count: Int)
| Parameter Name | Parameter Type | Description |
| :--- | :--- | :--- |
| percent | int | Current file download progress, ranging from 0 to 100. 100 means 100%. |
| index | int | The index of the current file being downloaded, starting from 1. |
| count | int | The total number of files to be downloaded. |

### onActionResult(action: DubbingAction, code: DubbingRetCode, msg: std::string)
| Parameter Name | Parameter Type | Description |
| :--- | :--- | :--- |
| action | DubbingAction Enum | Event type. |
| code | DubbingRetCode Enum | Event result. |
| msg | std::string | Event message, may be null. |

## DubbingAction
| Enum Value | Description |
| :--- | :--- |
| SET_VOICE | Set voice. |
| AUTH | Auth action. |
| PREPARE | Prepare engine. |
| CHECK_RESOURCES | Check file. |
| PRO_CALIBRATION | Pro mode calibration. |

## DubbingRetCode
| Enum Value | Description |
| :--- | :--- |
| SUCCESS | Success. |
| UNKNOWN_ERROR | Unknown error. |
| NET_REQUEST_ERROR | Network Error. |
| NET_AUTH_ERROR | Authentication failed. |
| LIC_ERROR | Authentication failed. |
| ENGINE_STATUS_ERROR | The current engine status does not support this operation. |
| RESOURCE_MISSING_FILES | Missing files. |
| VOICE_SETTING | A voice already in the process of being set. |
| VOICE_NOT_SET | Voice not set. |

## DubbingEngineStatus
| Enum Value | Description |
| :--- | :--- |
| IDLE | Instance successfully created. |
| PREPARING | Engine resources are being prepared. |
| PREPARED | Engine resources are ready. |
| STARTED | Voice transformation started. |
| STOPPED | Voice transformation stopped. |
| RELEASED | Engine has been released. |
| ERROR | Engine error. |
| CHECKING | Resource files are being checked. |
| CALIBRATING | Auto calibration is in progress. |

## DubbingMode
| Enum Value | Description |
| :--- | :--- |
| NORMAL_MODE | Normal mode. |
| PRO_MODE | Pro mode. |
---
sidebar_position: 3
---

# API Reference

## DBSDKManager

### prepare

Prepares the resources required by the engine and performs authentication. The first call will download voice model files, which may take a long time.

### getVoiceList

Gets the list of available voices. Only returns available voices after the engine is prepared.

**Returns:** `NSArray<DBSpeakerItem *>`, the list may be empty.

### getCurrentVoice

Gets the currently set voice.  
**Returns:** Voice ID, may be `nil`.

### cleanAllFiles

Deletes voice model files. After calling this method, these files will be re-downloaded the next time `prepare()` is called.

**Returns:** `void`  
**Note:** The engine automatically cleans up unnecessary files. Do not store other files in the engine's file directory.

### start

Starts voice transformation.

### stop

Stops voice transformation, but does not exit the voice transformation thread. After calling this method, the data in the thread will be cleared and the thread will enter a sleep state.

### getEngineStatus

Gets the current engine status.

### setVoice(voiceId: NSNumber)

When calling this method, it first checks whether the model required for this voice has been loaded; if not loaded, it will load the model into memory first.

Sets the voice. This operation is asynchronous, and the result will be returned through the `DBActionResultBlock` callback.

**Note:** Can only be set successfully after the engine is prepared. The voice can be set regardless of whether voice transformation is currently in progress. For example, during voice transformation, after successful setting, the voice will immediately switch to the new voice.

### releaseEngine

Releases engine resources and terminates the thread.

### transform(data: NSData): NSData?

Transforms audio data.  
Input: `data: NSData`  
Returns: `NSData?` (transformed data)

### checkResources

Checks whether required resource files need to be downloaded.

### setMode

Sets the engine processing mode (e.g., Pro mode).

```
setMode(mode: DubbingMode, intonation: Float, pitch: Float)
```

| Parameter | Type | Description |
|-----------|------|-------------|
| mode | `DubbingMode` | Mode enumeration |
| intonation | `float` | Emotional variation / Intonation |
| pitch | `float` | Pitch |

### getSupportIntonation

Checks whether the current voice supports intonation adjustment.

### getSupportPitch

Checks whether the current voice supports pitch adjustment.

### getMode

Gets the current engine mode settings.

### getIntonation

Gets the current intonation value.

### getPitch

Gets the current pitch value.

### proCalibration

Performs Pro mode calibration.

## DBSDKManager Default Parameters

| Parameter | Type | Default Value | Description |
|-----------|------|---------------|-------------|
| `onActionResult` | `DBActionResultBlock` | `nil` | Engine event callback |
| `sampleRate` | `NSInteger` | `48000` | Sample rate |
| `token` | `NSString *` | `nil` | Authentication Token, obtained by the developer |
| `debug` | `BOOL` | `NO` | Whether to print engine runtime logs |
| `transformDebug` | `BOOL` | `NO` | Whether to print voice transformation logs. Enabling this will significantly increase log output |
| `muteOnFail` | `BOOL` | `YES` | Whether to mute when voice transformation fails |
| `channel` | `NSInteger` | `1` | Default number of channels |
| `format` | `DBAudioSampleFormat` | `AUDIO_PCM_S16` | Default audio format |
| `isSync` | `BOOL` | `NO` | Whether to enable synchronous transformation |

## EngineConfig

### EngineConfig()

Constructor.

### defaultConfig

Creates a default configuration instance.

### debug

Enables log printing, only outputs log information during engine runtime.

### transformDebug

Enables voice transformation logs. Voice transformation is a high-frequency operation, enabling this will result in faster log refresh rates.

### token

Authentication Token, issued by the server.

### sampleRate

Sample rate, default value is 48000. Common optional values include 16000, 24000, 48000.

### onActionResult

Engine callback.

### muteOnFail

Whether to mute when voice transformation fails.

### isSync

Whether to enable synchronous transformation.

### channel

Number of audio channels.

### format

Audio format settings.

### onDownload

Download progress callback.

## DBDownloadProgressBlock

### onDownload(percent: NSInteger, index: NSInteger, count: NSInteger)

| Parameter | Type | Description |
|-----------|------|-------------|
| percent | `NSInteger` | Current file download progress (0–100) |
| index | `NSInteger` | Current downloading file index, starting from 1 |
| count | `NSInteger` | Total number of files to download |

## DBActionResultBlock

### onActionResult(action: DubbingAction, code: DubbingEngineCode, msg: String?)

| Parameter | Type | Description |
|-----------|------|-------------|
| action | `DubbingAction` enum | Event type |
| code | `DubbingEngineCode` enum | Event result |
| msg | `NSString *` | Event message, may be `nil` |

## DubbingAction

| Enum Value | Description |
|------------|-------------|
| `SET_VOICE` | Set voice |
| `AUTH` | Authentication |
| `PREPARE` | Prepare engine |
| `CHECK_RESOURCES` | Check resource files |
| `PRO_CALIBRATION` | Pro mode calibration |

## DubbingEngineCode

| Enum Value | Description |
|------------|-------------|
| `SUCCESS` | Success |
| `UNKNOWN_ERROR` | Unknown error |
| `NET_REQUEST_ERROR` | Network error |
| `NET_AUTH_ERROR` | Authentication failed |
| `LIC_ERROR` | Authentication failed |
| `ENGINE_STATUS_ERROR` | Current engine status does not support this operation |
| `RESOURCE_MISSING_FILES` | Missing resource files |
| `VOICE_SETTING` | Voice is being set |
| `VOICE_NOT_SET` | Voice not set |

## DubbingEngineStatus

| Enum Value | Description |
|------------|-------------|
| `IDLE` | Instance created successfully |
| `PREPARING` | Preparing engine resources |
| `PREPARED` | Engine resources ready |
| `STARTED` | Voice transformation started |
| `STOPPED` | Voice transformation stopped |
| `RELEASED` | Engine released |
| `ERROR` | Engine error |
| `CHECKING` | Checking resource files |
| `CALIBRATING` | Performing automatic calibration |

## DBSpeakerItem

| Member Variable | Description |
|-----------------|-------------|
| `id` | Voice ID |
| `name` | Voice name |

## DubbingMode

| Enum Value | Description |
|------------|-------------|
| `NORMAL_MODE` | Normal mode |
| `PRO_MODE` | Pro mode |
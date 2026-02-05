---
sidebar_position: 3
---

# API Reference

## Table of Contents

1. [Overview](#overview)
2. [Classes](#classes)
3. [Enumerations](#enumerations)
4. [Callbacks](#callbacks)
5. [Methods](#methods)

## Overview

DubbingSDK provides real-time voice transformation capabilities for iOS applications. The SDK supports both normal and professional modes with customizable intonation and pitch.

## Classes

### EngineConfig

Engine configuration class for setting up the SDK.

#### Properties

| Property | Type | Description | Default |
|---------|------|-------------|---------|
| `sampleRate` | `NSInteger` | Sample rate for both input and output (Hz) | 48000 |
| `token` | `NSString *` | Authentication token | `nil` |
| `debug` | `BOOL` | Enable debug logging | `NO` |
| `transformDebug` | `BOOL` | Enable transform logging | `NO` |
| `channel` | `NSInteger` | Audio channel count | 1 |
| `format` | `DBAudioSampleFormat` | Audio sample format | `AUDIO_PCM_S16` |
| `muteOnFail` | `BOOL` | Mute on transformation failure | `YES` |
| `isSync` | `BOOL` | Use synchronous transformation | `NO` |
| `onDownload` | `DBDownloadProgressBlock` | Download progress callback | `nil` |
| `onActionResult` | `DBActionResultBlock` | Action result callback | `nil` |

#### Methods

##### + (instancetype)defaultConfig

Create a default configuration instance.

**Returns:** A new `EngineConfig` instance with default values.

**Example:**
```objc
EngineConfig *config = [EngineConfig defaultConfig];
```

### DBSDKManager

Main SDK manager class for voice transformation operations.

#### Properties

| Property | Type | Description |
|---------|------|-------------|
| `engineConfig` | `EngineConfig *` | Engine configuration object |

#### Methods

##### - (void)setEngineConfig:(EngineConfig *)config

Set engine configuration.

**Parameters:**
- `config`: Engine configuration object

**Example:**
```objc
EngineConfig *config = [EngineConfig defaultConfig];
config.token = @"your_token";
config.sampleRate = 48000;
[manager setEngineConfig:config];
```

##### - (void)prepare

Prepare the engine (login, verify version, get speaker list).

This is an asynchronous operation. Results are returned through `engineConfig.onActionResult` callback with action `PREPARE`.

**Example:**
```objc
[manager prepare];
```

##### - (void)checkResources

Check if resource files need to be downloaded.

Download progress is reported through `engineConfig.onDownload` callback. Results are returned through `engineConfig.onActionResult` callback with action `CHECK_RESOURCES`.

**Example:**
```objc
[manager checkResources];
```

##### - (void)start

Start the voice transformation engine.

This is an asynchronous operation. Results are returned through `engineConfig.onActionResult` callback with action `PREPARE`. The engine status will change to `STARTED` when ready.

**Note:** This method clears the current speaker ID and audio buffers. You must call `setVoice` after engine starts successfully.

**Example:**
```objc
[manager start];
```

##### - (void)stop

Stop the voice transformation engine.

This is an asynchronous operation. Results are returned through `engineConfig.onActionResult` callback with action `PREPARE`.

**Example:**
```objc
[manager stop];
```

##### `- (NSArray<DBSpeakerItem *> *)getVoiceList`

Get the list of available voices.

**Returns:** Array of `DBSpeakerItem` objects, or empty array if not available.

**Example:**
```objc
NSArray<DBSpeakerItem *> *voices = [manager getVoiceList];
for (DBSpeakerItem *voice in voices) {
    NSLog(@"Voice ID: %@, Name: %@", voice.id, voice.name);
}
```

##### `- (NSNumber * _Nullable)getCurrentVoice`

Get the currently set voice ID.

**Returns:** Current voice ID, or `nil` if not set.

**Example:**
```objc
NSNumber *voiceId = [manager getCurrentVoice];
if (voiceId) {
    NSLog(@"Current voice ID: %@", voiceId);
}
```

##### `- (DubbingEngineStatus)getEngineStatus`

Get the current engine status.

**Returns:** Current engine status (`DubbingEngineStatus` enum).

**Example:**
```objc
DubbingEngineStatus status = [manager getEngineStatus];
if (status == STARTED) {
    // Engine is running
}
```

##### `- (void)setVoice:(NSNumber *)voiceId`

Set the voice for transformation.

**Parameters:**
- `voiceId`: Voice ID (from `getVoiceList`)

This is an asynchronous operation. Results are returned through `engineConfig.onActionResult` callback with action `SET_VOICE`.

**Example:**
```objc
[manager setVoice:@(1)];
```

##### - (void)setMode:(DubbingMode)mode intonation:(float)intonation pitch:(float)pitch

Set transformation mode, intonation, and pitch.

**Parameters:**
- `mode`: Transformation mode (`NORMAL_MODE` or `PRO_MODE`)
- `intonation`: Intonation value (pitch fluctuation, typically -30.0 to 30.0)
- `pitch`: Pitch value (pitch offset, typically -200.0 to 200.0)

**Example:**
```objc
[manager setMode:PRO_MODE intonation:0.7 pitch:0.6];
```

##### - (float)getIntonation

Get current intonation value.

**Returns:** Current intonation value.

**Example:**
```objc
float intonation = [manager getIntonation];
```

##### - (float)getPitch

Get current pitch value.

**Returns:** Current pitch value.

**Example:**
```objc
float pitch = [manager getPitch];
```

##### `- (NSArray<NSNumber *> *)getSupportIntonation`

Get supported intonation range.

**Returns:** Array with two elements: `[min, max]`.

**Example:**
```objc
NSArray<NSNumber *> *range = [manager getSupportIntonation];
float min = [range[0] floatValue];
float max = [range[1] floatValue];
```

##### `- (NSArray<NSNumber *> *)getSupportPitch`

Get supported pitch range.

**Returns:** Array with two elements: `[min, max]`.

**Example:**
```objc
NSArray<NSNumber *> *range = [manager getSupportPitch];
float min = [range[0] floatValue];
float max = [range[1] floatValue];
```

##### - (DubbingMode)getMode

Get current transformation mode.

**Returns:** Current mode (`NORMAL_MODE` or `PRO_MODE`).

**Example:**
```objc
DubbingMode mode = [manager getMode];
if (mode == PRO_MODE) {
    // Pro mode is active
}
```

##### - (void)proCalibration:(NSString *)path success:(void(^)(float pitchFluctuation, float pitchOffset))success

Perform professional mode calibration.

**Parameters:**
- `path`: Path to 10-second PCM audio file (must match `sampleRate` in config)
- `success`: Success callback with recommended intonation and pitch values

**Note:** The audio file should be named `audio.pcm` and placed in the resource directory (default: `dubbing_resource`). The file must match the `sampleRate` configured in `EngineConfig`.

**Example:**
```objc
NSString *calibrationFile = @"/path/to/audio.pcm";
[manager proCalibration:calibrationFile success:^(float pitchFluctuation, float pitchOffset) {
    NSLog(@"Recommended intonation: %f, pitch: %f", pitchFluctuation, pitchOffset);
    [manager setMode:PRO_MODE intonation:pitchFluctuation pitch:pitchOffset];
}];
```

##### - (NSData *)transform:(NSData *)data

Transform audio data in real-time.

**Parameters:**
- `data`: Input PCM audio data

**Returns:** Transformed audio data (same format as input). Returns silent data or original data based on `muteOnFail` setting if engine is not ready.

**Note:** 
- Minimum data size is 10ms of audio
- Data smaller than 10ms will be accumulated until minimum size is reached
- Engine internally converts to 16-bit mono for processing
- If engine is not started or voice is not set, returns silent data or original data based on `muteOnFail`

**Example:**
```objc
NSData *inputData = ...; // Your PCM audio data
NSData *outputData = [manager transform:inputData];
// Use outputData for playback
```

##### - (void)cleanAllFiles

Clean all downloaded resource files.

This is an asynchronous operation. Results are returned through `engineConfig.onActionResult` callback with action `CLEAN_FILES`.

**Example:**
```objc
[manager cleanAllFiles];
```

##### - (void)engineRelease

Release the engine and free all resources.

**Example:**
```objc
[manager engineRelease];
```

## Enumerations

### DBAudioSampleFormat

Audio sample format enumeration.

| Value | Description |
|-------|-------------|
| `AUDIO_PCM_u8` | Signed 8-bit PCM |
| `AUDIO_PCM_S16` | Signed 16-bit PCM |
| `AUDIO_PCM_S24` | Signed 24-bit PCM (in int32, LSB aligned) |
| `AUDIO_PCM_S32` | Signed 32-bit PCM |
| `AUDIO_PCM_F32` | Float32 PCM (-1.0 ~ 1.0) |

### DubbingEngineStatus

Engine status enumeration.

| Value | Description |
|-------|-------------|
| `IDLE` | Instance successfully created |
| `PREPARING` | Engine resources are being prepared |
| `PREPARED` | Engine resources are ready |
| `STARTED` | Voice conversion started |
| `STOPPED` | Voice conversion stopped |
| `RELEASED` | Engine released |
| `ERROR` | Engine error |
| `CHECKING` | Resource files are being checked |
| `CALIBRATING` | Auto calibration in progress |

### DubbingMode

Transformation mode enumeration.

| Value | Description |
|-------|-------------|
| `NORMAL_MODE` | Normal mode (default) |
| `PRO_MODE` | Professional mode |

### DubbingAction

Action type enumeration for callbacks.

| Value | Description |
|-------|-------------|
| `SET_VOICE` | Set voice action |
| `AUTH` | Authentication action |
| `PREPARE` | Prepare engine action |
| `CHECK_RESOURCES` | Check resources action |
| `PRO_CALIBRATION` | Professional calibration action |
| `CLEAN_FILES` | Clean files action |

### DubbingEngineCode

Engine result code enumeration.

| Value | Description |
|-------|-------------|
| `SUCCESS` | Operation succeeded |
| `UNKNOWN_ERROR` | Unknown error |
| `NET_REQUEST_ERROR` | Network request error |
| `NET_AUTH_ERROR` | Authentication error |
| `LIC_ERROR` | License error |
| `ENGINE_STATUS_ERROR` | Engine status error (operation not allowed in current state) |
| `RESOURCE_MISSING_FILES` | Resource files missing |
| `VOICE_SETTING` | Voice is being set |
| `VOICE_NOT_SET` | Voice is not set |

## Callbacks

### DBDownloadProgressBlock

Download progress callback block.

**Signature:**
```objc
typedef void(^DBDownloadProgressBlock)(NSInteger percent, NSInteger index, NSInteger count);
```

**Parameters:**
- `percent`: Current file download progress (0-100, 100 means current file completed)
- `index`: Current downloading file index (starting from 1)
- `count`: Total number of files to download

**Example:**
```objc
config.onDownload = ^(NSInteger percent, NSInteger index, NSInteger count) {
    NSLog(@"Download: %ld%% (%ld/%ld)", (long)percent, (long)index, (long)count);
};
```

### DBActionResultBlock

Action result callback block.

**Signature:**
```objc
typedef void(^DBActionResultBlock)(DubbingAction action, DubbingEngineCode code, NSString * _Nullable msg);
```

**Parameters:**
- `action`: Action type (`DubbingAction` enum)
- `code`: Result code (`DubbingEngineCode` enum)
- `msg`: Result message (may be `nil`)

**Example:**
```objc
config.onActionResult = ^(DubbingAction action, DubbingEngineCode code, NSString * _Nullable msg) {
    if (code == SUCCESS) {
        NSLog(@"Action %ld succeeded: %@", (long)action, msg ?: @"");
    } else {
        NSLog(@"Action %ld failed: %@", (long)action, msg ?: @"");
    }
};
```

## Models

### DBSpeakerItem

Speaker/Voice item model.

#### Properties

| Property | Type | Description |
|---------|------|-------------|
| `id` | `NSNumber *` | Speaker ID |
| `name` | `NSString *` | Speaker name |

**Example:**
```objc
NSArray<DBSpeakerItem *> *voices = [manager getVoiceList];
for (DBSpeakerItem *voice in voices) {
    NSLog(@"ID: %@, Name: %@", voice.id, voice.name);
}
```

## Usage Flow

### Standard Flow

1. **Initialize**: Create `DBSDKManager` instance
2. **Configure**: Create `EngineConfig`, set properties and callbacks
3. **Set Config**: Call `setEngineConfig:`
4. **Prepare**: Call `prepare` (waits for `PREPARE` success in callback, status becomes `PREPARED`)
5. **Check Resources**: Call `checkResources` (waits for `CHECK_RESOURCES` success in callback)
6. **Start**: Call `start` (waits for `PREPARE` success in callback, status becomes `STARTED`)
7. **Set Voice**: Call `setVoice:` (waits for `SET_VOICE` success in callback)
8. **Transform**: Call `transform:` repeatedly with audio data
9. **Stop**: Call `stop` when done
10. **Release**: Call `engineRelease` to free resources

### Pro Mode Flow

1. Follow standard flow steps 1-6
2. **Calibrate** (optional): Call `proCalibration:success:` with 10-second PCM file
3. **Set Mode**: Call `setMode:intonation:pitch:` with `PRO_MODE` and calibration values
4. **Set Voice**: Call `setVoice:`
5. **Transform**: Call `transform:` repeatedly

## Sample Rate Handling

The SDK uses a unified `sampleRate` for both input and output. The underlying engine internally handles resampling:

- **Input Processing**: If `sampleRate != 16000`, the engine resamples input from `sampleRate` to 16000Hz
- **Core Processing**: Engine processes at fixed 16000Hz input and 24000Hz output
- **Output Processing**: If `sampleRate != 24000`, the engine resamples output from 24000Hz to `sampleRate`

**Example:**
```objc
config.sampleRate = 48000;  // Set to 48000Hz
// Engine automatically handles:
// 48000Hz input -> 16000Hz (resample) -> 24000Hz (process) -> 48000Hz (resample)
```

## Error Handling

Always check `DubbingEngineCode` in `onActionResult` callback:

```objc
config.onActionResult = ^(DubbingAction action, DubbingEngineCode code, NSString * _Nullable msg) {
    switch (code) {
        case SUCCESS:
            // Handle success
            break;
        case NET_AUTH_ERROR:
            // Handle authentication error
            break;
        case RESOURCE_MISSING_FILES:
            // Handle missing files - call checkResources
            break;
        case ENGINE_STATUS_ERROR:
            // Handle state error - check current status
            break;
        default:
            // Handle other errors
            break;
    }
};
```

## Thread Safety

- All callbacks are called on background threads
- Use `dispatch_async(dispatch_get_main_queue(), ...)` to update UI
- `transform:` method is thread-safe and can be called from any thread
- Multiple calls to `transform:` can be made concurrently

## Best Practices

1. **Always check engine status** before calling methods that require specific states
2. **Handle callbacks properly** - don't ignore error codes
3. **Clean up resources** - call `stop` and `engineRelease` when done
4. **Use appropriate audio format** - match your audio pipeline format
5. **Set voice after start** - ensure engine is started before setting voice (start clears voice ID)
6. **Clear buffers on start** - the SDK automatically clears buffers when `start` is called
7. **Match sample rates** - ensure input audio sample rate matches `config.sampleRate`

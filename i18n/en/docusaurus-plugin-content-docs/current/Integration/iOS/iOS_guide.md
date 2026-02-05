---
sidebar_position: 2
---

# Quick Start

## Overview

DubbingSDK is a real-time voice transformation SDK for iOS. This guide will help you quickly integrate and use the SDK.

## Prerequisites

- iOS 13.0 or later
- Xcode 12.0 or later
- CocoaPods or manual framework integration

## Integration

### 1. Add Framework

Add `DubbingSDK.framework` to your project.

### 2. Import Header

```objc
#import <DubbingSDK/DubbingSDK.h>
```

## Basic Usage

### 1. Initialize SDK Manager

```objc
DBSDKManager *manager = [[DBSDKManager alloc] init];
```

### 2. Configure Engine

```objc
EngineConfig *config = [EngineConfig defaultConfig];
config.token = @"your_token_here";
config.sampleRate = 48000;  // Same for input and output
config.channel = 1;
config.format = AUDIO_PCM_S16;
config.debug = YES; // Enable debug logs
config.muteOnFail = NO; // Return original audio if transformation fails

// Set download progress callback
config.onDownload = ^(NSInteger percent, NSInteger index, NSInteger count) {
    NSLog(@"Download progress: %ld%% (%ld/%ld)", (long)percent, (long)index, (long)count);
};

// Set action result callback
config.onActionResult = ^(DubbingAction action, DubbingEngineCode code, NSString * _Nullable msg) {
    if (code == SUCCESS) {
        NSLog(@"Action %ld succeeded: %@", (long)action, msg ?: @"");
    } else {
        NSLog(@"Action %ld failed: %@", (long)action, msg ?: @"");
    }
};

[manager setEngineConfig:config];
```

### 3. Prepare Engine

```objc
[manager prepare];
```

The `prepare` method will:
- Login and authenticate
- Check version
- Get speaker list
- Prepare engine resources

Results are returned through `config.onActionResult` callback with action `PREPARE`.

### 4. Check and Download Resources

```objc
[manager checkResources];
```

This will check if resource files need to be downloaded. Download progress is reported through `config.onDownload` callback. Results are returned through `config.onActionResult` callback with action `CHECK_RESOURCES`.

### 5. Start Engine

```objc
[manager start];
```

The engine will start loading resource files. Results are returned through `config.onActionResult` callback with action `PREPARE`. The engine status will change to `STARTED` when ready.

**Note:** This method clears the current speaker ID and audio buffers. You must call `setVoice` after engine starts successfully.

### 6. Set Voice

```objc
// Get available voices
NSArray<DBSpeakerItem *> *voices = [manager getVoiceList];
for (DBSpeakerItem *voice in voices) {
    NSLog(@"Voice ID: %@, Name: %@", voice.id, voice.name);
}

// Set voice (use voice ID from the list)
[manager setVoice:@(1)]; // Replace 1 with actual voice ID
```

Results are returned through `config.onActionResult` callback with action `SET_VOICE`.

### 7. Transform Audio

```objc
// Transform audio data (PCM format)
NSData *inputAudioData = ...; // Your PCM audio data
NSData *outputAudioData = [manager transform:inputAudioData];
// Use outputAudioData for playback
```

**Note:**
- Minimum data size is 10ms of audio
- Data smaller than 10ms will be accumulated until minimum size is reached
- Engine internally converts to 16-bit mono for processing
- If engine is not ready or voice is not set, returns silent data or original data based on `muteOnFail` setting

### 8. Stop Engine

```objc
[manager stop];
```

Results are returned through `config.onActionResult` callback with action `PREPARE`.

### 9. Release Engine

```objc
[manager engineRelease];
```

## Complete Example

```objc
#import <DubbingSDK/DubbingSDK.h>

@interface ViewController ()
@property (nonatomic, strong) DBSDKManager *sdkManager;
@end

@implementation ViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    
    // Initialize SDK manager
    self.sdkManager = [[DBSDKManager alloc] init];
    
    // Configure engine
    EngineConfig *config = [EngineConfig defaultConfig];
    config.token = @"your_token_here";
    config.sampleRate = 48000;
    config.channel = 1;
    config.format = AUDIO_PCM_S16;
    config.debug = YES;
    config.muteOnFail = NO;
    
    // Set callbacks
    __weak typeof(self) weakSelf = self;
    config.onActionResult = ^(DubbingAction action, DubbingEngineCode code, NSString * _Nullable msg) {
        __strong typeof(weakSelf) strongSelf = weakSelf;
        if (!strongSelf) return;
        
        dispatch_async(dispatch_get_main_queue(), ^{
            if (code == SUCCESS) {
                NSLog(@"Success: %@", msg ?: @"");
                
                // After prepare succeeds, check resources
                if (action == PREPARE && strongSelf.sdkManager.getEngineStatus == PREPARED) {
                    [strongSelf.sdkManager checkResources];
                }
                // After check resources succeeds, start engine
                else if (action == CHECK_RESOURCES) {
                    [strongSelf.sdkManager start];
                }
                // After start succeeds, set voice
                else if (action == PREPARE && strongSelf.sdkManager.getEngineStatus == STARTED) {
                    NSArray<DBSpeakerItem *> *voices = [strongSelf.sdkManager getVoiceList];
                    if (voices.count > 0) {
                        [strongSelf.sdkManager setVoice:voices[0].id];
                    }
                }
            } else {
                NSLog(@"Error: %@", msg ?: @"");
            }
        });
    };
    
    config.onDownload = ^(NSInteger percent, NSInteger index, NSInteger count) {
        NSLog(@"Download: %ld%% (%ld/%ld)", (long)percent, (long)index, (long)count);
    };
    
    [self.sdkManager setEngineConfig:config];
    
    // Start preparation
    [self.sdkManager prepare];
}

- (void)transformAudio:(NSData *)audioData {
    if (self.sdkManager.getEngineStatus == STARTED) {
        NSData *transformedData = [self.sdkManager transform:audioData];
        // Use transformedData for playback
    }
}

- (void)dealloc {
    [self.sdkManager stop];
    [self.sdkManager engineRelease];
}

@end
```

## Pro Mode Usage

### Set Pro Mode

```objc
// Set to Pro mode with intonation and pitch
[manager setMode:PRO_MODE intonation:0.7 pitch:0.6];

// Get supported ranges
NSArray<NSNumber *> *intonationRange = [manager getSupportIntonation];
NSArray<NSNumber *> *pitchRange = [manager getSupportPitch];
NSLog(@"Intonation range: [%@, %@]", intonationRange[0], intonationRange[1]);
NSLog(@"Pitch range: [%@, %@]", pitchRange[0], pitchRange[1]);

// Get current mode and values
DubbingMode currentMode = [manager getMode];
float currentIntonation = [manager getIntonation];
float currentPitch = [manager getPitch];
```

### Pro Calibration

```objc
// Prepare 10 seconds of PCM audio data
// File should be named audio.pcm and match the sampleRate in config
NSString *calibrationFilePath = @"/path/to/audio.pcm";
[manager proCalibration:calibrationFilePath success:^(float pitchFluctuation, float pitchOffset) {
    NSLog(@"Calibration result - Intonation: %f, Pitch: %f", pitchFluctuation, pitchOffset);
    // Use the returned values for setMode
    [manager setMode:PRO_MODE intonation:pitchFluctuation pitch:pitchOffset];
}];
```

## Sample Rate Handling

The SDK uses a unified `sampleRate` for both input and output. The underlying engine internally handles resampling:

- **Input**: If `sampleRate != 16000`, the engine resamples input from `sampleRate` to 16000Hz
- **Processing**: Engine processes at fixed 16000Hz input and 24000Hz output
- **Output**: If `sampleRate != 24000`, the engine resamples output from 24000Hz to `sampleRate`

**Example:**
```objc
config.sampleRate = 48000;  // Set to 48000Hz
// Engine automatically handles:
// 48000Hz input -> 16000Hz (resample) -> 24000Hz (process) -> 48000Hz (resample)
```

## Important Notes

1. **Call Order**: Always follow this order: `prepare` → `checkResources` → `start` → `setVoice` → `transform`
2. **Thread Safety**: All callbacks are called on background threads. Use `dispatch_async(dispatch_get_main_queue(), ...)` to update UI.
3. **Audio Format**: The SDK supports various PCM formats. The engine internally converts to 16-bit mono for processing.
4. **Error Handling**: Always check `DubbingEngineCode` in `onActionResult` callback to handle errors.
5. **Resource Management**: Call `stop` and `engineRelease` when done to free resources.
6. **Voice Setting**: You must call `setVoice` after `start` succeeds, as `start` clears the current voice ID.

## Troubleshooting

### No Sound After Starting

- Ensure `setVoice` is called after `start` succeeds
- Check that `getCurrentVoice` returns a non-nil value before calling `transform`
- Verify audio format matches configuration
- Check engine status is `STARTED`

### Download Fails

- Check network connection
- Verify token is valid
- Check available storage space

### Engine Start Fails

- Ensure all resource files are downloaded (call `checkResources` first)
- Verify at least 3 bin files are available
- Check engine status before starting

### Audio Format Issues

- Ensure input audio format matches `config.format`
- Ensure input sample rate matches `config.sampleRate`
- Ensure input channel count matches `config.channel`

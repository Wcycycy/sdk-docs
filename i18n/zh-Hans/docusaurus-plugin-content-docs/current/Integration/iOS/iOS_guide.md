---
sidebar_position: 2
---

# 快速开始

## 概述

DubbingSDK 是一个用于 iOS 的实时变声 SDK。本指南将帮助您快速集成和使用该 SDK。

## 前置要求

- iOS 13.0 或更高版本
- Xcode 12.0 或更高版本
- CocoaPods 或手动框架集成

## 集成

### 1. 添加框架

将 `DubbingSDK.framework` 添加到您的项目中。

### 2. 导入头文件

```objc
#import <DubbingSDK/DubbingSDK.h>
```

## 基本使用

### 1. 初始化 SDK 管理器

```objc
DBSDKManager *manager = [[DBSDKManager alloc] init];
```

### 2. 配置引擎

```objc
EngineConfig *config = [EngineConfig defaultConfig];
config.token = @"your_token_here";
config.sampleRate = 48000;  // 输入和输出使用相同的采样率
config.channel = 1;
config.format = AUDIO_PCM_S16;
config.debug = YES; // 启用调试日志
config.muteOnFail = NO; // 变声失败时返回原声

// 设置下载进度回调
config.onDownload = ^(NSInteger percent, NSInteger index, NSInteger count) {
    NSLog(@"下载进度: %ld%% (%ld/%ld)", (long)percent, (long)index, (long)count);
};

// 设置操作结果回调
config.onActionResult = ^(DubbingAction action, DubbingEngineCode code, NSString * _Nullable msg) {
    if (code == SUCCESS) {
        NSLog(@"操作 %ld 成功: %@", (long)action, msg ?: @"");
    } else {
        NSLog(@"操作 %ld 失败: %@", (long)action, msg ?: @"");
    }
};

[manager setEngineConfig:config];
```

### 3. 准备引擎

```objc
[manager prepare];
```

`prepare` 方法将执行：
- 登录和认证
- 检查版本
- 获取音色列表
- 准备引擎资源

结果通过 `config.onActionResult` 回调返回，动作为 `PREPARE`。

### 4. 检查并下载资源

```objc
[manager checkResources];
```

这将检查是否需要下载资源文件。下载进度通过 `config.onDownload` 回调报告。结果通过 `config.onActionResult` 回调返回，动作为 `CHECK_RESOURCES`。

### 5. 启动引擎

```objc
[manager start];
```

引擎将开始加载资源文件。结果通过 `config.onActionResult` 回调返回，动作为 `PREPARE`。引擎状态将在就绪时变为 `STARTED`。

**注意:** 此方法会清空当前音色 ID 和音频缓冲区。引擎启动成功后必须调用 `setVoice`。

### 6. 设置音色

```objc
// 获取可用音色列表
NSArray<DBSpeakerItem *> *voices = [manager getVoiceList];
for (DBSpeakerItem *voice in voices) {
    NSLog(@"音色 ID: %@, 名称: %@", voice.id, voice.name);
}

// 设置音色（使用列表中的音色 ID）
[manager setVoice:@(1)]; // 将 1 替换为实际的音色 ID
```

结果通过 `config.onActionResult` 回调返回，动作为 `SET_VOICE`。

### 7. 变声处理

```objc
// 变声处理音频数据（PCM 格式）
NSData *inputAudioData = ...; // 您的 PCM 音频数据
NSData *outputAudioData = [manager transform:inputAudioData];
// 使用 outputAudioData 进行播放
```

**注意:**
- 最小数据大小为 10ms 的音频
- 小于 10ms 的数据会累积直到达到最小大小
- 引擎内部会转换为 16 位单声道进行处理
- 如果引擎未就绪或音色未设置，根据 `muteOnFail` 设置返回静音数据或原始数据

### 8. 停止引擎

```objc
[manager stop];
```

结果通过 `config.onActionResult` 回调返回，动作为 `PREPARE`。

### 9. 释放引擎

```objc
[manager engineRelease];
```

## 完整示例

```objc
#import <DubbingSDK/DubbingSDK.h>

@interface ViewController ()
@property (nonatomic, strong) DBSDKManager *sdkManager;
@end

@implementation ViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    
    // 初始化 SDK 管理器
    self.sdkManager = [[DBSDKManager alloc] init];
    
    // 配置引擎
    EngineConfig *config = [EngineConfig defaultConfig];
    config.token = @"your_token_here";
    config.sampleRate = 48000;
    config.channel = 1;
    config.format = AUDIO_PCM_S16;
    config.debug = YES;
    config.muteOnFail = NO;
    
    // 设置回调
    __weak typeof(self) weakSelf = self;
    config.onActionResult = ^(DubbingAction action, DubbingEngineCode code, NSString * _Nullable msg) {
        __strong typeof(weakSelf) strongSelf = weakSelf;
        if (!strongSelf) return;
        
        dispatch_async(dispatch_get_main_queue(), ^{
            if (code == SUCCESS) {
                NSLog(@"成功: %@", msg ?: @"");
                
                // prepare 成功后，检查资源
                if (action == PREPARE && strongSelf.sdkManager.getEngineStatus == PREPARED) {
                    [strongSelf.sdkManager checkResources];
                }
                // checkResources 成功后，启动引擎
                else if (action == CHECK_RESOURCES) {
                    [strongSelf.sdkManager start];
                }
                // start 成功后，设置音色
                else if (action == PREPARE && strongSelf.sdkManager.getEngineStatus == STARTED) {
                    NSArray<DBSpeakerItem *> *voices = [strongSelf.sdkManager getVoiceList];
                    if (voices.count > 0) {
                        [strongSelf.sdkManager setVoice:voices[0].id];
                    }
                }
            } else {
                NSLog(@"错误: %@", msg ?: @"");
            }
        });
    };
    
    config.onDownload = ^(NSInteger percent, NSInteger index, NSInteger count) {
        NSLog(@"下载: %ld%% (%ld/%ld)", (long)percent, (long)index, (long)count);
    };
    
    [self.sdkManager setEngineConfig:config];
    
    // 开始准备
    [self.sdkManager prepare];
}

- (void)transformAudio:(NSData *)audioData {
    if (self.sdkManager.getEngineStatus == STARTED) {
        NSData *transformedData = [self.sdkManager transform:audioData];
        // 使用 transformedData 进行播放
    }
}

- (void)dealloc {
    [self.sdkManager stop];
    [self.sdkManager engineRelease];
}

@end
```

## Pro 模式使用

### 设置 Pro 模式

```objc
// 设置为 Pro 模式，并设置情感起伏和音高
[manager setMode:PRO_MODE intonation:0.7 pitch:0.6];

// 获取支持的范围
NSArray<NSNumber *> *intonationRange = [manager getSupportIntonation];
NSArray<NSNumber *> *pitchRange = [manager getSupportPitch];
NSLog(@"情感起伏范围: [%@, %@]", intonationRange[0], intonationRange[1]);
NSLog(@"音高范围: [%@, %@]", pitchRange[0], pitchRange[1]);

// 获取当前模式和值
DubbingMode currentMode = [manager getMode];
float currentIntonation = [manager getIntonation];
float currentPitch = [manager getPitch];
```

### Pro 模式校准

```objc
// 准备 10 秒的 PCM 音频数据
// 文件应命名为 audio.pcm，并与 config 中的 sampleRate 匹配
NSString *calibrationFilePath = @"/path/to/audio.pcm";
[manager proCalibration:calibrationFilePath success:^(float pitchFluctuation, float pitchOffset) {
    NSLog(@"校准结果 - 情感起伏: %f, 音高: %f", pitchFluctuation, pitchOffset);
    // 使用返回的值进行 setMode
    [manager setMode:PRO_MODE intonation:pitchFluctuation pitch:pitchOffset];
}];
```

## 采样率处理

SDK 使用统一的 `sampleRate` 作为输入和输出采样率。底层引擎内部处理重采样：

- **输入处理**: 如果 `sampleRate != 16000`，引擎会将输入从 `sampleRate` 重采样到 16000Hz
- **核心处理**: 引擎在固定的 16000Hz 输入和 24000Hz 输出下处理
- **输出处理**: 如果 `sampleRate != 24000`，引擎会将输出从 24000Hz 重采样到 `sampleRate`

**示例:**
```objc
config.sampleRate = 48000;  // 设置为 48000Hz
// 引擎自动处理：
// 48000Hz 输入 -> 16000Hz（重采样）-> 24000Hz（处理）-> 48000Hz（重采样）
```

## 重要提示

1. **调用顺序**: 始终遵循此顺序：`prepare` → `checkResources` → `start` → `setVoice` → `transform`
2. **线程安全**: 所有回调都在后台线程调用。使用 `dispatch_async(dispatch_get_main_queue(), ...)` 更新 UI。
3. **音频格式**: SDK 支持多种 PCM 格式。引擎内部会转换为 16 位单声道进行处理。
4. **错误处理**: 始终在 `onActionResult` 回调中检查 `DubbingEngineCode` 来处理错误。
5. **资源管理**: 完成后调用 `stop` 和 `engineRelease` 释放资源。
6. **音色设置**: 必须在 `start` 成功后调用 `setVoice`，因为 `start` 会清空当前音色 ID。

## 故障排除

### 启动后没有声音

- 确保在 `start` 成功后调用 `setVoice`
- 检查调用 `transform` 前 `getCurrentVoice` 返回非 nil 值
- 验证音频格式与配置匹配
- 检查引擎状态是否为 `STARTED`

### 下载失败

- 检查网络连接
- 验证 token 是否有效
- 检查可用存储空间

### 引擎启动失败

- 确保所有资源文件已下载（先调用 `checkResources`）
- 验证至少有 3 个 bin 文件可用
- 启动前检查引擎状态

### 音频格式问题

- 确保输入音频格式与 `config.format` 匹配
- 确保输入采样率与 `config.sampleRate` 匹配
- 确保输入声道数与 `config.channel` 匹配

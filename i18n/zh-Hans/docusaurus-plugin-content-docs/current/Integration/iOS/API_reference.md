---
sidebar_position: 3
---

# API 参考文档

## 目录

1. [概览](#概览)
2. [类](#类)
3. [枚举](#枚举)
4. [回调](#回调)
5. [方法](#方法)

## 概览

DubbingSDK 为 iOS 应用提供实时语音变换能力。SDK 支持普通模式和专业模式，并可自定义情感起伏（Intonation）与音高（Pitch）。

## 类

### EngineConfig

用于配置 SDK 的引擎配置类。

#### 属性

| 属性 | 类型 | 说明 | 默认值 |
|---------|------|-------------|---------|
| `sampleRate` | `NSInteger` | 输入与输出的采样率（Hz） | 48000 |
| `token` | `NSString *` | 鉴权 Token | `nil` |
| `debug` | `BOOL` | 是否开启调试日志 | `NO` |
| `transformDebug` | `BOOL` | 是否开启变声过程日志 | `NO` |
| `channel` | `NSInteger` | 音频通道数 | 1 |
| `format` | `DBAudioSampleFormat` | 音频采样格式 | `AUDIO_PCM_S16` |
| `muteOnFail` | `BOOL` | 变声失败时是否静音 | `YES` |
| `isSync` | `BOOL` | 是否使用同步变声 | `NO` |
| `onDownload` | `DBDownloadProgressBlock` | 资源下载进度回调 | `nil` |
| `onActionResult` | `DBActionResultBlock` | 行为结果回调 | `nil` |

#### 方法

##### + (instancetype)defaultConfig

创建一个默认配置实例。

**返回值：** 使用默认参数创建的 `EngineConfig` 实例。

**示例：**
```objc
EngineConfig *config = [EngineConfig defaultConfig];
```

### DBSDKManager

用于语音变换操作的核心 SDK 管理类。

#### 属性

| 属性 | 类型 | 说明 |
|---------|------|-------------|
| `engineConfig` | `EngineConfig *` | 引擎配置对象 |

#### 方法

##### - (void)setEngineConfig:(EngineConfig *)config

设置引擎配置。

**参数：**
- `config`：引擎配置对象

**示例：**
```objc
EngineConfig *config = [EngineConfig defaultConfig];
config.token = @"your_token";
config.sampleRate = 48000;
[manager setEngineConfig:config];
```

##### - (void)prepare

准备引擎（登录、校验版本、获取音色列表）。

该方法为异步调用，结果会通过 `engineConfig.onActionResult` 回调返回，行为类型为 `PREPARE`。

##### - (void)checkResources

检查是否需要下载资源文件。

下载进度通过 `engineConfig.onDownload` 回调返回，结果通过 `engineConfig.onActionResult` 返回，行为类型为 `CHECK_RESOURCES`。

##### - (void)start

启动语音变换引擎。

该方法为异步调用，成功后引擎状态变为 `STARTED`。

**注意：** 调用该方法会清空当前音色 ID 和音频缓冲区，需在启动成功后重新调用 `setVoice`。

##### - (void)stop

停止语音变换，但不会销毁线程。

##### `- (NSArray<DBSpeakerItem *> *)getVoiceList`

获取可用音色列表。

##### `- (NSNumber * _Nullable)getCurrentVoice`

获取当前已设置的音色 ID。

##### - (DubbingEngineStatus)getEngineStatus

获取当前引擎状态。

##### - (void)setVoice:(NSNumber *)voiceId

设置当前音色。

##### - (void)setMode:(DubbingMode)mode intonation:(float)intonation pitch:(float)pitch

设置变声模式、情感起伏和音高。

##### - (float)getIntonation

获取当前情感起伏值。

##### - (float)getPitch

获取当前音高值。

##### `- (NSArray<NSNumber *> *)getSupportIntonation`

获取支持的情感起伏范围。

##### `- (NSArray<NSNumber *> *)getSupportPitch`

获取支持的音高范围。

##### - (DubbingMode)getMode

获取当前变声模式。

##### - (void)proCalibration:(NSString *)path success:(void(^)(float pitchFluctuation, float pitchOffset))success

执行专业模式校准。

##### - (NSData *)transform:(NSData *)data

对音频数据进行实时变声处理。

##### - (void)cleanAllFiles

清理所有已下载的资源文件。

##### - (void)engineRelease

释放引擎并回收所有资源。

## 枚举

### DBAudioSampleFormat

音频采样格式枚举。

### DubbingEngineStatus

引擎状态枚举。

### DubbingMode

变声模式枚举。

### DubbingAction

回调行为类型枚举。

### DubbingEngineCode

引擎结果码枚举。

## 回调

### DBDownloadProgressBlock

资源下载进度回调。

### DBActionResultBlock

行为结果回调。

## 使用流程

### 标准流程

1. 初始化 `DBSDKManager`
2. 创建并配置 `EngineConfig`
3. 调用 `setEngineConfig`
4. 调用 `prepare`
5. 调用 `checkResources`
6. 调用 `start`
7. 调用 `setVoice`
8. 持续调用 `transform`
9. 调用 `stop`
10. 调用 `engineRelease`

## 最佳实践

- 调用前始终检查引擎状态  
- 正确处理回调结果和错误码  
- 使用结束后及时释放资源  
- 确保音频采样率与配置一致  

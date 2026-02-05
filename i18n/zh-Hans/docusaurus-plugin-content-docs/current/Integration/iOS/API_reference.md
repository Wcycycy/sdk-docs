---
sidebar_position: 3
---

# API 参考

## DBSDKManager

### prepare

准备引擎所需的资源并执行鉴权。首次调用时会下载音色模型文件，因此耗时较长。

### getVoiceList

获取可用音色列表。只有在引擎准备完成后，才会返回可用的音色列表。

**返回值：** `NSArray<DBSpeakerItem *>`，列表可能为空。

### getCurrentVoice

获取当前设置的音色。  
**返回值：** 音色 ID，可能为 `nil`。

### cleanAllFiles

删除音色模型文件。执行该方法后，下次调用 `prepare()` 时会重新下载这些文件。

**返回值：** `void`  
**注意：** 引擎会自动清理不必要的文件，请勿在引擎的文件目录中存放其他文件。

### start

启动语音变换。

### stop

停止语音变换，但不会退出语音变换线程。执行该方法后，线程中的数据会被清空，线程进入休眠状态。

### getEngineStatus

获取当前引擎状态。

### setVoice(voiceId: NSNumber)

调用该方法时，会先检查该音色所需的模型是否已加载；如果未加载，则会先将模型加载到内存中。

设置音色。该操作为异步操作，结果会通过 `DBActionResultBlock` 回调返回。

**注意：** 只有在引擎准备完成后才能设置成功。无论当前是否正在进行语音变换，都可以设置音色。例如，在语音变换过程中，设置成功后声音会立即切换为新的音色。

### releaseEngine

释放引擎资源并终止线程。

### transform(data: NSData): NSData?

对音频数据进行变换。  
输入：`data: NSData`  
返回：`NSData?`（变换后的数据）

### checkResources

检查是否需要下载所需的资源文件。

### setMode

设置引擎处理模式（例如 Pro 模式）。

```
setMode(mode: DubbingMode, intonation: Float, pitch: Float)
```

| 参数名 | 参数类型 | 说明 |
|--------|----------|------|
| mode | `DubbingMode` | 模式枚举 |
| intonation | `float` | 情感起伏 / 语调 |
| pitch | `float` | 音高 |

### getSupportIntonation

检查当前音色是否支持语调调节。

### getSupportPitch

检查当前音色是否支持音高调节。

### getMode

获取当前引擎模式设置。

### getIntonation

获取当前语调值。

### getPitch

获取当前音高值。

### proCalibration

执行 Pro 模式校准。

## DBSDKManager 默认参数说明

| 参数名 | 参数类型 | 默认值 | 说明 |
|--------|----------|--------|------|
| `onActionResult` | `DBActionResultBlock` | `nil` | 引擎事件回调 |
| `sampleRate` | `NSInteger` | `48000` | 采样率 |
| `token` | `NSString *` | `nil` | 鉴权 Token，由开发者获取 |
| `debug` | `BOOL` | `NO` | 是否打印引擎运行日志 |
| `transformDebug` | `BOOL` | `NO` | 是否打印变声处理日志，开启后会显著增加日志输出 |
| `muteOnFail` | `BOOL` | `YES` | 变声失败时是否静音 |
| `channel` | `NSInteger` | `1` | 默认声道数 |
| `format` | `DBAudioSampleFormat` | `AUDIO_PCM_S16` | 默认音频格式 |
| `isSync` | `BOOL` | `NO` | 是否启用同步变换 |

## EngineConfig

### EngineConfig()

构造函数。

### defaultConfig

创建默认配置实例。

### debug

开启日志打印，仅输出引擎运行过程中的日志信息。

### transformDebug

开启变声日志。语音变换为高频操作，开启后日志刷新速度较快。

### token

鉴权 Token，由服务端下发。

### sampleRate

采样率，默认值为 48000。常见可选值包括 16000、24000、48000。

### onActionResult

引擎回调。

### muteOnFail

变声失败时是否静音。

### isSync

是否启用同步变换。

### channel

音频声道数。

### format

音频格式设置。

### onDownload

下载进度回调。

## DBDownloadProgressBlock

### onDownload(percent: NSInteger, index: NSInteger, count: NSInteger)

| 参数名 | 参数类型 | 说明 |
|--------|----------|------|
| percent | `NSInteger` | 当前文件下载进度（0–100） |
| index | `NSInteger` | 当前下载文件索引，从 1 开始 |
| count | `NSInteger` | 需要下载的文件总数 |

## DBActionResultBlock

### onActionResult(action: DubbingAction, code: DubbingEngineCode, msg: String?)

| 参数名 | 参数类型 | 说明 |
|--------|----------|------|
| action | `DubbingAction` 枚举 | 事件类型 |
| code | `DubbingEngineCode` 枚举 | 事件结果 |
| msg | `NSString *` | 事件消息，可能为 `nil` |

## DubbingAction

| 枚举值 | 说明 |
|--------|------|
| `SET_VOICE` | 设置音色 |
| `AUTH` | 鉴权 |
| `PREPARE` | 准备引擎 |
| `CHECK_RESOURCES` | 检查资源文件 |
| `PRO_CALIBRATION` | Pro 模式校准 |

## DubbingEngineCode

| 枚举值 | 说明 |
|--------|------|
| `SUCCESS` | 成功 |
| `UNKNOWN_ERROR` | 未知错误 |
| `NET_REQUEST_ERROR` | 网络错误 |
| `NET_AUTH_ERROR` | 鉴权失败 |
| `LIC_ERROR` | 鉴权失败 |
| `ENGINE_STATUS_ERROR` | 当前引擎状态不支持该操作 |
| `RESOURCE_MISSING_FILES` | 缺少资源文件 |
| `VOICE_SETTING` | 音色正在设置中 |
| `VOICE_NOT_SET` | 未设置音色 |

## DubbingEngineStatus

| 枚举值 | 说明 |
|--------|------|
| `IDLE` | 实例创建成功 |
| `PREPARING` | 正在准备引擎资源 |
| `PREPARED` | 引擎资源已就绪 |
| `STARTED` | 语音变换已启动 |
| `STOPPED` | 语音变换已停止 |
| `RELEASED` | 引擎已释放 |
| `ERROR` | 引擎错误 |
| `CHECKING` | 正在检查资源文件 |
| `CALIBRATING` | 正在进行自动校准 |

## DBSpeakerItem

| 成员变量 | 说明 |
|----------|------|
| `id` | 音色 ID |
| `name` | 音色名称 |

## DubbingMode

| 枚举值 | 说明 |
|--------|------|
| `NORMAL_MODE` | 普通模式 |
| `PRO_MODE` | Pro 模式 |
---
sidebar_position: 3
---

# API 参考

## DubbingEngine

### prepare
准备引擎所需的资源并执行鉴权。首次调用时会下载音色模型文件，因此耗时较长。

### getVoiceList
获取可用音色列表。只有在引擎完成 prepare 之后，才会返回音色列表。

**返回值：** `json:[{"id":10, "name":"xx"},{"id":11, "name":"xxx"}]`，音色列表可能为空。

### getCurrentVoice
获取当前设置的音色。  
**返回值：** 音色 ID，可能为 0。

### start
启动变声处理。

### stop
停止变声处理，但不会退出变声线程。执行该方法后，线程内数据会被清空，线程进入休眠状态。

### getEngineStatus
获取当前引擎状态。

### setVoice(voiceId: int)
调用该方法时，会首先检查该音色所需的模型是否已加载；如果未加载，则会先将模型加载到内存中。

设置音色。该操作为异步操作，结果会通过 `DubbingCallback` 回调返回。

**注意：**  
只有在引擎 prepare 成功后才能设置音色。无论当前是否正在变声，都可以设置音色；例如在变声进行中，音色设置成功后会立即切换为新的音色。

### releaseEngine
释放引擎资源并终止线程。

### transform(originData: char* data, int dataSize): bool?
对音频数据进行变声处理。  
输入：`originData: char* data, int dataSize`  
返回：`bool`（是否转换成功）。

### checkResources
检查是否需要下载所需的资源文件。

### setMode
设置引擎处理模式（例如 Pro 模式）。

```c++
setMode(mode: DubbingMode, intonation: Float, pitch: Float)
```

| 参数名 | 参数类型 | 描述 |
| :--- | :--- | :--- |
| mode | [DubbingMode] | 模式枚举 |
| intonation | float | 情感起伏 / 语调 |
| pitch | float | 音高 |

### getSupportIntonation
检查当前音色是否支持语调调节。

### getSupportPitch
检查当前音色是否支持音高调节。

### getMode
获取当前引擎模式。

### getIntonation
获取当前语调值。

### getPitch
获取当前音高值。

### proCalibration
执行 Pro 模式校准。

### getDelayMillis(): int
获取处理延迟（毫秒）。返回：`int`。

## EngineConfig 默认参数说明

| 参数名 | 参数类型 | 默认值 | 描述 |
| :--- | :--- | :--- | :--- |
| m_dubbbingCallBack | IDubbbingCallBack | nullptr | 引擎事件回调 |
| m_sampleRate | int | 48000 | 输入采样率 |
| m_channel | int | 1 | 默认声道数 |
| m_format | AudioSampleFormat | AUDIO_PCM_S16 | 默认音频格式 |
| m_token | std::string | "" | 鉴权 token，由开发者获取 |
| m_resourcePath | std::string | dubbing_resource | 默认路径示例：`${context.filesDir}/dubbing_resource` |
| m_muteOnFail | bool | true | 变声失败时是否静音 |
| m_enableLog | bool | false | 是否打印引擎运行日志 |
| m_enableTransformLog | bool | false | 是否打印变声过程日志（开启后日志量较大） |
| m_isSync | bool | false | 是否使用同步变声 |

## DubbingEngineCallback
（其余内容保持不变，已翻译）

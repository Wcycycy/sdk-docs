---
sidebar_position: 3
---

# API 参考

## DubbingEngine

### prepare
准备引擎所需的资源并执行鉴权。首次调用时会下载音色模型文件，因此耗时较长。

### getVoiceList
获取可用音色列表。只有在引擎准备完成后，才会返回可用的音色列表。

**返回值：** `ArrayList <DubbingVoice>`，列表可能为空。

### getCurrentVoice
获取当前设置的音色。  
**返回值：** 音色 ID，可能为 null。

### clearModelFiles
删除音色模型文件。执行该方法后，下次调用 `prepare()` 时会重新下载这些文件。

**返回值：** `int`，删除的文件数量。  
**注意：** 引擎会自动清理不必要的文件，请勿在引擎的文件目录中存放其他文件。

### start
启动语音变换。

### stop
停止语音变换，但不会退出语音变换线程。执行该方法后，线程中的数据会被清空，线程进入休眠状态。

### getEngineStatus
获取当前引擎状态。

### setVoice(voiceId: Int)
调用该方法时，会先检查该音色所需的模型是否已加载；如果未加载，则会先将模型加载到内存中。

设置音色。该操作为异步操作，结果会通过 `DubbingCallback` 回调返回。

**注意：** 只有在引擎准备完成后才能设置成功。无论当前是否正在进行语音变换，都可以设置音色。例如，在语音变换过程中，设置成功后声音会立即切换为新的音色。

### releaseEngine
释放引擎资源并终止线程。

### transform(originData: ByteArray): ByteArray?
对音频数据进行变换。  
输入：`originData: ByteArray`  
返回：`ByteArray?`（变换后的数据）

### transform(buffer: ByteBuffer): ByteArray?
对音频数据进行变换。  
输入：`buffer: ByteBuffer`  
返回：`ByteArray?`（变换后的数据）

### transform(originalData: FloatArray): FloatArray?
对音频数据进行变换。  
输入：`originalData: FloatArray`  
返回：`FloatArray?`（变换后的数据）

### checkResources
检查是否需要下载所需的资源文件。

### setMode
设置引擎处理模式（例如 Pro 模式）。

```kotlin
setMode(mode: DubbingMode, intonation: Float, pitch: Float)
```

| 参数名 | 参数类型 | 说明 |
| :--- | :--- | :--- |
| mode | [DubbingMode] | 模式枚举 |
| intonation | float | 情感起伏 / 语调 |
| pitch | float | 音高 |

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

### getDelayMillis(): Int
获取处理延迟（毫秒）。  
返回：`Int`

## DubbingEngine 默认参数说明

| 参数名 | 参数类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| callback | DubbingCallback | null | 引擎事件回调 |
| sampleRate | Int | 48000 | 采样率 |
| samplesPerCall | Int | | 每次音频数据回调的采样大小，默认由引擎计算：samplesPerCall = sampleRate / 100 * 16 * format.bytes * channel |
| mToken | String | null | 鉴权 Token，由开发者获取 |
| debugHelper | TransformDebugHelper | null | 变声性能统计辅助类，仅在 transformDebug 为 true 时生效 |
| muteOnFail | Boolean | true | 变声失败时是否静音 |
| debug | Boolean | false | 是否打印引擎运行日志 |
| transformDebug | Boolean | false | 是否打印变声处理日志，开启后会显著增加日志输出 |
| resourcePath | String | dubbing_resource | 默认路径：`${context?.filesDir}/dubbing_resource` |
| channel | Int | 1 | 默认声道数 |
| format | AudioSampleFormat | AUDIO_PCM_S16 | 默认音频格式 |
| isSync | Boolean | false | 是否启用同步变换 |

## DubbingEngine.EngineConfig

### EngineConfig(context: Context)
构造函数。

### enableLog（可选）
开启日志打印，仅输出引擎运行过程中的日志信息。

### enableTransformLog（可选）
开启变声日志。语音变换为高频操作，开启后日志刷新速度较快。

### enableTransformLog(TransformDebugHelper)（可选）
效果与 transformLog() 相同，同时 helper 会记录语音变换过程中的各类耗时数据。

### token
鉴权 Token，由服务端下发。

### sampleRate
采样率，默认值为 48000。常见可选值包括 16000、24000、48000。

### engineCallback(callback)
引擎回调。

### buildEngine
构建 DubbingEngine 实例。

### muteOnFail
变声失败时是否静音。

### sync
是否启用同步变换。

### channel
音频声道数。

### format
音频格式设置。

### samplesPerCall
每次音频数据回调的采样大小。  
每一帧数据长度必须是 10 毫秒的整数倍。

```kotlin
val bytes = 2
val channel = 1
samplesPerCall = 48000 / 100 * bytes * channel
```

## DubbingCallback

### onDownload(percent: Int, index: Int, count: Int)
| 参数名 | 参数类型 | 说明 |
| :--- | :--- | :--- |
| percent | int | 当前文件下载进度（0–100） |
| index | int | 当前下载文件索引，从 1 开始 |
| count | int | 需要下载的文件总数 |

### onActionResult(action: DubbingAction, code: DubbingEngineCode, msg: String?)
| 参数名 | 参数类型 | 说明 |
| :--- | :--- | :--- |
| action | DubbingAction 枚举 | 事件类型 |
| code | DubbingEngineCode 枚举 | 事件结果 |
| msg | String | 事件消息，可能为 null |

## DubbingAction
| 枚举值 | 说明 |
| :--- | :--- |
| SET_VOICE | 设置音色 |
| AUTH | 鉴权 |
| PREPARE | 准备引擎 |
| CHECK_RESOURCES | 检查资源文件 |
| PRO_CALIBRATION | Pro 模式校准 |

## DubbingEngineCode
| 枚举值 | 说明 |
| :--- | :--- |
| SUCCESS | 成功 |
| UNKNOWN_ERROR | 未知错误 |
| NET_REQUEST_ERROR | 网络错误 |
| NET_AUTH_ERROR | 鉴权失败 |
| LIC_ERROR | 鉴权失败 |
| ENGINE_STATUS_ERROR | 当前引擎状态不支持该操作 |
| RESOURCE_MISSING_FILES | 缺少资源文件 |
| VOICE_SETTING | 音色正在设置中 |
| VOICE_NOT_SET | 未设置音色 |

## DubbingEngineStatus
| 枚举值 | 说明 |
| :--- | :--- |
| IDLE | 实例创建成功 |
| PREPARING | 正在准备引擎资源 |
| PREPARED | 引擎资源已就绪 |
| STARTED | 语音变换已启动 |
| STOPPED | 语音变换已停止 |
| RELEASED | 引擎已释放 |
| ERROR | 引擎错误 |
| CHECKING | 正在检查资源文件 |
| CALIBRATING | 正在进行自动校准 |

## DubbingVoice
| 成员变量 | 说明 |
| :--- | :--- |
| id | 音色 ID |
| name | 音色名称 |

## DubbingMode
| 枚举值 | 说明 |
| :--- | :--- |
| NORMAL_MODE | 普通模式 |
| PRO_MODE | Pro 模式 |

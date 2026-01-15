---
sidebar_position: 2
---

# 快速开始

:::caution

SDK 支持 arm64-v8a。 

:::

## 环境配置

SDK 使用以下编译参数：

* **minSdk:** 21
* **targetSdk:** 31
* **compileSdk:** 31

## 集成 SDK

1. SDK 以 **.aar 文件** 的形式提供。下载后，将其放入应用的 `libs` 目录中，并在 `app/build.gradle` 中添加以下内容：

```kotlin
implementation fileTree(include: [ '*.jar' , '*.aar' ], dir: 'libs' )
```

2. 声明权限：

```kotlin
<uses-permission android:name="android.permission.INTERNET" />
```

### 直接使用变声引擎

1. **创建引擎实例。** 此步骤仅创建实例，**不会**加载变声所需的资源。

```kotlin
val engine = DubbingEngine.EngineConfig(this)
    .enableLog() // 打印日志
    .enableTransformLog() // 打印变声日志
    .token("xxx")
    .sampleRate(mSampleRate) // 输入采样率，例如 48000
    .engineCallback(object : DubbingCallback {
        // 资源下载进度
        override fun onDownload(percent: Int, index: Int, count: Int) {
            val str = "正在下载资源: $index / $count $percent %"
        }

        // 事件回调
        override fun onActionResult(action: DubbingAction, code: DubbingEngineCode, msg: String?) {
            Toast.makeText(
                context,
                "${action.name} : $code ${msg ?: ""}",
                Toast.LENGTH_SHORT
            ).show()
        }
    })
    .build()
```

2. **准备引擎资源。** 此操作较为耗时。完成后会通过第 1 步中注册的 `callback` **回调通知**。该步骤会将资源文件下载到 App 的私有目录中。

```kotlin
engine.prepare()
```

3. **启动变声工作线程** 并在工作线程中初始化引擎。资源准备完成后即可初始化引擎。

3.1 在第 1 步的 `onActionResult` 回调中 **检查资源是否准备完成**：

```kotlin
val success = action == DubbingAction.PREPARE && code == DubbingEngineCode.SUCCESS
```

**注意：** `prepare()` 为异步操作，需要进行鉴权并检查所需的变声资源。

4. **获取音色列表。** 引擎成功准备完成后即可查询音色列表。

```kotlin
engine.getVoiceList() // 返回 ArrayList<DubbingVoice>，可能为空
```

5. **设置音色。** 从第 4 步获取的列表中选择一个音色并设置。该操作为异步操作，结果会通过 `onActionResult` **回调** 返回。

```kotlin
engine.setVoice(voice.id)
```

6. **启动变声。**

```kotlin
engine.start()
```

7. **停止变声。** 该步骤会清空工作线程中的数据，内部 Looper 将进入休眠状态。

```kotlin
engine.stop()
```

8. **语音变换。** 在引擎成功初始化且音色设置成功后，即可开始进行语音变换。

```kotlin
engine.transform(data) // data 为字节数组
```

**注意：** 仅当引擎状态为 `DubbingEngineStatus.STARTED`（完成第 6 步操作后）且音色设置成功时，语音变换才会生效。

9. **释放引擎。**

```kotlin
engine.releaseEngine()
```

**注意：** 引擎释放后，如需再次使用，必须从第 2 步（准备引擎资源）重新开始。

### 单独下载变声资源

如果只需要下载资源，可仅执行“直接使用变声引擎”中的第 1 步和第 2 步。

### 检查是否需要下载资源

如果仅需要 **检查所需的资源文件**，可以调用以下方法：

```kotlin
engine.checkResources()
```

然后在 `DubbingCallback` 的 `onActionResult` 回调中处理结果，示例如下。

**注意：** 如果需要下载文件，`msg` 参数将返回一个 **JSON 字符串**，例如：
`{"fileCount":0,"fileLength":100000}`。
* `fileCount` 表示需要下载的文件数量
* `fileLength` 表示文件的总大小（**字节**），该值并非精确值，仅用于界面展示

```kotlin
if (action == DubbingAction.CHECK_RESOURCES) {
    if (code == DubbingEngineCode.SUCCESS) {
        Log.d("tag", "资源文件已下载完成")
    } else {
        msg?.let {
            val obj = JSONObject(msg)
            var fileCount = 0L
            var fileLength = 0L
            if (obj.has("fileCount") && obj.has("fileLength")) {
                fileCount = obj.getLong("fileCount")
                fileLength = obj.getLong("fileLength")
            }
            Log.d("tag", "需要下载的文件数: $fileCount, 大小: $fileLength")
        }
    }
}
```

## 自采集 / 播放 / 文件转换

在同时进行采集与播放（自采集/自播放）或进行文件转换时，调用 `transform` 时传入的数据长度计算方式如下：

```kotlin
val bufferSize = sampleRate / 100 * 16 * bytes * channels
```

自采集/播放示例代码：

```kotlin
var audioRecord: AudioRecord // 录音
var audioTrack: AudioTrack // 播放

// 采集时：
val buffer = ByteArray(bufferSize)
val result = audioRecord.read(buffer, 0, buffer.size)

// 播放时：
if (result != null && result.isNotEmpty()) {
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
        audioTrack!!.write(
            result,
            0,
            result.size,
            AudioTrack.WRITE_BLOCKING
        )
    } else {
        audioTrack!!.write(result, 0, result.size)
    }
}
```

文件转换示例代码：

```kotlin
val fin: FileInputStream = FileInputStream(inPath) // 输入文件
var fot: FileOutputStream = FileOutputStream(outPath) // 输出文件
val buffer = ByteArray(bufferSize)
val result = fin.read(buffer)
val transform = engine?.transform(buffer)
if (transform != null && transform.isNotEmpty()) {
    fot.write(transform)
}
```

**注意：** 文件的采样率必须与引擎设置的采样率一致，并且文件必须为 PCM 格式数据。由于文件中的数据长度无法保证是单次变换帧的整数倍，在连续转换多个文件时，需要将第一个文件末尾剩余的数据与第二个文件开头的数据进行拼接，以保证音频的连续性。

例如：采样率为 48000 时，若 `bufferSize = 15360`，第一个文件长度为 20000 字节，则在取出第一帧数据后还剩余 4640 字节。下一次变换时，需要从第二个文件的开头取出 10720 字节的数据，与第一个文件剩余的 4640 字节拼接成 15360 字节后再进行变换，依此类推。

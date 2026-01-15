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

1. SDK 以 **.aar 文件** 的形式提供。下载后，请将其放入应用的 `libs` 目录中，并在 `app/build.gradle` 中添加以下内容：

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
        override fun onDownload(percent: Int, index: Int, count: Int) {
            val str = "正在下载资源: $index / $count $percent %"
        }

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

2. **准备引擎资源。** 该操作较为耗时，完成后会通过回调通知。

```kotlin
engine.prepare()
```

3. **启动变声工作线程** 并初始化引擎。

```kotlin
val success = action == DubbingAction.PREPARE && code == DubbingEngineCode.SUCCESS
```

4. **获取音色列表。**

```kotlin
engine.getVoiceList()
```

5. **设置音色。**

```kotlin
engine.setVoice(voice.id)
```

6. **启动变声。**

```kotlin
engine.start()
```

7. **停止变声。**

```kotlin
engine.stop()
```

8. **语音变换。**

```kotlin
engine.transform(data)
```

9. **释放引擎。**

```kotlin
engine.releaseEngine()
```

## 自采集 / 播放 / 文件转换

```kotlin
val bufferSize = sampleRate / 100 * 16 * bytes * channels
```

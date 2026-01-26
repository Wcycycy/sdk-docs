---
sidebar_position: 2
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# 快速开始

:::caution
当前 SDK 仅支持 x64 架构。
:::

## 集成 SDK
SDK 以 **动态链接库（DLL）** 的形式提供。

将 SDK 集成到你的项目中，请按照以下步骤操作：

1. **部署：** 将所有提供的 DLL 文件放置在**程序调用目录**（即应用程序的运行目录）。
2. **核心库：** 核心 C++ 库通过 `dubbing-sdk-cpp-dll.dll` 对外提供。

**使用说明：**

关于函数调用方式及具体实现流程，请参考**随 SDK 提供的示例 Demo 程序**。

### 直接语音变换（实时变声）
本节介绍如何初始化引擎并启用实时语音变换功能。

#### 1. 获取鉴权 Token（签名字符串）
首先，你需要从自己的服务器获取鉴权 Token（Sign String）。

<Tabs>
  <TabItem value="cpp" label="C++">

```cpp
std::string token = "access_key=\"xxxxxx\",timestamp=\"xxxxxx\",nonce=\"xxxxxx\",id=\"xxxxxx\",signature=\"xxxxxx\"";
```

  </TabItem>
  <TabItem value="csharp" label="C#">

```csharp
token = "access_key=\"xxxxxx\",timestamp=\"xxxxxx\",nonce=\"xxxxxx\",id=\"xxxxxx\",signature=\"xxxxxx\"";
```

  </TabItem>
  <TabItem value="python" label="Python">

```python
token = b"access_key=\"xxxxxx\",timestamp=\"xxxxxx\",nonce=\"xxxxxx\",id=\"xxxxxx\",signature=\"xxxxxx\""
```

  </TabItem>
</Tabs>

#### 2. 创建引擎实例
此步骤仅创建引擎实例，并**不会**加载任何变声资源。

<Tabs>
  <TabItem value="cpp" label="C++">

```cpp
DUBBING::EngineConfig engineConfig;
MyDubbbingCallBack myDubbbingCallBack;
engineConfig.token(token)
    .channel(1)
    .format(AUDIO_PCM_S16)
    .sampleRate(ma_standard_sample_rate_16000)
    .isSync(false)
    .dubbbingCallBack(&myDubbbingCallBack);
DUBBING::IDubbingEngine* engine = createDubbingEngine(engineConfig);
```

  </TabItem>
</Tabs>

#### 3. 准备引擎资源
该操作耗时较长。完成后会通过回调返回结果，并将所需资源文件下载至应用的私有目录中。

<Tabs>
  <TabItem value="cpp" label="C++">

```cpp
engine->prepare();
```

  </TabItem>
</Tabs>

#### 4. 启动变声工作线程
在资源准备完成后，需要在工作线程中初始化并启动引擎。

#### 4.1 检查资源是否准备完成
在第 1 步中注册的回调 `onActionResult` 中判断资源状态：

<Tabs>
  <TabItem value="cpp" label="C++">

```cpp
bool isSuccess = (actionType == SET_VOICE && retCode == SUCCESS);
```

  </TabItem>
</Tabs>

**注意：**  
`prepare()` 为异步方法，内部会执行鉴权流程并检查、下载变声所需资源。

#### 5. 获取音色列表
当引擎资源准备完成后，即可获取当前可用的音色列表。

<Tabs>
  <TabItem value="cpp" label="C++">

```cpp
std::string voices = engine->getVoiceList();
printf(voices.c_str());
```

  </TabItem>
</Tabs>

#### 6. 设置音色
从第 5 步获取的音色列表中选择一个音色并进行设置。该操作为异步操作，结果会通过 `onActionResult` 回调返回。

<Tabs>
  <TabItem value="cpp" label="C++">

```cpp
engine->setVoice(192); // 示例音色 ID
```

  </TabItem>
</Tabs>

#### 7. 启动变声
<Tabs>
  <TabItem value="cpp" label="C++">

```cpp
engine->start();
```

  </TabItem>
</Tabs>

#### 8. 停止变声
该操作会清空工作线程中的数据，并使内部 Looper 进入休眠状态。

<Tabs>
  <TabItem value="cpp" label="C++">

```cpp
engine->stop();
```

  </TabItem>
</Tabs>

#### 9. 语音变换
当引擎成功启动且音色设置完成后，即可开始进行语音变换。

<Tabs>
  <TabItem value="cpp" label="C++">

```cpp
bool isSuccess = engine->transform(data, readSize); // data 为音频缓冲区，readSize 为数据长度
```

  </TabItem>
</Tabs>

**注意：**  
只有当引擎状态为 `VCEngineStatus.STARTED`（即完成第 7 步）且音色设置成功时，语音变换才会生效。

#### 10. 释放引擎
不再需要使用引擎时，应释放相关资源并终止线程。

<Tabs>
  <TabItem value="cpp" label="C++">

```cpp
engine->releaseEngine();
```

  </TabItem>
</Tabs>

### 示例调试说明
为了成功运行并调试示例 Demo，请按照以下步骤操作：

1. **DLL 部署：** 下载 Demo 包后，将 `third` 目录中的 DLL 文件复制到程序运行目录（例如 Visual Studio 的 `x64/Debug` 目录）。
2. **音频文件：** 将所需的 `.wav` 音频文件放置在解决方案文件（`.sln`）所在目录中。

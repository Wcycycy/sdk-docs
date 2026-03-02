---
sidebar_position: 2
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# 快速开始

:::caution

当前 SDK 仅提供 x64 架构版本。

:::

## 集成 SDK
SDK 以 **动态链接库（DLL）** 的形式提供。

将 SDK 集成到你的项目中：

1.  **部署：** 将提供的所有 DLL 文件放置在 **调用目录**（即你的应用程序运行目录）。
2.  **核心库：** 核心 C++ 库通过 `dubbing-sdk-cpp-dll.dll` 暴露。

**使用方式：**

有关函数调用与实现方式的详细说明，请参考 **提供的示例应用程序**。

### 直接语音转换（实时变声）
本节介绍初始化引擎并启用直接语音转换（实时变声）功能所需的步骤。

#### 1. 获取认证 Token（签名字符串）
首先，你必须从服务器获取认证 token（签名字符串）。

<Tabs>
  <TabItem value="cpp" label="C++">

    ```cpp
    std::string token = "access_key=\"xxxxxx\",timestamp=\"xxxxxx\",nonce=\"xxxxxx\",id=\"xxxxxx\",signature=\"xxxxxx\"";
    ```

  </TabItem>
  <TabItem value="csharp" label="C#">

    ```csharp
    string token = "access_key=\"xxxxxx\",timestamp=\"xxxxxx\",nonce=\"xxxxxx\",id=\"xxxxxx\",signature=\"xxxxxx\"";
    ```

  </TabItem>
  <TabItem value="python" label="Python">

    ```python
    token = b"access_key=\"xxxxxx\",timestamp=\"xxxxxx\",nonce=\"xxxxxx\",id=\"xxxxxx\",signature=\"xxxxxx\""
    ```

  </TabItem>
</Tabs>

#### 2. 创建引擎实例
此步骤仅创建实例，并 **不会加载** 变声所需资源。

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

  <TabItem value="csharp" label="C#">

    ```csharp
    engineConfig = new EngineConfig();

    engineConfig.ResourcesPath(folderPath)
                .Token(token)
                .EnableLog()
                .EnableTransformLog()
                .SampleRate(48000)
                .Channel(1)
                .Format(AudioSampleFormat.AUDIO_PCM_S16)
                .MuteOnFail(true)
                .IsSync(true)
                .SetDubbbingCallBack(this);
    dubbingEngine = new DubbingEngine(engineConfig);
    ```

  </TabItem>
  <TabItem value="python" label="Python">

    ```python
    dubbingEngineId = dubbing_sdk_python.dubbing_engine.createDubbingEngineByPool(resPath, token, params.framerate, params.nchannels, dubbing_sdk_python.dubbing_base.AudioSampleFormat.AUDIO_PCM_S16, True, False, True, True, downloadCallback, completeCallback, errorCallback, actionResultCallback)
    ```

  </TabItem>

</Tabs>

#### 3. 准备引擎资源
此操作耗时较长。完成后将 **回调** 到第 1 步注册的回调函数。该步骤会将资源文件下载到应用的私有目录。

<Tabs>
  <TabItem value="cpp" label="C++">

    ```cpp
    engine->prepare();
    ```

  </TabItem>
  <TabItem value="csharp" label="C#">

    ```csharp
    Thread newThread = new Thread(() => {
        dubbingEngine.prepare();
    });
    newThread.Start();
    ```

  </TabItem>
  <TabItem value="python" label="Python">

    ```python
    result = dubbing_sdk_python.dubbing_engine.prepare(dubbingEngineId)
    ```

  </TabItem>
</Tabs>

#### 4. 启动变声工作线程
并在工作线程中初始化引擎。资源准备完成后即可初始化引擎。

#### 4.1 检查资源是否就绪
在第 1 步的 onActionResult 回调中：
<Tabs>
  <TabItem value="cpp" label="C++">

    ```cpp
    bool isSuccess = (actionType == SET_VOICE && retCode == SUCCESS)
    ```

  </TabItem>
  <TabItem value="csharp" label="C#">

    ```csharp
    switch(actionType)
    {
    case DubbingAction.PREPARE:
        {
            this.Invoke(new Action(() =>
            {
                this.lblStatus.Text = "Engine loaded";
            }));
        }
        break;
    case DubbingAction.SET_VOICE:
        {
            this.Invoke(new Action(() =>
            {
                if (retCode == DubbingRetCode.SUCCESS)
                {
                    if (dubbingEngine != null)
                    {
                        dubbingEngine.start();
                    }

                    this.lblStatus.Text = "Voice set successfully";
                }
                else
                {
                    this.lblStatus.Text = "Failed to set voice";
                }
            }));
        }
        break;
    default:
        break;
    }
    ```

  </TabItem>
  <TabItem value="python" label="Python">

    ```python
    if actionType == dubbing_sdk_python.dubbing_base.DubbingAction.SET_VOICE:
        if retCode == dubbing_sdk_python.dubbing_base.DubbingRetCode.SUCCESS:
            global setVoiceSuccess
            setVoiceSuccess = True
            print("setVoiceSuccess = True")
    ```

  </TabItem>
</Tabs>
**注意：** 引擎的 prepare() 为异步操作，需要进行认证并检查必要的变声资源。


#### 5. 获取音色列表
引擎准备成功后即可查询音色列表。

<Tabs>
  <TabItem value="cpp" label="C++">

    ```cpp
    std::string voices = engine->getVoiceList();
    printf(voices.c_str());
    ```

  </TabItem>
  <TabItem value="csharp" label="C#">

    ```csharp
    var list = dubbingEngine.getDubbingVoiceList();
    ```

  </TabItem>
  <TabItem value="python" label="Python">

    ```python
    voices = dubbing_sdk_python.dubbing_engine.getVoiceList(dubbingEngineId)
    print(voices)
    ```

  </TabItem>

</Tabs>

#### 6. 设置音色

从第 5 步获取的列表中选择一个音色并设置。该操作为异步执行，结果会 **回调** 到 onActionResult。

<Tabs>
  <TabItem value="cpp" label="C++">

    ```cpp
    client->setVoice(192); // 192 is an example voice ID
    
    void MyDubbbingCallBack::onActionResult(DubbingAction actionType, DubbingRetCode retCode, const std::string& msg)
    {
        cout << "action result" << endl;
        if (actionType == PREPARE)
        {
            if (retCode == SUCCESS)
            {
                if (m_engine)
                {
                    m_engine->start();
                }
            }
        }
    }
    ```
  
  </TabItem>
  <TabItem value="csharp" label="C#">

    ```csharp
    // Set voice
    DubbingVoice dubbingVoice = new DubbingVoice(Convert.ToInt3(frmVoice.comboBox1. SelectedValue), frmVoice.comboBox1SelectedText);
    speakId = dubbingVoice.id;
    dubbingEngine.setVoice(dubbingVoice.id);

    public void onActionResult(long dubbingEngineId, DubbingAction actionType, DubbingRetCode retCode, string msg)
    {
        switch(actionType)
        {
            case DubbingAction.AUTH:
                break;
            case DubbingAction.PRO_CALIBRATION:
                break;
            case DubbingAction.CHECK_RESOURCES:
                break;
            case DubbingAction.PREPARE:
                {
                    this.Invoke(new Action(() =>
                    {
                        this.lblStatus.Text = "Engine loaded";
                    }));
                }
                break;
            case DubbingAction.SET_VOICE:
                {
                    this.Invoke(new Action(() =>
                    {
                        if (retCode == DubbingRetCode.SUCCESS)
                        {
                            if (dubbingEngine != null)
                            {
                                dubbingEngine.start();
                            }

                            this.lblStatus.Text = "Voice set successfully";
                        }
                        else
                        {
                            this.lblStatus.Text = "Failed to set voice";
                        }
                    }));
                }
                break;
            default:
                break;
        }
    }
    ```

  </TabItem>
  <TabItem value="python" label="Python">

    ```python
    # Set voice.
    print("set voice begin.")
    result = dubbing_sdk_python.dubbing_engine.setVoice(dubbingEngineId, voiceId)

    @dubbing_sdk_python.dubbing_engine.thread_safe_callback(ctypes.CFUNCTYPE(None, ctypes.c_int64, ctypes.c_int, ctypes.c_int, ctypes.c_char_p))
    def actionResultCallback(dubbingEngineId, actionType, retCode, msg):
      print("dubbing engine id:", dubbingEngineId, "  action type:", actionType, "  ret code:", retCode, "  msg:", msg)
      if actionType == dubbing_sdk_python.dubbing_base.DubbingAction.SET_VOICE:
          if retCode == dubbing_sdk_python.dubbing_base.DubbingRetCode.SUCCESS:
              global setVoiceSuccess
              setVoiceSuccess = True
              print("setVoiceSuccess = True")
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
  <TabItem value="csharp" label="C#">

    ```csharp
    dubbingEngine.start();
    ```

  </TabItem>
  <TabItem value="python" label="Python">

    ```python
    dubbing_sdk_python.dubbing_engine.start(dubbingEngineId)
    ```

  </TabItem>
</Tabs>

#### 8. 停止变声
此步骤会清理工作线程中的数据，并使内部 Looper 进入休眠状态。
<Tabs>
  <TabItem value="cpp" label="C++">

    ```cpp
    engine->stop();
    ```

  </TabItem>
  <TabItem value="csharp" label="C#">

    ```csharp
    dubbingEngine.stop();
    ```

  </TabItem>
  <TabItem value="python" label="Python">

    ```python
    dubbing_sdk_python.dubbing_engine.stop(dubbingEngineId)
    ```

  </TabItem>
</Tabs>

#### 9. 语音转换

当引擎成功初始化并成功设置音色后，即可开始语音转换。

<Tabs>
  <TabItem value="cpp" label="C++">

    ```cpp
    bool isSuccess = engine->transform(data, readSize); // 'data' is the audio buffer, 'len' is the data length
    ```

  </TabItem>
  <TabItem value="csharp" label="C#">

    ```csharp
    byte[] bytes = new byte[segWriteSize];
    byte[] outVoice = dubbingEngine.transform(bytes);
    ```

  </TabItem>
  <TabItem value="python" label="Python">

    ```python
    chunk = audio_data[i:i+chunk_size]
    byte_arr = (ctypes.c_byte * len(chunk))(*chunk)
    dubbing_sdk_python.dubbing_engine.transform(dubbingEngineId, byte_arr,len(byte_arr))
    # Get the processing result.
    byte_arr = ctypes.cast(byte_arr, ctypes.POINTER(ctypes.c_byte * le(byte_arr))).contents
    ```

  </TabItem>
</Tabs>

**注意：** 只有当引擎状态为 VCEngineStatus.STARTED（执行第 7 步后）且音色设置成功时，语音转换才会成功。

#### 9. 释放引擎

<Tabs>
  <TabItem value="cpp" label="C++">

    ```cpp
    engine->engineRelease()
    ```

  </TabItem>
  <TabItem value="csharp" label="C#">

    ```csharp
    dubbingEngine.engineRelease();
    ```

  </TabItem>
  <TabItem value="python" label="Python">

    ```python
    dubbing_sdk_python.dubbing_engine.engineRelease(dubbingEngineId)
    ```

  </TabItem>
</Tabs>

### 调试示例设置
要成功运行并调试提供的示例：

1.  **DLL 部署：** 下载示例包后，将 `third` 文件夹中的必要 **DLL 文件** 复制到你的 **运行目录**（例如 Visual Studio 常见的 `x64/Debug` 目录）。
2.  **音频文件放置：** 将所需的 **`.wav` 音频文件** 放到解决方案文件（`.sln`）所在目录。


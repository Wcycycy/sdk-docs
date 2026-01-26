---
sidebar_position: 2
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Quick Start

:::caution

The SDK is currently provided for x64 architecture.

:::

## Integrate SDK
The SDK is provided in the form of **Dynamic Link Libraries (DLLs)**.

To integrate the SDK into your project:

1.  **Deployment:** Place all provided DLL files in the **calling directory** (the directory from which your application runs).
2.  **Core Library:** The core C++ library is exposed via `dubbing-sdk-cpp-dll.dll`.

**Usage:**

For detailed instructions on function calls and implementation patterns, please refer to the **provided demo application**.

### Direct Voice Transformation (Real-time Voice Change)
This section outlines the steps required to initialize the engine and enable direct voice transformation functionality.

#### 1. Obtain Authentication Token (Sign String)
First, you must acquire an authentication token (sign string) from your server.

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

#### 2. Create the Engine Instance. 
This step only creates the instance and does **not** load the necessary voice changer resources.

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

#### 3. Prepare the engine resources. 
This operation is time-consuming. Once completed, it will **call back** to the callback registered in step 1. This step downloads the resource files to the App's private directory.

<Tabs>
  <TabItem value="cpp" label="C++">

    ```cpp
    engine->prepare();
    ```

  </TabItem>
</Tabs>

#### 4. Start the voice changer worker thread
and initialize the engine within the worker thread. The engine can be initialized after the resources are prepared.

#### 4.1. Check if resources are ready
in the onActionResult callback from the first step:
<Tabs>
  <TabItem value="cpp" label="C++">

    ```cpp
    bool isSuccess = (actionType == SET_VOICE && retCode == SUCCESS)
    ```

  </TabItem>
</Tabs>
**Note:** The engine's prepare() is asynchronous, requiring authentication and checking for necessary voice changer resources.


#### 5. Get the voice list
The voice list can be queried after the engine is successfully prepared.

<Tabs>
  <TabItem value="cpp" label="C++">

    ```cpp
    std::string voices = engine->getVoiceList();
    printf(voices.c_str());
    ```

  </TabItem>

</Tabs>

#### 6. Set the voice

Select a voice from the list obtained in step 5 and set it. This is an asynchronous operation, and the result will **call back** to onActionResult.

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
</Tabs>


#### 7. Start the voice changer
<Tabs>
  <TabItem value="cpp" label="C++">

    ```cpp
    engine->start();
    ```

  </TabItem>
</Tabs>

#### 8. Stop the voice changer.
 This step clears the data within the worker thread, and the internal Looper will enter hibernation.
<Tabs>
  <TabItem value="cpp" label="C++">

    ```cpp
    engine->stop();
    ```

  </TabItem>
</Tabs>

#### 9. Voice Transformation

After the engine is successfully initialized and the voice is successfully set, you can start voice transformation..

<Tabs>
  <TabItem value="cpp" label="C++">

    ```cpp
    bool isSuccess = engine->transform(data, readSize); // 'data' is the audio buffer, 'len' is the data length
    ```

  </TabItem>
</Tabs>

**Note:** Voice transformation will only succeed if the engine status is VCEngineStatus.STARTED (after the operation in step 7) and the voice is successfully set.

#### 9. Release the engine

<Tabs>
  <TabItem value="cpp" label="C++">

    ```cpp
    engine->releaseEngine()
    ```

  </TabItem>
</Tabs>

### Debug Example Setup
To successfully run and debug the provided demo:

1.  **DLL Deployment:** After downloading the demo package, copy the necessary **DLL files** from the `third` folder into your **running directory** (e.g., `x64/Debug` folder for a typical Visual Studio setup).
2.  **Audio File Placement:** Place the required **`.wav` audio files** into the directory where the Solution file (`.sln`) is located.


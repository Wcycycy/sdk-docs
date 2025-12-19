---
sidebar_position: 2
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Quick Start

:::caution

The SDK is currently provided for x64 architecture. For 32-bit support, please reach out to our team.

:::

## Integrate SDK
The SDK is provided in the form of **Dynamic Link Libraries (DLLs)**.

To integrate the SDK into your project:

1.  **Deployment:** Place all provided DLL files in the **calling directory** (the directory from which your application runs).
2.  **Core Library:** The core C++ library is exposed via `dubbing-sdk-cpp-dll.dll`.
3.  **Python Interface:** Import the accompanying Python module, `dubbing_sdk_python.py`. This file contains the necessary function definitions and interfaces to access the functions within `dubbing-sdk-cpp-dll.dll`.

**Usage:**

For detailed instructions on function calls and implementation patterns, please refer to the **provided demo application**.

### Direct Voice Transformation (Real-time Voice Change)
This section outlines the steps required to initialize the engine and enable direct voice transformation functionality.

#### 1. Obtain Authentication Token (Sign String)
First, you must acquire an authentication token (sign string) from your server.

<Tabs>
  <TabItem value="cpp" label="C++">

    ```cpp
    std::string signStrs = "access_key=\"xxxxxx\",timestamp=\"xxxxxx\",nonce=\"xxxxxx\",id=\"xxxxxx\",signature=\"xxxxxx\"";
    ```

  </TabItem>
  <TabItem value="csharp" label="C#">

    ```csharp
    g_akId = "access_key=\"xxxxxx\",timestamp=\"xxxxxx\",nonce=\"xxxxxx\",id=\"xxxxxx\",signature=\"xxxxxx\"";
    ```

  </TabItem>
</Tabs>

#### 2. Initialize Engine Data Resources
Engine initialization is a crucial step that includes authentication, resource downloading, and resource loading. Due to these processes, this step can be time-consuming. **It is highly recommended to execute this process in a new thread.**

The parameters `downloadCallback`, `completeCallback`, and `errorCallback` are callback functions used to monitor the download process.

> **Note on License Mode:** If `config._netwodrkReqKey` is set to empty (`NULL` or `""`), the SDK will use the **Local License Mode** for verification. In this mode, the License, model, and voice files **must be placed** in the directory specified by `config._resourcesPath` beforehand. If `config._resourcesPath` is not set, the current working directory will be used.

<Tabs>
  <TabItem value="cpp" label="C++">

    ```cpp
    EngineConfig config;
    config._netwodrkReqKey = signStrs.c_str();
    config._iDownload = down; // Assume 'down' is your download interface implementation
    int loginOK = client->initEngineData(config);
    ```

  </TabItem>
  <TabItem value="csharp" label="C#">

    ```csharp
    vCEngine = new VCEngine.Builder()
    .engineLog()
    .transformLog()
    .engineToken(g_akId)
    .engineInputSampleRate(48000)
    .engineOutputSampleRate(48000)
    .engineCallback(this)
    .build();
    ```

  </TabItem>
</Tabs>

#### 3. Retrieve Voice List
After the engine has been successfully initialized and prepared, you can query for the available voice presets list.

<Tabs>
  <TabItem value="cpp" label="C++">

    ```cpp
    // Get voice list
    std::string voices = client->getVoiceList();
    printf(voices.c_str());
    ```

  </TabItem>
  <TabItem value="csharp" label="C#">

    ```csharp
    var list = vCEngine.getVoiceList();
    ```

  </TabItem>
</Tabs>

#### 4. Set Voice Preset

Use the returned ID from the voice list to set the desired voice transformation preset.

<Tabs>
  <TabItem value="cpp" label="C++">

    ```cpp
    int speakerOk = client->setVoice(193); // 193 is an example voice ID
    ```

  </TabItem>
  <TabItem value="csharp" label="C#">

    ```csharp
    VCVoice vCVoice = new VCVoice(Convert.ToInt32(frmVoice.comboBox1.SelectedValue), frmVoice.comboBox1.SelectedText, "", "", frmVoice.comboBox1.SelectedIndex);
    speakId = vCVoice.id;
    vCEngine.setPass(true);
    vCEngine.setVoice(vCVoice.id);
    ```

  </TabItem>
</Tabs>

#### 5. Start Voice Transformation

This step executes the voice transformation on the raw audio data you actively push to the SDK.

<Tabs>
  <TabItem value="cpp" label="C++">

    ```cpp
    nret = client->transform(data, len); // 'data' is the audio buffer, 'len' is the data length
    ```

  </TabItem>
  <TabItem value="csharp" label="C#">

    ```csharp
    byte[] bytes = new byte[segWriteSize];
    byte[] outVoice = vCEngine.transform(bytes);
    ```

  </TabItem>
</Tabs>

#### 6. Enable Voice Transformation for Self-Collection

Call this function to enable the voice transformation for the audio captured by the engine's internal self-collection mechanism (if applicable).

<Tabs>
  <TabItem value="cpp" label="C++">

    ```cpp
    client->setPass(true);
    ```

  </TabItem>
  <TabItem value="csharp" label="C#">

    ```csharp
    vCEngine.setPass(true);
    ```

  </TabItem>
</Tabs>

### Using Dubbing Audio Device Management and Collection
#### 1. Obtain Authentication Token (Sign String)

First, you must acquire an authentication token (sign string) from your server.

<Tabs>
  <TabItem value="cpp" label="C++">

    ```cpp
    std::string signStrs = "access_key=\"xxxxxx\",timestamp=\"xxxxxx\",nonce=\"xxxxxx\",id=\"xxxxxx\",signature=\"xxxxxx\"";
    ```

  </TabItem>
  <TabItem value="csharp" label="C#">

    ```csharp
    g_akId = "access_key=\"xxxxxx\",timestamp=\"xxxxxx\",nonce=\"xxxxxx\",id=\"xxxxxx\",signature=\"xxxxxx\"";
    ```

  </TabItem>
</Tabs>

#### 2. Initialize Engine Data Resources

Engine initialization is a crucial step that includes authentication, resource downloading, and resource loading. Due to these processes, this step can be time-consuming. **It is highly recommended to execute this process in a new thread.**

<Tabs>
  <TabItem value="cpp" label="C++">

    ```cpp
    EngineConfig config;
    config._netwodrkReqKey = signStrs.c_str();
    config._iDownload = down; // Assume 'down' is your download interface implementation
    int nRet = client->initEngineData(config);
    ```

  </TabItem>
  <TabItem value="csharp" label="C#">

    ```csharp
    vCEngine = new VCEngine.Builder()
      .engineResourcesPath(folderPath)
      .engineLog()
      .transformLog()
      .engineToken(g_akId)
      .engineInputSampleRate(48000)
      .engineOutputSampleRate(48000)
      .engineCallback(this)
      .build();
    ```

  </TabItem>
</Tabs>

#### 3. Read Device Information and Get Device Indices

After successful authentication, read the device information to obtain the indices of the devices required for startup, including the virtual audio device.

```cpp
int captureDevId = 0;
int renderDevId = 0;
int virtualCaptureDevId = 1;
int virtualRenderDevId = 1;
wchar_t captureDevName[100][1024];
IDubbingDeviceManager* deviceMgr = client->getDubbingDeviceManager();

if (deviceMgr == nullptr)
{
    return -1;
}

// Get Capture Devices (Microphones)
int captureDevCount = deviceMgr->getAudioDevList(captureDevName, true);
wchar_t myDevName[1024] = L"Dubbing Virtual Device";

for (int i = 0; i < captureDevCount; i++)
{
    if (StrStrW(captureDevName[i], myDevName) != NULL)
    {
        virtualCaptureDevId = i;
        if (virtualCaptureDevId == captureDevId)
        {
            captureDevId++;
        }
        break;
    }
}

// Get Render Devices (Speakers)
wchar_t renderDevName[100][1024];
int renderDevCount = deviceMgr->getAudioDevList(renderDevName, false);

for (int i = 0; i < renderDevCount; i++)
{
    if (StrStrW(renderDevName[i], myDevName) != NULL)
    {
        virtualRenderDevId = i;
        if (virtualRenderDevId == renderDevId)
        {
            renderDevId++;
        }
        break;
    }
}
```



#### 4. Start Devices

Start the devices to begin microphone data collection, perform voice transformation, and send the transformed data to the physical speaker and the virtual speaker for playback.

<Tabs>
  <TabItem value="cpp" label="C++">

    ```cpp
    nRet = deviceMgr->startDevice(captureDevId, renderDevId, virtualCaptureDevId, virtualRenderDevId);
    if (nRet != 0)
    {
        std::cout << "start dubbing device failed." << std::endl;
        return -1;
    }
    ```

  </TabItem>
  <TabItem value="csharp" label="C#">

    ```csharp
    int nRet = vcDeviceEngine.startDevice();
    ```

  </TabItem>
</Tabs>


#### 5. Get Audio Device Name Lists

Retrieve the list of audio device names, including the microphone (capture) device list and the speaker (render) device list.

<Tabs>
  <TabItem value="cpp" label="C++">

    ```cpp
    std::cout << "Get Audio Device List:" << std::endl;

    // Get Capture Device List
    wchar_t captureDevName[100][1024];
    int captureDevCount = deviceMgr->getAudioDevList(captureDevName, true);
    for (int i = 0; i < captureDevCount; i++)
    {
        std::string name = WcharToChar(captureDevName[i]);
        std::cout << name << std::endl;
    }

    // Get Render Device List
    wchar_t renderDevName[100][1024];
    int renderDevCount = deviceMgr->getAudioDevList(renderDevName, false);
    for (int i = 0; i < renderDevCount; i++)
    {
        std::string name = WcharToChar(renderDevName[i]);
        std::cout << name << std::endl;
    }
    ```

  </TabItem>
  <TabItem value="csharp" label="C#">

    ```csharp
    // Get the list of microphone (input) devices
    string micMessage = "Microphone Device List:\n" + vcDeviceEngine.getAudioDevList(true);
    MessageBox.Show(micMessage);

    // Get the list of speaker (output) devices
    string speakerMessage = "Speaker Device List:\n" + vcDeviceEngine.getAudioDevList(false);
    MessageBox.Show(speakerMessage);
    ```

  </TabItem>
</Tabs>

#### 6. Start Dumping Audio Data

Start dumping audio data from the microphone, after voice transformation, and from the speaker. This is used for analyzing audio issues. The generated PCM files are single-channel, 32-bit, and have a 48000 Hz sample rate.

> **Note:** The recorded files will be saved in the `./dumpPcm` folder.

<Tabs>
  <TabItem value="cpp" label="C++">

    ```cpp
    deviceMgr->startDumpRecord("./dumpPcm");
    ```

  </TabItem>
  <TabItem value="csharp" label="C#">

    ```csharp
    vcDeviceEngine.startDumpRecord(AppDomain.CurrentDomain.BaseDirectory + Path.DirectorySeparatorChar + "dumpPcm");
    ```

  </TabItem>
</Tabs>

#### 7. Stop Dumping Audio Data

Stop dumping the audio data from the microphone, processed audio, and speaker.

<Tabs>
  <TabItem value="cpp" label="C++">

    ```cpp
    deviceMgr->stopDumpRecord();
    ```

  </TabItem>
  <TabItem value="csharp" label="C#">

    ```csharp
    vcDeviceEngine.stopDumpRecord();
    ```

  </TabItem>
</Tabs>

#### 8. Set Microphone Volume

Set the volume level for the audio capture device (microphone). The value should be a floating-point number between 0.0 and 1.0.

<Tabs>
  <TabItem value="cpp" label="C++">

    ```cpp
    float value = 0.5;
    std::cout << "Please enter decimals from 0 to 1:";
    std::cin >> value;
    deviceMgr->setAudioCaptureVolume(value);
    ```

  </TabItem>
  <TabItem value="csharp" label="C#">

    ```csharp
    float value = (float)this.numericCaptureVolume.Value;
    float fValue = value / 100.0f;
    vcDeviceEngine.setAudioCaptureVolume(fValue);
    ```

  </TabItem>
</Tabs>

#### 9. Set Speaker Volume

Set the volume level for the audio render device (speaker). The value should be a floating-point number between 0.0 and 1.0.

<Tabs>
  <TabItem value="cpp" label="C++">

    ```cpp
    float value = 0.5;
    std::cout << "Please enter decimals from 0 to 1:";
    std::cin >> value;
    deviceMgr->setAudioRenderVolume(renderDevId, value);
    ```

  </TabItem>
  <TabItem value="csharp" label="C#">

    ```csharp
    float value = (float)this.numericRenderVolume.Value;
    float fValue = value / 100.0f;
    vcDeviceEngine.setAudioRenderVolume(_renderDevId, fValue);
    ```

  </TabItem>
</Tabs>

#### 10. Get Microphone Volume

Retrieve the current volume level of the audio capture device (microphone). The returned value will be a floating-point number between 0.0 and 1.0.

<Tabs>
  <TabItem value="cpp" label="C++">

    ```cpp
    float value;
    deviceMgr->getAudioCaptureVolume(value);
    std::cout << "getAudioCaptureVolume: " << value << std::endl;
    ```

  </TabItem>
  <TabItem value="csharp" label="C#">

    ```csharp
    float fValue = 0.0f;
    fValue = vcDeviceEngine.getAudioCaptureVolume();
    int value = (int)Math.Round(fValue*100, 2);
    this.numericCaptureVolume.Value = value;
    ```

  </TabItem>
</Tabs>

#### 11. Get Speaker Volume

Retrieve the current volume level of the audio render device (speaker). The returned value will be a floating-point number between 0.0 and 1.0.

<Tabs>
  <TabItem value="cpp" label="C++">

    ```cpp
    float value;
    deviceMgr->getAudioRenderVolume(renderDevId, value);
    std::cout << "getAudioRenderVolume: " << value << std::endl;
    ```

  </TabItem>
  <TabItem value="csharp" label="C#">

    ```csharp
    float fValue = 0.0f;
    fValue = vcDeviceEngine.getAudioRenderVolume();
    int value = (int)Math.Round(fValue*100, 2);
    this.numericRenderVolume.Value = value;
    ```

  </TabItem>
</Tabs>

#### 12. Get Microphone Peak Level

Retrieve the current peak audio level from the microphone (capture device).

<Tabs>
  <TabItem value="cpp" label="C++">

    ```cpp
    float value;
    deviceMgr->getAudioCapturePeak(value);
    std::cout << "getAudioCapturePeak: " << value << std::endl;
    ```

  </TabItem>
  <TabItem value="csharp" label="C#">

    ```csharp
    float fValue = 0.0f;
    fValue = vcDeviceEngine.getAudioCapturePeak();
    int value = (int)(fValue*10000);
    this.numericCaptureVolume.Value = value;
    ```

  </TabItem>
</Tabs>

#### 13. Get Speaker Peak Level

Retrieve the current peak audio level from the speaker (render device).

<Tabs>
  <TabItem value="cpp" label="C++">

    ```cpp
    float value;
    deviceMgr->getAudioRenderPeak(renderDevId, value);
    std::cout << "getAudioRenderPeak: " << value << std::endl;
    ```

  </TabItem>
  <TabItem value="csharp" label="C#">

    ```csharp
    float fValue = 0.0f;
    fValue = vcDeviceEngine.getAudioRenderPeak();
    int value = (int)(fValue*10000);
    this.numericRenderVolume.Value = value;
    ```

  </TabItem>
</Tabs>

#### 14. Set Microphone Volume Level (Gain)

Set the volume amplification level (gain) for the microphone. The value should be a floating-point number between 0.0 and 2.0.

<Tabs>
  <TabItem value="cpp" label="C++">

    ```cpp
    float value = 0.5;
    std::cout << "Please enter decimals from 0 to 2:";
    std::cin >> value;
    deviceMgr->setAudioCaptureVolumeLevel(value);
    ```

  </TabItem>
  <TabItem value="csharp" label="C#">

    ```csharp
    float value = (float)this.numericCaptureVolume.Value;
    float fValue = value / 100.0f;
    vcDeviceEngine.setAudioCaptureVolumeLevel(fValue);
    ```

  </TabItem>
</Tabs>

#### 15. Set Speaker Volume Level (Gain)

Set the volume amplification level (gain) for the speaker (render device). The value should be a floating-point number between 0.0 and 2.0.

<Tabs>
  <TabItem value="cpp" label="C++">

    ```cpp
    float value = 0.5;
    std::cout << "Please enter decimals from 0 to 2:";
    std::cin >> value;
    deviceMgr->setAudioRenderVolumeLevel(value);
    ```

  </TabItem>
  <TabItem value="csharp" label="C#">

    ```csharp
    float value = (float)this.numericRenderVolume.Value;
    float fValue = value / 100.0f;
    vcDeviceEngine.setAudioRenderVolumeLevel(fValue);
    ```

  </TabItem>
</Tabs>

#### 16. Get Virtual Sound Card Microphone Volume

Retrieve the current volume level of the virtual sound card's microphone output.

<Tabs>
  <TabItem value="cpp" label="C++">

    ```cpp
    float value = 0.5;
    deviceMgr->getAudioVirtualCaptureVolume(value);
    std::cout << "getAudioVirtualCaptureVolume: " << value << std::endl;
    ```

  </TabItem>
  <TabItem value="csharp" label="C#">

    ```csharp
    float fValue = 0.0f;
    fValue = vcDeviceEngine.getAudioVirtualCaptureVolume();
    int value = (int)Math.Round(fValue*100, 2);
    this.numericCaptureVolume.Value = value;
    ```

  </TabItem>
</Tabs>

#### 17. Set Microphone Mute

Toggle the mute state for the microphone (capture device).

<Tabs>
  <TabItem value="cpp" label="C++">

    ```cpp
    static bool captureMute = false;
    captureMute = !captureMute;
    deviceMgr->setCaptureMute(captureMute);
    ```

  </TabItem>
  <TabItem value="csharp" label="C#">

    ```csharp
    vcDeviceEngine.setCaptureMute(this.checkBoxSetCaptureMute.Checked);
    ```

  </TabItem>
</Tabs>

#### 18. Set Speaker Mute

Toggle the mute state for the speaker (render device).

<Tabs>
  <TabItem value="cpp" label="C++">

    ```cpp
    static bool renderMute = false;
    renderMute = !renderMute;
    deviceMgr->setRenderMute(renderDevId, renderMute);
    ```

  </TabItem>
  <TabItem value="csharp" label="C#">

    ```csharp
    vcDeviceEngine.setRenderMute(this.checkBoxSetRenderMute.Checked);
    ```

  </TabItem>
</Tabs>

#### 19. Start Recording Microphone Audio

Start recording the raw audio from the microphone to a file. The output file is a PCM file.

<Tabs>
  <TabItem value="cpp" label="C++">

    ```cpp
    std::string recordPcm = "./dumpPcm/recordPcm.pcm";
    deviceMgr->startCaptureRecord(recordPcm.c_str());
    ```

  </TabItem>
  <TabItem value="csharp" label="C#">

    ```csharp
    vcDeviceEngine.startCaptureRecord(AppDomain.CurrentDomain.BaseDirectory + Path.DirectorySeparatorChar + "dumpPcm/recordPcm.pcm");
    ```

  </TabItem>
</Tabs>

#### 20. Stop Recording Microphone Audio

Stop recording the microphone audio.

<Tabs>
  <TabItem value="cpp" label="C++">

    ```cpp
    deviceMgr->stopCaptureRecord();
    ```

  </TabItem>
  <TabItem value="csharp" label="C#">

    ```csharp
    vcDeviceEngine.stopCaptureRecord();
    ```

  </TabItem>
</Tabs>

#### 21. Start Playing Recorded File

Start playing back the recorded audio file through the speaker.

<Tabs>
  <TabItem value="cpp" label="C++">

    ```cpp
    std::string recordPcm = "./dumpPcm/recordPcm.pcm";
    deviceMgr->startPlayRecordFile(recordPcm.c_str());
    ```

  </TabItem>
  <TabItem value="csharp" label="C#">

    ```csharp
    Thread newThread = new Thread(() => vcDeviceEngine.startPlayRecordFile(AppDomain.CurrentDomain.BaseDirectory + Path.DirectorySeparatorChar + "dumpPcm/recordPcm.pcm"));
    // Start the thread
    newThread.Start();
    ```

  </TabItem>
</Tabs>

#### 22. Stop Playing Recorded File

Stop playing the recorded audio file.

<Tabs>
  <TabItem value="cpp" label="C++">

    ```cpp
    deviceMgr->stopPlayRecordFile();
    ```

  </TabItem>
  <TabItem value="csharp" label="C#">

    ```csharp
    vcDeviceEngine.stopPlayRecordFile();
    ```

  </TabItem>
</Tabs>

#### 23. Flush Device Cache

Clear the cached data for both the speaker and microphone.

<Tabs>
  <TabItem value="cpp" label="C++">

    ```cpp
    deviceMgr->flush();
    ```

  </TabItem>
  <TabItem value="csharp" label="C#">

    ```csharp
    vcDeviceEngine.flush();
    ```

  </TabItem>
</Tabs>

#### 24. Prevent Virtual Speaker from Being Default

Set the Dubbing Virtual Sound Card Speaker **not** to be the system's default rendering device.

<Tabs>
  <TabItem value="cpp" label="C++">

    ```cpp
    deviceMgr->setDubbingNoDefaultRenderDev();
    ```

  </TabItem>
  <TabItem value="csharp" label="C#">

    ```csharp
    vcDeviceEngine.setDubbingNoDefaultRenderDev();
    ```

  </TabItem>
</Tabs>

#### 25. Get Previous Default Microphone Device Name

Retrieve the name of the microphone device that was the system's default *before* the current setting (e.g., before the virtual device was potentially set as default).

<Tabs>
  <TabItem value="cpp" label="C++">

    ```cpp
    wchar_t devName[1024];
    memset(devName, 0, sizeof(devName));
    deviceMgr->getPreDefaultCaptureDevName(devName);
    std::string name = WcharToChar(devName);
    std::cout << "getPreDefaultCaptureDevName: " << name << std::endl;
    ```

  </TabItem>
  <TabItem value="csharp" label="C#">

    ```csharp
    string strMessage = "Previous Default Microphone Name: " + vcDeviceEngine.getPreDefaultCaptureDevName();
    MessageBox.Show(strMessage);
    ```

  </TabItem>
</Tabs>

#### 26. Get Current Default Render Device Name (Speaker)

Retrieve the name of the current default **render device (speaker)**.

<Tabs>
  <TabItem value="cpp" label="C++">

    ```cpp
    wchar_t devName[1024];
    int nsize = sizeof(devName);
    memset(devName, 0, nsize);
    deviceMgr->getDefaultRenderDevName(devName);
    std::string name = WcharToChar(devName);
    std::cout << "getDefaultRenderDevName: " << name << std::endl;
    ```

  </TabItem>
  <TabItem value="csharp" label="C#">

    ```csharp
    string strMessage = "Default Speaker Name: " + vcDeviceEngine.getDefaultRenderDevName();
    MessageBox.Show(strMessage);
    ```

  </TabItem>
</Tabs>

### Resource Download Callbacks
The `initEngineData` function initiates the download of voice model files upon its first execution. The progress and status of this download are reported via callback functions.

To handle these events, you must implement the `IDubbingDownload` interface's callback methods.

<Tabs>
  <TabItem value="cpp" label="C++">

    ```cpp
    // Define our callback functions
    void MyDownload::OnDownload(int percent, int index, int count) {
        // percent: Download progress percentage for the current file (0-100)
        // index: The index of the file currently being downloaded (starting from 0)
        // count: The total number of files to download
        cout << percent << index << count << endl;
    }

    void MyDownload::OnComplete() {
        // Called when all resource files have been successfully downloaded.
        cout << "end" << endl;
    }

    void MyDownload::OnError() {
        // Called if an error occurs during the download process.
        cout << "error" << endl;
    }
    ```

  </TabItem>
  <TabItem value="csharp" label="C#">

    ```csharp
    // Download progress callback
    public void onDownload(int percent, int index, int count)
    {
        this.Invoke(new Action(() =>
        {
            SetMessage(percent, index, count);
        }));
    }

    public void onComplete()
    {
        this.Invoke(new Action(() =>
        {
            this.lblProcess.Visible = true;
            this.lblProcess.Text = "Resource download complete";
            this.progressBar1.Value = 100;
        }));
    }

    public void onError()
    {
        this.Invoke(new Action(() =>
        {
            this.lblStatus.Text = "An error occurred during resource download";
        }));
    }
    ```

  </TabItem>
</Tabs>

### Debug Example Setup
To successfully run and debug the provided demo:

1.  **DLL Deployment:** After downloading the demo package, copy the necessary **DLL files** from the `third` folder into your **running directory** (e.g., `x64/Debug` folder for a typical Visual Studio setup).
2.  **Audio File Placement:** Place the required **`.wav` audio files** into the directory where the Solution file (`.sln`) is located.


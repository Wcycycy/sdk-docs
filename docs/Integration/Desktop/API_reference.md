---
draft: false
sidebar_position: 3
---

# API Reference

### 1. initEngineData
Initializes the resources, authentication, and data required by the engine. The first execution will download the voice model files, which may take some time.

#### EngineConfig Parameters:
* **`config._resourcesPath = nullptr;`** Sets the resource path. If set to `nullptr`, it defaults to the current directory.
* **`config._insamplerate = 48000;`** The sample rate of the input audio.
* **`config._osamplerate = 48000;`** The sample rate of the output audio.
* **`config._isOpenLog = false;`** Determines whether to enable logging.
* **`config._networkReqKey = signStrs.c_str();`** The authorization key for network requests. If left empty, the engine will use **Local License Mode** for verification. In this case, the License, model, and voice files must be placed in the `config._resourcesPath` directory in advance.
* **`config._iDownload = down;`** Configuration for the download instance/callback.

#### Return Value:
* Returns an **Integer**.
* **10000**: Success.
* **Other values**: Error codes.

### 2. setVoice
Sets or switches the voice identity.

#### Parameters:
* **`voiceId`**: The unique identifier (ID) of the target voice.

#### Return Value:
* Returns an **Integer**.
* **10000**: Success.
* **Other values**: Error codes.

### 3. setPass
Enables or disables the voice changing effect for self-collected audio.

#### Parameters:
* **`isPass`**: Determines whether to enable voice changing.

### 4. transform
Performs the voice transformation.

**Parameters:**
* `data_in`: A pointer to the input audio data. The transformed audio data is returned through this same pointer.
* `nlen`: The length of the input audio data.

**Return Value:**
* Returns an **Integer**.
* **10000**: Success.
* **Other values**: Error codes.

### 5. getVoiceList
Retrieves the list of available voices.

**Return Value:**
* Returns a **String** type.
* The result is a **JSON-formatted string**.

### 6. getAudioDevList
Retrieves the list of audio device names.

**Parameters:**
* `isCapture`: Determines whether to retrieve microphone (capture) devices.

**Return Value:**
* Returns a **String** type.
* The result is a **JSON-formatted string**.

### 7. startDevice
Starts and initializes the specified audio devices.

**Parameters:**
* `captureDevId`: The index number of the microphone device.
* `renderDevId`: The index number of the speaker device.
* `virtualCaptureDevId`: The index number of the virtual microphone device.
* `virtualRenderDevId`: The index number of the virtual speaker device.

**Return Value:**
* Returns an **Integer**.
* **0**: Success.
* **Other values**: Failure.

### 8. stopDevice
Stops the currently running audio devices.

**Return Value:**
* Returns an **Integer**.
* **0**: Success.
* **Other values**: Failure.

### 9. setCaptureMute
Sets the microphone to mute or unmute.

**Parameters:**
* `mute`: Determines whether to mute the microphone.

### 10. setRenderMute
Sets the speaker to mute or unmute.

**Parameters:**
* `mute`: Determines whether to mute the speaker.

### 11. flush
Clears the cached audio data from both the microphone and the speaker.

### 12. setAudioCaptureVolume
Sets the microphone volume.

**Parameters:**
* `value`: Volume level, ranging from 0.0 to 1.0 (Decimal/Float).

### 13. setAudioCaptureVolumeLevel
Sets the volume gain (boost) for the microphone.

**Parameters:**
* `value`: Volume gain level, ranging from 0.0 to 2.0 (Decimal/Float).

### 14. getAudioCaptureVolume
Retrieves the current microphone volume level.

**Return Value:**
* Returns a **Decimal (Float/Double)** ranging from 0.0 to 1.0.

### 15. getAudioCapturePeak
Retrieves the peak level of the microphone input.

**Return Value:**
* Returns a **Decimal (Float/Double)** ranging from 0.0 to 1.0.

### 16. setAudioVirtualCaptureVolume
Sets the microphone volume for the Dubbing (大饼) virtual sound card.

**Parameters:**
* `value`: Volume level, ranging from 0.0 to 1.0 (Decimal/Float).

### 17. getAudioVirtualCaptureVolume
Retrieves the microphone volume level of the Dubbing virtual sound card.

**Return Value:**
* Returns a **Decimal (Float/Double)** ranging from 0.0 to 1.0.

### 18. getPreDefaultCaptureDevName
Retrieves the name of the previous default microphone device.

**Return Value:**
* Returns a **String** type.

### 19. getDefaultRenderDevName
Retrieves the name of the default microphone device.

**Return Value:**
* Returns a **String** type.

### 20. setDubbingNoDefaultRenderDev
Sets the Dubbing (大饼) virtual sound card speaker to not be the default playback device.

### 21. setAudioRenderVolume
Sets the volume for a specific speaker device.

**Parameters:**
* `renderDevId`: The index number of the speaker device.
* `value`: Volume level, ranging from 0.0 to 1.0 (Decimal/Float).

### 22. setAudioRenderVolumeLevel
Sets the volume gain (boost) for a specific speaker device.

**Parameters:**
* `renderDevId`: The index number of the speaker device.
* `value`: Volume gain level, ranging from 0.0 to 1.0 (Decimal/Float).

### 23. getAudioRenderVolume
Retrieves the speaker volume level.

**Return Value:**
* Returns a **Decimal (Float/Double)** ranging from 0.0 to 1.0.

### 24. getAudioRenderPeak
Retrieves the peak level of the speaker output.

**Return Value:**
* Returns a **Decimal (Float/Double)** ranging from 0.0 to 1.0.

### 25. startCaptureRecord
Starts recording audio input from the microphone.

**Parameters:**
* `pcmFile`: The path and filename for the recorded PCM audio file.

### 26. stopCaptureRecord
Stops the current microphone recording session.

### 27. startPlayRecordFile
Starts playing back a recorded audio file.

**Parameters:**
* `pcmFile`: The path and filename of the PCM audio file to play.

### 28. stopPlayRecordFile
Stops the playback of the current recording file.

### 29. setPlayingRecord
Sets the current recording playback status.

**Parameters:**
* `isPlaying`: Boolean/Flag indicating if the audio is currently playing.

### 30. startDumpRecord
Starts recording the microphone, speaker, and voice-changed audio streams simultaneously (Dump mode).

**Parameters:**
* `pcmDir`: The directory path where the dump files will be saved.

### 31. stopDumpRecord
Stops the multi-stream recording (microphone, speaker, and voice-changed audio).

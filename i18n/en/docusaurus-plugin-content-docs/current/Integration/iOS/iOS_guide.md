# Quick Start

## Environment Setup

Follow the steps below to configure the environment for using the SDK:

Minimum Deployment Target for iOS: 12.0

## Integrating the SDK

Prerequisites

Before integrating the SDK, make sure that:

- The framework DubbingRtvcSDK.framework has been added to your project.

-  The project includes the required dependency Accelerate.framework.

<img src="/img/iOSFramework.png" alt="iOS Framework" width="800" />

## 1. Get Voice Resources

This section describes how to request voice resources over the network and how to retrieve a list of existing local voice resources.

```swift
// Request network voice timbre resources
DBRtvcManager.shared.getSourceList { speakerInfoList in

} failure: { errorString in
    print(errorString)
}

// Local voice resources can be retrieved after the request is complete
let array = DBRtvcManager.shared.getSpeakerInfoList()
```

## 2. Set Output and Input Sample Rate

This section shows how to set the engine's input and output sample rates.

```swift
DBRtvcManager.shared.setEngineSampleRate(inputSampleRate: 48000, outputSampleRate: 48000)
```

## 3. Resource Download

This section describes how to check if resource files need to be downloaded and how to initiate the download process.

```swift
// Check if resource download is needed
if DBRtvcManager.shared.checkEngineSpeakerFiles() {
    /*
     downProgress: total download progress
     complete: 1: Download successful, 0: Download failed
    */
    DBRtvcManager.shared.starDownEngineSpeakerFiles { [weak self] progress in
        print(progress)
    } complete: { num in
        print(num)
        // num = 
    }
}
```

## 4. Set Voice

This section explains how to set the desired voice resource using a speaker ID.

```swift
// Pass in the speaker ID
DBRtvcManager.shared.setVoice(speakerId: id) { [weak self] in

} failure: { errorString in

}
```

## 5. Real-time Conversion

This section details how to perform real-time voice conversion by passing audio data to the engine.

There are two primary methods for conversion: asynchronous (non-blocking) and synchronous (blocking).

### Asynchronous Conversion

```swift
/*
 * Asynchronous conversion, will not block the thread
 * data: The audio data to be converted
 * mode: 0: Normal mode 1: Pro mode (requires pitchFluctuation, pitchOffset, obtainable from getSoundDataCheck)
 */
if let result = DBRtvcManager.shared.transform(data: data, mode: 0 ) {
}
```

### Synchronous Conversion

```swift
/*
 * Synchronous conversion, will block the thread
 * data: The audio data to be converted
 * mode: 0: Normal mode 1: Pro mode (requires pitchFluctuation, pitchOffset, obtainable from getSoundDataCheck)
 */
if let result = DBRtvcManager.shared.syncTransform(data: data, mode: 0 ) {
}
```

## 6. Destroy Engine

This section shows the method for releasing and destroying the voice conversion engine.

```swift
DBRtvcManager.shared.releaseEngine { 

}
```

## 7. resetEngine Engine

This section describes the method to call if you need to clear the audio cache data that has already been converted by the engine.

```swift
// Call this if you need to clear the audio cache data that has already been converted
DBRtvcManager.shared.resetEngine { 

}
```

## 8. Logout

This section describes how to log out of the current status, which will automatically destroy the engine.

```swift
// Logout status, the engine will be automatically destroyed
DBRtvcManager.shared.userLogout { 

}
```

## 9. Get Delay

This section provides the method for obtaining the conversion delay time.

```swift
// Get conversion delay time in ms
let delay = DBRtvcManager.shared.getDelay()
```


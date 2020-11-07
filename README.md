# Camio Stream Web Component
## Live Demo

https://mlpierce22.github.io/hls-mvp/

## Installation
### In Angular:
1. Add `schemas: [CUSTOM_ELEMENTS_SCHEMA]` into `app.module.ts` of the app you want to import into.
2. In `main.ts` add an import statement. I recommend downloading the camio-live-stream.js file at this link and placing it into a local folder. For example, if I wanted something like `<script type='text/javascript' src="./camio-live-streams.js"></script>`, then I would run something like `curl https://raw.githubusercontent.com/CamioCam/camio-stream-component/master/elements/camio-live-streams.js > ./elements/camio-live-streams.js` write this import into the main.ts: `import "../elements/camio-live-streams.js"`.
3. Using the tag name that you declared for the custom component, just embed it where you want it in the app as if it was a regular component. Eg. in this case: `<camio-live-streams></camio-live-streams>`

### In Javascript and HTML:
1. Place the web component declaration in the body of the html file (including inputs you need).
2. Underneath that, place a script tag that imports the `custom-component.js` file and declares it as type `text/javascript`.
3. Finally, add another script tag and inside that, place all event listeners.

```
...
<body>
  <camio-live-streams></camio-live-streams>
  <script type="text/javascript" src="https://cdn.jsdelivr.net/gh/mlpierce22/hls-mvp@master/elements/camio-live-streams.js"></script>
  <script>
    // Javascript code for registering event listeners (see Javascript: Outputs below)
  </script>
</body>
```

## Handling Input/Output events
### In Angular:
#### Inputs:
Follow the normal Angular syntax for inputs. That is `<camio-live-streams [inputTitle]="componentNeedsThis"></camio-live-streams>` would take our local variable `componentNeedsThis` and gives it to the web component as an input variable called `inputTitle`. **Note: inputTitle has to be the name of an actual input in the web component**

#### Outputs:
Follow the normal Angular syntax unless you need the payload of an event. That is `<camio-live-streams (outputTitle)="functionToCall()"></camio-live-streams>` would call our local function called `functionToCall` whenever an event fires from the emitter variable called `outputTitle`. Unlike typical Angular Syntax though, `$event` encapsulates the full event instead of the actual payload. To get the payload, and pass it to our function, we would have to do this: `(outputTitle)="functionToCall($event.detail)`. **Note: outputTitle has to be the name of an actual output event in the web component**

### In Javascript:
#### Inputs:
Place an empty stream tag `<camio-live-streams></camio-live-streams>`, and set an attribute in a script tag below it. **Note**: the attribute has to match that of the possible inputs (see Schema Inputs below)

Some sample code to make this more clear:
```
<camio-live-streams></camio-live-streams>
<script>
  // define a config
  let streamConfig = [
    {
      manifestUrl: "https://playertest.longtailvideo.com/adaptive/wowzaid3/playlist.m3u8",
      online: true,
      cameraName: "Long Tail Video - Captions",
      timeStamp: Date.now(),
      labels: ['HQ', 'San Mateo', 'Work'],
    }
  ]
  // Add the attribute to the stream
  const liveStream = document.querySelector("camio-live-streams");
  if (liveStream) {
    liveStream.setAttribute("streams", JSON.stringify(streamConfig));
  }
</script>
```

#### Outputs:
Unlike inputs, the outputs don't need to be declared in the html, instead they should be handled in a seperate script tag (so that we can actually catch the events) by registering an event listener on the component itself.

Some sample code to make this more clear:
```
<camio-live-streams></camio-live-streams>
<script>
  var camioStream = document.querySelector("camio-live-streams")
  camioStream.addEventListener("outputTitle", function (event) {
    ...
    // Do stuff with event that will happen when outputTitle fires
    ...
  });
}
</script>
<script type="text/javascript" src="https://cdn.jsdelivr.net/gh/mlpierce22/hls-mvp@latest/elements/camio-live-streams.js"></script>
```

## Schema for this web component (WIP):
### Inputs
- *streams*
  - Payload: Array<InputStream>
  - Triggered: When the user clicks the fullscreen button.
  - Description: Makes the video component full screen.
*Some ideas for inputs: an api key, a config for the video element (show/hide controls, volume, etc), share camera url?*

### Outputs
- *fullScreen*
  - Payload: none
  - Triggered: When the user clicks the fullscreen button.
  - Description: Makes the video component full screen.

- *startStream*
  - Payload: none
  - Triggered: When the user clicks the start stream button.
  - Description: Starts the process of embedding the HLS live stream.

- *stopStream*
  - Payload: none
  - Triggered: When the user clicks the stop stream button.
  - Description: Hides the video player and switches back to the poster view.

- *shareCamera*
  - Payload: none
  - Triggered: When the user clicks the share camera button.
  - Description: Creates a shareable link for the camera.

- *search*
  - Payload: string
  - Triggered: When the user clicks on the camera or any of its tags
  - Description: Allows the user to search using the query parameters provided in the payload.

- *editZones*
  - Payload: LiveStream
  - Triggered: When the user clicks the edit zones button.
  - Description: Allows the user to edit the zones of the camera.

- *rewind*
  - Payload: none
  - Triggered: When the user clicks the rewind button.
  - Description: Allows the user to rewind the video 15 minutes.

- *videoSelectionToggle*
  - Payload: LiveStream
  - Triggered: When the user clicks on the tags on the bottom right of each video.
  - Description: Allows the user to see the camera's tags and select multiple cameras.

### Models
```
InputStream: {
  manifestUrl: string, // The url to the *.m3u8 file
  online: boolean, // The online/offline state of the camera
  cameraName: string, // The name of the camera
  timeStamp: Date, // the time of the camera (eg. it's 5pm where the camera is located)
  labels: Array<string>, // the labels associated with this camera.
},
```
```
LiveStream {
  id: number; // Unique identifier
  currentIndex: number // Where the stream is in the list (determined by either local storage or default)
  manifestUrl: string // The url to the manifest file. Should be https.
  online: boolean, // Whether the camera is online or not.
  cameraName: string // The name of the camera
  timeStamp: number // The current time stamp
  labels: Array<string> // The labels used
  isFocused: boolean; // Whether or not this stream is focused (big).
  isSelected: boolean; // Whether or not the tag is selected for this stream
}
```

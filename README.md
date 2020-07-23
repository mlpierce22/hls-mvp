# Camio Stream Web Component

## Installation
### In Angular:
1. Add `schemas: [CUSTOM_ELEMENTS_SCHEMA]` into `app.module.ts` of the app you want to import into.
2. In `main.ts` add an import statement. It would be the same as embedding a script from an external source. For example, if I wanted something like `<script type='text/javascript' src="Desktop/custom-component.js"></script>`, then I would write this import into the main.ts: `import "Desktop/custom-component.js"`. It is still unclear to me if this can fetch from an external source like a script could (will figure out).
3. Using the tag name that you declared for the custom component, just embed it where you want it in the app as if it was a regular component. Eg. in this case: `<camio-live-streams></camio-live-streams>`

### In Javascript and HTML:
1. Place the web component declaration in the body of the html file (including inputs you need).
2. Underneath that, place a script tag that imports the `custom-component.js` file and declares it as type `text/javascript`.
3. Finally, add another script tag and inside that, place all event listeners.

```
...
<body>
  <camio-live-streams thisInput="ourVariable"></camio-live-streams>
  
  <script type="text/javascript" src="path/to/camio-live-streams.js"></script>
  <script>
    // Javascript code for registering event listeners (see Javascript: Outputs below)
  </script>
</body>
```


## The Life-Cycle of Web Components:
- `connectedCallback`: Invoked each time the custom element is appended into a document-connected element. This will happen each time the node is moved, and may happen before the element's contents have been fully parsed.
**Note: connectedCallback may be called once your element is no longer connected, use Node.isConnected to make sure.**
- `disconnectedCallback`: Invoked each time the custom element is disconnected from the document's DOM.
- `adoptedCallback`: Invoked each time the custom element is moved to a new document.
- `attributeChangedCallback`: Invoked each time one of the custom element's attributes is added, removed, or changed. Which attributes to notice change for is specified in a static get observedAttributes method

source: [Mozilla](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements)


## Handling Input/Output events
### In Angular:
#### Inputs:
Follow the normal Angular syntax for inputs. That is `<camio-live-streams [inputTitle]="componentNeedsThis"></camio-live-streams>` would take our local variable `componentNeedsThis` and gives it to the web component as an input variable called `inputTitle`. **Note: inputTitle has to be the name of an actual input in the web component**

#### Outputs:
Follow the normal Angular syntax unless you need the payload of an event. That is `<camio-live-streams (outputTitle)="functionToCall()"></camio-live-streams>` would call our local function called `functionToCall` whenever an event fires from the emitter variable called `outputTitle`. Unlike typical Angular Syntax though, `$event` encapsulates the full event instead of the actual payload. To get the payload, and pass it to our function, we would have to do this: `(outputTitle)="functionToCall($event.detail)`. **Note: outputTitle has to be the name of an actual output event in the web component**

### In Javascript:
#### Inputs:
`<camio-live-streams inputTitle="componentNeedsThis"></camio-live-streams>` would take our local variable `componentNeedsThis` and gives it to the web component as an input variable called `inputTitle`.

Some sample code to make this more clear:
```
<camio-live-streams inputTitle="componentNeedsThis"></camio-live-streams>
<script>
var componentNeedsThis = "important words"
</script>
```

#### Outputs:
Unlike inputs, the outputs don't need to be declared in the html, instead they should be handled in a seperate script within the `connectedCallback()` function (so that we can actually catch the events) by registering an event listener (on the shadow dom I think?).

**Note: This needs to be tested, syntax may be slightly off.**
Some sample code to make this more clear:
```
<camio-live-streams></camio-live-streams>
<script>
connectedCallback(){
  ...
  this.shadowRoot.addEventListener("outputTitle", function (event) {
    ...
    // Do stuff with event that will happen when outputTitle fires
    ...
    });
}
</script>
```

## Schema for this web component (WIP):
### Inputs
*There are currently no inputs. Some ideas for inputs: an api key, a config for the video element (show/hide controls, volume, etc), share camera url?*

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
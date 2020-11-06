import { Component, OnDestroy, ViewEncapsulation, Output, EventEmitter } from "@angular/core";
import { Subject, BehaviorSubject, fromEvent, combineLatest } from "rxjs";
import {
  map,
  takeUntil,
  withLatestFrom,
} from "rxjs/operators";
import { FetchStreamService } from "./fetch-stream.service";
import { LiveStream, VideoDimensions } from "./app.models";
import * as arrayMove from "array-move"

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
  encapsulation: ViewEncapsulation.ShadowDom
})
export class AppComponent implements OnDestroy {

  // ------------ Public Facing Events ---------------

  /** Event representing when a user starts fullscreen. */
  @Output() fullScreen: EventEmitter<void> = new EventEmitter<void>();

  /** Event representing when a user starts stream. */
  @Output() startStream: EventEmitter<void> = new EventEmitter<void>();

  /** Event representing when a user stops stream. */
  @Output() stopStream: EventEmitter<void> = new EventEmitter<void>();

  /** Event representing when a user shares a camera. */
  @Output() shareCamera: EventEmitter<void> = new EventEmitter<void>();

  /** Event representing when a user needs to search. */
  @Output() search: EventEmitter<string> = new EventEmitter<string>();

  /** Event representing when a user needs to search. */
  @Output() editZones: EventEmitter<LiveStream> = new EventEmitter<LiveStream>();

  /** Event representing when a user rewinds back 15 minutes. */
  @Output() rewind: EventEmitter<void> = new EventEmitter<void>();

  /** Event representing when a user clicks on the tags for a video (could be to select or unselect it). */
  @Output() videoSelectionToggle: EventEmitter<LiveStream> = new EventEmitter<LiveStream>();

  // ------------ Public Input Data ---------------

  // ------------ Data Observables ---------------
  /** Partial LiveStream Object from backend */
  liveStreamData$: BehaviorSubject<Partial<LiveStream>[]> = new BehaviorSubject<Partial<LiveStream>[]>(null);

  /** Constructed LiveStream Object */
  liveStreams$: BehaviorSubject<LiveStream[]> = new BehaviorSubject<LiveStream[]>(null);

  /** The live stream that is in focus  */
  focusedStream$: BehaviorSubject<LiveStream> = new BehaviorSubject<LiveStream>(null);

  /** The live stream that is selected (with a tag) */
  selectedStreams$: BehaviorSubject<LiveStream[]> = new BehaviorSubject<LiveStream[]>(null);

  /** The index of the focused Stream */
  focusedStreamIndex$: BehaviorSubject<number> = new BehaviorSubject<number>(
    null
  );

  // ------------ Event (Manual) Observables ---------------
  /** Event to handle when a user wants to edit a zone. */
  editZones$: Subject<LiveStream> = new Subject<LiveStream>();

  /** Event to handle when a user wants to search. */
  search$: Subject<string> = new Subject<string>();

  /** Event to handle when a user wants to see the tags for a video. */
  toggleVideoSelect$: Subject<number> = new Subject<number>();

  /** Event that handles the newly dropped stream (for drag and drop). */
  dropped$: Subject<Object> = new Subject<Object>();

  /** Event that handles saving the position of the streams to local storage (every time the user drops it). */
  savePosition$: Subject<LiveStream[]> = new Subject<LiveStream[]>();

  // ------------ Event (Automatic) Observables ---------------
 
  /** The size of the focused stream. */
  focusedStreamDim$: BehaviorSubject<VideoDimensions> = new BehaviorSubject<
    VideoDimensions
  >({ width: 1067, height: 600 });

  /** The size of the listed streams */
  listedStreamDim$: BehaviorSubject<VideoDimensions> = new BehaviorSubject<
    VideoDimensions
  >({ width: 456, height: 267 });

  /** Destroy observables so no leaks. */
  unsubscribe$: Subject<void> = new Subject<void>();

  // ------------------- Functions -------------------
  /** Adjust the display based on window width. */
  adjustDisplay() {
    const focusedWidth = window.innerWidth * 0.74;
    const focusedHeight = focusedWidth * 0.56;
    this.focusedStreamDim$.next({
      width: focusedWidth,
      height: focusedHeight,
    });

    if (window.innerWidth < 500) {
      const listedWidth = window.innerWidth * 0.7;
      const listedHeight = focusedWidth * 0.56;
      this.listedStreamDim$.next({
        width: listedWidth,
        height: listedHeight,
      });
    }
  }

  // ------------------- Lifecycle -------------------
  constructor(public fss: FetchStreamService) {}

  ngOnInit(): void {
    // Initially adjust the display so it's the right size for the user's screen.
    this.adjustDisplay();

    // Then, dynamically adjust the display from now on
    fromEvent(window, "resize")
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(() => {
      this.adjustDisplay()
    });

    // ---------------------- DATA -------------------------

    // Fetch the camera and metadata from the fetch service (happens once unless the data changes)
    this.fss.fetch().pipe(
      map((liveStreams) => {
        return liveStreams.map((metaData, index) => {
          return {
            manifestUrl: metaData.manifestUrl,
            online: metaData.online,
            cameraName: metaData.cameraName,
            timeStamp: metaData.timeStamp,
            labels: metaData.labels,
            id: index,
          };
        });
      }),
    ).subscribe(streamArray => {
      this.liveStreamData$.next(streamArray)
    });

    // Builds a full stream object with an appropriate index and dispatches it onto the livestream stream
    combineLatest(this.liveStreamData$, this.selectedStreams$, this.focusedStream$)
    .pipe(
      takeUntil(this.unsubscribe$))
    .subscribe(([liveStreamData, selected, focused]) => {
      let updatedStream: LiveStream[] = liveStreamData.map((stream, index) => {
        let savedStream = localStorage.getItem(stream.id.toString())
        let streamObj: LiveStream;
        if (savedStream) {
           streamObj = JSON.parse(savedStream)
        }
        return {
          manifestUrl: stream.manifestUrl,
          online: stream.online,
          cameraName: stream.cameraName,
          timeStamp: stream.timeStamp,
          labels: stream.labels,
          id: index,
          currentIndex: streamObj ? streamObj.currentIndex : index,
          isFocused: !!focused && focused.id == stream.id,
          isSelected: !!selected && selected.filter(sel => sel.id == stream.id).length == 1
        }
      }).sort((a, b) => a.currentIndex - b.currentIndex)
      this.liveStreams$.next(updatedStream)
    })

    // ---------------------- Events -------------------------

    // some operation when the user asks to search (also allow parent to handle)
    this.search$.pipe(takeUntil(this.unsubscribe$)).subscribe((query) => {
      this.search.emit(query)
    });

    // Handle the selecting of the stream tags.
    this.toggleVideoSelect$
      .pipe(withLatestFrom(this.liveStreams$, this.selectedStreams$), takeUntil(this.unsubscribe$))
      .subscribe(([index, streams, selectedStreams]) => {
        let selectedStreamsCopy;
        this.videoSelectionToggle.emit(streams[index])
        // if the array is uninitialized, initialize it and push first selectedStream
        if (!selectedStreams) {
          let newArray = new Array<LiveStream>();
          newArray.push(streams[index])
          this.selectedStreams$.next(newArray)
        // if array is empty, push first selected stream
        } else if (selectedStreams.length == 0) {
          selectedStreamsCopy = [...selectedStreams]
          selectedStreamsCopy.push(streams[index])
          this.selectedStreams$.next(selectedStreamsCopy)
        // otherwise, make a copy and traverse selected streams
        } else {
          let location = null;
          selectedStreamsCopy = [...selectedStreams]
          selectedStreamsCopy.forEach((selStream, indx) => {
            // if the stream is already in the selected streams array, save where it is
            if (selStream.id == streams[index].id) {
              location = indx;
              return;
            } 
          })
          // if the selected stream was in the array, then take it out.
          if (location !== null) {
            selectedStreamsCopy.splice(location, 1)
          // otherwise, put it in.
          } else {
            selectedStreamsCopy.push(streams[index])
          }
          // Update the selected streams observable with this new information
          this.selectedStreams$.next(selectedStreamsCopy)
        }
    });

    // Handle when the user wants to edit the zones.
    this.editZones$.pipe(takeUntil(this.unsubscribe$))
    .subscribe((stream) => {
      this.editZones.emit(stream)
    })

    // Handle when the user drops the stream into a new position
    this.dropped$.pipe(
      withLatestFrom(this.liveStreams$), 
      takeUntil(this.unsubscribe$)
    ).subscribe(([ev, liveStream]) => {
      if (ev['type'] == "end") {
        let newStream = arrayMove(liveStream, ev['oldIndex'], ev['newIndex'])
        newStream.forEach((stream, index) => {
            stream.currentIndex = index
        })
        console.log("Moved to" + ev['newIndex'], newStream)
        this.savePosition$.next(newStream)
        this.liveStreams$.next(newStream)
        // If the stream is focused, we also have to update the focused position
        newStream.forEach((stream, index) => {
          if (stream.isFocused) {
            this.focusedStreamIndex$.next(index)
          }
        })
      }
    })

    // Save the position of the videos to local storage.
    this.savePosition$.pipe(
      takeUntil(this.unsubscribe$)
      ).subscribe((liveStreams) => {
        localStorage.clear()
        liveStreams.forEach(stream => {
          localStorage.setItem(stream.id.toString(), JSON.stringify(stream));
        })
      });

      // Every time the stream index is updated, update the livestream
      this.focusedStreamIndex$.pipe(
        takeUntil(this.unsubscribe$),
        withLatestFrom(this.liveStreams$))
      .subscribe(([index, liveStream]) => {
        console.log("updated focused! to ", index)
        if (index != null) {
        this.focusedStream$.next(liveStream[index])
        } else {
          this.focusedStream$.next(null)
        }
      })

  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}

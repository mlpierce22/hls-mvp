import { Component, AfterViewInit, OnDestroy } from "@angular/core";
import { Subject, Observable, BehaviorSubject, fromEvent, of, combineLatest, merge } from "rxjs";
import {
  map,
  takeUntil,
  withLatestFrom,
  distinctUntilChanged,
  tap,
  startWith,
  pairwise,
  take,
} from "rxjs/operators";
import { FetchStreamService } from "./fetch-stream.service";
import { LiveStream, VideoDimensions } from "./app.models";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnDestroy {
  width: number = 250;
  height: number = 200;

  /** Destroy observables so no leaks. */
  unsubscribe$: Subject<void> = new Subject<void>();

  /** Partial LiveStream Object from backend */
  liveStreamData$: BehaviorSubject<Partial<LiveStream>[]> = new BehaviorSubject<Partial<LiveStream>[]>(null);

  /** Constructed LiveStream Object */
  liveStreams$: BehaviorSubject<LiveStream[]> = new BehaviorSubject<LiveStream[]>(null);

  /** The live stream used to  */
  focusedStream$: BehaviorSubject<LiveStream> = new BehaviorSubject<LiveStream>(null);

  /** The live stream used to  */
  selectedStreams$: BehaviorSubject<LiveStream[]> = new BehaviorSubject<LiveStream[]>(null);

  /** The index of the selected Stream */
  focusedStreamIndex$: BehaviorSubject<number> = new BehaviorSubject<number>(
    null
  );

  editZones$: Subject<LiveStream> = new Subject<LiveStream>();

  /** Event to handle searching */
  search$: Subject<string> = new Subject<string>();

  /** Event to handle toggling a video select. */
  toggleVideoSelect$: Subject<number> = new Subject<number>();

  // --------------- OPTIONS ---------------
  /** The size of the focused stream. */
  focusedStreamDim$: BehaviorSubject<VideoDimensions> = new BehaviorSubject<
    VideoDimensions
  >({ width: 1067, height: 600 });

  /** The size of the listed streams */
  listedStreamDim$: BehaviorSubject<VideoDimensions> = new BehaviorSubject<
    VideoDimensions
  >({ width: 456, height: 267 });

  constructor(public fss: FetchStreamService) {}

  ngOnInit(): void {

    this.adjustDisplay();

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

    combineLatest(this.liveStreamData$, this.selectedStreams$, this.focusedStream$)
    .pipe(
      takeUntil(this.unsubscribe$))
    .subscribe(([liveStreamData, selected, focused]) => {
      let updatedStream: LiveStream[] = liveStreamData.map((stream, index) => {
        return {
          manifestUrl: stream.manifestUrl,
          online: stream.online,
          cameraName: stream.cameraName,
          timeStamp: stream.timeStamp,
          labels: stream.labels,
          id: index,
          currentIndex: index, // TODO: get from local storage
          isFocused: !!focused && focused.id == stream.id,
          isSelected: !!selected && selected.filter(sel => sel.id == stream.id).length == 1
        }
      })
      this.liveStreams$.next(updatedStream)
    })

    this.search$.pipe(takeUntil(this.unsubscribe$)).subscribe((query) => {
      console.log("searching the following query:", query);
    });

    fromEvent(window, "resize")
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {
        this.adjustDisplay()
      });

    this.toggleVideoSelect$
      .pipe(withLatestFrom(this.liveStreams$, this.selectedStreams$), takeUntil(this.unsubscribe$))
      .subscribe(([index, streams, selectedStreams]) => {

        let selectedStreamsCopy;
        if (!selectedStreams) {
          let newArray = new Array<LiveStream>();
          newArray.push(streams[index])
          this.selectedStreams$.next(newArray)
        } else if (selectedStreams.length == 0) {
          selectedStreamsCopy = [...selectedStreams]
          selectedStreamsCopy.push(streams[index])
          this.selectedStreams$.next(selectedStreamsCopy)
        } else {
          let location = null;
          selectedStreamsCopy = [...selectedStreams]
          selectedStreamsCopy.forEach((selStream, indx) => {
            // if the stream is already in there, save where it is
            if (selStream.id == streams[index].id) {
              location = indx;
              return;
            } 
          })

          if (location !== null) {
            selectedStreamsCopy.splice(location, 1)
          } else {
            selectedStreamsCopy.push(streams[index])
          }
          this.selectedStreams$.next(selectedStreamsCopy)
        }
    });

    this.editZones$.pipe(takeUntil(this.unsubscribe$))
    .subscribe((stream) => {
      console.log("editing zones for the following camera:", stream.cameraName);
    })
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

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
}

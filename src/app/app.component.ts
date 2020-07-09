import { Component, AfterViewInit, OnDestroy } from "@angular/core";
import { Subject, Observable, BehaviorSubject, fromEvent } from "rxjs";
import { map, takeUntil, withLatestFrom, distinctUntilChanged, tap, startWith, pairwise } from "rxjs/operators";
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

  /** Constructed LiveStream Object */
  liveStreams$: Observable<LiveStream[]> = new Observable<LiveStream[]>();

  /** The live stream used to  */
  focusedStream$: Observable<LiveStream> = new Observable<LiveStream>(null);

  /** The index of the selected Stream */
  selectedStreamIndex$: BehaviorSubject<number> = new BehaviorSubject<number>(null);


  // --------------- OPTIONS ---------------
  /** The size of the focused stream. */
  focusedStreamDim$: BehaviorSubject<VideoDimensions> = new BehaviorSubject<VideoDimensions>({ width: 1067, height: 600});

  /** The size of the listed streams */
  listedStreamDim$: BehaviorSubject<VideoDimensions> = new BehaviorSubject<VideoDimensions>({ width: 456, height: 267});

  constructor(public fss: FetchStreamService) {

    this.liveStreams$ = this.fss.fetch().pipe(
      map((streamUrls) => {
        return streamUrls.map((metaData, index) => {
          return {
            manifestUrl: metaData.manifestUrl,
            online: metaData.online,
            cameraName: metaData.cameraName,
            timeStamp: metaData.timeStamp,
            labels: metaData.labels,
            id: index,
            isFocused: false,
          };
        });
      })
    );

    this.focusedStream$ = this.selectedStreamIndex$
    .pipe(
      startWith(null),
      distinctUntilChanged(),
      pairwise(),
      withLatestFrom(this.liveStreams$), 
      map(([[prevIndex, currIndex], streams]) => {
        console.log("advanced index from " + prevIndex + " to " + currIndex)
        
        if (currIndex !== null) {
          streams[currIndex].isFocused = true
          if (prevIndex !== null) {
            streams[prevIndex].isFocused = false
          }
          return streams[currIndex]
        }
        else {
          return null
        }
      }),
      takeUntil(this.unsubscribe$)
    )
  }

  ngOnInit(): void {
    fromEvent(window, 'resize').pipe(takeUntil(this.unsubscribe$)).subscribe(() => {
        const focusedWidth = window.innerWidth * .74
        const focusedHeight = focusedWidth * .56
        this.focusedStreamDim$.next({width: focusedWidth, height: focusedHeight})

        if (window.innerWidth < 500) {
          const listedWidth = window.innerWidth * .7
          const listedHeight = focusedWidth * .56
          this.listedStreamDim$.next({width: listedWidth, height: listedHeight})
        }
    })
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  // /** Allows users to highlight multiple streams to delete */
  // toggleHighlight(index) {
  //   this.liveStreams[index].selected = !this.liveStreams[index].selected
  // }

  // /** Handles delete stream click event */
  // deleteStreams() {
  //   let tempStream = this.liveStreams.filter(stream => !stream.selected);
  //   this.liveStreams = tempStream;
  // }

  // /** Handles add stream click event */
  // addStream() {
  //   const randNum = Math.floor(Math.random() * this.liveStreamURLs.length - 1) + 1
  //   let url = this.liveStreamURLs[randNum]
  //   this.liveStreams.push({ id: this.liveStreams.length, url, selected: false})
  //   this.setupHls(url, this.liveStreams.length - 1)
  // }
}

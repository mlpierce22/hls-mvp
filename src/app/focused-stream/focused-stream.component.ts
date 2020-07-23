import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { LiveStream, VideoDimensions } from '../app.models';
import { Subject, BehaviorSubject } from 'rxjs';
import { trigger, transition, animate, style } from '@angular/animations'
import { takeUntil, withLatestFrom } from 'rxjs/operators';


@Component({
  selector: 'app-focused-stream',
  templateUrl: './focused-stream.component.html',
  styleUrls: ['./focused-stream.component.scss'],
  animations: [
    // These animations have a monkey patch in main.ts: https://github.com/angular/angular/issues/25672
    trigger('slideInOut', [
      transition(':enter', [
        style({
          maxHeight: '0px',
          opacity:0
        }),
        animate('500ms ease-in', 
        style({
          maxHeight: '999px',
          opacity:1
        }))
      ]),
      transition(':leave', [
        animate('500ms ease-in', 
        style({ 
          height: '0px',
          opacity:0
        })
        )
      ])
    ])
  ],
})
export class FocusedStreamComponent implements OnInit, OnDestroy {
  // --------------------- INPUTS ---------------------

  /** The index of big stream the user is focused on. */
  @Input() focusedStreamIndex: number;

  /** The list of all live streams. */
  @Input() liveStreams: LiveStream[];

  /** The list of all live stream's dimensions. */
  @Input() focusedStreamDim: VideoDimensions;

  /** The url of the poster to show (which should be fetched often). */
  @Input() posterUrl: string

  // --------------------- OUTPUTS ---------------------

  /** Event that fires when the user "selects/unselects" the video (via the tag). */
  @Output() toggleVideoSelect: EventEmitter<number> = new EventEmitter<number>();

  /** Event that fires when the user searches. */
  @Output() search: EventEmitter<string> = new EventEmitter<string>();

  /** Event that fires when the user wants to close the focused video. */
  @Output() close: EventEmitter<void> = new EventEmitter<void>();

  /** Event that fires when the user wants to edit zones. */
  @Output() editZones: EventEmitter<LiveStream> = new EventEmitter<LiveStream>();

  /** Event that fires when the user wants to enter full screen. */
  @Output() fullScreen: EventEmitter<void> = new EventEmitter<void>();

  /** Event that fires when the user starts the stream. */
  @Output() startStream: EventEmitter<void> = new EventEmitter<void>();

  /** Event that fires when the user stops the stream. */
  @Output() stopStream: EventEmitter<void> = new EventEmitter<void>();

  /** Event that fires when the user shares the camera. */
  @Output() shareCamera: EventEmitter<void> = new EventEmitter<void>();

  /** Event that fires when the user rewinds 15 minutes. */
  @Output() rewind: EventEmitter<void> = new EventEmitter<void>();

  // ------------ EVENT (Manual) Observables ---------------

  /** Whether the video is streaming (should default to false) */
  isStreaming$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  /** Event to handle when the user wants to start the stream. */
  startStream$: Subject<void> = new Subject<void>();

  /** Event to handle when the user wants to start the stream. */
  stopStream$: Subject<void> = new Subject<void>();

  // For future: OpenSettings

  /** Event to handle when the user wants to enter fullscreen. */
  fullScreen$: Subject<void> = new Subject<void>();

  /** Event to handle when the user wants to share the camera. */
  shareCamera$: Subject<boolean> = new Subject<boolean>();

  // ------------ Event (Automatic) Observables ---------------

  /** The reference to the video element from the stream component. */
  videoRef$: BehaviorSubject<ElementRef> = new  BehaviorSubject<ElementRef>(null);

  /** Prevent memory leaks, fires on destroy */
  unsubscribe$: Subject<void> = new Subject<void>();

  // --------------------- FUNCTIONS ---------------------

  /** Closes the stream (makes sure to stop it too.) */
  closeStream() {
    this.stopStream$.next()
    this.close.emit()
  }

  // --------------------- LIFECYCLE ---------------------
  constructor() { }

  ngOnInit() {

    // --------------------- EVENTS ---------------------

    // if the user wants to share their camera.
    this.shareCamera$.pipe(takeUntil(this.unsubscribe$)).subscribe(share => {
      this.shareCamera.emit()
      console.log("show share", share)
    })

    // Enters the user into fullscreen mode
    this.fullScreen$.pipe(withLatestFrom(this.isStreaming$, this.videoRef$), takeUntil(this.unsubscribe$)).subscribe(([_, isStreaming, videoRef]) => {
      if (videoRef && isStreaming) {
        this.fullScreen.emit()
        videoRef.nativeElement.requestFullscreen().catch(error => {
          console.warn("Failed to enter full screen because: ", error)
        })
      }
    })

    // Starts the stream.
    this.startStream$.pipe(takeUntil(this.unsubscribe$)).subscribe(() => {
      this.isStreaming$.next(true)
      this.startStream.emit()
    })

    // Stops the stream
    this.stopStream$.pipe(takeUntil(this.unsubscribe$)).subscribe(() => {
      this.isStreaming$.next(false)
      this.stopStream.emit()
    })
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    this.unsubscribe$.next()
    this.unsubscribe$.complete()
  }

}

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
    // Maybe these animations will work in the future: https://github.com/angular/angular/issues/25672
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

  /** The big stream the user is focused on. */
  @Input() focusedStreamIndex: number;

  @Input() liveStreams: LiveStream[];
  
  @Input() focusedStreamDim: VideoDimensions;

  @Input() posterUrl: string

  @Output() toggleVideoSelect: EventEmitter<number> = new EventEmitter<number>();

  @Output() search: EventEmitter<string> = new EventEmitter<string>();

  @Output() close: EventEmitter<void> = new EventEmitter<void>();

  @Output() editZones: EventEmitter<LiveStream> = new EventEmitter<LiveStream>()

  startStream$: Subject<void> = new Subject<void>();

  stopStream$: Subject<void> = new Subject<void>();

  videoRef$: BehaviorSubject<ElementRef> = new  BehaviorSubject<ElementRef>(null);

  // For future: OpenSettings

  fullScreen$: Subject<void> = new Subject<void>();

  shareCamera$: Subject<boolean> = new Subject<boolean>();

  unsubscribe$: Subject<void> = new Subject<void>();

  isStreaming$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor() { }

  ngOnInit() {

    this.shareCamera$.pipe(takeUntil(this.unsubscribe$)).subscribe(share => {
      console.log("show share", share)
    })

    this.fullScreen$.pipe(withLatestFrom(this.isStreaming$, this.videoRef$), takeUntil(this.unsubscribe$)).subscribe(([_, isStreaming, videoRef]) => {
      if (videoRef && isStreaming) {
        videoRef.nativeElement.requestFullscreen().catch(error => {
          console.warn("Failed to enter full screen because: ", error)
        })
      }
    })

    this.startStream$.pipe(takeUntil(this.unsubscribe$)).subscribe(() => {
      this.isStreaming$.next(true)
    })

    this.stopStream$.pipe(takeUntil(this.unsubscribe$)).subscribe(() => {
      this.isStreaming$.next(false)
    })
  }

  closeStream() {
    this.stopStream$.next()
    this.close.emit()
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    this.unsubscribe$.next()
    this.unsubscribe$.complete()
  }

}

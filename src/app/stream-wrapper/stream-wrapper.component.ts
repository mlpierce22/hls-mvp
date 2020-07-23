import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  ChangeDetectorRef,
  SimpleChanges,
  OnDestroy,
  ElementRef,
} from "@angular/core";
import { LiveStream, VideoDimensions } from "../app.models";
import { takeUntil, flatMap, take } from 'rxjs/operators';
import { Subject, timer, BehaviorSubject } from 'rxjs';
import { FetchStreamService } from '../fetch-stream.service';

@Component({
  selector: "app-stream-wrapper",
  templateUrl: "./stream-wrapper.component.html",
  styleUrls: ["./stream-wrapper.component.scss"],
})
export class StreamWrapperComponent implements OnInit, OnDestroy, OnChanges {

  // --------------------- INPUTS ---------------------

  /** The live stream for this component. */
  @Input() stream: LiveStream;

  /** Whether or not the orange X should be shown. */
  @Input() canClose: boolean;

  /** This live stream's dimensions */
  @Input() streamDim: VideoDimensions;

  /** Whether this live stream is selected. */
  @Input() isSelected: boolean;

  /** Whether or not we should be fetching posters periodically. */
  @Input() showPoster: boolean;

  // --------------------- OUTPUTS ---------------------

  /** Event that fires when the user has clicked the video. */
  @Output() focusVideo: EventEmitter<void> = new EventEmitter<void>();

  /** Event that fires when user clicks search. */
  @Output() search: EventEmitter<string> = new EventEmitter<string>();

  /** Event that fires when the user "selects/unselects" the video (via the tag). */
  @Output() toggleVideoSelect: EventEmitter<void> = new EventEmitter<void>();

  /** Event that fires when the user rewinds 15 minutes. */
  @Output() rewind: EventEmitter<void> = new EventEmitter<void>();

  /** Event that fires when the user wants to close the focused video. */
  @Output() close: EventEmitter<void> = new EventEmitter<void>();

  /** Fires when the video has encountered some sort of error and shows an error screen. */
  @Output() videoError: EventEmitter<boolean> = new EventEmitter<boolean>();

  /** Reference to the video object in the live stream component. */
  @Output() videoRef: EventEmitter<ElementRef> = new EventEmitter<ElementRef>();

  // --------------------- LOCAL VARS ---------------------

  /** Whether or not the dropdown is shown. */
  isDropdown: boolean = false;

  /** Whether or not to show the border around the video (on hover). */
  showBorder: boolean = false;

  /** Whether or not the video is in an error state. */
  hasErrored: boolean = false;

  /** The video object in the live stream component. */
  videoElement: HTMLVideoElement;
  
  // ------------ Event (Automatic) Observables ---------------

  /** The URL of the poster (updates frequently). */
  posterUrl$: BehaviorSubject<string> =  new BehaviorSubject<string>("https://tinyurl.com/yxsyedbd")

  /** Prevent memory leaks, fires on destroy */
  unsubscribe$: Subject<void> = new Subject<void>()

  // --------------------- FUNCTIONS ---------------------

  /** Sets the error state from the live stream component and tells parent there has been an error. */
  setErrorStatus(status) {
    this.videoError.emit(status)
    this.hasErrored = status
  }

  /** Sets the video element and sends it to the parent. */
  setVideoElement(videoEl) {
    this.videoRef.emit(videoEl)
    this.videoElement = videoEl.nativeElement
  }

  /** Toggles the dropdown. */
  toggleDropdown() {
    this.isDropdown = !this.isDropdown;
  }

  /** Sets up the dropdown initially. */
  registerDropdown() {
    document.body.addEventListener("click", (ev) => {
      let hasContainer = false;
      ev.composedPath().forEach((path) => {
        const id = (path as HTMLElement).id;
        const contId = "dropdown-container-" + this.stream.id;
        if (id && id == contId) {
          hasContainer = true;
          return;
        }
      });
      // if the dropdown is open and the click event doesn't contain the container
      if (this.isDropdown && !hasContainer) {
        this.isDropdown = false;
      }
    });
  }

  /** Rewinds the video based on the child's video object. */
  rewindVideo() {
    let newTime = this.videoElement.currentTime - 900 >= 0 ? this.videoElement.currentTime - 900 : 0;
    this.videoElement.currentTime = newTime;
    this.rewind.emit();
  }

  /** Changes the color of the tag based on whether or not the tag is selected. */
  isTagSelected() {
    let color;
    if (this.isSelected) {
      color = "0a59f3"; // blue
    } else {
      color = "636363"; // gray
    }
    return "https://icongr.am/material/tag-multiple.svg?size=30&color=" + color;
  }

  // --------------------- LIFECYCLE ---------------------

  constructor(public cdr: ChangeDetectorRef, public fss: FetchStreamService) {}

  ngOnInit() {
    // Setup the dropdown
    this.registerDropdown();

    // Setup grabbing new images every 5s
    timer(0, 5000)
      .pipe(
        flatMap(() => this.fss.fetchImage(this.stream.id)),
        takeUntil(this.unsubscribe$)
      ).subscribe(imageUrl => {
        if (this.showPoster) {
          this.posterUrl$.next(imageUrl)
        }
        else {
          this.posterUrl$.next(null);
        }
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    if (!!changes["showPoster"]) {
      if (!changes["showPoster"].currentValue) {
        this.posterUrl$.next(null)
      } else {
        this.fss.fetchImage(this.stream.id).pipe(take(1)).subscribe(imageUrl => {
          this.posterUrl$.next(imageUrl)
        })
      }
    }
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    this.unsubscribe$.next()
    this.unsubscribe$.complete()
  }
}

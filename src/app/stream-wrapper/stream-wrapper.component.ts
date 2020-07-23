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
  ViewChild,
  ElementRef,
} from "@angular/core";
import { LiveStream, VideoDimensions } from "../app.models";
import Hls from "hls.js";
import { takeUntil, flatMap, take } from 'rxjs/operators';
import { Subject, timer, BehaviorSubject } from 'rxjs';
import { FetchStreamService } from '../fetch-stream.service';

@Component({
  selector: "app-stream-wrapper",
  templateUrl: "./stream-wrapper.component.html",
  styleUrls: ["./stream-wrapper.component.scss"],
})
export class StreamWrapperComponent implements OnInit, OnDestroy, OnChanges {
  @Input() stream: LiveStream;

  @Input() canClose: boolean;

  @Input() streamDim: VideoDimensions;

  @Input() isSelected: boolean;

  @Input() showPoster: boolean;

  @Output() focusVideo: EventEmitter<void> = new EventEmitter<void>();

  @Output() search: EventEmitter<string> = new EventEmitter<string>();

  @Output() toggleVideoSelect: EventEmitter<void> = new EventEmitter<void>();

  @Output() rewind: EventEmitter<void> = new EventEmitter<void>();

  @Output() close: EventEmitter<void> = new EventEmitter<void>();

  @Output() videoError: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Output() videoRef: EventEmitter<ElementRef> = new EventEmitter<ElementRef>();

  isDropdown: boolean = false;

  showBorder: boolean = false;

  hasErrored: boolean = false;

  videoElement: HTMLVideoElement;
  
  posterUrl$: BehaviorSubject<string> =  new BehaviorSubject<string>("https://tinyurl.com/yxsyedbd")

  unsubscribe$: Subject<void> = new Subject<void>()

  constructor(public cdr: ChangeDetectorRef, public fss: FetchStreamService) {}

  ngOnInit() {
    this.registerDropdown();
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

  setErrorStatus(status) {
    this.videoError.emit(status)
    this.hasErrored = status
  }

  setVideoElement(videoEl) {
    this.videoRef.emit(videoEl)
    this.videoElement = videoEl.nativeElement
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    this.unsubscribe$.next()
    this.unsubscribe$.complete()
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

  toggleDropdown() {
    this.isDropdown = !this.isDropdown;
  }

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

  rewindVideo() {
    let newTime = this.videoElement.currentTime - 900 >= 0 ? this.videoElement.currentTime - 900 : 0;
    this.videoElement.currentTime = newTime;
    this.rewind.emit();
  }

  isTagSelected() {
    let color;
    if (this.isSelected) {
      color = "0a59f3"; // blue
    } else {
      color = "636363"; // gray
    }
    return "https://icongr.am/material/tag-multiple.svg?size=30&color=" + color;
  }
}

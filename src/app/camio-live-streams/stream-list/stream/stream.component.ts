import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  ChangeDetectorRef,
  ViewEncapsulation,
} from "@angular/core";
import { LiveStream, VideoDimensions } from "src/app/app.models";
import { Subject } from "rxjs";
import Hls from "hls.js";

@Component({
  selector: "app-stream",
  templateUrl: "./stream.component.html",
  styleUrls: ["./stream.component.scss"],
  encapsulation: ViewEncapsulation.ShadowDom
})
export class StreamComponent implements OnInit, OnChanges {

  @Input() stream: LiveStream;

  @Input() canClose: boolean

  @Input() streamDim: VideoDimensions;

  @Input() isSelected: boolean;

  @Output() focusVideo: EventEmitter<void> = new EventEmitter<void>();

  @Output() search: EventEmitter<string> = new EventEmitter<string>();

  @Output() toggleVideoSelect: EventEmitter<void> = new EventEmitter<void>();

  @Output() rewind: EventEmitter<void> = new EventEmitter<void>();

  @Output() close: EventEmitter<void> = new EventEmitter<void>();

  isDropdown: boolean = false;

  showBorder: boolean = false;

  constructor(public cdr: ChangeDetectorRef) {}

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.

    // In the future, we may have to decide if this is the desired behavior
    if (!!changes["stream"] && changes["stream"].firstChange) {
      this.setupHls(this.stream);
    }
    if (
      !!changes["stream"] && !!changes["stream"].previousValue &&
      changes["stream"].currentValue["manifestUrl"] !==
        changes["stream"].previousValue["manifestUrl"]
    ) {
      this.setupHls(this.stream);
    }
  }

  toggleDropdown() {
    this.isDropdown = !this.isDropdown;
  }

  rewindVideo() {
    let video = document.getElementById("live-stream-" + this.stream.id) as HTMLVideoElement
    let newTime = video.currentTime - 900 >= 0 ? video.currentTime - 900: 0
    video.currentTime = newTime
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

  setupHls(stream: LiveStream) {
    let exists = setInterval(function () {
      if (stream && document.getElementById("live-stream-" + stream.id)) {
        clearInterval(exists);
        let video = document.getElementById(
          "live-stream-" + stream.id
        ) as HTMLVideoElement;
        if (Hls.isSupported()) {
          let hls = new Hls();
          let retries = { network: 0, media: 0 };
          hls.on(Hls.Events.ERROR, (event, data) => {
            // Note: I grabbed this straight from the docs for hls.js
            if (data.fatal) {
              switch (data.type) {
                case Hls.ErrorTypes.NETWORK_ERROR && retries.network < 2:
                  // try to recover network error
                  hls.startLoad();
                  retries.network++;
                  break;
                case Hls.ErrorTypes.MEDIA_ERROR && retries.media < 2:
                  hls.recoverMediaError();
                  retries.media++;
                  break;
                default:
                  // cannot recover
                  hls.destroy();
                  break;
              }
            }
          });

          hls.attachMedia(video);
          hls.on(Hls.Events.MEDIA_ATTACHED, () => {
            video.muted = true;
            video.controls = true;
            video.loop = true;
            hls.loadSource(stream.manifestUrl);
            hls.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
              //console.log(data)
            });
          });
        } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
          video.src = stream.manifestUrl;
        }
      }
    }, 100);
  }
}

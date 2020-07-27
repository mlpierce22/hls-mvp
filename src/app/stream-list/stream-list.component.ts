import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { LiveStream, VideoDimensions } from '../app.models';
import Sortable from 'sortablejs';

@Component({
  selector: 'app-stream-list',
  templateUrl: './stream-list.component.html',
  styleUrls: ['./stream-list.component.scss']
})
export class StreamListComponent implements OnInit {

  // --------------------- INPUTS ---------------------
  /** The list of all live streams. */
  @Input() liveStreams: LiveStream[]

  /** The list of all live stream's dimensions. */
  @Input() listedStreamDim: VideoDimensions

  /** The url of the poster to show (which should be fetched often). */
  @Input() posterUrl: string

  // --------------------- OUTPUTS ---------------------
  /** Event that fires when the user clicks on the video which should make it big. */
  @Output() focusVideo: EventEmitter<number> = new EventEmitter<number>();

  /** Event that fires when the user "selects/unselects" the video (via the tag). */
  @Output() toggleVideoSelect: EventEmitter<number> = new EventEmitter<number>();

  /** Event that fires when the user searches. */
  @Output() search: EventEmitter<string> = new EventEmitter<string>();

  /** Event that fires when the user "drops" the video. */
  @Output() drop: EventEmitter<Object> = new EventEmitter<Object>();

  // --------------------- LOCAL VARS ---------------------
  /** Whether to show/hide the dragger icon for the video. */
  showDragger: boolean[] = [];

  // --------------------- FUNCTIONS ---------------------

  /** Allow angular to optimize ngFor. */
  trackByFn(index, item) {
    return index + item.id; 
  }
  // --------------------- LIFECYCLE ---------------------
  constructor() { }

  ngOnInit() {
    // Initialize showDragger array
    this.liveStreams.forEach(() => this.showDragger.push(false))

    // Setup the dragging and dropping using the sortable plugin.
    const streamList = document.querySelector("camio-live-streams").shadowRoot.getElementById("streamList")
    Sortable.create(streamList, {
      handle: '.dragger',
      animation: 150,
      easing: "cubic-bezier(1, 0, 0, 1)",
      ghostClass: "ghost",
      chosenClass: "chosen",
      onEnd: (ev) => this.drop.emit(ev),
    });
  }
}

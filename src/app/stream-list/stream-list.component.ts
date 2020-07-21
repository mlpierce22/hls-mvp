import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { LiveStream, VideoDimensions } from '../app.models';
import Sortable from 'sortablejs';

@Component({
  selector: 'app-stream-list',
  templateUrl: './stream-list.component.html',
  styleUrls: ['./stream-list.component.scss']
})
export class StreamListComponent implements OnInit {

  @Input() liveStreams: LiveStream[]

  @Input() listedStreamDim: VideoDimensions

  @Input() posterUrl: string

  @Output() focusVideo: EventEmitter<number> = new EventEmitter<number>();

  @Output() toggleVideoSelect: EventEmitter<number> = new EventEmitter<number>();

  @Output() search: EventEmitter<string> = new EventEmitter<string>();

  @Output() drop: EventEmitter<Object> = new EventEmitter<Object>();

  showDragger: boolean[] = [];

  constructor() { }

  ngOnInit() {
    this.liveStreams.forEach(() => this.showDragger.push(false))

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
  // Need the trackby if we want live video in the for loop
  // trackByFn(index, item) {
  //   return index; 
  // }
}

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { LiveStream, VideoDimensions } from '../app.models';

@Component({
  selector: 'app-stream-list',
  templateUrl: './stream-list.component.html',
  styleUrls: ['./stream-list.component.scss']
})
export class StreamListComponent implements OnInit {

  @Input() liveStreams: LiveStream[]

  @Input() listedStreamDim: VideoDimensions

  @Output() focusVideo: EventEmitter<number> = new EventEmitter<number>();

  @Output() toggleVideoSelect: EventEmitter<number> = new EventEmitter<number>();

  @Output() search: EventEmitter<string> = new EventEmitter<string>();

  constructor() { }

  ngOnInit() {
  }

}

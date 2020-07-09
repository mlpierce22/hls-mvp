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

  @Output() selectVideo: EventEmitter<number> = new EventEmitter<number>();

  constructor() { }

  ngOnInit() {
  }

}

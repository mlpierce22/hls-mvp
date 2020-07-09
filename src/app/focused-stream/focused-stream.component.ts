import { Component, OnInit, Input } from '@angular/core';
import { LiveStream, VideoDimensions } from '../app.models';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-focused-stream',
  templateUrl: './focused-stream.component.html',
  styleUrls: ['./focused-stream.component.scss']
})
export class FocusedStreamComponent implements OnInit {

  /** The big stream the user is focused on. */
  @Input() focusedStream: LiveStream;

  @Input() focusedStreamDim: VideoDimensions;


  constructor() { }

  ngOnInit() {
  }

}

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { LiveStream, VideoDimensions } from '../app.models';
import { Subject } from 'rxjs';
import { trigger, transition, animate, style } from '@angular/animations'


@Component({
  selector: 'app-focused-stream',
  templateUrl: './focused-stream.component.html',
  styleUrls: ['./focused-stream.component.scss'],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({
          maxHeight: '0px',
        }),
        animate('500ms ease-in', 
        style({
          maxHeight: '999px',
        }))
      ]),
      transition(':leave', [
        animate('500ms ease-in', 
        style({ 
          height: '0px',
        })
        )
      ])
    ])
  ],
})
export class FocusedStreamComponent implements OnInit {

  /** The big stream the user is focused on. */
  @Input() focusedStreamIndex: number;

  @Input() liveStreams: LiveStream[];
  
  @Input() focusedStreamDim: VideoDimensions;

  @Output() toggleVideoSelect: EventEmitter<number> = new EventEmitter<number>();

  @Output() search: EventEmitter<string> = new EventEmitter<string>();

  @Output() close: EventEmitter<void> = new EventEmitter<void>();

  constructor() { }

  ngOnInit() {
  }

}

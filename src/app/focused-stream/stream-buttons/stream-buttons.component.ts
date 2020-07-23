import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-stream-buttons',
  templateUrl: './stream-buttons.component.html',
  styleUrls: ['./stream-buttons.component.scss']
})
export class StreamButtonsComponent implements OnInit {

  @Input() showPoster: boolean

  @Output() startStream: EventEmitter<void> = new EventEmitter<void>();

  @Output() stopStream: EventEmitter<void> = new EventEmitter<void>();

  @Output() editZones: EventEmitter<void> = new EventEmitter<void>();

  @Output() search: EventEmitter<void> = new EventEmitter<void>();

  @Output() openSettings: EventEmitter<void> = new EventEmitter<void>();

  @Output() fullScreen: EventEmitter<void> = new EventEmitter<void>();

  @Output() shareCamera: EventEmitter<void> = new EventEmitter<void>();

  constructor() { }

  ngOnInit() {
  }

}

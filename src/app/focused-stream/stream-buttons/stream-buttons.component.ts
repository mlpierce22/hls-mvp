import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-stream-buttons',
  templateUrl: './stream-buttons.component.html',
  styleUrls: ['./stream-buttons.component.scss']
})
export class StreamButtonsComponent implements OnInit {

  // --------------------- INPUTS ---------------------

  /** Whether or not the poster is showing. */
  @Input() showPoster: boolean

  // --------------------- OUTPUTS ---------------------

  /** Handle when the user clicks start stream button. */
  @Output() startStream: EventEmitter<void> = new EventEmitter<void>();

  /** Handle when the user clicks stop stream button. */
  @Output() stopStream: EventEmitter<void> = new EventEmitter<void>();

  /** Handle when the user clicks edit zones button. */
  @Output() editZones: EventEmitter<void> = new EventEmitter<void>();

  /** Handle when the user clicks search button. */
  @Output() search: EventEmitter<void> = new EventEmitter<void>();

  /** Handle when the user clicks open settings button. */
  @Output() openSettings: EventEmitter<void> = new EventEmitter<void>();

  /** Handle when the user clicks full screen button. */
  @Output() fullScreen: EventEmitter<void> = new EventEmitter<void>();

  /** Handle when the user clicks share camera button. */
  @Output() shareCamera: EventEmitter<void> = new EventEmitter<void>();

  constructor() { }

  ngOnInit() {
  }

}

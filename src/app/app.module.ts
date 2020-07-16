import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Injector } from '@angular/core';
import { createCustomElement } from '@angular/elements'

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CamioLiveStreamsComponent } from './camio-live-streams/camio-live-streams.component';
import { StreamListComponent } from './camio-live-streams/stream-list/stream-list.component';
import { StreamComponent } from './camio-live-streams/stream-list/stream/stream.component';
import { FocusedStreamComponent } from './camio-live-streams/focused-stream/focused-stream.component';
import { StreamButtonsComponent } from './camio-live-streams/focused-stream/stream-buttons/stream-buttons.component';
import { ClickOutsideDirective } from './camio-live-streams/stream-list/stream/click-outside.directive';


@NgModule({
  declarations: [
    AppComponent,
    StreamListComponent,
    StreamComponent,
    FocusedStreamComponent,
    StreamButtonsComponent,
    ClickOutsideDirective,
    CamioLiveStreamsComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatTooltipModule
  ],
  providers: [],
  entryComponents: [CamioLiveStreamsComponent]
})
export class AppModule { 
  constructor(private injector: Injector) {
  }

  ngDoBootstrap() {
    const stream = createCustomElement(CamioLiveStreamsComponent, { injector: this.injector })
    customElements.define('camio-live-streams', stream)
  }
}

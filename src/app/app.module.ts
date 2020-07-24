import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Injector, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { createCustomElement } from '@angular/elements';


import { AppComponent } from './app.component';
import { StreamListComponent } from './stream-list/stream-list.component';
import { FocusedStreamComponent } from './focused-stream/focused-stream.component';
import { StreamButtonsComponent } from './focused-stream/stream-buttons/stream-buttons.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { MatButtonModule } from '@angular/material/button';
import { TooltipModule, TooltipOptions } from 'ng2-tooltip-directive';
import { StreamWrapperComponent } from './stream-wrapper/stream-wrapper.component';
import { Defaults } from './tooltip.config';


@NgModule({
  declarations: [
    AppComponent,
    StreamListComponent,
    FocusedStreamComponent,
    StreamButtonsComponent,
    StreamWrapperComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatButtonModule,
    TooltipModule.forRoot(Defaults as TooltipOptions),
  ],
  providers: [],
  entryComponents: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { 
  constructor(private inject: Injector) {

  }
  ngDoBootstrap() {
    const liveStreams = createCustomElement(AppComponent, { injector: this.inject });
    customElements.define('camio-live-streams', liveStreams);
  }
}

import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Injector } from '@angular/core';
import { createCustomElement } from '@angular/elements';


import { AppComponent } from './app.component';
import { StreamListComponent } from './stream-list/stream-list.component';
import { StreamComponent } from './stream-list/stream/stream.component';
import { FocusedStreamComponent } from './focused-stream/focused-stream.component';
import { StreamButtonsComponent } from './focused-stream/stream-buttons/stream-buttons.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';


@NgModule({
  declarations: [
    AppComponent,
    StreamListComponent,
    StreamComponent,
    FocusedStreamComponent,
    StreamButtonsComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatTooltipModule
  ],
  providers: [],
  entryComponents: [AppComponent]
})
export class AppModule { 
  constructor(private inject: Injector) {

  }
  ngDoBootstrap() {
    const myElement = createCustomElement(AppComponent, { injector: this.inject });
    customElements.define('camio-live-streams', myElement);
  }
}

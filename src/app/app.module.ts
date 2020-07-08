import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { StreamListComponent } from './stream-list/stream-list.component';
import { StreamComponent } from './stream-list/stream/stream.component';
import { FocusedStreamComponent } from './focused-stream/focused-stream.component';
import { StreamButtonsComponent } from './focused-stream/stream-buttons/stream-buttons.component';

@NgModule({
  declarations: [
    AppComponent,
    StreamListComponent,
    StreamComponent,
    FocusedStreamComponent,
    StreamButtonsComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

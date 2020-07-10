import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { StreamListComponent } from './stream-list/stream-list.component';
import { StreamComponent } from './stream-list/stream/stream.component';
import { FocusedStreamComponent } from './focused-stream/focused-stream.component';
import { StreamButtonsComponent } from './focused-stream/stream-buttons/stream-buttons.component';
import { ClickOutsideDirective } from './stream-list/stream/click-outside.directive';
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
    ClickOutsideDirective
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatTooltipModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

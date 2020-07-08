import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy {
 
  width: number = 250;
  height: number = 200;

  /** Destroy observables so no leaks. */
  unsubscribe$: Subject<void> = new Subject<void>();


  liveStreams: Array<{id: number, url: string, selected: boolean}> = new Array<{id: number, url: string, selected: boolean}>();

  liveStreamURLs = [
    "https://playertest.longtailvideo.com/adaptive/wowzaid3/playlist.m3u8",
    "https://playertest.longtailvideo.com/adaptive/captions/playlist.m3u8",
    "https://playertest.longtailvideo.com/adaptive/oceans_aes/oceans_aes.m3u8",
    "https://b028.wpc.azureedge.net/80B028/Samples/0e8848ca-1db7-41a3-8867-fe911144c045/d34d8807-5597-47a1-8408-52ec5fc99027.ism/Manifest(format=m3u8-aapl-v3)",
  ]
  
  ngOnInit(): void {
    // for (let i = 0; i < 16; i++) {
    //   const randNum = Math.floor(Math.random() * this.liveStreamURLs.length - 1) + 1
    //   let url = this.liveStreamURLs[randNum]
    //   this.liveStreams.push({ id: i, url, selected: false})
    // }


    //this.liveStreams.forEach((stream: any) => this.setupHls(stream.url, stream.id))
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  // /** Allows users to highlight multiple streams to delete */
  // toggleHighlight(index) {
  //   this.liveStreams[index].selected = !this.liveStreams[index].selected
  // }

  // /** Handles delete stream click event */
  // deleteStreams() {
  //   let tempStream = this.liveStreams.filter(stream => !stream.selected);
  //   this.liveStreams = tempStream;
  // }

  // /** Handles add stream click event */
  // addStream() {
  //   const randNum = Math.floor(Math.random() * this.liveStreamURLs.length - 1) + 1
  //   let url = this.liveStreamURLs[randNum]
  //   this.liveStreams.push({ id: this.liveStreams.length, url, selected: false})
  //   this.setupHls(url, this.liveStreams.length - 1) 
  // }
}

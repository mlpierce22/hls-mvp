import { Component, AfterViewInit } from '@angular/core';
import Hls from 'hls.js'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
 
  width: number = 250;
  height: number = 200;

  liveStreams: Array<{id: number, url: string, selected: boolean}> = new Array<{id: number, url: string, selected: boolean}>();

  liveStreamURLs = [
    "https://playertest.longtailvideo.com/adaptive/wowzaid3/playlist.m3u8",
    "https://playertest.longtailvideo.com/adaptive/captions/playlist.m3u8",
    "https://playertest.longtailvideo.com/adaptive/oceans_aes/oceans_aes.m3u8",
    "https://b028.wpc.azureedge.net/80B028/Samples/0e8848ca-1db7-41a3-8867-fe911144c045/d34d8807-5597-47a1-8408-52ec5fc99027.ism/Manifest(format=m3u8-aapl-v3)",
  ]
  
  ngOnInit(): void {
    for (let i = 0; i < 16; i++) {
      const randNum = Math.floor(Math.random() * this.liveStreamURLs.length - 1) + 1
      let url = this.liveStreamURLs[randNum]
      this.liveStreams.push({ id: i, url, selected: false})
    }

    this.liveStreams.forEach((stream: any) => this.setupHls(stream.url, stream.id))
  }

  setupHls(manifestURL, id) {
    let exists = setInterval(function() {
    if (document.getElementById("live-stream-" + id)) {
      clearInterval(exists);
      let video = document.getElementById("live-stream-" + id) as HTMLVideoElement
      video.muted = true
      video.controls = false
      video.loop = true
      if (Hls.isSupported()) {
        let hls = new Hls();
        let retries = { network: 0, media: 0 }
        hls.on(Hls.Events.ERROR, (event, data) => {
          // Note: I grabbed this straight from the docs for hls.js
          if (data.fatal) {
            switch(data.type) {
              case Hls.ErrorTypes.NETWORK_ERROR && retries.network < 2:
              // try to recover network error
                hls.startLoad();
                retries.network++;
                break;
              case Hls.ErrorTypes.MEDIA_ERROR && retries.media < 2:
                hls.recoverMediaError();
                retries.media++;
                break;
              default:
                // cannot recover
                hls.destroy();
                break;
            }
          }
        })

        hls.attachMedia(video)
        hls.on(Hls.Events.MEDIA_ATTACHED, () => {
          hls.loadSource(manifestURL);
          hls.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
            //console.log(data)
          });
        })
      }
      else if (video.canPlayType('application/vnd.apple.mpegurl'))
      {
        video.src = manifestURL
      }
    }
   }, 100);
    
  }

  /** Allows users to highlight multiple streams to delete */
  toggleHighlight(index) {
    this.liveStreams[index].selected = !this.liveStreams[index].selected
  }

  /** Handles delete stream click event */
  deleteStreams() {
    let tempStream = this.liveStreams.filter(stream => !stream.selected);
    this.liveStreams = tempStream;
  }

  /** Handles add stream click event */
  addStream() {
    const randNum = Math.floor(Math.random() * this.liveStreamURLs.length - 1) + 1
    let url = this.liveStreamURLs[randNum]
    this.liveStreams.push({ id: this.liveStreams.length, url, selected: false})
    this.setupHls(url, this.liveStreams.length - 1) 
  }
}

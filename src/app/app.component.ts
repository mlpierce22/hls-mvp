import { Component, AfterViewInit } from '@angular/core';
import Hls from 'hls.js'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
 
  width: number = 250;
  height: number = 200;

  liveStreams: Array<{}> = new Array<{}>();

  liveStreamURLs = [
    "https://b028.wpc.azureedge.net/80B028/SampleStream/595d6b9a-d98e-4381-86a3-cb93664479c2/b722b983-af65-4bb3-950a-18dded2b7c9b.ism/Manifest(format=m3u8-aapl-v3)",
    "https://playertest.longtailvideo.com/adaptive/wowzaid3/playlist.m3u8",
    "https://playertest.longtailvideo.com/adaptive/captions/playlist.m3u8",
    "https://playertest.longtailvideo.com/adaptive/oceans_aes/oceans_aes.m3u8",
    "https://b028.wpc.azureedge.net/80B028/Samples/0e8848ca-1db7-41a3-8867-fe911144c045/d34d8807-5597-47a1-8408-52ec5fc99027.ism/Manifest(format=m3u8-aapl-v3)",
  ]
  
  ngOnInit(): void {
    for (let i = 0; i < 16; i++) {
      const randNum = Math.floor(Math.random() * this.liveStreamURLs.length - 1) + 1
      let url = this.liveStreamURLs[randNum]
      this.liveStreams.push({ id: i, url})
    }
  }

  ngAfterViewInit(): void {
    this.liveStreams.forEach((stream: any) => this.setupHls(stream.url, stream.id))
  }

  setupHls(manifestURL, id) {
    let video = document.getElementById("live-stream-" + id) as HTMLVideoElement
    video.muted = true
    video.controls = false
    video.loop = true
    if (Hls.isSupported()) {
      let hls = new Hls();
      hls.attachMedia(video)
      hls.on(Hls.Events.MEDIA_ATTACHED, () => {
        console.log("url:", manifestURL, id)
        hls.loadSource(manifestURL);
        hls.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
          console.log(data)
        });
      })
    }
    else if (video.canPlayType('application/vnd.apple.mpegurl'))
    {
      video.src = manifestURL
    }
  }
}

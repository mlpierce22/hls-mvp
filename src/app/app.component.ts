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
    "http://sample.vodobox.com/skate_phantom_flex_4k/skate_phantom_flex_4k.m3u8",
    "http://sample.vodobox.com/pipe_dream_tahiti/pipe_dream_tahiti.m3u8",
    "http://sample.vodobox.com/we_are_blood_4k/we_are_blood_4k.m3u8",
    "http://sample.vodobox.com/caminandes_1_4k/caminandes_1_4k.m3u8",
    "http://sample.vodobox.com/big_buck_bunny_4k/big_buck_bunny_4k.m3u8",
    "http://playertest.longtailvideo.com/adaptive/oceans_aes/oceans_aes.m3u8",
    "http://playertest.longtailvideo.com/adaptive/captions/playlist.m3u8",
  ]
  
  ngOnInit(): void {
    for (let i = 0; i < 16; i++) {
      const randNum = Math.floor(Math.random() * this.liveStreamURLs.length - 1) + 1
      console.log("rand num: ", randNum)
      let url = this.liveStreamURLs[randNum]
      console.log("url", url)
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

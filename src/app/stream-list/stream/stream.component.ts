import { Component, OnInit } from '@angular/core';
import Hls from 'hls.js'

@Component({
  selector: 'app-stream',
  templateUrl: './stream.component.html',
  styleUrls: ['./stream.component.scss']
})
export class StreamComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  setupHls(manifestURL, id) {
    let exists = setInterval(function() {
    if (document.getElementById("live-stream-" + id)) {
      clearInterval(exists);
      let video = document.getElementById("live-stream-" + id) as HTMLVideoElement
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
          video.muted = true
          video.controls = false
          video.loop = true
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

}

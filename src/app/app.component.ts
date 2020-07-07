import { Component } from '@angular/core';
import Hls from 'hls.js'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
 
  width: number = 500;
  height: number = 500;
  
  ngOnInit(): void {
    const URL = "http://sample.vodobox.com/skate_phantom_flex_4k/skate_phantom_flex_4k.m3u8"
    this.setupHls(URL)

    /** Some other URL's you could use */
    /*
      http://sample.vodobox.com/skate_phantom_flex_4k/skate_phantom_flex_4k.m3u8
      http://sample.vodobox.com/planete_interdite_hevc/planete_interdite_hevc.m3u8
      http://sample.vodobox.com/pipe_dream_tahiti/pipe_dream_tahiti.m3u8
      http://sample.vodobox.com/we_are_blood_4k/we_are_blood_4k.m3u8
      http://sample.vodobox.com/caminandes_1_4k/caminandes_1_4k.m3u8
      http://sample.vodobox.com/big_buck_bunny_4k/big_buck_bunny_4k.m3u8
      http://playertest.longtailvideo.com/adaptive/oceans_aes/oceans_aes.m3u8
      http://playertest.longtailvideo.com/adaptive/captions/playlist.m3u8
    */
  }

  setupHls(manifestURL) {
    let video = document.getElementById("live-stream")
    if (Hls.isSupported()) {
      let hls = new Hls();
      hls.attachMedia(video)
      hls.on(Hls.Events.MEDIA_ATTACHED, () => {
        hls.loadSource(manifestURL);
        hls.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
          console.log(data)
        });
      })
    }
    else {
      // TODO: implement canPlay for video (if the browser supports playing
      // the m3u8 file directly)
      console.log("fail")
    }
  }
}

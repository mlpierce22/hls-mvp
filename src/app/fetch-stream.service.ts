import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FetchStreamService {

  constructor() { }

  fetch() {


    return [
      "https://playertest.longtailvideo.com/adaptive/wowzaid3/playlist.m3u8",
      "https://playertest.longtailvideo.com/adaptive/captions/playlist.m3u8",
      "https://playertest.longtailvideo.com/adaptive/oceans_aes/oceans_aes.m3u8",
      "https://b028.wpc.azureedge.net/80B028/Samples/0e8848ca-1db7-41a3-8867-fe911144c045/d34d8807-5597-47a1-8408-52ec5fc99027.ism/Manifest(format=m3u8-aapl-v3)",
      "https://playertest.longtailvideo.com/adaptive/captions/playlist.m3u8",
      "https://playertest.longtailvideo.com/adaptive/oceans_aes/oceans_aes.m3u8",
    ]
  }
}

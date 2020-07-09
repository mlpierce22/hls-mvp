import { Injectable } from '@angular/core';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FetchStreamService {

  constructor() { }

  /** Fetch the m3u8 based on an api key (TODO: FURTHER DEFINE THIS!) */
  public fetch() {
    // TODO: fetch the actual m3u8 based on the api key
    return of([
      "https://playertest.longtailvideo.com/adaptive/wowzaid3/playlist.m3u8",
      "https://playertest.longtailvideo.com/adaptive/captions/playlist.m3u8",
      "https://playertest.longtailvideo.com/adaptive/oceans_aes/oceans_aes.m3u8",
      "https://b028.wpc.azureedge.net/80B028/Samples/0e8848ca-1db7-41a3-8867-fe911144c045/d34d8807-5597-47a1-8408-52ec5fc99027.ism/Manifest(format=m3u8-aapl-v3)",
      "https://playertest.longtailvideo.com/adaptive/captions/playlist.m3u8",
      "https://playertest.longtailvideo.com/adaptive/oceans_aes/oceans_aes.m3u8",
    ])
  }
}

import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';
import { LiveStream } from './app.models';

@Injectable({
  providedIn: 'root'
})
export class FetchStreamService {

  constructor() { }

  /** Fetch the m3u8 and metaData based on an api key (TODO: FURTHER DEFINE THIS!) */
  public fetch(): Observable<Partial<LiveStream>[]> {
    // TODO: fetch the actual m3u8 based on the api key
    return of([
      {
        manifestUrl: "https://playertest.longtailvideo.com/adaptive/wowzaid3/playlist.m3u8",
        online: true,
        cameraName: "Long Tail Video - Captions",
        timeStamp: Date.now(),
        labels: ['HQ', 'San Mateo', 'Work'],
      },
      {
        manifestUrl: "https://playertest.longtailvideo.com/adaptive/captions/playlist.m3u8",
        online: true,
        cameraName: "Long Tail Video - Captions",
        timeStamp: Date.now(),
        labels: ['HQ', 'San Mateo', 'Work'],
      },
      {
        manifestUrl: "https://playertest.longtailvideo.com/adaptive/oceans_aes/oceans_aes.m3u8",
        online: true,
        cameraName: "Long Tail Video - Oceans",
        timeStamp: Date.now(),
        labels: ['HQ', 'San Mateo', 'Work'],
      },
      {
        manifestUrl: "https://b028.wpc.azureedge.net/80B028/Samples/0e8848ca-1db7-41a3-8867-fe911144c045/d34d8807-5597-47a1-8408-52ec5fc99027.ism/Manifest(format=m3u8-aapl-v3)",
        online: true,
        cameraName: "Azure Edge",
        timeStamp: Date.now(),
        labels: ['HQ', 'San Mateo', 'Work'],
      },
    ])
  }

  public fetchImage(cameraId: number): Observable<string> {
    
    const photos = [
      //"https://source.unsplash.com/random/456x267"
      "https://images.unsplash.com/photo-1592763022445-f31297d51d3a?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=267&ixlib=rb-1.2.1&q=80&w=456",
      "https://images.unsplash.com/photo-1594809810374-2a79fe387e7d?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=267&ixlib=rb-1.2.1&q=80&w=456",
      "https://images.unsplash.com/photo-1593205804269-118584b0860e?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=267&ixlib=rb-1.2.1&q=80&w=456",
      "https://images.unsplash.com/photo-1593145141686-e342b4f0729d?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=267&ixlib=rb-1.2.1&q=80&w=456",
      "https://images.unsplash.com/photo-1594749794764-717b02dbb530?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=267&ixlib=rb-1.2.1&q=80&w=456",
      "https://images.unsplash.com/photo-1593443320566-1fcb1a3d2ca5?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=267&ixlib=rb-1.2.1&q=80&w=456",

    ]
    const startIndex = Math.floor(Math.random() * (cameraId + Math.random() * 100)) % 6
    console.log("choosing:", startIndex)
    return of(photos[startIndex])
  }
}

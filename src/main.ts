import 'hammerjs';
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
// TODO: Change path: could this be an http request??
import "../elements/camio-stream.js"

if (environment.production) {
  enableProdMode();
}

import { ɵWebAnimationsDriver } from '@angular/animations/browser';
ɵWebAnimationsDriver.prototype.containsElement = (el1: any, el2: any) => {
  // Travel up the tree to the root node.
  let elem = el2;
  while (elem && elem !== document.documentElement) {
    if (elem === el1)
      return true;
    elem = elem.parentNode || elem.host;
  }
  return false;
};

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));

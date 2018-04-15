import { Injectable } from '@angular/core';

function getWindow (): any {
  return window;
}

@Injectable()
export class UtilsService {
  get nativeWindow (): any {
    return getWindow();
  }
}

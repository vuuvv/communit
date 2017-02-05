import { Component, Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

export type UnsafeType = 'url' | 'style' | 'html' | 'script' | 'resourceUrl';

@Pipe({
  name: 'unsafe',
})
export class UnSafePipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {
  }

  transform(value: string, type: UnsafeType = 'style'):any {
    switch (type) {
      case 'url':
        return this.sanitizer.bypassSecurityTrustUrl(value);
      case 'style':
        return this.sanitizer.bypassSecurityTrustStyle(value);
      case 'html':
        return this.sanitizer.bypassSecurityTrustHtml(value);
      case 'html':
        return this.sanitizer.bypassSecurityTrustScript(value);
      case 'resourceUrl':
        return this.sanitizer.bypassSecurityTrustResourceUrl(value);
      default:
        throw new Error(`unsafe type should be one of ('url', 'style', 'html', 'script', 'resourceUrl'), but now is '${type}'`);
    }
  }
}

import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[vRepeat]',
})
export class RepeatDirective {
  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainerRef: ViewContainerRef
  ) {
  }

  @Input('vRepeat') set count(c: number) {
    this.viewContainerRef.clear();
    for (let i = 0; i < c; i++) {
      this.viewContainerRef.createEmbeddedView(this.templateRef);
    }
  }
}

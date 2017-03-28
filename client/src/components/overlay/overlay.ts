import {
 Type,
 Component,
 Directive,
 Input,
 ViewContainerRef,
 EventEmitter,
 ViewEncapsulation,
 ComponentFactoryResolver,
 OnInit,
} from '@angular/core';

import { OverlayService, OverlayConfig } from './overlay.service';

const OVERLAY_ID_KEY: string = '$$OVERLAY_ID_KEY$$';

@Directive({selector: "v-overlay-component"})
export class OverlayComponent implements OnInit {
  @Input('config') config: OverlayConfig;

  constructor(
    private overlayService: OverlayService,
    private viewContainerRef: ViewContainerRef,
    private componentFactoryResolver: ComponentFactoryResolver) {
  }

  ngOnInit() {
    let componentfactory = this.componentFactoryResolver.resolveComponentFactory(this.config.componentType);
    let componentRef = this.viewContainerRef.createComponent(componentfactory);
    // let componentRef = this.componentBuilder.createComponent(this.config.componentType, this.viewContainerRef);
    let instance = componentRef.instance;
    let data = this.config.data;
    if (data) {
      for (let key in data) {
        instance[key] = data[key];
      }
    }
    instance[OVERLAY_ID_KEY] = this.config.id;
    this.config.instance = instance;
    this.overlayService.instance(this.config);
  }

  confirm() {
  }

  alert() {
  }
}

@Component({
  selector: 'v-overlay',
  templateUrl: './overlay.html',
})
export class Overlay implements OnInit {
  overlayConfigs: OverlayConfig[] = [];
  actionsheet: boolean = false;

  showToast: boolean = false;
  toastText: string = "";
  toastIcon: string = "";

  constructor(private overlayService: OverlayService) {
  }

  ngOnInit() {
    this.overlayService.getNewEvent().subscribe((config) => {
      this.overlayConfigs.push(config);
    });

    this.overlayService.getCloseEvent().subscribe((component) => {
      if (component) {
        let id = component[OVERLAY_ID_KEY];
        let index = this.overlayConfigs.findIndex((c) => {
          return c.id === id;
        });
        this.overlayConfigs.splice(index, 1);
      } else {
        this.overlayConfigs = [];
      }
    });

    this.overlayService.getToastEvent().subscribe((config) => {
      if (!config.show) {
        this.showToast = false;
        return;
      }
      this.showToast = config.show;
      this.toastText = config.text;
      this.toastIcon = config.icon;

      if (config.duration) {
        setTimeout(() => {
          this.showToast = false;
        }, config.duration)
      }
    });

    this.overlayService.getActionSheetEvent().subscribe((show) => {
      this.actionsheet = show;
    });
  }

  get toastBlock(): string {
    if (this.showToast) {
      return 'block';
    } else {
      return 'none';
    }
  }

  get iconClass(): string {
    return `${this.toastIcon} weui-icon_toast`;
  }

  closeActionSheet() {
    this.actionsheet = false;
  }
}


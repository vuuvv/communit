import { Component, Input, OnInit, Output, EventEmitter }  from '@angular/core';
import { FormGroup }                 from '@angular/forms';

import { InputBase }              from './input-base';
import { ControlService }    from './control.service';

@Component({
  selector: 'dynamic-form',
  templateUrl: './dynamic-form.html',
  providers: [ ControlService ]
})
export class DynamicFormComponent implements OnInit {

  @Input() inputs: InputBase<any>[] = [];
  @Output() submit = new EventEmitter();
  form: FormGroup;
  payLoad = '';

  constructor(private controlService: ControlService) {  }

  ngOnInit() {
    this.form = this.controlService.toFormGroup(this.inputs);
  }

  onSubmit() {
    this.submit.emit(this.form.value);
  }

  change(event) {
    console.log(event);
  }

  getOptions(target) {
    if (!this.inputs || !this.inputs.length) {
      return [];
    }

    let input: any = this.inputs.find((value) => value.key === target);
    if (!input) {
      return [];
    }
    let opt = input.options.find((value) => value.key === this.form.value[input.key]);
    if (!opt) {
      return [];
    }

    return opt.children;
  }
}

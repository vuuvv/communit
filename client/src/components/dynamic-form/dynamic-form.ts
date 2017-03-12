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
}

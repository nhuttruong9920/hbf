import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, AbstractControlDirective } from '@angular/forms';

type ErrorMessage = {
  validator: string;
  message: string;
  desiredValue?: string;
};

@Component({
  selector: 'app-error-message',
  templateUrl: './form-error-message.component.html',
  styleUrl: './form-error-message.component.scss',
  standalone: true,
  imports: [],
})
export class FormErrorMessageComponent implements OnInit {
  @Input()
  control!: AbstractControl | AbstractControlDirective;
  errorConfig: ErrorMessage[] = [];

  constructor() {}

  ngOnInit(): void {
    this.initErrorConfig();
  }

  private initErrorConfig(): void {
    this.errorConfig = [
      { validator: 'required', message: 'Bắt buộc' },
      {
        validator: 'minlength',
        message: 'Kí tự tối thiểu',
        desiredValue: 'requiredLength',
      },
      {
        validator: 'maxlength',
        message: 'Kí tự tối đa',
        desiredValue: 'requiredLength',
      },
      { validator: 'pattern', message: 'Không hợp lệ' },
      {
        validator: 'min',
        message: 'Giá trị tối thiểu',
        desiredValue: 'min',
      },
      {
        validator: 'max',
        message: 'Giá trị tối đa',
        desiredValue: 'max',
      },
      { validator: 'email', message: 'Email không hợp lệ' },
      { validator: 'phone', message: 'Số điện thoại không hợp lệ' },
    ];
  }

  hasError(): boolean {
    return (this.control && this.control.errors && this.control.dirty) ?? false;
  }
}

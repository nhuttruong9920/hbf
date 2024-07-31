import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

import { ButtonModule } from 'primeng/button';
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { Subject, takeUntil } from 'rxjs';
import { FormErrorMessageComponent } from '@shared/component/form-error-message/form-error-message.component';
import { ImgFallbackDirective } from '@shared/directive/img-fallback.directive';
import { ApiService } from '@shared/service/api.service';
import { BaseApiResponse } from '@shared/type/api.type';
import { Category } from '../category.type';
import { ImgCropperComponent } from '@shared/component/img-cropper/img-cropper.component';


@Component({
  selector: 'app-create-category',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    InputSwitchModule,
    InputNumberModule,
    FormErrorMessageComponent,
    ImgFallbackDirective,
  ],
  templateUrl: './category-modal.component.html',
  styleUrl: './category-modal.component.scss',
})
export class CategoryModalComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject<void>();

  categoryId: number = 0;
  categoryForm!: FormGroup;

  imageSelectionConfigRef: DynamicDialogRef | undefined;
  selectedImage: string = '';

  loading: boolean = false;
  errorMsg: string = '';

  constructor(
    private fb: FormBuilder,
    private config: DynamicDialogConfig,
    private apiService: ApiService,
    private ref: DynamicDialogRef,
    private dialogService: DialogService
  ) {}

  ngOnInit() {
    this.categoryId = this.config.data;
    if (this.categoryId) {
      this.fetchCategory(this.categoryId);
    }
    this.initCreateForm();
  }

  private fetchCategory(categoryId: number): void {
    this.apiService
      .get(`/admin/categories/${categoryId}`)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (response: BaseApiResponse<Category>) => {
          if (!response.error) {
            this.categoryForm.patchValue(response.data ?? {});
          }
        },
        error: () => {
          console.log('error');
        },
      });
  }

  private initCreateForm() {
    this.categoryForm = this.fb.group({
      id: [0, Validators.required],
      title: ['', Validators.required],
      description: ['', Validators.required],
      url: [''],
      tag: [''],
      visible: [true, Validators.required],
    });
  }

  onSubmit(): void {
    if (this.categoryId) {
      this.updateCategory();
    } else {
      this.createCategory();
    }
  }

  private createCategory() {
    this.apiService
      .post('/admin/categories/create', this.categoryForm.value)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: () => {
          this.ref.close(true);
        },
        error: (response: HttpErrorResponse) => {
          this.errorMsg = response.error?.error?.msg ?? '';
        },
      });
  }

  private updateCategory() {
    this.apiService
      .put(`/admin/categories/update`, this.categoryForm.value)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: () => {
          this.ref.close(true);
        },
        error: (response: HttpErrorResponse) => {
          this.errorMsg = response.error?.error?.msg ?? '';
        },
      });
  }

  onOpenImageSelectionModal(event: Event): void {
    event.preventDefault();
    this.imageSelectionConfigRef = this.dialogService.open(
      ImgCropperComponent,
      {
        header: 'Chọn hình',
        width: '50vw',
        data: { imageType: 0 },
        breakpoints: {
          '992px': '80vw',
          '768px': '90vw',
          '576px': '98vw',
        },
      }
    );

    this.imageSelectionConfigRef.onClose
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data: string) => {
        if (data) {
          this.selectedImage = data;
          this.categoryForm.patchValue({ url: data });
        }
      });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}

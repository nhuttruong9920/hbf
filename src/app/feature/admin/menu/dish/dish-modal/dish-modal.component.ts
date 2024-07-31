import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FormErrorMessageComponent } from '@shared/component/form-error-message/form-error-message.component';
import { ImgFallbackDirective } from '@shared/directive/img-fallback.directive';

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
import { Category, CategoryCompact } from '../../category/category.type';
import { ApiService } from '@shared/service/api.service';
import { BaseApiResponse } from '@shared/type/api.type';
import { Dish } from '../dish.type';
import { ImgCropperComponent } from '@shared/component/img-cropper/img-cropper.component';
import { CategorySelectionComponent } from '../../category/category-selection/category-selection.component';

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
  templateUrl: './dish-modal.component.html',
  styleUrl: './dish-modal.component.scss',
})
export class DishModalComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject<void>();

  dishForm!: FormGroup;
  dishId: number = 0;

  loading: boolean = false;

  imageSelectionConfigRef: DynamicDialogRef | undefined;
  selectedImage: string = '';

  categorySelectionConfigRef: DynamicDialogRef | undefined;
  categoryCompacts: CategoryCompact[] = []; //input

  constructor(
    private fb: FormBuilder,
    private config: DynamicDialogConfig,
    private apiService: ApiService,
    private ref: DynamicDialogRef,
    private dialogService: DialogService
  ) {}

  ngOnInit() {
    this.dishId = this.config.data;
    if (this.dishId) {
      this.fetchDish(this.dishId);
    }
    this.initForm();
  }

  private fetchDish(id: number): void {
    this.apiService
      .get(`/admin/dishes/${id}`)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (response: BaseApiResponse<Dish>) => {
          if (!response.error) {
            this.categoryCompacts = response.data?.categories ??[];
            this.dishForm.patchValue({
              ...response.data,
              price: response.data?.price.currentPrice,
            });
          }
        },
        error: () => {
          console.log('error');
        },
      });
  }

  private initForm() {
    this.dishForm = this.fb.group({
      categories: [[]],
      title: ['', Validators.required],
      description: ['', Validators.required],
      price: [0, Validators.required],
      unit: ['', Validators.required],
      url: [''],
      tag: [''],
      visible: [true, Validators.required],
    });
  }

  onSubmit(): void {
    if (this.dishId) {
      this.updateCategory();
    } else {
      this.createCategory();
    }
  }

  private createCategory() {
    const categoryIds = this.categoryCompacts.map((category) => category.id);
    this.dishForm.patchValue({ categories: categoryIds });

    this.apiService
      .post('/admin/dishes/create', this.dishForm.value)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: () => {
          this.ref.close(true);
        },
        error: () => {
          console.log('error');
        },
      });
  }

  private updateCategory(): void {
    const categoryIds = this.categoryCompacts.map((category) => category.id);
    this.dishForm.patchValue({ categories: categoryIds });
    this.dishForm.addControl('id', this.fb.control(this.dishId));

    this.apiService
      .put(`/admin/dishes/update`, this.dishForm.value)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: () => {
          this.ref.close(true);
        },
        error: () => {
          console.log('error');
        },
      });
  }

  onOpenCategorySelectionModal(event: Event): void {
    event.preventDefault();
    this.categorySelectionConfigRef = this.dialogService.open(
      CategorySelectionComponent,
      {
        header: 'Chọn danh mục',
        width: '50vw',
        height: '70vh',
        breakpoints: {
          '992px': '80vw',
          '768px': '90vw',
          '576px': '98vw',
        },
        data: {
          categoryCompacts: this.categoryCompacts,
        },
      }
    );

    this.categorySelectionConfigRef.onClose
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data: Category[]) => {
        if (data) {
          this.categoryCompacts = data.map((category) => ({
            id: category.id,
            title: category.title,
            tag: category.tag,
          }));
        }
      });
  }

  onOpenImageSelectionModal(event: Event): void {
    event.preventDefault();
    this.imageSelectionConfigRef = this.dialogService.open(
      ImgCropperComponent,
      {
        header: 'Chọn hình',
        width: '50vw',
        // height: '70vh',
        breakpoints: {
          '992px': '80vw',
          '768px': '90vw',
          '576px': '98vw',
        },
        data: { imageType: 1 },
      }
    );

    this.imageSelectionConfigRef.onClose
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data: string) => {
        if (data) {
          this.selectedImage = data;
          this.dishForm.patchValue({ url: this.selectedImage });
        }
      });
  }

  onRemoveCategory(id: number) {
    this.categoryCompacts = this.categoryCompacts.filter(
      (category) => category.id !== id
    );
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}

import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpResponse } from '@angular/common/http';

import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { Subject, takeUntil } from 'rxjs';
import { DebounceDirective } from '@shared/directive/debounce.directive';
import { ToLocaleStringPipe } from '@shared/pipe/to-locale-string.pipe';
import { ImgFallbackDirective } from '@shared/directive/img-fallback.directive';
import { Category, CategoryRequest } from './category.type';
import { BaseApiResponse, XPaging } from '@shared/type/api.type';
import { ApiService } from '@shared/service/api.service';
import { CategoryModalComponent } from './category-modal/category-modal.component';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [
    ButtonModule,
    TableModule,
    InputSwitchModule,
    FormsModule,
    ConfirmPopupModule,
    CheckboxModule,
    InputTextModule,
    DebounceDirective,
    ToLocaleStringPipe,
    ImgFallbackDirective,
  ],
  templateUrl: './category.component.html',
  styleUrl: './category.component.scss',
  providers: [DialogService, ConfirmationService],
})
export class CategoryComponent {
  private ngUnsubscribe = new Subject<void>();

  categories: Category[] = [];
  categoryRequest: CategoryRequest = {
    pageIndex: 1,
    pageSize: 50,
    orderBy: '',
    searchTerm: '',
    isDeleted: false,
  };

  xPaging!: XPaging;
  totalRecords: number = 0;

  //! UI
  categoryLoading: boolean = false;

  constructor(
    private apiService: ApiService,
    private dialogService: DialogService,
    private confirmationService: ConfirmationService
  ) {}

  createConfigRef: DynamicDialogRef | undefined;

  ngOnInit(): void {}

  onLoadCategories(event: TableLazyLoadEvent): void {
    let pageIndex = 0;
    if (event.rows && event.first) {
      pageIndex = event.first / event.rows + 1;
    }
    this.categoryRequest.pageIndex = pageIndex;
    this.categoryRequest.pageSize = event.rows ?? 10;
    this.fetchCategories();
  }

  fetchCategories(): void {
    this.categoryLoading = true;
    this.apiService
      .post('/admin/categories', this.categoryRequest)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (response: HttpResponse<BaseApiResponse<Category[]>>) => {
          if (response && response.body) {
            this.categories = response.body.data ?? [];
          }
          const xPaging = response.headers.get('x-paging');
          if (xPaging) {
            this.xPaging = JSON.parse(xPaging);
            this.totalRecords = this.xPaging.TotalItems
              ? this.xPaging.TotalItems
              : 0;
          }

          this.categoryLoading = false;
        },
        error: () => {
          this.categoryLoading = false;
        },
      });
  }

  onOpenModal(id: number | undefined = undefined): void {
    this.createConfigRef = this.dialogService.open(CategoryModalComponent, {
      header: id ? 'Sửa danh mục' : 'Tạo danh mục',
      width: '50vw',
      breakpoints: {
        '992px': '80vw',
        '768px': '90vw',
        '576px': '98vw',
      },
      data: id,
    });
    this.createConfigRef.onClose
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data: boolean) => {
        if (data) {
          this.fetchCategories();
        }
      });
  }

  onConfirmDelete(event: Event, id: number) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Xoá danh mục?',
      icon: 'far fa-question-circle',
      acceptLabel: 'Xác nhận',
      rejectLabel: 'Huỷ',
      accept: () => {
        this.fetchDeleteCategory(id);
      },
      reject: () => {},
    });
  }

  onConfirmRestore(event: Event, id: number) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Khôi phục danh mục?',
      icon: 'far fa-question-circle',
      acceptLabel: 'Khôi phục',
      rejectLabel: 'Huỷ',
      accept: () => {
        this.fetchRestoreCategory(id);
      },
      reject: () => {},
    });
  }

  private fetchDeleteCategory(id: number): void {
    this.apiService
      .delete(`/admin/categories/${id}`)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (response: BaseApiResponse<string>) => {
          if (!response.error) {
            this.fetchCategories();
          }
        },
      });
  }

  private fetchRestoreCategory(id: number): void {
    this.apiService
      .put(`/admin/categories/restore/${id}`)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (response: BaseApiResponse<string>) => {
          if (!response.error) {
            this.fetchCategories();
          }
        },
      });
  }

  onSearchCategory(event: string): void {
    this.categoryRequest.searchTerm = event;
    this.categoryRequest.pageIndex = 1;
    this.fetchCategories();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}

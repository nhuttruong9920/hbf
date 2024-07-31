
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ImgFallbackDirective } from '@shared/directive/img-fallback.directive';

import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { Subject, takeUntil } from 'rxjs';
import { Category, CategoryCompact, CategoryRequest } from '../category.type';
import { BaseApiResponse, XPaging } from '@shared/type/api.type';
import { ApiService } from '@shared/service/api.service';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-category-selection',
  standalone: true,
  imports: [
    TableModule,
    CheckboxModule,
    FormsModule,
    ButtonModule,
    PaginatorModule,
    ImgFallbackDirective,
  ],
  templateUrl: './category-selection.component.html',
  styleUrl: './category-selection.component.scss',
})
export class CategorySelectionComponent {
  private ngUnsubscribe = new Subject<void>();

  //! Selection
  categories: Category[] = [];
  selectedCategories: Category[] = [];
  categoryCompacts: CategoryCompact[] = [];
  categoryRequest: CategoryRequest = {
    pageIndex: 1,
    pageSize: 50,
    orderBy: '',
    searchTerm: '',
    isDeleted: false,
  };
  xPaging!: XPaging;
  totalRecords: number = 0;

  constructor(
    private apiService: ApiService,
    private ref: DynamicDialogRef,
    private config: DynamicDialogConfig
  ) {}

  ngOnInit(): void {
    this.fetchCategories();

    this.categoryCompacts = this.config.data.categoryCompacts;
  }

  onLoadCategories(event: TableLazyLoadEvent): void {
    let pageIndex = 0;
    if (event.rows && event.first) {
      pageIndex = event.rows / event.first + 1;
    }
    this.categoryRequest.pageIndex = pageIndex;
    this.categoryRequest.pageSize = event.rows ?? 10;
    this.fetchCategories();
  }

  fetchCategories(): void {
    this.apiService
      .post('/admin/categories', this.categoryRequest)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (response: HttpResponse<BaseApiResponse<Category[]>>) => {
          if (response?.body) {
            this.categories = response.body.data ?? [];
          }
          const xPaging = response.headers.get('x-paging');
          if (xPaging) {
            this.xPaging = JSON.parse(xPaging);
            this.totalRecords = this.xPaging.TotalItems
              ? this.xPaging.TotalItems
              : 0;
          }
          if (this.categoryCompacts?.length > 0) {
            this.selectedCategories = this.categoryCompacts?.map((compact) => {
              const category = this.categories.find(
                (category) => category.id === compact.id
              );
              return category ?? ({} as Category);
            });
          }
        },
      });
  }

  onSelectCategory(category: Category): void {
    const isSelecated = this.onCheckSelecated(category);
    if (isSelecated) {
      this.selectedCategories = this.selectedCategories.filter(
        (selectedCategory) => selectedCategory.id !== category.id
      );
    } else {
      this.selectedCategories.push(category);
    }
  }

  onCheckSelecated(category: Category): boolean {
    return this.selectedCategories.some(
      (selectedCategory) => selectedCategory.id === category.id
    );
  }

  onPageChange(event: PaginatorState): void {
    this.categoryRequest.pageIndex = event.page ? event.page + 1 : 1;
    this.fetchCategories();
  }

  onConfirmSelection(): void {
    this.ref.close(this.selectedCategories);
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}

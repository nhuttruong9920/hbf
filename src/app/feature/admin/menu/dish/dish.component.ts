import { HttpResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DebounceDirective } from '@shared/directive/debounce.directive';
import { ImgFallbackDirective } from '@shared/directive/img-fallback.directive';
import { ToLocaleStringPipe } from '@shared/pipe/to-locale-string.pipe';

import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { Subject, takeUntil } from 'rxjs';
import { Dish, DishRequest } from './dish.type';
import { BaseApiResponse, XPaging } from '@shared/type/api.type';
import { ApiService } from '@shared/service/api.service';
import { DishModalComponent } from './dish-modal/dish-modal.component';

@Component({
  selector: 'app-dish',
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
  templateUrl: './dish.component.html',
  styleUrl: './dish.component.scss',
  providers: [DialogService, ConfirmationService],
})
export class DishComponent {
  private ngUnsubscribe = new Subject<void>();

  dishes: Dish[] = [];
  dishRequest: DishRequest = {
    pageIndex: 1,
    pageSize: 50,
    orderBy: '',
    searchTerm: '',
    isDeleted: false,
  };

  xPaging!: XPaging;
  totalRecords: number = 0;

  //! UI
  dishLoading: boolean = false;

  constructor(
    private apiService: ApiService,
    private dialogService: DialogService,
    private confirmationService: ConfirmationService
  ) {}

  createConfigRef: DynamicDialogRef | undefined;

  ngOnInit(): void {}

  onLoadDishes(event: TableLazyLoadEvent): void {
    let pageIndex = 0;
    if (event.rows && event.first) {
      pageIndex = event.first / event.rows + 1;
    }
    this.dishRequest.pageIndex = pageIndex;
    this.dishRequest.pageSize = event.rows ?? 10;
    this.fetchDishes();
  }

  fetchDishes(): void {
    this.dishLoading = true;
    this.apiService
      .post('/admin/dishes', this.dishRequest)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (response: HttpResponse<BaseApiResponse<Dish[]>>) => {
          if (response && response.body) {
            this.dishes = response.body.data ?? [];
          }

          const xPaging = response.headers.get('x-paging');
          if (xPaging) {
            this.xPaging = JSON.parse(xPaging);
            this.totalRecords = this.xPaging.TotalItems
              ? this.xPaging.TotalItems
              : 0;
          }
          this.dishLoading = false;
        },
        error: () => {
          this.dishLoading = false;
        },
      });
  }

  onOpenModal(id: number | undefined = undefined): void {
    this.createConfigRef = this.dialogService.open(DishModalComponent, {
      header: id ? 'Sửa món ăn' : 'Tạo món ăn',
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
      .subscribe((data: BaseApiResponse<string>) => {
        if (data) {
          this.fetchDishes();
        }
      });
  }

  onConfirmDelete(event: Event, id: number) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Xoá món ăn?',
      icon: 'far fa-question-circle',
      acceptLabel: 'Xác nhận',
      rejectLabel: 'Huỷ',
      accept: () => {
        this.fetchDelete(id);
      },
      reject: () => {},
    });
  }

  onConfirmRestore(event: Event, id: number) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Khôi phục món ăn?',
      icon: 'far fa-question-circle',
      acceptLabel: 'Khôi phục',
      rejectLabel: 'Huỷ',
      accept: () => {
        this.fetchRestoreDish(id);
      },
      reject: () => {},
    });
  }

  private fetchDelete(id: number): void {
    this.apiService
      .delete(`/admin/dishes/${id}`)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (response: BaseApiResponse<string>) => {
          if (!response.error) {
            this.fetchDishes();
          }
        },
      });
  }

  private fetchRestoreDish(id: number): void {
    this.apiService
      .put(`/admin/dishes/restore/${id}`)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (response: BaseApiResponse<string>) => {
          if (!response.error) {
            this.fetchDishes();
          }
        },
      });
  }

  onSearchDish(event: string): void {
    this.dishRequest.searchTerm = event;
    this.dishRequest.pageIndex = 0;
    this.fetchDishes();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}

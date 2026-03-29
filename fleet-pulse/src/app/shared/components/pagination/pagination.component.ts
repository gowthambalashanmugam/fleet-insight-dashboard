import { Component, computed, input, model } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss',
})
export class PaginationComponent {
  readonly totalItems = input.required<number>();
  readonly pageSize = model<number>(10);
  readonly currentPage = model<number>(1);

  readonly pageSizeOptions = input<number[]>([10, 50, 100]);

  readonly totalPages = computed(() =>
    Math.max(1, Math.ceil(this.totalItems() / this.pageSize()))
  );

  readonly startItem = computed(() =>
    this.totalItems() === 0 ? 0 : (this.currentPage() - 1) * this.pageSize() + 1
  );

  readonly endItem = computed(() =>
    Math.min(this.currentPage() * this.pageSize(), this.totalItems())
  );

  readonly canGoPrevious = computed(() => this.currentPage() > 1);
  readonly canGoNext = computed(() => this.currentPage() < this.totalPages());

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }

  goFirst(): void {
    this.goToPage(1);
  }

  goPrevious(): void {
    this.goToPage(this.currentPage() - 1);
  }

  goNext(): void {
    this.goToPage(this.currentPage() + 1);
  }

  goLast(): void {
    this.goToPage(this.totalPages());
  }

  onPageSizeChange(size: number): void {
    this.pageSize.set(size);
    this.currentPage.set(1);
  }
}

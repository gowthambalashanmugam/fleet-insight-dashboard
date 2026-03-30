import { Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SortOption } from '../../models/alert.model';

@Component({
  selector: 'app-alert-header',
  imports: [FormsModule],
  templateUrl: './alert-header.component.html',
  styleUrl: './alert-header.component.scss',
})
export class AlertHeaderComponent {
  readonly selectedCount = input<number>(0);
  readonly totalCount = input<number>(0);

  readonly sortChange = output<SortOption>();
  readonly filterToggle = output<void>();
  readonly selectAll = output<boolean>();
  readonly bulkDelete = output<void>();

  sortOption: SortOption = 'latest';
  selectAllChecked = false;

  onSortChange(): void {
    this.sortChange.emit(this.sortOption);
  }

  onFilterToggle(): void {
    this.filterToggle.emit();
  }

  onSelectAll(): void {
    this.selectAllChecked = !this.selectAllChecked;
    this.selectAll.emit(this.selectAllChecked);
  }

  onBulkDelete(): void {
    this.bulkDelete.emit();
  }
}

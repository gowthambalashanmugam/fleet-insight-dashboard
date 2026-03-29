import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, provideZonelessChangeDetection } from '@angular/core';
import { LatestTripTableComponent } from './latest-trip-table.component';
import { Trip } from '../../../../core/models/trip.model';

const MOCK_TRIPS: Trip[] = [
  {
    id: 't1',
    tripNumber: 'TR-001',
    driver: { name: 'Alice', avatarUrl: 'https://example.com/alice.png' },
    vehicle: { name: 'Volvo XC90', registration: 'ABC 123' },
    destination: 'Stockholm',
    duration: '2h 15m',
    status: 'Ongoing',
  },
  {
    id: 't2',
    tripNumber: 'TR-002',
    driver: { name: 'Bob', avatarUrl: 'https://example.com/bob.png' },
    vehicle: { name: 'Scania R500', registration: 'DEF 456' },
    destination: 'Gothenburg',
    duration: '4h 30m',
    status: 'Done',
  },
  {
    id: 't3',
    tripNumber: 'TR-003',
    driver: { name: 'Charlie', avatarUrl: 'https://example.com/charlie.png' },
    vehicle: { name: 'Mercedes Actros', registration: 'GHI 789' },
    destination: 'Malmö',
    duration: '1h 45m',
    status: 'Cancelled',
  },
];

@Component({
  template: `<app-latest-trip-table
    [trips]="trips"
    (tripSelect)="selectedTripId = $event"
    (seeAllClick)="seeAllClicked = true"
  />`,
  imports: [LatestTripTableComponent],
})
class TestHostComponent {
  trips: Trip[] = [];
  selectedTripId: string | null = null;
  seeAllClicked = false;
}

describe('LatestTripTableComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  async function setTrips(trips: Trip[]): Promise<void> {
    host.trips = trips;
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    await fixture.whenStable();
  }

  it('should show empty state when no trips', () => {
    const emptyState = fixture.nativeElement.querySelector('.empty-state');
    expect(emptyState).toBeTruthy();
    expect(emptyState.textContent).toContain('No trips found');
  });

  it('should not render table when no trips', () => {
    const table = fixture.nativeElement.querySelector('table');
    expect(table).toBeNull();
  });

  it('should render correct number of rows', async () => {
    await setTrips(MOCK_TRIPS);
    const rows = fixture.nativeElement.querySelectorAll('tbody tr');
    expect(rows.length).toBe(3);
  });

  it('should display row numbers starting from 1', async () => {
    await setTrips(MOCK_TRIPS);
    const firstRowCells = fixture.nativeElement.querySelectorAll('tbody tr:first-child td');
    expect(firstRowCells[0].textContent.trim()).toBe('1');
  });

  it('should display trip number', async () => {
    await setTrips(MOCK_TRIPS);
    const firstRowCells = fixture.nativeElement.querySelectorAll('tbody tr:first-child td');
    expect(firstRowCells[1].textContent.trim()).toBe('TR-001');
  });

  it('should display driver avatar and name', async () => {
    await setTrips(MOCK_TRIPS);
    const driverCell = fixture.nativeElement.querySelectorAll('tbody tr:first-child td')[2];
    const img = driverCell.querySelector('img');
    expect(img.src).toContain('alice.png');
    expect(img.alt).toBe('Alice');
    expect(driverCell.textContent).toContain('Alice');
  });

  it('should display vehicle name and registration', async () => {
    await setTrips(MOCK_TRIPS);
    const vehicleCell = fixture.nativeElement.querySelectorAll('tbody tr:first-child td')[3];
    expect(vehicleCell.textContent).toContain('Volvo XC90');
    expect(vehicleCell.textContent).toContain('ABC 123');
  });

  it('should display destination and duration', async () => {
    await setTrips(MOCK_TRIPS);
    const cells = fixture.nativeElement.querySelectorAll('tbody tr:first-child td');
    expect(cells[4].textContent.trim()).toBe('Stockholm');
    expect(cells[5].textContent.trim()).toBe('2h 15m');
  });

  it('should render status badge for each row', async () => {
    await setTrips(MOCK_TRIPS);
    const badges = fixture.nativeElement.querySelectorAll('app-status-badge');
    expect(badges.length).toBe(3);
  });

  it('should emit trip id on row click', async () => {
    await setTrips(MOCK_TRIPS);
    const firstRow = fixture.nativeElement.querySelector('tbody tr');
    firstRow.click();
    expect(host.selectedTripId).toBe('t1');
  });

  it('should emit seeAllClick when See All is clicked', () => {
    const seeAllBtn = fixture.nativeElement.querySelector('.see-all-link');
    seeAllBtn.click();
    expect(host.seeAllClicked).toBeTrue();
  });

  it('should display header with Latest Trip title', () => {
    const header = fixture.nativeElement.querySelector('.section-header h2');
    expect(header.textContent.trim()).toBe('Latest Trip');
  });
});

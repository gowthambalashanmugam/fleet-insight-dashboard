import {
  Component,
  DestroyRef,
  inject,
  OnInit,
  output,
  signal,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, startWith } from 'rxjs';
import { VehicleDataService } from '../../../../core/services/vehicle-data.service';
import { VehicleStatus } from '../../../../core/models/vehicle.model';
import { CreateVehicleRequest } from '../../../../core/models/api.model';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-add-vehicle-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './add-vehicle-form.component.html',
  styleUrl: './add-vehicle-form.component.scss',
})
export class AddVehicleFormComponent implements OnInit {
  private readonly vehicleDataService = inject(VehicleDataService);
  private readonly destroyRef = inject(DestroyRef);

  readonly vehicleAdded = output<void>();
  readonly cancel = output<void>();

  readonly isSubmitting = signal(false);
  readonly submissionError = signal<string | null>(null);

  readonly form = new FormGroup({
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    registration: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.pattern(/^[A-Z]{3} \d{3}$/)],
    }),
    vehicleType: new FormControl('Truck', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    driverName: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    driverContact: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    status: new FormControl<VehicleStatus>('Idle', { nonNullable: true }),
    latitude: new FormControl<number>(59.33, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(-90), Validators.max(90)],
    }),
    longitude: new FormControl<number>(18.07, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(-180), Validators.max(180)],
    }),
  });

  readonly isFormValid = toSignal(
    this.form.statusChanges.pipe(
      startWith(this.form.status),
      map((status) => status === 'VALID')
    ),
    { initialValue: false }
  );

  readonly vehicleTypes = ['Truck', 'Van', 'SUV', 'Sedan'];
  readonly statuses: VehicleStatus[] = ['Active', 'Idle', 'Maintenance'];

  ngOnInit(): void {
    const sub = this.form.valueChanges.subscribe(() => {
      if (this.submissionError() !== null) {
        this.submissionError.set(null);
      }
    });
    this.destroyRef.onDestroy(() => sub.unsubscribe());
  }

  resetForm(): void {
    this.form.reset();
    this.submissionError.set(null);
    this.isSubmitting.set(false);
  }

  onCancel(): void {
    this.resetForm();
    this.cancel.emit();
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.submissionError.set(null);

    const value = this.form.getRawValue();
    const payload: CreateVehicleRequest = {
      name: value.name,
      registration: value.registration,
      vehicleType: value.vehicleType,
      driverName: value.driverName,
      driverContact: value.driverContact,
      status: value.status,
      latitude: value.latitude,
      longitude: value.longitude,
    };

    this.vehicleDataService.addVehicle(payload).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.form.reset();
        this.vehicleAdded.emit();
      },
      error: (err: HttpErrorResponse) => {
        this.isSubmitting.set(false);
        if (err.status === 409) {
          this.submissionError.set(
            err.error?.message ?? 'A vehicle with this registration already exists'
          );
        } else {
          this.submissionError.set(
            err.error?.message ?? 'An unexpected error occurred. Please try again.'
          );
        }
      },
    });
  }
}

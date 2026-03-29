export type TripStatus = 'Ongoing' | 'Done' | 'Cancelled';

export interface Driver {
  name: string;
  avatarUrl: string;
}

export interface TripVehicle {
  name: string;
  registration: string;
}

export interface Trip {
  id: string;
  tripNumber: string;
  driver: Driver;
  vehicle: TripVehicle;
  destination: string;
  duration: string; // formatted string e.g. "2h 15m"
  status: TripStatus;
}

import { Vehicle } from './vehicle.model';
import { Alert } from './alert.model';

export interface WsVehicleUpdate {
  type: 'vehicle-update';
  payload: Vehicle[];
}

export interface WsAlertUpdate {
  type: 'alert-update';
  payload: Alert[];
}

export type WsMessage = WsVehicleUpdate | WsAlertUpdate;

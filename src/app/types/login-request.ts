import { Subject } from 'rxjs';

export interface LoginRequest {
  returnUrl?: string;
  success?: Subject<any>;
  message?: string;
}

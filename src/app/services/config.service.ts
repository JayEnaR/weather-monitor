import { Injectable } from '@angular/core';
import config from '../../../public/config.json';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  config = config;

  constructor() {}
}

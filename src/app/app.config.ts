import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MQTT_SERVICE_CONFIG } from './mqtt/mqtt_service_config';
import { MqttModule } from 'ngx-mqtt';
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideAnimationsAsync(),
    importProvidersFrom(MqttModule.forRoot(MQTT_SERVICE_CONFIG)),
    provideHttpClient()
  ],
};

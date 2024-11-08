import { IMqttServiceOptions } from "ngx-mqtt";

export const MQTT_SERVICE_CONFIG: IMqttServiceOptions = {
    hostname: 'broker.hivemq.com', //broker.hivemq.com broker.emqx.io
    port: 8000,
    protocol: "ws",
    path: '/mqtt'
}
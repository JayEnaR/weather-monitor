import { IMqttServiceOptions } from "ngx-mqtt";

export const MQTT_SERVICE_CONFIG: IMqttServiceOptions = {
    hostname: 'broker.emqx.io', //broker.hivemq.com broker.emqx.io
    port: 8083,
    protocol: "ws",
    path: '/mqtt'
}
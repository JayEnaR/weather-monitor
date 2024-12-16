export class Time {
    static getTime(): string {
        const now = new Date();
        const formattedTime = `${now.getHours().toString().padStart(2, '0')}:${now
          .getMinutes()
          .toString()
          .padStart(2, '0')}:${now.getSeconds()}`;
        return formattedTime;
      }
}
export class Time {
    static getTime(): string {
        const now = new Date();
        const formattedTime = `${now.getHours().toString().padStart(2, '0')}:${now
          .getMinutes()
          .toString()
          .padStart(2, '0')}:${now.getSeconds()}`;
        return formattedTime;
      }

      static getMostRecent(dateTime1: string, dateTime2: string): string {
        const date1 = new Date(dateTime1);
        const date2 = new Date(dateTime2);
        return date1 > date2 ? date1.toString() : date2.toString();
      }
}
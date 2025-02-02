export class DecimalRound {
    public static roundNum(val: number, decimal: number): number {
        const format = (num: number, dec: number) => num.toLocaleString('en-US', {
          minimumFractionDigits: dec,
          maximumFractionDigits: dec,
        });
        const result: string = format(val, decimal);
        return result.includes(',') ? +result.replace(',', '') : +result;
      }
}
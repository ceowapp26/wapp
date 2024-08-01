export const time = {
  now: (): string => {
    return new Date().toISOString();
  },

  format: (date: Date, format: string): string => {
    // Basic implementation for date formatting
    // You can use a library like date-fns or moment.js for more complex formatting
    const options: Intl.DateTimeFormatOptions = {};

    if (format.includes('yyyy')) options.year = 'numeric';
    if (format.includes('MM')) options.month = '2-digit';
    if (format.includes('dd')) options.day = '2-digit';
    if (format.includes('HH')) options.hour = '2-digit';
    if (format.includes('mm')) options.minute = '2-digit';
    if (format.includes('ss')) options.second = '2-digit';

    return new Intl.DateTimeFormat('en-US', options).format(date);
  },

  addDays: (date: Date, days: number): Date => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  },

  addMonths: (date: Date, months: number): Date => {
    const result = new Date(date);
    result.setMonth(result.getMonth() + months);
    return result;
  },

  addYears: (date: Date, years: number): Date => {
    const result = new Date(date);
    result.setFullYear(result.getFullYear() + years);
    return result;
  }
};

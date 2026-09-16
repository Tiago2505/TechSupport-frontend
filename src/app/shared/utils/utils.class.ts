export class UtilsClass {
  static getTimeAgo(date: string): string {
    const now = new Date();

    const parsedDate = new Date(date.replace(' ', 'T').replace(/\.(\d{3})\d+$/, '.$1'));

    const difference = now.getTime() - parsedDate.getTime();

    const seconds = Math.floor(difference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds < 60) {
      return `Hace ${seconds} ${seconds === 1 ? 'segundo' : 'segundos'}`;
    }

    if (minutes < 60) {
      return `Hace ${minutes} ${minutes === 1 ? 'minuto' : 'minutos'}`;
    }

    if (hours < 24) {
      return `Hace ${hours} ${hours === 1 ? 'hora' : 'horas'}`;
    }

    return `Hace ${days} ${days === 1 ? 'día' : 'días'}`;
  }

  static sortAsStack<T>(array: T[]): T[] {
    const result: T[] = [];

    for (let i = array.length - 1; i >= 0; i--) {
      result.push(array[i]);
    }

    return result;
  }

  static sortAsQueue<T>(array: T[]): T[] {
    const result: T[] = [];

    for (let i = 0; i < array.length; i++) {
      result.push(array[i]);
    }

    return result;
  }
}

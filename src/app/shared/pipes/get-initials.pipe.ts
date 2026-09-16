import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'initials'
})

export class InitialsPipe implements PipeTransform {
  transform(string: string | undefined ): string {

    if(!string) return '';

    const stringSplit = string.split(' ');

    const initials = stringSplit.map((string)=> string.charAt(0)).join("").toUpperCase();

    return initials

  }
}

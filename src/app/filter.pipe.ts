import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  standalone: true,
  name: 'filter'
})
export class FilterPipe implements PipeTransform {
  transform(items: any[], searchTerm: string): any[] {
    if (!items || !searchTerm) return items;

    searchTerm = searchTerm.toLowerCase();
    return items.filter(item => {
      return Object.values(item).some(val =>
        val && val.toString().toLowerCase().includes(searchTerm)
      );
    });
  }
}

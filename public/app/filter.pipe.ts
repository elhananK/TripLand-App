import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(posts: any, term?: any): any {
    // check if search term is undefined
    if (term === undefined) return posts;
    // return updated posts array
    return posts.filter(function (posts) {
      return posts.text.toLowerCase().includes(term.toLowerCase());
    })
  }

}

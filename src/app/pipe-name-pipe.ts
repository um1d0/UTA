import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ratingStars',
  standalone: true
})
export class PipeNamePipe implements PipeTransform {

  transform(value: number): string {
    if (!value || value < 1) return '⭐';
    const roundedRating = Math.min(5, Math.round(value));
    return '⭐'.repeat(roundedRating);
  }

}
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MenuSelectedService {
  private selectedItemSubject = new BehaviorSubject<any>(null);
  selectedItem$ = this.selectedItemSubject.asObservable();

  setSelectedItem(item: any) {
    this.selectedItemSubject.next(item);
  }
}

import { Injectable } from '@angular/core';

@Injectable({providedIn: 'root'})
export class StorageService {

  saveToLocalStorage(key: string, value: string){

    localStorage.setItem(key, value);

  }

  saveToSessionStorage(key: string, value: string){

    sessionStorage.setItem(key, value);

  }

  getItemFromLocalStorage(key: string): string | null{
    return localStorage.getItem(key);
  }

  getItemFromSessionStorage(key: string): string | null{
    return sessionStorage.getItem(key);
  }

  removeItemFromLocalStorage(key: string){
    localStorage.removeItem(key);
  }

  removeItemFromSessionStorage(key: string){
    sessionStorage.removeItem(key);
  }

  clearLocalStorage(){
    localStorage.clear();
  }

  clearSessionStorage(){
    sessionStorage.clear();
  }


}

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  set(key: string, data: unknown, stringify: boolean = true): void {
    try {
      localStorage.setItem(key, stringify && typeof data !== 'string' ? JSON.stringify(data) : (data as string));
    } catch (e) {
      console.error('Error saving to localStorage', e);
    }
  }

  get<T>(key: string, stringify: boolean = true): T | null {
    try {
      const data = localStorage.getItem(key);
      return data ? (stringify && typeof data !== 'string' ? JSON.parse(data) : (data as T)) : null;
    } catch (e) {
      console.error('Error getting data from localStorage', e);
      return null;
    }
  }

  remove(key: string): void {
    localStorage.removeItem(key);
  }
}

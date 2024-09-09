import {Injectable} from "@angular/core";

@Injectable()
export class LocalStorageService {

  setNumber(key: string, value: number): void {
    localStorage.setItem(key, value.toString());
  }

  getNumber(key: string): number | null {
    const value = localStorage.getItem(key);
    return value ? parseFloat(value) : null;
  }

  setBoolean(key: string, value: boolean): void {
    localStorage.setItem(key, value.toString());
  }

  getBoolean(key: string): boolean  {
    const value = localStorage.getItem(key);
    return value !== null ? value === 'true' : false;
  }

  setList<T>(key: string, value: T[]): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  getList<T>(key: string): T[] | null {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  }

  removeItem(key: string): void {
    localStorage.removeItem(key);
  }

}

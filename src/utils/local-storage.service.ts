class LocalStorageService {
  static setValue(key: string, value: any): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  static getValue(key: string): any {
    return JSON.parse(localStorage.getItem(key));
  }
}

export default LocalStorageService;

class Helper {
  hasAnyPropertyEmptyString(obj: any): boolean {
    for (const key in obj) {
      if (obj.hasOwnProperty(key) && obj[key] === '') {
        return true;
      }
    }
    return false;
  }
}
export default new Helper();

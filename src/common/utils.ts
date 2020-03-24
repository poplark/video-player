export function typeTo(target: any): string {
  return Object.prototype.toString.call(target);
}

export function isNumber(target: any): boolean {
  return typeTo(target) === '[object Number]';
}

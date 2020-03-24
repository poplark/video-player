export function typeTo(target: any): string {
  return Object.prototype.toString.call(target);
}

export function isNumber(target: any): boolean {
  return typeTo(target) === '[object Number]';
}

export function isString(target: any): boolean {
  return typeTo(target) === '[object String]';
}

export function normalizeId(id: string): string {
  return id.indexOf('#') === 0 ? id.slice(1) : id;
}
export function logger(...args: any[]) {
  return console.log.call(null, '[utils logger]', ...args);
}
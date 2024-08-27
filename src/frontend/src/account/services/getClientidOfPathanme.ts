export function getClientid(): string {
  const currentPathname = window.location.pathname;
  const regex = /^\d+$/;
  const arr = currentPathname.split('/');

  let clientIndex = 'Null';
  if (arr.length > 1 &&
    regex.test(arr[arr.length - 1])) {
    clientIndex = arr[arr.length - 1];
  }
  return clientIndex;
}

/**
 * int - число. 0  зарегистрирован (args[0]), 1- не зарегистрирован (args[1]).
 * */
export function messageForUser(int: number, argg: string[]): HTMLParagraphElement {
  const oldP = document.getElementById('note');
  if (oldP !== null) {
    (oldP as HTMLElement).innerHTML = '';
  }
  const p = document.createElement('p');
  p.id = 'note';
  p.style.paddingTop = 15 + 'px';
  p.style.color = (int === 0) ? 'green' : 'red';
  p.innerText = (int === 0) ? argg[0] : argg[1];
  return p;
}

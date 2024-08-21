export async function doActiveReferences(): Promise<boolean> {

  const links = document.querySelectorAll<HTMLAnchorElement>('.menu > .nav-item.dropdown');
  if (links.length === 0) {
    return false
  }

  links.forEach(link => {
    let isActive = false; // Состояние для отслеживания активности ссылки

    // Обработчик события наведения
    link.removeEventListener('mouseenter', () => {
      if (!isActive) {
        link.classList.add('active');
      }
    });

    // Обработчик события покидания области ссылки
    link.removeEventListener('mouseleave', () => {
      if (!isActive) {
        link.classList.remove('active');
      }
    });

    // Обработчик события клика
    link.removeEventListener('click', (event) => {
      // Отменяем стандартное поведение ссылки
      isActive = !isActive; // Переключаем состояние активности
      link.classList.toggle('active', isActive); // Добавляем или удаляем класс 'active'
    });
  });

  links.forEach(link => {
    let isActive = false; // Состояние для отслеживания активности ссылки

    // Обработчик события наведения
    link.addEventListener('mouseenter', () => {
      if (!isActive) {
        link.classList.add('active');
      }
    });

    // Обработчик события покидания области ссылки
    link.addEventListener('mouseleave', () => {
      if (!isActive) {
        link.classList.remove('active');
      }
    });

    // Обработчик события клика
    link.addEventListener('click', (event) => {
      // event.preventDefault(); // Отменяем стандартное поведение ссылки
      isActive = !isActive; // Переключаем состояние активности
      link.classList.toggle('active', isActive); // Добавляем или удаляем класс 'active'
    });
  });
  return true;
}

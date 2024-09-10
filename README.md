## Обзор
Проект имеет общее ядро. \
Дополнительно два sub-ядра (frontend, backend). \
sub-ядро backend имеет свои зависимости и наследуются зависимовти из ядра. От sub-ядра frontend закрыт файлами config, ignore.
sub-ядро backend  свои зависимости, в основном имеет в ядре проекта. Не стал утруждаться в связи с тестовым проектом. \
Весь проект настроен так , что при жеданиии \
Зависимости используемые ТОЛЬКО во frontend - можно через копипаст вырезать из package (который в ядре) и вставить в package (который во frontend). \
Далее команды для установк из ядра проекта.
frontend, backend - имеют свои команды.
Кажле sub-ядро запускается отдельно друг от друга, разными командами из ядра проекта.

При необходимости необходимости проект мог бы и может содержать два ядра вместо одного (как сделать сейчас). \
Так как такого требования небыло, сделал моно (через worckspaces).

Про базу данных
- название базы, пользователя, пароли, и прочее - укажите в файле env.
- Все таблицы создаются в первом запуске.
- В последубщие запуски проходит проверка - наличия таблиз. Если таблица \
существует, ошибок ни каких не выpывает.

Весь код писался с учётом`Полиморфизма`.

Note!!
- "Зависимости" - модули из npm.
- "Ядро" - корень проекта.


## ENV
Файл `.env.example` переименуйте в `.env` и внесите свои данные.

## Команды
```text
// Установка зависимостей
`npm run install` или `npm run install package.json`

// Установить зависимовти backend (логика сервера)
`npm --workspace=backend run i package.json`

// Подключаем wf `tailwindcss`
`run npm cssstyle`

// Запустить проверки стиля для написанного кода
`run npm lint`

// Развернуть файлы (frontend) в режиме сборки
`npm run build:front`

// Развернуть файлы (backend)
`npm run build:back`

// Для работы с проектом запустить сервер (frontend)
`npm run server:front`

// Для работы с проектом запустить сервер (backend)
`npm run server:back`

// Запуск husk который в автоматическом режиме будет реагировать на
// команды коммита (`git commit`) и запускать `lint`
`npm run prepare`

// Для установки дополнительных зависимостей, общих для frontend и  backend
`npm -W i ....`

// Для установки дополнительных зависимостей на backend
`npm  --workspace=backend i ....`

// Для установки дополнительных зависимостей на frontend
`npm  --workspace=frontend i ....`
```


## Задание
![img](./img/Screenshot_6.png)

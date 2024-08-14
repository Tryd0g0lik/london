13.08
Настроена рабочая среда, в то числе eslit и Husky дл автоматической проверки.\
2024-08-14 замусь бозой данных и логкой.

14.08
1. Создал модильный модуль для логирования  при работе нв сервера. (можно и на фронте его использоваить). \
2000 строк (уровень можно регулировать) файл удаялется и создается новый. \
```test
16:25:10:37 ==> [server -> ERROR]: 'Users' Something that wrong!
     ERR-MEASSAGE: ошибка синтаксиса (примерное положение: "DEAFULT")
16:25:10:37 ==> [server]: "Emails" returning FALSE.
16:25:10:37 ==> [server]: END
16:27:38:15 ==> [server]: START
16:27:38:16 ==> [server]: Start the "Client" connection.
16:27:38:48 ==> [server -> ERROR1]: 'createDBTable' Something that wrong!
     ERR-MEASSAGE: база данных "london" уже существует
16:27:38:48 ==> [server -> Client2]: Start the  "Client" connection.
16:27:38:73 ==> [server]: "Emails" was created .
16:27:38:34 ==> [server]: "Users" was created .
16:27:38:34 ==> [server]: The end the "Client" connection.
16:27:38:34 ==> [server]: END
16:28:34:4 ==> [server]: START
16:28:34:6 ==> [server]: Start the "Client" connection.
16:28:34:36 ==> [server -> ERROR1]: 'createDBTable' Something that wrong!
     ERR-MEASSAGE: база данных "london" уже существует
16:28:34:36 ==> [server -> Client2]: Start the  "Client" connection.
16:28:34:63 ==> [server]: "Emails" was created .
16:28:34:63 ==> [server]: "Users" was created .
16:28:34:63 ==> [server]: The end the "Client" connection.
16:28:34:63 ==> [server]: END
16:29:58:51 ==> [server]: START
16:29:58:52 ==> [server]: Start the "Client" connection.
16:29:58:83 ==> [server -> ERROR1]: 'createDBTable' Something that wrong!
     ERR-MEASSAGE: база данных "london" уже существует
16:29:58:83 ==> [server -> Client2]: Start the  "Client" connection.
16:29:58:9 ==> [server]: "Emails" was created .
16:29:58:9 ==> [server]: "Users" was created .
16:29:58:9 ==> [server]: The end the "Client" connection.
16:29:58:10 ==> [server]: END
19:28:25:2 ==> [server -> listen]: Server starte to listen the PORT 7070
```
2. запуск проекта вызывает логику ответственную за создание самой бзы данных и создание двух таблиц в базе данных.  \
Таблица Users связана с таблицей  Emails. \
void prymaryInstalation();

3. роутер запросов на сервере  изначально писал на 'require("http");' \
Данная библиотека слабая для большого проекта и закомментировал.
Сделал набросок роутера на основе frameworke require("express")

на 15/08 надо писать sql для работы с REST API и совместить с роутерем запросов.

Очень много времени отнимается работа с debug через `console.loge` и самописными `log-ирование`. В слепую фактически. 

:-) Может поскажете способ логирования сервеной лигики помимо бзценных console.log и лигов?


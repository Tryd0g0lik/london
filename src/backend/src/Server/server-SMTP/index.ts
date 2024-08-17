const fs_ = require('fs');
const { SMTPServer, SMTPServerOptions } = require('smtp-server');

// Определение параметров SMTP-сервера
const smtpOptions: typeof SMTPServerOptions = {
  secure: false, // Установите true, если используете SSL
  key: fs.readFileSync('./key.pem'), // Путь к вашему SSL-ключу
  cert: fs.readFileSync('./cert.pem'), // Путь к вашему SSL-сертификату
  onRcptTo: (address: string, session: unknown, callback: (error?: Error) => unknown) => {
    // Валидация получателя
    if (address.startsWith('noreply@')) {
      return callback(new Error(`Address ${address} is not allowed receiver`));
    }
    callback();
  },
  onData: (stream: NodeJS.ReadableStream, session: unknown, callback: () => void) => {
    // Обработка данных письма
    let emailData = '';
    stream.on('data', (chunk: Buffer) => {
      emailData += chunk.toString();
    });
    stream.on('end', () => {
      console.log('Email received:', emailData);
      callback();
    });
  },
  authOptional: true // Необязательная аутентификация
};

// Создание и запуск SMTP-сервера
const smptPortNum = (process.env.REACT_APP_SERVER_SMPT) ? Number(process.env.REACT_APP_SERVER_SMPT) : 587;
const smtpServer = new SMTPServer(smtpOptions);
smtpServer.listen(smptPortNum, () => {
  console.log('SMTP server is running on port 587');
});

const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { propsForClient } = require('@typeof typeof propsForClient');
const REACT_APP_POSTGRES_HOST = (process.env.REACT_APP_POSTGRES_HOST as string | unknown) || 'localhost';
const REACT_APP_FRONT_PORT = (process.env.REACT_APP_FRONT_PORT as string | unknown) || '8080';
const REACT_APP_PROTOCOL_OF_URL = (process.env.REACT_APP_PROTOCOL_OF_URL as string | unknown) || 'http';
// interface typeof propsForClient {
//   readonly email: string
//   readonly firstName: string
//   readonly lastName: string
//   readonly passwords: string
// };

//  Создание активационной ссылки
export async function activatorForUser(oneUser: typeof propsForClient): Promise<typeof propsForClient> {
  const us = { email: oneUser.email };
  const createActivationToken = (user: typeof us): typeof jwt => {
    return jwt.sign(user, process.env.ACTIVATION_SECRET, {
      expiresIn: '10m' // Токен будет действителен 5 минут
    });
  };

  // Пример использования
  const activationToken = createActivationToken(us);
  const singleActivationUrl = `${REACT_APP_PROTOCOL_OF_URL as string}://${REACT_APP_POSTGRES_HOST as string}:${REACT_APP_FRONT_PORT as string}/activate/${activationToken}`;
  /* ------------------------------------------------------------ */
  // Отправка электронной почты
  const sendMail = async (email: string, activationUrl: string): Promise<void> => {
    const smptPortNum = (process.env.REACT_APP_SERVER_SMPT) ? Number(process.env.REACT_APP_SERVER_SMPT) : 587;
    // user: process.env.EMAIL_USER,
    //   pass: process.env.EMAIL_PASS, gmail
    const transporter = nodemailer.createTransport({
      service: REACT_APP_POSTGRES_HOST,
      port: smptPortNum,
      secure: false // // Установите true, если используете SSL
    });

    // Определение параметров письма
    const mailOptions = {
      from: 'work80@mail.ru',
      to: email,
      subject: 'Activate Your Account',
      html: `<p>Hello, this is a test email! </br> Please click the link to activate your account: <a href="${activationUrl}">${activationUrl}</a></p>`
    };

    // Отправка письма
    await transporter.sendMail(mailOptions, (error: unknown, info: unknown) => {
      if (error) {
        console.log('Error occurred:', error);
        return false;
      }
      console.log('Email sent:', info); // info.response
    });
  };
  void sendMail(oneUser.email as string, singleActivationUrl);
  return oneUser;
}

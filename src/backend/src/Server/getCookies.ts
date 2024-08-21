// const { cookies } = require('next/headers');
// /**
//  * @param name Получаем Cookie клиента
//  * @returns string cookie csrfToken
//  */
// export async function GET(request: Request) {
//   // Получаем cookie
//   const cookieStore = cookies();
//   const myCookie = cookieStore.get('myCookieName');

//   // Проверяем наличие cookie
//   if (myCookie) {
//     console.log('Cookie value:', myCookie.value);
//     return NextResponse.json({ message: 'Cookie found', value: myCookie.value });
//   } else {
//     return NextResponse.json({ message: 'Cookie not found' });
//   }
// } мер использования
// // const csrfToken = getCookie('csrftoken');
// // console.log(csrfToken);

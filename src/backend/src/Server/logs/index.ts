const path = require('path');
const fs = require('fs'); // .promises;

function logTime(): string {
  const time = new Date();
  const milliseconds = time.getMilliseconds();
  const firstFiveMilliseconds = milliseconds % 100;
  return `${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}:${firstFiveMilliseconds}`;
}

function checkFile(): void {
  // Если файл не существует, создаем его
  try {
    fs.promises.access('logs_server.txt');
  } catch {
    fs.writeFile('logs_server.txt', ''); // Create the file if it doesn't exist
  }
};

// Функция для подсчета количества строк в файле
async function calculateLines(file: unknown): Promise<number> {
  // проверяем существование файлап
  try {
    const data = await fs.promises.readFile(file, 'utf8');
    const lines = data.split('\n');
    console.log(`[server -> log]: lines.length => ${lines.length} `);
    return lines.length;
  } catch (err: unknown) {
    const error = new Error((err as ErrorEvent).message);
    throw error;
  }
}

// Функция для удаления файла, если в нем более или равно 'maxLongth' строк
// maxLongth макс число строк. По умолчанию 2000
async function deleteFileIfLarger(): Promise<void> {
  // fs.promise.unlink('logs_server.txt', (err: unknown) => {
  //   if (err) throw err;
  // });
  try {
    await fs.promises.unlink('logs_server.txt');
  } catch (err) {
    console.error('Error deleting file:', err);
    throw err; // Пробрасываем ошибку дальше
  }
}

// Функция для записи новой строки в файл
function writeNewLine(newLine: string): void {
  const text = `${logTime()} ==> ${newLine}\n`;
  fs.appendFileSync('logs_server.txt', text);
}

//  если  более или равно 'maxLongth' строк
// maxLongth макс число строк. По умолчанию 2000
async function logs(newLog: string, maxLongth = 2000): Promise<void> {
  // checkFile();
  try {
    const intgCurrent: number = await calculateLines('./logs_server.txt'); // подсчитываем строки
    if (intgCurrent >= maxLongth) {
      // Запускаем функцию для удаления файла
      void deleteFileIfLarger();
      checkFile();
    }
    checkFile();
    // Создаем запись
    writeNewLine(newLog);
  } catch (err: unknown) {
    console.log((err as ErrorEvent).message);
    writeNewLine((err as ErrorEvent).message);
  }
}
module.exports = logs;

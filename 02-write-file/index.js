const { stdout, stdin } = process;
const fs = require('fs');
const readline = require('readline');
const path = require('path');

const createPathFile = path.join(__dirname, 'text.txt');
const writingStream = fs.createWriteStream(createPathFile)

const rl = readline.createInterface({
  input: stdin,
  output: stdout,
});

const writeMessage = (message) => {
  stdout.write(message)
  rl.on('line', (line) => {
    if (line.trim() === 'exit') {
      rl.close();
    } else {
      writingStream.write(line + '\n');
      stdout.write(message);
    }
  })
  rl.on('close', () => {
    stdout.write('GOOD BYE! ^_^');
    writingStream.close();
    process.exit(0)
  })
  rl.on('SIGINT', () => {
    rl.close();
  });
}
writeMessage('Write your message, please.\n')
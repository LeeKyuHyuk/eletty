const COM_PORT = "COM3"
const BAUDRATE = 115200

var term = new Terminal();
const SerialPort = require('serialport')
const Readline = require('@serialport/parser-readline')
const port = new SerialPort(COM_PORT, {
    baudRate: BAUDRATE,
    parser: new Readline({ delimiter: '\r\n' })
});

SerialPort.list().then(
    ports => ports.forEach(console.log),
    err => console.error(err)
)

SerialPort.list().then(ports => {
    document.getElementById("port-list").innerHTML = `
    <h1>Detected Serial Ports</h1>
    <ul>
      ${ports.map(port => `<li>${port.comName}</li>`).join('')}
    </ul>
    `
})

port.on('data', function (data) {
    let string = String(data);
    for (let i = 0; i < string.length; i++) {
        let char = string.charCodeAt(i)
        term.write(String.fromCharCode(char))
    }
})

term.open(document.getElementById('terminal'));
term.write('Hello \x1B[1;3;31meletty\x1B[0m!\r\n')

let tmp = ""

term.onKey(e => {
    const printable = !e.domEvent.altKey && !e.domEvent.altGraphKey && !e.domEvent.ctrlKey && !e.domEvent.metaKey;

    if (e.domEvent.keyCode === 13) {
        prompt(term);
    } else if (e.domEvent.keyCode === 8) {
        term.write('\b \b');
        tmp = tmp.substring(0, tmp.length - 1);
    } else if (printable) {
        term.write(e.key);
        tmp += e.key;
    }
});

function prompt(term) {
    port.write(tmp)
    tmp = ""
    term.write('\n');
}
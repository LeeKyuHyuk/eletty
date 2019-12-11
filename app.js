const COM_PORT = "COM3"
const BAUDRATE = 115200

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

const log = document.getElementById("port-list")

port.on('data', function (data) {
    let string = String(data);
    for (let i = 0; i < string.length; i++) {
        let char = string.charCodeAt(i)
        term.write(String.fromCharCode(char))
    }
})

// port.write('Hello eletty!\n')
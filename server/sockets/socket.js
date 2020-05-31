const { io } = require('../server');
const { TicketControl } = require('../classes/ticket-control');

const tControl = new TicketControl();


io.on('connection', (client) => {

    client.on('siguienteTicket', (data, callback) => {

        let siguiente = tControl.siguienteNum();
        console.log(siguiente);
        callback(siguiente);
    });

    //Emitir un evento de estado actual
    client.emit('estadoActual', {
        actual: tControl.getUltimoTicket(),
        ultimos4: tControl.getUltimos4()
    });



    client.on('atenderTicket', (data, callback) => {

        if (!data.escritorio) {
            return callback({
                err: true,
                mensaje: 'El escritorio es necesario'
            });
        }

        let atenderTicket = tControl.atenderTicket(data.escritorio);

        callback(atenderTicket);

        //Actualizar/Notificar cambios en los ultimos 4
        client.broadcast.emit('ultimos4', {
            ultimos4: tControl.getUltimos4()
        });


    });
});
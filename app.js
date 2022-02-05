const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const DB = require("./util/db");

const {insertOneString, deleteLastString, addColumn, deleteColumn, updateCell} = require("./util/db");


const app = express();


app.use(cors());

const tableRoutes = require("./routes/table");

app.use(bodyParser.json());
app.use(tableRoutes);


const server = require('http').createServer(app);

const io = require('socket.io')(server, {
    cors: {
        origin: '*',
    }
});
io.on('connection', (socket) => {
    socket.on("addStr", (arg) => {
        insertOneString(arg);
        socket.broadcast.emit('addStr', {...arg, flag: true})
    });
    socket.on("deleteString", (arg) => {
        deleteLastString(arg);
        socket.broadcast.emit('deleteString', {...arg, flag: true})
    });
    socket.on("addColumn", (arg) => {
        addColumn(arg);
        socket.broadcast.emit('addColumn', {...arg, flag: true})
    });
    socket.on("deleteColumn", (arg) => {
        deleteColumn(arg);
        socket.broadcast.emit('deleteColumn', {...arg, flag: true})
    });
    socket.on("changeCell", (arg) => {
        updateCell(arg);
        socket.broadcast.emit('changeCell', {...arg, flag: true})
    });

});


DB.run()
    .then(r => server.listen(3000))
    .catch(console.dir);

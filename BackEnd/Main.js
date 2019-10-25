const express = require('express');
const jsonBodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = 5000;

// listens in on port 5000
app.listen(port, () => console.log(`Listening on ${port}!`));  

// enables adding content to request body
// the preferred content type is json
app.use(jsonBodyParser.json( {extended:true} ));  

// CORS settings
app.use(function (_, res, next) {
  
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');
  
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers,X-Access-Token,XKey,Authorization');
    next();
  });

// requests for resources databse
app.get('/Resources', (_, res) => { readResources(res); });
app.get('/Resources/:id', (req, res) => { readResource(req.params.id, res); });
app.put('/Resources/:id', (req, res) => { updateResource(req.params.id, req.body, res); }); 
app.delete('/Resources/:id', (req, res) => { deleteResource(req.params.id, res); }); 
app.post('/Resources', (req, res) => { createResource(req.body, res); }); 
 

// requests for reservations databse
app.get('/Reservations', (_, res) => { readReservations(res); });
app.get('/Reservations/:id', (req, res) => { readReservation(req.params.id, res); });
app.put('/Reservations/:id', (req, res) => { updateReservation(req.params.id, req.body, res); }); 
app.delete('/Reservations/:id', (req, res) => { deleteReservation(req.params.id, res); }); 
app.post('/Reservations', (req, res) => { createReservation(req.body, res); });

// connects to sqlite database
const db = new sqlite3.Database(`./database.db`, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log(`Connected to database.`);
    createTables();
});

// creates database if necessary and sets foreign key constraint
function createTables() {
    db.get("PRAGMA foreign_keys = ON");
    db.run(`CREATE TABLE IF NOT EXISTS resources (
        resource_id INTEGER PRIMARY KEY AUTOINCREMENT,
        resource_name TEXT UNIQUE NOT NULL
        );`
    );
    db.run(`CREATE TABLE IF NOT EXISTS reservations (
            reservation_id INTEGER PRIMARY KEY AUTOINCREMENT,
            reservation_name TEXT NOT NULL,
            start_date DATE,
            end_date DATE,
            owner_email TEXT NOT NULL,
            comments TEXT NOT NULL, 
            resource_id INTEGER NOT NULL,
            FOREIGN KEY (resource_id)
                REFERENCES resources(resource_id) 
            );`
        );
}



// RESOURCES CRUD 
function createResource(body, res) {
    console.warn(body);
    if (body.resource_name) {
        db.run(`INSERT INTO resources(resource_name) VALUES
        ('${body.resource_name}')`, (err) => {
        if (err) {
            console.log(`Error adding resource "${body.resource_name}" ${err}`);
            res.status(403).send(`Error adding resource "${body.resource_name}" ${err}`);
        } else {
            console.log(`Successfully added resource "${body.resource_name}"`);
            res.send(`Successfully added resource "${body.resource_name}"`)
        }});
    } else {
        console.log("Error adding resource, please complete all required fields");
        res.status(403).send(`Error adding resource, please complete all required fields`);
    }
};
function readResources(res) {
        db.all(`SELECT * FROM resources`, (err, rows) => {
        if (err) {
            console.log(`Error getting resources`);
            res.status(403).send(`Error getting resources" ${err}`);
        } else {
            res.send(rows)
        }});
};
function readResource(id, res) {
        db.all(`SELECT * FROM resources WHERE resource_id = "${id}"`, (err, rows) => {
        if (err) {
            console.log(`Error getting resource`);
            res.status(403).send(`Error getting resource" ${err}`);
        } else {
            res.send(rows)
        }});
};

function updateResource(id, body, res) {
    console.warn(body); 
    if (body.resource_name) {
        db.run(`UPDATE resources SET
        resource_name='${body.resource_name}'
        WHERE resource_id = '${id}'`, (err) => {
        if (err) {
            console.log(`Error updating resource "${body.resource_name}" ${err}`);
            res.status(403).send(`Error updating resource "${body.resource_name}" ${err}`);
        } else {
            console.log(`Successfully updated resource "${body.resource_name}"`);
            res.send(`Successfully updated resource`)
        }});
    } else {
        console.log("Error updating resource, please complete all required fields");
        res.status(403).send(`Error updating resource, please complete all required fields`);
    }
}

function deleteResource(id, res) {
    db.run(`DELETE FROM resources WHERE resource_id='${id}'`, (err) => {
    if (err) {
        console.log(`Error deleting resource`);
        res.status(403).send(`Error deleting resource" ${err}`);
    } else {
        res.send(`Succesfully deleted resource`);
    }});
};
//////////////////////////////////////////////////////////////////////


// RESERVATIONS CRUD
function createReservation(body, res) {
    console.warn(body);
    if (body.reservation_name) {
        db.run(`INSERT INTO reservations(reservation_name, start_date, end_date, owner_email, comments, resource_id) VALUES
        ('${body.reservation_name}', '${body.start_date}', '${body.end_date}', '${body.owner_email}', '${body.comments}', '${body.resource_id}')`, (err) => {
        if (err) {
            console.log(`Error adding reservation "${body.reservation_name}" ${err}`);
            res.status(403).send(`Error adding reservation "${body.reservation_name}" ${err}`);
        } else {
            console.log(`Successfully added reservation "${body.reservation_name}"`);
            res.send(`Successfully added reservation "${body.reservation_name}"`)
        }});
    } else {
        console.log("Error adding reservation, please complete all required fields");
        res.status(403).send(`Error adding reservation, please complete all required fields`);
    }
};
function readReservations(res) {
        db.all(`SELECT * FROM reservations`, (err, rows) => {
        if (err) {
            console.log(`Error getting reservations`);
            res.status(403).send(`Error getting reservations" ${err}`);
        } else {
            res.send(rows)
        }});
};
function readReservation(id, res) {
        db.all(`SELECT * FROM reservations WHERE reservation_id = "${id}"`, (err, rows) => {
        if (err) {
            console.log(`Error getting reservation`);
            res.status(403).send(`Error getting reservation" ${err}`);
        } else {
            res.send(rows)
        }});
};

function updateReservation(id, body, res) {
    console.warn(body); 
    if (body.reservation_name) {
        db.run(`UPDATE reservations SET
        reservation_name='${body.reservation_name}',
        start_date='${body.start_date}',
        end_date='${body.end_date}',
        resource_id='${body.resource_id}',
        owner_email='${body.owner_email}',
        comments ='${body.comments }'
        WHERE reservation_id = '${id}'`, (err) => {
        if (err) {
            console.log(`Error updating reservations "${body.reservation_name}" ${err}`);
            res.status(403).send(`Error updating reservations "${body.reservation_name}" ${err}`);
        } else {
            console.log(`Successfully updated reservations "${body.reservation_name}"`);
            res.send(`Successfully updated reservations`)
        }});
    } else {
        console.log(`Error updating reservation, please complete all required fields`);
        res.status(403).send(`Error updating reservation, please complete all required fields`);
    }
}

function deleteReservation(id, res) {
    db.run(`DELETE FROM reservations WHERE reservation_id='${id}'`, (err) => {
    if (err) {
        console.log(`Error deleting reservation`);
        res.status(403).send(`Error deleting reservation" ${err}`);
    } else {
        res.send(`Succesfully deleted reservation`);
    }});
};

//////////////////////////////////////////////////////////////////////
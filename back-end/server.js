import express from 'express';
import fs from 'fs-jetpack';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3001;

let { pathname } = new URL('./user-info.json', import.meta.url);
fs.file(pathname);


let counter = fs.read(pathname, 'json');

app.use(cors());

app.get('/visit', (req, res) => {
    const { site } = req.query;

    // prüft ob Query-Parameter "site" vorhanden ist
    if (!site) {
        res
            .status(400)  // wenn nicht, dann senden des Statuscodes
            .send({ error: "Use ?site query to specify site you want to track" }); // Rückgabe der Fehlermeldung in Form eines JSON-Objects
    }

    // prüft, ob bereits ein Zähler in der "Counter"Datenstruktur existiert
    // wenn nicht, dann wird einer erstellt
    if (!counter[site]) {
        counter[site] = 0;
    }

    // erhöht den Counter um +1
    counter[site] += 1;
    res.send();

    // schreiben der aktualisierten Zählerwerte in JSON-Datei, die durch "pathname" definiert ist
    fs.write(pathname, counter);
});

app.get('/visited', (req, res) => {
    let trackingInfo = '';

    for (const [site, visits] of Object.entries(counter)) {
        trackingInfo += `Website: ${site}, Besuche: ${visits}\n`;
    }

    if (trackingInfo === '') {
        trackingInfo = "Keine Website-Besuche verzeichnet.";
    }
    res.send(trackingInfo);
})

app.listen(PORT, () => {
    console.log(`Server runs ${PORT} Miles per Day!`);
});

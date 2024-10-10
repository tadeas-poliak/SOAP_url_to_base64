const express = require('express');
const soap = require('soap');
const fs = require('fs');
const fetch = require('node-fetch'); // Change this to require
const { createCanvas, loadImage } = require('canvas');

const myService = {
    ImageService: {
        ImagePort: {
            // Existing ProcessImage function
            ProcessImage: async function (args) {
                try {
                    console.log('Received args:', args);

                    const response = await fetch(args.imageUrl); // Use fetch correctly
                    if (!response.ok) {
                        throw new Error(`Failed to fetch image: ${response.statusText}`);
                    }
                    
                    const buffer = await response.buffer();
                    console.log('Downloaded image buffer:', buffer);

                    const image = await loadImage(buffer);
                    const imageCanvas = createCanvas(image.width, image.height);
                    const ctx = imageCanvas.getContext('2d');
                    ctx.drawImage(image, 0, 0);

                    const base64Image = imageCanvas.toDataURL('image/png').replace('data:image/png;base64,', '');
                    return { base64Image: base64Image };
                } catch (err) {
                    console.error('Error in ProcessImage:', err);
                    return { base64Image: `Error: ${err.message}` };
                }
            },
            // New AddIntegers function
            AddIntegers: function (args) {
                const sum = args.intA + args.intB;
                console.log(`Adding ${args.intA} + ${args.intB} = ${sum}`);
                return { sum: sum };
            }
        }
    }
};

const xml = fs.readFileSync('testService.wsdl', 'utf8');

const port = process.env.PORT || 8001;
const app = express();

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    //Setting header content type with char set
    res.header('Content-Type', 'text/xml; charset=utf-8');
    next();
});

app.use(function (req, res, next) {
    console.log("Request was made.");
    console.log('Request received: ', req.url);
    next();
});

app.listen(port, function () {
    soap.listen(app, '/SOAP.Demo.cls', myService, xml, function () {
        console.log('SOAP server initialized... open http://localhost:'+ port +'/SOAP.Demo.cls?wsdl');
    });
});

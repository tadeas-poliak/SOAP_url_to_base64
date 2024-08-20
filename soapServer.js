import express from 'express';
import soap from 'soap';
import fs from 'fs';
import fetch from 'node-fetch';
import { createCanvas, loadImage } from 'canvas';

const myService = {
    ImageService: {
        ImagePort: {
            ProcessImage: async function (args) {
                try {
                    console.log('Received args:', args);

                    // Fetching the image from the provided URL in args.imageUrl
                    const response = await fetch(args.imageUrl);
                    if (!response.ok) {
                        throw new Error(`Failed to fetch image: ${response.statusText}`);
                    }
                    
                    const buffer = await response.buffer();
                    console.log('Downloaded image buffer:', buffer);

                    // Loading the image with canvas
                    const image = await loadImage(buffer);
                    const imageCanvas = createCanvas(image.width, image.height);
                    const ctx = imageCanvas.getContext('2d');
                    ctx.drawImage(image, 0, 0);

                    // Converting the canvas to a Base64 string
                    const base64Image = imageCanvas.toDataURL('image/png').replace('data:image/png;base64,', '');
                    //Donwloading the image
                    //fs.writeFileSync('image.png', base64Image, 'base64');
                    //Writing the base64 text to text file
                    //fs.writeFileSync('image.txt', base64Image, "utf-8");

                    // Return the base64 encoded image as the response
                    return { base64Image: base64Image };
                } catch (err) {
                    console.error('Error in ProcessImage:', err);
                    return { base64Image: `Error: ${err.message}` };
                }
            }
        }
    }
};

const xml = fs.readFileSync('testService.wsdl', 'utf8');

const app = express();

app.listen(8001, function () {
    soap.listen(app, '/MyFunction', myService, xml, function () {
        console.log('SOAP server initialized... open http://localhost:8001/MyFunction?wsdl');
    });
});

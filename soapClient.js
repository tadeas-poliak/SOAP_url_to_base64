import soap from 'soap'; // ES module import

// const url = 'http://localhost:8001/SOAP.Demo.cls?wsdl';
const url = 'https://soapurltobase64-production.up.railway.app/SOAP.demo.cls?wsdl';
// Define an async function to handle the SOAP requests
async function callSOAPService() {
    try {
        // Create SOAP client asynchronously
        const client = await soap.createClientAsync(url);
        console.log("SOAP Client created successfully: ", client);

        // Define arguments for ProcessImage operation
        const imageArgs = { imageUrl: 'http://www.delbag.net/SAP/HENGST_logo_carton.png' };

        // Call ProcessImage operation
        const [imageResult] = await client.ProcessImageAsync(imageArgs);
        console.log("ProcessImage Result: ", imageResult);

        // Call AddIntegers operation
        const addIntegersArgs = { intA: 5, intB: 10 };
        const addIntegersResult = await client.AddIntegersAsync(addIntegersArgs);
        console.log("AddIntegers Result: ", addIntegersResult);

    } catch (err) {
        console.error("Error: ", err);
    }
}

// Call the async function to execute the SOAP requests
callSOAPService();

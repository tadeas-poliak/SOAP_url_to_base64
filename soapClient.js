var soap = require('soap');
var url = 'http://localhost:8001/SOAP.Demo.cls?wsdl';
var args = { imageUrl: 'http://www.delbag.net/SAP/HENGST_logo_carton.png' };

soap.createClient(url, function(err, client) {
  if (err) {
    console.error("Client creation error: ", err);
    return;
  }

  client.ProcessImage(args, function(err, result) {
    if (err) {
        console.error("Error calling ProcessImage: ", err);
    } else {
        console.log("Result: ", result);
    }
  });

  client.AddIntegers({ intA: 5, intB: 10 }, function(err, result) {
    if (err) {
        console.error("Error calling AddIntegers: ", err);
    } else {
        console.log("Result: ", result);
    }
});
});

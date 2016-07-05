function createHTTPRequest()
{
var tmpXMLHttpRequest;

if (window.XMLHttpRequest)
{
// Firefox , IE 7
tmpXMLHttpRequest = new XMLHttpRequest();
}
// IE 6 and below
else if (typeof ActiveXObject != "undefined")
{
try
{
tmpXMLHttpRequest = new ActiveXObject("Msxml2.XMLHTTP"); // refers to Msxml2.XMLHTTP.3.0!
}
catch (e)
{
try
{
tmpXMLHttpRequest = new ActiveXObject("Msxml2.XMLHTTP.3.0");
}
catch (e)
{
try
{
tmpXMLHttpRequest = new ActiveXObject("Microsoft.XMLHTTP"); // actually depricated
}
catch (e)
{
alert("To display this page, please use a different browser! (Reason: XMLHTTP not supported)");
}
}
}
}

return tmpXMLHttpRequest;
}

function dummy()
{
}
function getFile(parFilename,parAsync,parCB, parCBHandle)
{
var tmpResponse;
var tmpResponseXML;
var tmpXMLHTTPRequest = createHTTPRequest();
if (tmpXMLHTTPRequest)
{
var tmpAsync = true;
//if (parAsync != undefined)
//  tmpAsync = parAsync;

tmpXMLHTTPRequest.open('GET',parFilename,tmpAsync);
var tmpRequest = tmpXMLHTTPRequest;
var tmpCB = parCB;
var tmpCBHandle = parCBHandle;
if (tmpAsync)
{
tmpXMLHTTPRequest.onreadystatechange = function()
{
if (tmpRequest.readyState == 4)
{
if (tmpRequest.status == 200)
{
tmpResponse = tmpRequest.responseText;
tmpResponseXML = tmpRequest.responseXML;
if (tmpCB)
tmpCB(tmpResponse,tmpResponseXML, tmpCBHandle);

tmpRequest.onreadystatechange = dummy;
tmpRequest = null;
}
}
}
}
tmpXMLHTTPRequest.setRequestHeader("If-Modified-Since", "Sat, 1 Jan 2005 00:00:00 GMT");
tmpXMLHTTPRequest.send("");

if (!tmpAsync)
{
if (tmpRequest.status == 200)
{
tmpResponse = tmpRequest.responseText;
tmpResponseXML = tmpRequest.responseXML;
if (tmpCB)
tmpCB(tmpResponse,tmpResponseXML);

tmpRequest = null;
}
}
}
}

function createDocument()
{
var tmpDoc = null;
if (document.implementation && document.implementation.createDocument)
{
tmpDoc = document.implementation.createDocument("","",null);
var tmpProcessingInstructions =
tmpDoc.createProcessingInstruction("xml",'version="1.0" encoding="UTF-8"');
tmpDoc.appendChild(tmpProcessingInstructions);
}
else if (window.ActiveXObject)
{
try
{
tmpDoc = new ActiveXObject("Microsoft.XMLDOM");
var tmpProcessingInstructions = tmpDoc.createProcessingInstruction("xml", 'version="1.0" encoding="UTF-8"');
tmpDoc.appendChild(tmpProcessingInstructions);
}
catch (e)
{
try
{
tmpDoc = new ActiveXObject("Msxml2.DOMDocument"); // refers to Msxml2.DOMDocument.3.0
var tmpProcessingInstructions = tmpDoc.createProcessingInstruction("xml", 'version="1.0" encoding="UTF-8"');
tmpDoc.appendChild(tmpProcessingInstructions);
}
catch (e)
{
alert("To display this page, please use a different browser! (Reason: Msxml2.DOMDocument not supported)")
}
}
}
else
{
alert("Could not create document");
}
return tmpDoc;
}

function createSOAPDocument()
{
var tmpDoc = createDocument();
if (tmpDoc)
{
var tmpRoot = tmpDoc.createElement("Soap:Envelope");
tmpRoot.setAttribute("xmlns:soap","http://schemas.xmlsoap.org/soap/envelope/");
tmpRoot.setAttribute("xmlns:xsi","http://www.w3.org/2001/XMLSchema-instance");
tmpRoot.setAttribute("xmlns:xsd","http://www.w3.org/2001/XMLSchema");

var tmpBody = tmpDoc.createElement("Soap:Body");

tmpRoot.appendChild(tmpBody);
tmpDoc.appendChild(tmpRoot);
}

return tmpDoc;
}

function XMLtoString(parDocument)
{
if (parDocument.xml)
{
return parDocument.xml;
}
else
{
var tmpXMLSerializer = new XMLSerializer();
return tmpXMLSerializer.serializeToString(parDocument);
}
}

function determineParams(parParamString)
{
var tmpResult = new Object();
var tmpURIParam = parParamString.replace(/^\?/,"");
var tmpParams = tmpURIParam.split(/\&/);
for (var tmpIndex = 0; tmpIndex < tmpParams.length; tmpIndex++)
{
var tmpParam = tmpParams[tmpIndex].split(/=/)
if (tmpParam.length == 2)
tmpResult[tmpParam[0]] = tmpParam[1];
}
return tmpResult;
}


function encodeBase64(parInputString)
{
var base64chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
var output = "";
var in1, in2, in3;
var out1, out2, out3, out4;
var i = 0;

do {
in1 = parInputString.charCodeAt(i++);
in2 = parInputString.charCodeAt(i++);
in3 = parInputString.charCodeAt(i++);
out1 = in1 >> 2;
out2 = ((in1 & 3) << 4) | (in2 >>> 4);
out3 = ((in2 & 15) << 2) | (in3 >>> 6);
out4 = in3 & 63;
if (isNaN(in2))
{
out3 = out4 = 64;
}
else if (isNaN(in3))
{
out4 = 64;
}

output = output + base64chars.charAt(out1) + base64chars.charAt(out2) +
base64chars.charAt(out3) + base64chars.charAt(out4);
} while (i < parInputString.length);

return output;
}

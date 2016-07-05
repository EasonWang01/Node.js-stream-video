function OPCItem(parItemHandle,parItemElement,parAdditionalElements)
{
this.mItemElement = parItemElement;
this.mItemHandle = parItemHandle;
this.mAdditionalElements = parAdditionalElements;
this.mRefCount = 1;
}

function OPCItemValue(parItemPath,parItemName,parItemHandle,parItemValue,parItemResultID)
{
this.mItemPath = parItemPath;
this.mItemName = parItemName;
this.mItemHandle = parItemHandle;
this.mItemValue = parItemValue;
this.mItemResultId = parItemResultID;
}

function OPCItemProperties(parItemPath,
parItemName,
parName,
parIsItem,
parHasChildren,
parResultId,
parValue,
parType,
parAccessRights,
parEnums,
parEffectiveness,
parIsEnum)
{
this.mItemPath = parItemPath;
this.mItemName = parItemName;
this.mName = parName;
this.mIsItem = parIsItem;
this.mHasChildren = parHasChildren;
this.mResultId = parResultId;
this.mValue = parValue;
this.mType = parType;
this.mAccessRights = parAccessRights;
this.mEffectiveness = parEffectiveness;
this.mEnums = parEnums;
this.mIsEnum = parIsEnum;
}

// --- RequestHandler ---
// TODO: alle send requests um die Parameter erweitern
function RequestHandler(parCallback,parSOAPAction,parResponseTag)
{
this.mXMLHttpRequest = null;
this.mSOAPAction = parSOAPAction;
this.mCallBack = parCallback;
this.mTimeout = null;
this.mState = 0;
this.sendRequest = function(parDocument, parAsync, parRedirectPath)
{
var tmpThis = this;
if (this.mState == 0)
{
this.mXMLHttpRequest = createHTTPRequest();
if (this.mXMLHttpRequest)
{
this.mXMLHttpRequest.onreadystatechange =
function()
{
if (tmpThis.mXMLHttpRequest.readyState == 4)
{
tmpThis.mState = 0;
clearTimeout(tmpThis.mTimeout);
tmpThis.mCallBack(tmpThis.mXMLHttpRequest.responseXML);
}
};
var tmpAsync = (parAsync != undefined) ? parAsync : true;

if(parRedirectPath != undefined)
this.mXMLHttpRequest.open("POST", parRedirectPath + "/soap/opcxml",tmpAsync);
else
this.mXMLHttpRequest.open("POST","/soap/opcxml",tmpAsync);

// for IE9
this.mXMLHttpRequest.setRequestHeader("Accept", "application/xml, text/xml, */*");
this.mXMLHttpRequest.setRequestHeader("Content-Type", "text/xml; charset=utf-8");
this.mXMLHttpRequest.setRequestHeader("SOAPAction", "http://opcfoundation.org/webservices/XMLDA/1.0/" + this.mSOAPAction);
var tmpTimeoutCB = function()
{
tmpThis.mState = 0;
tmpThis.mCallBack(null);
if (tmpThis.mXMLHttpRequest)
tmpThis.mXMLHttpRequest.abort();
};
this.mState = 1;
this.mTimeout = setTimeout(tmpTimeoutCB,20000);

if(typeof XMLSerializer == 'undefined'){
this.mXMLHttpRequest.send(parDocument);
}
else{
// IE9 fuegt automatisch noch Namespaces NS1, NS2 ...
// diese Namespaces muss man loeschen
var str = (new XMLSerializer()).serializeToString(parDocument); // get string from XML
str = str.replace(/xmlns:NS\d+=""\s+NS\d+:/ig,''); // delete from string NS1, NS2...
this.mXMLHttpRequest.send(str);
}
}
}
else
{
alert("Wrong status");
}
};
this.destructor = function()
{
if (this.mXMLHttpRequest)
{
this.mXMLHttpRequest.onreadystatechange = dummy;
this.mXMLHttpRequest.abort();
}
this.mXMLHttpRequest = null;
};
}

function dummy()
{
}

// --- createItemHandle ---
function OPCcreateItemHandle(parItemPath,parItemName)
{
return parItemPath + "@" + parItemName;
}

// --- ItemListManager ---
function OPCItemListManager(parListTag,parItemTag)
{
this.addItem = function(parSOAPDocument,parItemPath,parItemName,parItemHandle,parAditionalElements,parItemType)
{
var tmpItemHandle = parItemHandle;
if (!tmpItemHandle)
tmpItemHandle = OPCcreateItemHandle(parItemPath,parItemName);
if (!this.mItems[tmpItemHandle])
{
var tmpItemElement = parSOAPDocument.createElement(this.mItemTag);
tmpItemElement.setAttribute("ItemPath",parItemPath);
tmpItemElement.setAttribute("ItemName",parItemName);
tmpItemElement.setAttribute("ClientItemHandle",tmpItemHandle);
if (parItemType)
tmpItemElement.setAttribute("ReqType",parItemType);

var tmpItemList = parSOAPDocument.getElementsByTagName(this.mListTag);
tmpItemList[0].appendChild(tmpItemElement);
if (parAditionalElements)
{
for (var tmpIndex = 0; tmpIndex < parAditionalElements.length; tmpIndex++)
{
tmpItemList[0].appendChild(parAditionalElements[tmpIndex]);
}
}
var tmpItem = new OPCItem(tmpItemHandle,tmpItemElement,parAditionalElements);
this.mItems[tmpItemHandle] = tmpItem;
this.mItemCount++;
}
else
{
this.mItems[tmpItemHandle].mRefCount++;
}
return this.mItems[tmpItemHandle];
}
this.getItem = function(parItemHandle)
{
return this.mItems[parItemHandle];
}
this.removeItem = function(parSOAPDocument,parItemHandle)
{
if (this.mItems[parItemHandle])
{
var tmpItem = this.mItems[parItemHandle];
tmpItem.mRefCount--;
if (tmpItem.mRefCount <= 0)
{
delete this.mItems[parItemHandle];
this.mItemCount--;
var tmpItemList = parSOAPDocument.getElementsByTagName(this.mListTag);
tmpItemList[0].removeChild(tmpItem.mItemElement);
var tmpAdditionalElements = tmpItem.mAdditionalElements;
if (tmpAdditionalElements)
{
for (var tmpIndex = 0; tmpIndex < tmpAdditionalElements.length; tmpIndex++)
{
tmpItemList[0].removeChild(tmpItem.mAdditionalElements[tmpIndex]);
}
}
}
}
}
this.createItemValueList = function(parResponse,parItemTag)
{
var tmpResult = new Array();
var tmpItems;
if (parResponse)
{
tmpItems = parResponse.getElementsByTagName(parItemTag);
}

if (tmpItems)
{
var tmpIndex;
for (tmpIndex = 0; tmpIndex < tmpItems.length; tmpIndex++)
{
var tmpItemName;
var tmpItemPath;
var tmpItemHandle;
var tmpItemValue;
var tmpItemResult;

var tmpItem = tmpItems[tmpIndex];
var tmpItemAttributes = tmpItem.attributes;
var tmpItemAttribCount = tmpItemAttributes.length;
var tmpAttribIndex;
for (tmpAttribIndex = 0; tmpAttribIndex < tmpItemAttribCount; tmpAttribIndex++)
{
tmpItemResult = undefined;
var tmpAttribute = tmpItemAttributes[tmpAttribIndex];
var tmpAttribName = tmpAttribute.nodeName;
if (tmpAttribName == "ItemName")
tmpItemName = tmpAttribute.nodeValue;
else if (tmpAttribName == "ItemPath")
tmpItemPath = tmpAttribute.nodeValue;
else if (tmpAttribName == "ClientItemHandle")
tmpItemHandle = tmpAttribute.nodeValue;
else if (tmpAttribName == "ResultID")
tmpItemResult = tmpAttribute.nodeValue;
}
tmpItemValue = "Error";
var tmpValueNode = tmpItem.childNodes[0];
if (tmpValueNode)
tmpItemValue = (tmpValueNode.childNodes.length > 0) ?
tmpValueNode.childNodes[0].nodeValue : "";

tmpResult[tmpIndex] = new OPCItemValue(tmpItemPath,tmpItemName,tmpItemHandle,tmpItemValue,tmpItemResult);
}

tmpItems = null;
}

return tmpResult;
}
this.mItems = new Array();
this.mItemCount = 0;
this.mListTag = parListTag;
this.mItemTag = parItemTag;
}

function OPCGetProperties(parProperties)
{
var tmpItemPath = parProperties.getAttribute("ItemPath");
var tmpItemName = parProperties.getAttribute("ItemName");
var tmpResultId = parProperties.getAttribute("ResultID");
var tmpPropertyList = parProperties.childNodes;
var tmpEnums = undefined;
var tmpValue = undefined;
var tmpType = undefined;
var tmpIsEnum = false;
var tmpAccessRights = undefined;
var tmpEffectiveness = undefined;
var tmpListIndex = undefined;
if (!tmpResultId)
{
for (tmpListIndex = 0; tmpListIndex < tmpPropertyList.length; tmpListIndex++)
{
var tmpProperty = tmpPropertyList[tmpListIndex];
var tmpPropertyName = tmpProperty.getAttribute("Name");
switch (tmpPropertyName)
{
case "value":
{
var tmpPropertyValue = tmpProperty.childNodes[0];
if (tmpPropertyValue)
tmpValue = (tmpPropertyValue.childNodes.length > 0) ? tmpPropertyValue.childNodes[0].nodeValue : "";
}
break;
case "dataType":
{
var tmpPropertyValue = tmpProperty.childNodes[0];
tmpType = tmpPropertyValue.childNodes[0].nodeValue;
}
break;
case "accessRights":
{
var tmpPropertyValue = tmpProperty.childNodes[0];
tmpAccessRights = tmpPropertyValue.childNodes[0].nodeValue;
}
break;
case "effectiveness":
{
var tmpPropertyValue = tmpProperty.childNodes[0];
tmpEffectiveness = tmpPropertyValue.childNodes[0].nodeValue;
}
break;
case "euInfo":
{
var tmpEnumValues = tmpProperty.childNodes[0];
var tmpEnumCount = tmpEnumValues.childNodes.length;
tmpEnums = new Array();
for (var tmpEnumIndex = 0; tmpEnumIndex < tmpEnumCount; tmpEnumIndex++)
{
tmpEnums.push(tmpEnumValues.childNodes[tmpEnumIndex].childNodes[0].nodeValue);
}
}
break;
case "euType":
{
var tmpPropertyValue = tmpProperty.childNodes[0];
tmpIsEnum = (tmpPropertyValue.childNodes[0].nodeValue == 'enumerated');
}
break;
}
}
}

var tmpPropertyResult = new OPCItemProperties(tmpItemPath,
tmpItemName,
undefined,
true,
false,
tmpResultId,
tmpValue,
tmpType,
tmpAccessRights,
tmpEnums,
tmpEffectiveness,
tmpIsEnum);
return tmpPropertyResult;
}

// --- OPCGetPropertiesRequest ---
function OPCGetPropertiesRequest(parLocaleId,parResultCB,parAllProperties,parProperties,parRedirectPath,parRequestHandle)
{
// --- public functions ---
this.addItem = function(parItemPath,parItemName)
{
var tmpPropertiesArray = new Array();
var tmpItem = this.mItemListManager.addItem(this.mSOAPDocument,parItemPath,parItemName,undefined,tmpPropertiesArray);
return tmpItem.mItemHandle;
};
this.removeItem = function(parItemHandle)
{
this.mItemListManager.removeItem(parItemHandle);
}
this.sendGetPropertiesRequest = function(parAsync)
{
if (this.mRequestHandler)
{
if (parAsync == undefined)
parAsync = true;
this.mRequestHandler.sendRequest(this.mSOAPDocument, parAsync, this.mRedirectPath);
}
};
this.destructor = function()
{
this.mRequestHandler.destructor();
}

// --- private functions ---
this.procResult = function(parResult)
{
var tmpResult = new Array();
if (parResult)
{
var tmpPropertyLists = parResult.getElementsByTagName("PropertyLists");
if (tmpPropertyLists && (tmpPropertyLists.length > 0))
{
for (var tmpListsIndex = 0; tmpListsIndex < tmpPropertyLists.length; tmpListsIndex++)
{
var tmpPropertyResult = OPCGetProperties(tmpPropertyLists[tmpListsIndex]);
tmpResult.push(tmpPropertyResult);
}
}
}

if (this.mResultCB)
if (this.mResultCB(tmpResult,this.mRequestHandle))
this.destructor();
}

this.mSOAPDocument = createSOAPDocument();
this.mItemListManager = new OPCItemListManager("GetProperties","ItemIDs");
this.mResultCB = parResultCB;
this.mRedirectPath = (parRedirectPath != undefined) ? parRedirectPath : "";
this.mRequestHandle = parRequestHandle;
if (this.mSOAPDocument)
{
var tmpSOAPBody = this.mSOAPDocument.getElementsByTagName("Soap:Body");
if (tmpSOAPBody)
{
var tmpGetProperties = this.mSOAPDocument.createElement("GetProperties");
tmpGetProperties.setAttribute("LocaleId",parLocaleId);
if ((parAllProperties == undefined) || (parAllProperties == null) || (parAllProperties == true))
{
tmpGetProperties.setAttribute("ReturnAllProperties", "true");
}
tmpGetProperties.setAttribute("ReturnErrorText","true");
tmpGetProperties.setAttribute("ReturnPropertyValues","true");
tmpGetProperties.setAttribute("xmlns","http://opcfoundation.org/webservices/XMLDA/1.0/");
if (parProperties)
{
for (var tmpIndex = 0; tmpIndex < parProperties.length; tmpIndex++)
{
var tmpPropertiesElem = this.mSOAPDocument.createElement("PropertyNames");
var tmpPropertiesText = this.mSOAPDocument.createTextNode(parProperties[tmpIndex]);
tmpPropertiesElem.appendChild(tmpPropertiesText);
tmpGetProperties.appendChild(tmpPropertiesElem);
}
}
tmpSOAPBody[0].appendChild(tmpGetProperties);
}
else
this.mSOAPDocument = null;
}

var tmpThis = this;
var tmpCB = function(parResponse)
{
tmpThis.procResult(parResponse);
};
this.mRequestHandler = new RequestHandler(tmpCB,"GetProperties","GetPropertiesResponse");
}

// --- Status request ---
function OPCStatusRequest(parLocaleId,parResultCB)
{
// --- public functions ---
this.sendStatusRequest = function()
{
if (this.mRequestHandler)
{
this.mRequestHandler.sendRequest(this.mSOAPDocument, true, "");
}
};
this.destructor = function()
{
this.mRequestHandler.destructor();
};

// --- private functions ---
this.procResult = function(parResponse)
{
var tmpResult = parResponse;
if (parResponse)
{
var tmpAttribText = "";
var tmpStatusResult = parResponse.getElementsByTagName("GetStatusResult");
if (tmpStatusResult)
{
var tmpStatusResultAttributes = tmpStatusResult[0].attributes;
if (tmpStatusResultAttributes)
{
var tmpAtribCount = tmpStatusResultAttributes.length;
var tmpIndex;
for (tmpIndex = 0; tmpIndex < tmpAtribCount; tmpIndex++)
{
var tmpAttribute = tmpStatusResultAttributes[tmpIndex];
tmpAttribText += tmpAttribute.nodeName + ": " + tmpAttribute.nodeValue + "\n";
}
}
}
var tmpStatusInfo = parResponse.getElementsByTagName("StatusInfo");
if (tmpStatusInfo)
{
var tmpStatusInfoValue = tmpStatusInfo[0].childNodes[0].nodeValue;
tmpAttribText += "\n" + tmpStatusInfoValue + "\n";
}
}
if (this.mResultCB)
{
if (this.mResultCB(parResponse))
this.destructor();
}
};

this.mSOAPDocument = createSOAPDocument();
if (this.mSOAPDocument)
{
var tmpSOAPBody = this.mSOAPDocument.getElementsByTagName("Soap:Body");
if (tmpSOAPBody)
{
var tmpGetStatus = this.mSOAPDocument.createElement("GetStatus");
tmpGetStatus.setAttribute("LocaleID",parLocaleId);
tmpGetStatus.setAttribute("xmlns","http://opcfoundation.org/webservices/XMLDA/1.0/");
tmpSOAPBody[0].appendChild(tmpGetStatus);
}
else
this.mSOAPDocument = null;
}
var tmpThis = this;
var tmpCB = function(parResponse)
{
tmpThis.procResult(parResponse);
};
this.mResultCB = parResultCB;
this.mRequestHandler = new RequestHandler(tmpCB,"GetStatus","GetStatusResponse");
}

// --- Read request ---
function OPCReadRequest(parLocaleId,parResultCB)
{
// --- public functions ---
this.addItem = function(parItemPath,parItemName)
{
var tmpItem = this.mSOAPDocument.createElement("Items");
tmpItem.setAttribute("ItemPath",parItemPath);
tmpItem.setAttribute("ItemName",parItemName);

this.mItemList.appendChild(tmpItem);
};
this.sendReadRequest = function()
{
if (this.mRequestHandler)
{
this.mRequestHandler.sendRequest(this.mSOAPDocument);
}
};
this.destructor = function()
{
this.mRequestHandler.destructor();
}

// --- private functions ---
this.procResult = function(parResponse)
{
var tmpResult = new Array();
var tmpItems;
if (parResponse)
tmpItems = parResponse.getElementsByTagName("Items");

if (tmpItems)
{
var tmpIndex;
for (tmpIndex = 0; tmpIndex < tmpItems.length; tmpIndex++)
{
var tmpItemName = undefined;
var tmpItemPath = undefined;
var tmpItemValue = undefined;
var tmpItemResult = undefined;

var tmpItem = tmpItems[tmpIndex];
var tmpItemAttributes = tmpItem.attributes;
var tmpItemAttribCount = tmpItemAttributes.length;
var tmpAttribIndex;
for (tmpAttribIndex = 0; tmpAttribIndex < tmpItemAttribCount; tmpAttribIndex++)
{
var tmpAttribute = tmpItemAttributes[tmpAttribIndex];
var tmpAttribName = tmpAttribute.nodeName;
if (tmpAttribName == "ItemName")
tmpItemName = tmpAttribute.nodeValue;
else if (tmpAttribName == "ItemPath")
tmpItemPath = tmpAttribute.nodeValue;
else if (tmpAttribName == "ResultID")
tmpItemResult = tmpAttribute.nodeValue;
}
var tmpValueNode = tmpItem.firstChild;
tmpItemValue = "";
if (tmpValueNode && tmpValueNode.hasChildNodes())
tmpItemValue = tmpValueNode.firstChild.nodeValue;

var tmpItemHandle = OPCcreateItemHandle(tmpItemPath,tmpItemName);
tmpResult[tmpIndex] = new OPCItemValue(tmpItemPath,tmpItemName,tmpItemHandle,tmpItemValue,tmpItemResult);
}
}
if (this.mResultCB)
{
if (this.mResultCB(tmpResult))
this.destructor();
}
};

this.mSOAPDocument = createSOAPDocument();
this.mItemList = null;
this.mResultCB = parResultCB;
if (this.mSOAPDocument)
{
var tmpSOAPBody = this.mSOAPDocument.getElementsByTagName("Soap:Body");
if (tmpSOAPBody)
{
var tmpRead = this.mSOAPDocument.createElement("Read");
tmpRead.setAttribute("xmlns","http://opcfoundation.org/webservices/XMLDA/1.0/");
var tmpOptions = this.mSOAPDocument.createElement("Options");
tmpOptions.setAttribute("LocaleID",parLocaleId);
tmpOptions.setAttribute("ReturnItemName","true");
tmpOptions.setAttribute("ReturnItemPath","true");
this.mItemList = this.mSOAPDocument.createElement("ItemList");
this.mItemList.setAttribute("ReqType","xsd:string");

tmpRead.appendChild(tmpOptions);
tmpRead.appendChild(this.mItemList);
tmpSOAPBody[0].appendChild(tmpRead);
}
else
this.mSOAPDocument = null;
}
var tmpThis = this;
var tmpCB = function(parResponse)
{
tmpThis.procResult(parResponse);
};
this.mRequestHandler = new RequestHandler(tmpCB,"Read","ReadResponse");
}

// --- Write request ---
var gloOPCWriteRequestId = 0;
function OPCWriteRequest(parLocaleId,parResultCB)
{
// --- public functions ---
this.addItem = function(parItemPath,parItemName,parType)
{
var tmpItem = this.mItemListManager.addItem(this.mSOAPDocument,parItemPath,parItemName);
if (tmpItem.mRefCount == 1)
{
var tmpType = parType;
if (!tmpType)
tmpType = "xsd::string";

var tmpItemElement = tmpItem.mItemElement;
tmpItemElement.setAttribute("ValueTypeQualifier",tmpType);
var tmpValueElement = this.mSOAPDocument.createElement("Value");
tmpValueElement.setAttribute("xsi:type",tmpType);
var tmpValueTextNode = this.mSOAPDocument.createTextNode("0");
tmpValueElement.appendChild(tmpValueTextNode);
tmpItemElement.appendChild(tmpValueElement);
}
return tmpItem.mItemHandle;
};
this.removeItem = function(parItemHandle)
{
this.mItemListManager.removeItem(parItemHandle);
}
this.setItemValue = function(parItemHandle,parValue)
{
var tmpItem = this.mItemListManager.getItem(parItemHandle);
if (tmpItem)
{
tmpItem.mItemElement.childNodes[0].childNodes[0].nodeValue = parValue;
}
}
this.sendWriteRequest = function()
{
if (this.mRequestHandler)
{
this.mRequestHandler.sendRequest(this.mSOAPDocument);
}
};
this.destructor = function()
{
this.mRequestHandler.destructor();
}

// --- private functions ---
this.mSOAPDocument = createSOAPDocument();
this.mItemListManager = new OPCItemListManager("ItemList","Items");
this.mItemList = null;
this.mResultCB = parResultCB;

this.procResult = function(parResult)
{
var tmpResultList = this.mItemListManager.createItemValueList(parResult,"Items");
if (this.mResultCB)
if (this.mResultCB(tmpResultList))
this.destructor();
}

if (this.mSOAPDocument)
{
var tmpSOAPBody = this.mSOAPDocument.getElementsByTagName("Soap:Body");
if (tmpSOAPBody)
{
var tmpWrite = this.mSOAPDocument.createElement("Write");
tmpWrite.setAttribute("ReturnValuesOnReply","true");
tmpWrite.setAttribute("xmlns","http://opcfoundation.org/webservices/XMLDA/1.0/");
var tmpOptions = this.mSOAPDocument.createElement("Options");
tmpOptions.setAttribute("LocaleID",parLocaleId);
tmpOptions.setAttribute("ReturnItemName","true");
tmpOptions.setAttribute("ReturnItemPath","true");
this.mItemList = this.mSOAPDocument.createElement("ItemList");

tmpWrite.appendChild(tmpOptions);
tmpWrite.appendChild(this.mItemList);
tmpSOAPBody[0].appendChild(tmpWrite);
}
else
this.mSOAPDocument = null;
}

var tmpThis = this;
var tmpCB = function(parResponse)
{
tmpThis.procResult(parResponse);
};
this.mRequestHandler = new RequestHandler(tmpCB,"Write","WriteResponse");
this.mName = "OPCWriteRequest_" + gloOPCWriteRequestId++;
}

// --- Browse request ---
function OPCBrowseRequest(parLocaleId,parResultCB,parProperties,parReturnAllProperties,parReturnPropertyValues, parRedirectPath)
{
// --- public functions ---
this.sendBrowseRequest = function(parItemPath,parItemName)
{
switch (this.mState)
{
case 0: // IDLE
{
this.mItemPath = parItemPath;
this.mItemName = parItemName;

this.mBrowse.setAttribute("ItemPath",parItemPath);
this.mBrowse.setAttribute("ItemName",parItemName);
this.mBrowse.setAttribute("ContinuationPoint","0");
this.mIndex = 0;
this.mResult = new Array();

if(this.mRedirectPath)
{
this.mRequestHandler.sendRequest(this.mSOAPDocument, true , parRedirectPath);
}
else
{
this.mRequestHandler.sendRequest(this.mSOAPDocument);
}

// this.mRequestHandler.sendRequest(this.mSOAPDocument, true , parRedirectPath);
}
break;
}
};
this.destructor = function()
{
this.mRequestHandler.destructor();
}

// --- private functions ---
this.procResult = function(parResponse)
{
var tmpElements;
if (parResponse)
{
tmpElements = parResponse.getElementsByTagName("Elements");
if (tmpElements)
{
var tmpCount;
for (tmpCount = 0; tmpCount < tmpElements.length; tmpCount++,this.mIndex++)
{
var tmpItemName;
var tmpName;
var tmpItemPath;
var tmpIsItem;
var tmpHasChildren;
var tmpElement = tmpElements[tmpCount];
var tmpAttributes = tmpElement.attributes;
var tmpAttribCount = tmpAttributes.length;
var tmpAttribIndex;
for (tmpAttribIndex = 0; tmpAttribIndex < tmpAttribCount; tmpAttribIndex++)
{
var tmpAttribute = tmpAttributes[tmpAttribIndex];
var tmpAttribName = tmpAttribute.nodeName;
if (tmpAttribName == "Name")
tmpName = tmpAttribute.nodeValue;
else if (tmpAttribName == "ItemName")
tmpItemName = tmpAttribute.nodeValue;
else if (tmpAttribName == "ItemPath")
tmpItemPath = tmpAttribute.nodeValue;
else if (tmpAttribName == "IsItem")
tmpIsItem = (tmpAttribute.nodeValue == "true");
else if (tmpAttribName == "HasChildren")
tmpHasChildren = (tmpAttribute.nodeValue == "true");
}
var tmpItem = undefined;
if (tmpIsItem)
{
tmpItem = OPCGetProperties(tmpElement);
tmpItem.mName = tmpName;
tmpItem.mIsItem = tmpIsItem;
tmpItem.mHasChildren = tmpHasChildren;
}
else
{
tmpItem = new OPCItemProperties(tmpItemPath,
tmpItemName,
tmpName,
tmpIsItem,
tmpHasChildren);
}
this.mResult[this.mIndex] = tmpItem;
}
}

var tmpBrowseResponse = parResponse.getElementsByTagName("BrowseResponse");
if (tmpBrowseResponse && (tmpBrowseResponse.length > 0))
{
var tmpMoreElements = 0;
var tmpContinuationPoint = 0;

var tmpAttributes = tmpBrowseResponse[0].attributes;
var tmpAttribCount = tmpAttributes.length;
var tmpAttribIndex;
for (tmpAttribIndex = 0; tmpAttribIndex < tmpAttribCount; tmpAttribIndex++)
{
var tmpAttribute = tmpAttributes[tmpAttribIndex];
var tmpAttribName = tmpAttribute.nodeName;
if (tmpAttribName == "MoreElements")
tmpMoreElements = (tmpAttribute.nodeValue == "true");
else if (tmpAttribName == "ContinuationPoint")
tmpContinuationPoint = tmpAttribute.nodeValue;
}
if (tmpMoreElements && (tmpContinuationPoint > 0))
{
this.mBrowse.setAttribute("ContinuationPoint",tmpContinuationPoint);

if(this.mRedirectPath)
{
this.mRequestHandler.sendRequest(this.mSOAPDocument, true , parRedirectPath);
}
else
{
this.mRequestHandler.sendRequest(this.mSOAPDocument);
}

}
else
{
if (this.mResultCB)
this.mResultCB(this.mResult,this.mItemPath,this.mItemName);
}
}
else
if (this.mResultCB)
this.mResultCB(this.mResult,this.mItemPath,this.mItemName);
}
else
{
if (this.mResultCB)
this.mResultCB(this.mResult,this.mItemPath,this.mItemName);
}

this.mState = 0;
};

this.mItemPath = "";
this.mItemName = "";

// 0: IDLE
// 1: BUSY
this.mState = 0;
this.mResultCB = parResultCB;
this.mIndex = 0;
this.mBrowse;
this.mResult;

this.mSOAPDocument = createSOAPDocument();
if (this.mSOAPDocument)
{
var tmpSOAPBody = this.mSOAPDocument.getElementsByTagName("Soap:Body");
if (tmpSOAPBody)
{
this.mBrowse = this.mSOAPDocument.createElement("Browse");
this.mBrowse.setAttribute("LocaleID",parLocaleId);
this.mBrowse.setAttribute("MaxElementsReturned","30");
var tmpReturnAllProperties = ((parReturnAllProperties != undefined) && parReturnAllProperties);
this.mBrowse.setAttribute("ReturnAllProperties",tmpReturnAllProperties);
this.mBrowse.setAttribute("ReturnErrorText","false");
var tmpReturnPropertyValues = ((parReturnPropertyValues != undefined) && parReturnPropertyValues);
this.mBrowse.setAttribute("ReturnPropertyValues",tmpReturnPropertyValues);
this.mBrowse.setAttribute("xmlns","http://opcfoundation.org/webservices/XMLDA/1.0/");
tmpSOAPBody[0].appendChild(this.mBrowse);
if (parProperties)
{
for (var tmpIndex = 0; tmpIndex < parProperties.length; tmpIndex++)
{
var tmpPropertyElem = this.mSOAPDocument.createElement("PropertyNames");
var tmpPropertyText = this.mSOAPDocument.createTextNode(parProperties[tmpIndex]);
tmpPropertyElem.appendChild(tmpPropertyText);
this.mBrowse.appendChild(tmpPropertyElem);
}
}
}
}
this.mRedirectPath = parRedirectPath;
var tmpThis = this;
var tmpCB = function(parResponse)
{
tmpThis.procResult(parResponse);
};
this.mRequestHandler = new RequestHandler(tmpCB,"Browse","BrowseResponse");
}

// --- Subscription ---
function OPCSubscriptionRequest(parLocaleId,parResultCB,parCancelCB)
{
// --- public functions ---
this.refresh = function(parReturnAllItems)
{
if (this.mItemListManager.mItemCount > 0)
{
switch (this.mState)
{
case 0: // IDLE
{
this.mState = 1;
this.sendSubscribeRequest();
}
break;

case 2: // INSTALLED
{
this.mState = 3;
this.sendSubscriptionPolledRefresh(parReturnAllItems);
}
break;
}
}
}
this.addItem = function(parItemPath,parItemName,parItemHandle,parItemType)
{
return this.mItemListManager.addItem(this.mSubscribeSOAPDocument,parItemPath,parItemName,parItemHandle,undefined,parItemType).mItemHandle;
}
this.removeItem = function(parItemHandle)
{
this.mItemListManager.removeItem(this.mSubscribeSOAPDocument,parItemHandle);
}
this.cancel = function()
{
switch (this.mState)
{
case 0: // IDLE
{
this.procCancelResponse();
}
break;
case 1: // INSTALLING
{
this.mState = 5;
}
break;
case 2: // INSTALLED
{
this.mState = 4;
this.sendSubscriptionCancel();
}
break;
case 3: // REFRESHING
{
this.mState = 6;
}
}
};
this.destructor = function()
{
switch (this.mState)
{
case 0: // IDLE
case 1: // INSTALLING
{
}
break;
case 2: // INSTALLED
case 3: // REFRESHING
{
this.sendSubscriptionCancel(false);
}
break;
}
this.mState = 255;
this.mSubscribeRequestHandler.destructor();
this.mSubscriptionPolledRefreshRequestHandler.destructor();
this.mSubscriptionCancelRequestHandler.destructor();
};

// --- private functions ---
this.procResult = function(parResponse)
{
if (parResponse)
{
switch (this.mState)
{
case 0:
{
if (this.mResultCB)
this.mResultCB(undefined,tmpResult,undefined);
}
break;
case 1: // INSTALLING
{
var tmpResult = "OK";
var tmpReplyTime;
var tmpSubscribeResult = parResponse.getElementsByTagName("SubscribeResult");
if (tmpSubscribeResult.length > 0)
{
tmpReplyTime = tmpSubscribeResult[0].getAttribute("ReplyTime");
this.mReplyTime = tmpReplyTime;
tmpSubscribeResult = null;
}
//          else
//            tmpResult = "INVALID_RESPONSE";

if (tmpResult == "OK")
{
var tmpSubscribeResponse = parResponse.getElementsByTagName("SubscribeResponse");
if (tmpSubscribeResponse.length > 0)
{
var tmpServerSubHandle = tmpSubscribeResponse[0].getAttribute("ServerSubHandle");
if (tmpServerSubHandle)
{
var tmpServerSubHandleNode = this.mPolledRefreshDocument.getElementsByTagName("ServerSubHandles");
var tmpServerSubHandleTextNode = this.mPolledRefreshDocument.createTextNode(tmpServerSubHandle);
var tmpOldNode = tmpServerSubHandleNode[0].firstChild;
if (tmpOldNode)
tmpServerSubHandleNode[0].replaceChild(tmpServerSubHandleTextNode, tmpOldNode);
else
tmpServerSubHandleNode[0].appendChild(tmpServerSubHandleTextNode);
tmpServerSubHandleNode = null;
tmpServerSubHandleTextNode = null;

var tmpSubscriptionCancel = this.mSubscriptionCancelDocument.getElementsByTagName("SubscriptionCancel");
tmpSubscriptionCancel[0].setAttribute("ServerSubHandle", tmpServerSubHandle);
tmpSubscriptionCancel = null;
tmpServerSubHandle = null;
tmpSubscribeResponse = null;
this.mState = 2;
}
else
this.mState = 0;
var tmpResultList = this.mItemListManager.createItemValueList(parResponse,"ItemValue");
if (this.mResultCB)
this.mResultCB(tmpResultList,tmpResult,tmpReplyTime);
}
}

if (tmpResult != "OK")
{
this.mState = 0;
var tmpResultList = this.mItemListManager.createItemValueList(parResponse,"ItemValue");
if (this.mResultCB)
this.mResultCB(tmpResultList,"OK",tmpReplyTime);
}
}
break;

case 2: // INSTALLED
case 3: // REFRESHING
{
var tmpResult = "OK";
var tmpReplyTime;
var tmpInvalidServerSubHandles = parResponse.getElementsByTagName("InvalidServerSubHandles");
if (tmpInvalidServerSubHandles.length == 0)
{
var tmpSubscriptionPolledRefreshResult = parResponse.getElementsByTagName("SubscriptionPolledRefreshResult");
if (tmpSubscriptionPolledRefreshResult.length > 0)
{
tmpReplyTime = tmpSubscriptionPolledRefreshResult[0].getAttribute("ReplyTime");
this.mReplyTime = tmpReplyTime;
tmpSubscriptionPolledRefreshResult = null;
}
else
tmpResult = "INVALID_RESPONSE";
}
else
tmpResult = "INVALID_SERVER_SUBHANDLE";

if (tmpResult == "OK")
{
var tmpResultList = this.mItemListManager.createItemValueList(parResponse,"Items");
this.mState = 2;
if (this.mResultCB)
this.mResultCB(tmpResultList,tmpResult,tmpReplyTime);
}
else
{
this.mState = 0;
if (this.mResultCB)
this.mResultCB(undefined,tmpResult,tmpReplyTime);
}
}
break;

case 5: // INSTALLING_BEFORE_CANCELLING
{
var tmpSubscribeResponse = parResponse.getElementsByTagName("SubscribeResponse");
if (tmpSubscribeResponse.length > 0)
{
var tmpServerSubHandle = tmpSubscribeResponse[0].getAttribute("ServerSubHandle");
if (tmpServerSubHandle)
{
var tmpSubscriptionCancel = this.mSubscriptionCancelDocument.getElementsByTagName("SubscriptionCancel");
if (tmpSubscriptionCancel)
{
tmpSubscriptionCancel[0].setAttribute("ServerSubHandle", tmpServerSubHandle);
tmpSubscriptionCancel = null;
}
tmpServerSubHandle = null;
tmpSubscribeResponse = null;
this.mState = 2;
this.cancel();
}
else
{
this.mState = 0;
if (this.mCancelCB)
this.mCancelCB();
}
}
else
this.mState = 0;
}
break;

case 6: // REFRESHING_BEFORE_CANCELLING
{
this.mState = 2;
this.cancel();
}
break;

default:
{
alert(this.mState);
}
break;
}
}
else
{
this.mState = 0;
if (this.mResultCB)
this.mResultCB(undefined,"NO_RESPONSE",undefined);
}
}
this.procCancelResponse = function()
{
this.mState = 0;
if (this.mCancelCB)
{
this.mCancelCB();
}
};
this.sendSubscribeRequest = function()
{
if (this.mSubscribeRequestHandler)
{
this.mSubscribeRequestHandler.sendRequest(this.mSubscribeSOAPDocument);
}
};
this.sendSubscriptionPolledRefresh = function(parReturnAllItems)
{
if (this.mSubscriptionPolledRefreshRequestHandler)
{
this.mPolledRefreshElement.setAttribute("HoldTime",this.mReplyTime);
if (parReturnAllItems == undefined)
parReturnAllItems = false;
this.mPolledRefreshElement.setAttribute("ReturnAllItems",parReturnAllItems);
this.mSubscriptionPolledRefreshRequestHandler.sendRequest(this.mPolledRefreshDocument);
}
};
this.sendSubscriptionCancel = function(parAsync)
{
if (this.mSubscriptionCancelRequestHandler)
{
var tmpAsync = (parAsync == undefined) ? true : parAsync;
this.mSubscriptionCancelRequestHandler.sendRequest(this.mSubscriptionCancelDocument,tmpAsync);
}
};

// --- private data ---
this.mSubscribeSOAPDocument = createSOAPDocument();
this.mPolledRefreshDocument = createSOAPDocument();
this.mPolledRefreshElement;
this.mForceRefresh = false;
this.mSubscriptionCancelDocument = createSOAPDocument();
this.mResultCB = parResultCB;
this.mCancelCB = parCancelCB;
this.mItemListManager = new OPCItemListManager("ItemList","Items");

this.mReplyTime;
// 0: IDLE
// 1: INSTALLING
// 2: INSTALLED
// 3: REFRESHING
// 4: CANCELLING
// 5: INSTALLING_BEFORE_CANCELLING
// 6: REFRESHING_BEFORE_CANCELLING
this.mState = 0;

if (this.mSubscribeSOAPDocument)
{
var tmpSOAPBody = this.mSubscribeSOAPDocument.getElementsByTagName("Soap:Body");
if (tmpSOAPBody)
{
var tmpSubscribe = this.mSubscribeSOAPDocument.createElement("Subscribe");
tmpSubscribe.setAttribute("ReturnValuesOnReply","true");
tmpSubscribe.setAttribute("SubscriptionPingRate","0");
tmpSubscribe.setAttribute("xmlns","http://opcfoundation.org/webservices/XMLDA/1.0/");
var tmpOptions = this.mSubscribeSOAPDocument.createElement("Options");
tmpOptions.setAttribute("LocaleID",parLocaleId);
tmpOptions.setAttribute("ReturnDiagnosticInfo","false");
tmpOptions.setAttribute("ReturnErrorText","true");
tmpOptions.setAttribute("ReturnItemName","true");
tmpOptions.setAttribute("ReturnItemPath","true");
tmpOptions.setAttribute("ReturnItemTime","false");
var tmpItemList = this.mSubscribeSOAPDocument.createElement("ItemList");
//      tmpItemList.setAttribute("LocaleID",parLocaleId);
//      tmpItemList.setAttribute("ReturnDiagnosticInfo","false");
//      tmpItemList.setAttribute("ReturnErrorText","true");
//      tmpItemList.setAttribute("ReturnItemName","true");
//      tmpItemList.setAttribute("ReturnItemPath","true");
//      tmpItemList.setAttribute("ReturnItemTime","false");

tmpSubscribe.appendChild(tmpOptions);
tmpSubscribe.appendChild(tmpItemList);
tmpSOAPBody[0].appendChild(tmpSubscribe);
tmpOptions = null;
tmpSubscribe = null;
tmpSOAPBody = null;
}
}
if (this.mPolledRefreshDocument)
{
var tmpSOAPBody = this.mPolledRefreshDocument.getElementsByTagName("Soap:Body");
if (tmpSOAPBody)
{
this.mPolledRefreshElement = this.mPolledRefreshDocument.createElement("SubscriptionPolledRefresh");
this.mPolledRefreshElement.setAttribute("HoldTime",this.mReplyTime);
this.mPolledRefreshElement.setAttribute("ReturnAllItems","false");
this.mPolledRefreshElement.setAttribute("WaitTime","1000");
this.mPolledRefreshElement.setAttribute("xmlns","http://opcfoundation.org/webservices/XMLDA/1.0/");
var tmpOptions = this.mPolledRefreshDocument.createElement("Options");
tmpOptions.setAttribute("LocaleID","de");
tmpOptions.setAttribute("ReturnDiagnosticInfo","false");
tmpOptions.setAttribute("ReturnErrorText","false");
tmpOptions.setAttribute("ReturnItemName","true");
tmpOptions.setAttribute("ReturnItemPath","true");
tmpOptions.setAttribute("ReturnItemTime","false");
var tmpServerSubHandles = this.mPolledRefreshDocument.createElement("ServerSubHandles");
this.mPolledRefreshElement.appendChild(tmpOptions);
this.mPolledRefreshElement.appendChild(tmpServerSubHandles);
tmpSOAPBody[0].appendChild(this.mPolledRefreshElement);
tmpOptions = null;
tmpServerSubHandles = null;
tmpSOAPBody = null;
}
}
if (this.mSubscriptionCancelDocument)
{
var tmpSOAPBody = this.mSubscriptionCancelDocument.getElementsByTagName("Soap:Body");
if (tmpSOAPBody)
{
var tmpSubscriptionCancel = this.mSubscriptionCancelDocument.createElement("SubscriptionCancel");
tmpSubscriptionCancel.setAttribute("xmlns","http://opcfoundation.org/webservices/XMLDA/1.0/");
tmpSOAPBody[0].appendChild(tmpSubscriptionCancel);
tmpSubscriptionCancel = null;
tmpSOAPBody = null;
}
}

var tmpThis = this;
var tmpCB = function(parResponse)
{
tmpThis.procResult(parResponse);
};
this.mSubscribeRequestHandler = new RequestHandler(tmpCB,"Subscribe","SubscribeResponse");
this.mSubscriptionPolledRefreshRequestHandler = new RequestHandler(tmpCB,"SubscriptionPolledRefresh","SubscriptionPolledRefreshResponse");
var tmpCancelCB = function()
{
tmpThis.procCancelResponse();
}
this.mSubscriptionCancelRequestHandler = new RequestHandler(tmpCancelCB,"SubscriptionCancel","SubscriptionCancelResponse");
}

// --- OPCSubscriptionAutoRefresh ---
function OPCSubscriptionAutoRefresh(parLocaleId,parResultCB,parCancelCB,parCycleTime,parReturnAllItems)
{
// --- public functions ---
this.startRefresh = function()
{
switch (this.mState)
{
case 0: // IDLE
case 5: // CANCELLED
{
this.mState = 1;
this.mSubscription.refresh();
}
break;
}
}
this.restart = function()
{
switch (this.mState)
{
case 0: // IDLE
{
this.startRefresh();
}
break;
case 2: // WAITING_FOR_TIMEOUT
clearTimeout(this.mTimer);
case 1: // WAITING_FOR_RESPONSE
{
this.mState = 3;
this.mSubscription.cancel();
}
break;
case 3: // WAITING_FOR_RESTART
{
}
break;
}
}
this.cancel = function()
{
switch (this.mState)
{
case 2: // WAITING_FOR_TIMEOUT
clearTimeout(this.mTimer);
case 1: // WAITING_FOR_RESPONSE
case 3: // WAITING_FOR_RESTART
{
this.mState = 4;
this.mSubscription.cancel();
}
break;
}
}
this.addItem = function(parItemPath,parItemName,parItemHandle,parNoAutoRestart,parItemType)
{
var tmpItemHandle = this.mSubscription.addItem(parItemPath,parItemName,parItemHandle,parItemType);
if (!(parNoAutoRestart && (parNoAutoRestart == true)))
this.restart();
return tmpItemHandle;
}
this.removeItem = function(parItemHandle)
{
this.mSubscription.removeItem(parItemHandle);
this.restart();
}
this.destructor = function()
{
this.mState = 255;
this.mSubscription.destructor();
}

// --- private functions ---
this.refresh = function()
{
switch (this.mState)
{
case 2: // WAITING_FOR_TIMEOUT
{
this.mState = 1;
this.mSubscription.refresh(this.mReturnAllItems);
}
break;
}
}
this.procResult = function(parResultList,parResult,parReplyTime)
{
switch (this.mState)
{
case 1: // WAITING_FOR_RESPONSE
{
if (parResult == "OK")
{
this.mState = 2;
if (this.mResultCB)
this.mResultCB(parResultList,parResult,parReplyTime);

var tmpThis = this;
var tmpTimerCB = function()
{
tmpThis.refresh();
}
this.mTimer = setTimeout(tmpTimerCB,this.mCycleTime);
}
else if (parResult == "INVALID_SERVER_SUBHANDLE")
{
this.mState = 0;
this.startRefresh();
}
else
{
}
}
break;
}
}
this.procCancelCB = function()
{
switch (this.mState)
{
case 3: // WAITING_FOR_RESTART
{
this.mState = 0;
this.startRefresh();
}
break;
case 4: // CANCELLING
{
this.mState = 5;
if (this.mCancelCB)
this.mCancelCB();
}
}
}


var tmpThis = this;
var tmpResultCB = function(parResultList,parResult,parReplyTime)
{
tmpThis.procResult(parResultList,parResult,parReplyTime);
};
var tmpCancelCB = function()
{
tmpThis.procCancelCB();
};
this.mSubscription = new OPCSubscriptionRequest(parLocaleId,tmpResultCB,tmpCancelCB);

// 0: IDLE
// 1: WAITING_FOR_RESPONSE
// 2: WAITING_FOR_TIMEOUT
// 3: WAITING_FOR_RESTART
// 4: CANCELLING
// 5: CANCELLED
this.mState = 0;
this.mTimer;
this.mCycleTime = parCycleTime;
this.mResultCB = parResultCB;
this.mCancelCB = parCancelCB;
this.mReturnAllItems = parReturnAllItems;
}

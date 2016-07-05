
var PosNum;
var id_1=["setSpeed","setAddSpeed","setSubSpeed","setAddAddSpeed"];
var var_1=["unit/dHdGlobal.gsHMIdata.sJog.r64Velo","unit/dHdGlobal.gsHMIdata.sJog.r64Accel","unit/dHdGlobal.gsHMIdata.sJog.r64Decel","unit/dHdGlobal.gsHMIdata.sJog.r64Jerk"];
var id_2=["setPosition","inputMethod","turnMethod"]
var var_2=["unit/dHdGlobal.gsHMIdata.r64HomingPosition","unit/dHdGlobal.gsHMIdata.i32InputMode","unit/dHdGlobal.gsHMIdata.i32Direction"]
var id_3=["setVibSpeed","setVibAddSpeed","setVibSubSpeed","setVibAddAddSpeed","setVibAngle","setVibVibSpeed"]

var var_3=["unit/dHdGlobal.gsHMIdata.sShock.r64Velo"
,"unit/dHdGlobal.gsHMIdata.sShock.r64Accel",
"unit/dHdGlobal.gsHMIdata.sShock.r64Decel",
"unit/dHdGlobal.gsHMIdata.sShock.r64Jerk","unit/dHdGlobal.gsHMIdata.sShock.r64Angle",
"unit/dHdGlobal.gsHMIdata.sShock.i32Number"
]

var id_4=["setCenSpeed","setCenAddSpeed","setCenSubSpeed","setCenAddAddSpeed"]
var var_4=["unit/dHdGlobal.gsHMIdata.sCentrifugal.r64Velo","unit/dHdGlobal.gsHMIdata.sCentrifugal.r64Accel","unit/dHdGlobal.gsHMIdata.sCentrifugal.r64Decel","unit/dHdGlobal.gsHMIdata.sCentrifugal.r64Jerk"]
var id_5=["multiplePos"]
var var_5=["unit/dHdGlobal.gsHMIdata.i32StationNumber"]

var id_6=["day"]
var var_6=["unit/dHdGlobal.gsHMIdata.sCentrifugal.t32time"]

$(document).ready(function(){
    $("#footer").hide();
    ///////////////////
    ReadValue(id_1,var_1);
    ReadValue(id_2,var_2);
    ReadValue(id_3,var_3);
    ReadValue(id_4,var_4);
    ReadValuePosNum(id_5,var_5);
    ReadValueTime(id_6,var_6);
    /////////////////////
    buildSubscription();
    ///////////////////////正轉
    document.getElementById("btnright1").addEventListener('mousedown',btnrightf1,false);
    document.getElementById("btnright1").addEventListener('mouseup',
    btnrightf2,false);


//////////////////////////////反轉
     document.getElementById("btnleft1").addEventListener('mousedown',function(){

        writeValueFN("true", "unit/dHdGlobal.gsHMIdata.sJog.b2Reversion");
     
     },false);
     document.getElementById("btnleft1").addEventListener('mouseup',function(){
        
        writeValueFN("false", "unit/dHdGlobal.gsHMIdata.sJog.b2Reversion");
     
     },false);
///////////////////////////////位置設定的設定
document.getElementById("setPositionButton").addEventListener('mousedown',function(){

        writeValueFN("true", "unit/dHdGlobal.gsHMIdata.b2Homing");
     
     },false);
document.getElementById("setPositionButton").addEventListener('mouseup',function(){

        writeValueFN("false", "unit/dHdGlobal.gsHMIdata.b2Homing");
     
     },false);

/////////////////////////////////
     document.getElementById("upperhide").addEventListener('click',
    function(){$("#header").hide();$("#footer").show();},false);

     document.getElementById("footerhide").addEventListener('click',
    function(){$("#footer").hide();$("#header").show();},false);



//-------------------------------------------------------------------------------
    document.getElementById("setSpeed").addEventListener("change", function(){
   
        writeValueFN(this.value, "unit/dHdGlobal.gsHMIdata.sJog.r64Velo");

});
    document.getElementById("setAddSpeed").addEventListener("change", function(){
   
        writeValueFN(this.value, "unit/dHdGlobal.gsHMIdata.sJog.r64Accel");

});
    document.getElementById("setSubSpeed").addEventListener("change", function(){
   
        writeValueFN(this.value, "unit/dHdGlobal.gsHMIdata.sJog.r64Decel");

});
    document.getElementById("setAddAddSpeed").addEventListener("change", function(){
   
        writeValueFN(this.value, "unit/dHdGlobal.gsHMIdata.sJog.r64Jerk");

});
    document.getElementById("setPosition").addEventListener("change", function(){
   
        writeValueFN(this.value, "unit/dHdGlobal.gsHMIdata.r64HomingPosition");

});
     
 document.getElementById("inputMethod").addEventListener("change", function(){
   
        writeValueFN(this.value, "unit/dHdGlobal.gsHMIdata.i32InputMode");

});
document.getElementById("turnMethod").addEventListener("change", function(){
   
        writeValueFN(this.value, "unit/dHdGlobal.gsHMIdata.i32Direction");

});
/////////////////工位數量
document.getElementById("multiplePos").addEventListener("change", function(){
   
        writeValueFN(this.value, "unit/dHdGlobal.gsHMIdata.i32StationNumber");
          
});
document.getElementById("multiplePos").addEventListener("change", myFunction
 
          
);
/////////////////////////
///////////////////第二頁
document.getElementById("setVibSpeed").addEventListener("change", function(){
   
        writeValueFN(this.value, "unit/dHdGlobal.gsHMIdata.sShock.r64Velo");

});
document.getElementById("setVibAddSpeed").addEventListener("change", function(){
   
        writeValueFN(this.value, "unit/dHdGlobal.gsHMIdata.sShock.r64Accel");

});
document.getElementById("setVibSubSpeed").addEventListener("change", function(){
   
        writeValueFN(this.value, "unit/dHdGlobal.gsHMIdata.sShock.r64Decel");

});
document.getElementById("setVibAddAddSpeed").addEventListener("change", function(){
   
        writeValueFN(this.value, "unit/dHdGlobal.gsHMIdata.sShock.r64Jerk");

});
document.getElementById("setVibAngle").addEventListener("change", function(){
   
        writeValueFN(this.value, "unit/dHdGlobal.gsHMIdata.sShock.r64Angle");

});
document.getElementById("setVibVibSpeed").addEventListener("change", function(){
   
        writeValueFN(this.value, "unit/dHdGlobal.gsHMIdata.sShock.i32Number");

});

document.getElementById("setCenSpeed").addEventListener("change", function(){
   
        writeValueFN(this.value, "unit/dHdGlobal.gsHMIdata.sCentrifugal.r64Velo");

});

document.getElementById("setCenAddSpeed").addEventListener("change", function(){
   
        writeValueFN(this.value, "unit/dHdGlobal.gsHMIdata.sCentrifugal.r64Accel");

});


document.getElementById("setCenSubSpeed").addEventListener("change", function(){
   
        writeValueFN(this.value, "unit/dHdGlobal.gsHMIdata.sCentrifugal.r64Decel");

});
document.getElementById("setCenAddAddSpeed").addEventListener("change", function(){
   
        writeValueFN(this.value, "unit/dHdGlobal.gsHMIdata.sCentrifugal.r64Jerk");

});



//-------------------------------------------------------------------------------
});

function writeValueFN(tmpItemValue, tmpString) {
////////////////以下為opcwriterequest的callback
    var tmpWriteCB = function (parWriteResult) {

        tmpWrite.destructor();

        return true;

    }
///////////EN為LANGUAGE/////tmpWriteCB為callback
    var tmpWrite = new OPCWriteRequest("EN", tmpWriteCB);

    var tmpItemHandle = tmpWrite.addItem("SIMOTION", tmpString);
////////////tmpItemHandle 是variable from the variables list 
    tmpWrite.setItemValue(tmpItemHandle, tmpItemValue);

    tmpWrite.sendWriteRequest();
//-------------------------------------------------------------------------------

}
function btnrightf1(id){

        writeValueFN("true", "unit/dHdGlobal.gsHMIdata.sJog.b2Forward");
     
        };

        function btnrightf2(id){ 
        
        writeValueFN("false", "unit/dHdGlobal.gsHMIdata.sJog.b2Forward");
        
    };

///////////////////////////////



var SubscriptionCycle = 50;///subscription讀取頻率

var SubscriptionInstance = null;

var SubscriptionData =

    {

        ItemList: new Array(),
         
        LastIndex: 0

    };
function buildSubscription() {


    SubscriptionData.ItemList[SubscriptionData.LastIndex] = new Object();

    SubscriptionData.ItemList[SubscriptionData.LastIndex].id = "currentPosition";

    SubscriptionData.ItemList[SubscriptionData.LastIndex].style = "floatValue";

    SubscriptionData.ItemList[SubscriptionData.LastIndex].itemPath = "SIMOTION";

    SubscriptionData.ItemList[SubscriptionData.LastIndex].itemName = "unit/dHdGlobal.gsHMIdata.sInformation.r64Position";

    SubscriptionData.LastIndex = SubscriptionData.LastIndex + 1;


    SubscriptionData.ItemList[SubscriptionData.LastIndex] = new Object();

    SubscriptionData.ItemList[SubscriptionData.LastIndex].id = "currentSpeed";

    SubscriptionData.ItemList[SubscriptionData.LastIndex].style = "floatValue";

    SubscriptionData.ItemList[SubscriptionData.LastIndex].itemPath = "SIMOTION";

    SubscriptionData.ItemList[SubscriptionData.LastIndex].itemName = "unit/dHdGlobal.gsHMIdata.sInformation.r64Velocity";

    SubscriptionData.LastIndex = SubscriptionData.LastIndex + 1;
    
    
    SubscriptionInstance = subscription(SubscriptionInstance, SubscriptionCycle, SubscriptionData.ItemList);
}



function subscription(instance, cycleTime, parItemList) {

    var HandleList = new Array;


    if (!instance) {

        //Rckgabefunktion fr die subscription. Diese Funktion beschreibt wie die aktualisierten Variablen auf der HTML-Seite dargestellt werden sollen.

        var tmpSubscriptionCB = function (CurrentValues) {

            for (var i = 0; i < CurrentValues.length; i++) {

                for (var k = 0; k < HandleList.length; k++) {

                    if (CurrentValues[i].mItemHandle == HandleList[k]) {

                        var Value = "empty";

                        switch (parItemList[k].style) {

                            //Diese switch-case Anweisung beschreibt das unterschiedliche Vorgehen der Aktualisierung je nach verwendetem "style" in der oben beschriebenen Itemlist der "buildSubscription"-Funktion.

                            case "floatValue":

                                //Wenn Typ ist "floatValue" -> schreiben des neuen Variablenwertes in das angebundene HTML-Element.
                                {

                                    var tmpValue = document.getElementById(parItemList[k].id);

                                    Value = parseFloat(CurrentValues[i].mItemValue).toFixed(2);

                                    tmpValue.value = Value;

                                    break;
                                }

                            case "floatSpeed":

                                //Wenn Typ ist "floatValue" -> schreiben des neuen Variablenwertes in das angebundene HTML-Element.

                                {

                                    var tmpValue = document.getElementById(parItemList[k].id);

                                    Value = parseFloat(CurrentValues[i].mItemValue).toFixed(1);

                                    tmpValue.value = Value;

                                    break;

                                }
                            


                            default:

                                //Wenn Typ unbekannt oder nicht angegeben, dann wird versucht, den aktualisierten Variablenwert in das angebundene HTML-Element zu schreiben.

                                {

                                    var tmpValue = document.getElementById(parItemList[k].id);

                                    if(tmpValue != null)
                                    {
                                        Value = CurrentValues[i].mItemValue;

                                        tmpValue.value = Value;
                                    }

                                    break;

                                };

                        }

                    }

                }

            }

        };

        var tmpCancelCB = function () {

            if (instance) {

                instance.destructor();

                instance = null;

            }

        };



        instance = new OPCSubscriptionAutoRefresh("DE", tmpSubscriptionCB, tmpCancelCB, cycleTime);

        for (var i = 0; i < parItemList.length; i++) {

            HandleList[i] = instance.addItem(parItemList[i].itemPath, parItemList[i].itemName);

        }

        return instance;

    }

}
///////////////////////////////////////
function ReadValue(id, SimotionVariable) {/////////函式一開始會先執行最下方sendReadRequest一次送完
    var tmpReadCB = function(parResponse)///////此為閉包
    {///伺服器回應parResponse
        for (var tmpIndex = 0; tmpIndex < parResponse.length; tmpIndex++)
        {
            var tmpItemValue = parResponse[tmpIndex];//console.log(tmpItemValue);
            var tmpValue = (tmpItemValue.mItemValue) ? tmpItemValue.mItemValue : tmpItemValue.mItemResultId;
            if(document.getElementById(id[tmpIndex]) != null)
            {///////////將讀到的值給陣列中ID顯示
             
                document.getElementById(id[tmpIndex]).value = (tmpValue); 
            }
        }
        return true;
    }
    var tmpReadRequest = new OPCReadRequest("DE", tmpReadCB);
    for(var i = 0; i < id.length; i++)
    {
        tmpReadRequest.addItem("SIMOTION", SimotionVariable[i]);
    }
    tmpReadRequest.sendReadRequest();
}
///////////////////////////////////////
function ReadValueTime(id, SimotionVariable) {/////////函式一開始會先執行最下方sendReadRequest一次送完
    var tmpReadCB = function(parResponse)///////此為閉包
    {///伺服器回應parResponse
        for (var tmpIndex = 0; tmpIndex < parResponse.length; tmpIndex++)
        {
            var tmpItemValue = parResponse[tmpIndex];//console.log(tmpItemValue);
            var tmpValue = (tmpItemValue.mItemValue) ? tmpItemValue.mItemValue : tmpItemValue.mItemResultId;
            if(document.getElementById(id[tmpIndex]) != null)
            {///////////將讀到的值給陣列中ID顯示
                
                if((tmpValue.substring(tmpValue.indexOf("#")+1,tmpValue.lastIndexOf("d")))=="T#"){
                    document.getElementById("day").value = 0;
                }else{
            document.getElementById("day").value = tmpValue.substring(tmpValue.indexOf("#")+1,tmpValue.lastIndexOf("d")); }
   
////////////////////小時

            if(tmpValue.indexOf("h")==-1){
                document.getElementById("hour").value = 0

            }else if(tmpValue.substring(tmpValue.indexOf("h")-2,tmpValue.lastIndexOf("h")-1)!="d"&&tmpValue.substring(tmpValue.indexOf("h")-2,tmpValue.lastIndexOf("h")-1)!="#"){
                document.getElementById("hour").value =tmpValue.substring(tmpValue.indexOf("h")-2,tmpValue.lastIndexOf("h"));
                
            }else {
                
                document.getElementById("hour").value =tmpValue.substring(tmpValue.indexOf("h")-1,tmpValue.lastIndexOf("h"));
            }
 ////////////////////分鐘
var mm =tmpValue.replace("ms","");
var re = /\d/;

                if(mm.indexOf("m")==-1){
                    document.getElementById("minute").value =0}
                    else if(re.test(mm.substring(tmpValue.indexOf("m")-2,tmpValue.indexOf("m")-1))) {
                  document.getElementById("minute").value = mm.substring(tmpValue.indexOf("m")-2,tmpValue.indexOf("m"))}
                  else{
                     document.getElementById("minute").value = mm.substring(tmpValue.indexOf("m")-1,tmpValue.indexOf("m"))
                  }


//////////////秒數
                 if(mm.indexOf("s")==-1){ 
                     document.getElementById("second").value = 0} 
                 else if(re.test(mm.substring(tmpValue.indexOf("s")-2,tmpValue.indexOf("s")-1))){
                 document.getElementById("second").value = tmpValue.substring(tmpValue.indexOf("s")-2,tmpValue.indexOf("s"));}
                 else{
                    document.getElementById("second").value = tmpValue.substring(tmpValue.indexOf("s")-1,tmpValue.indexOf("s"));
                 }

/////////////////毫秒

                if(re.test(tmpValue.substring(tmpValue.indexOf("ms")-2,tmpValue.indexOf("ms")-1))){
                 document.getElementById("millisecond").value = tmpValue.substring(tmpValue.indexOf("ms")-2,tmpValue.lastIndexOf("ms"));
                }else{
                    document.getElementById("millisecond").value = tmpValue.substring(tmpValue.indexOf("ms")-1,tmpValue.lastIndexOf("ms"));
                }
                           

            }
        }
        return true;
    }
    var tmpReadRequest = new OPCReadRequest("DE", tmpReadCB);
    for(var i = 0; i < id.length; i++)
    {
        tmpReadRequest.addItem("SIMOTION", SimotionVariable[i]);
    }
    tmpReadRequest.sendReadRequest();
}


/////////////////////////////////////////
function ReadValuePosNum(id, SimotionVariable) {/////////函式一開始會先執行最下方sendReadRequest一次送完
    var tmpReadCB = function(parResponse)///////此為閉包
    {///伺服器回應parResponse
        for (var tmpIndex = 0; tmpIndex < parResponse.length; tmpIndex++)
        {
            var tmpItemValue = parResponse[tmpIndex];//console.log(tmpItemValue);
            var tmpValue = (tmpItemValue.mItemValue) ? tmpItemValue.mItemValue : tmpItemValue.mItemResultId;
            if(document.getElementById(id[tmpIndex]) != null)
            {///////////將讀到的值給陣列中ID顯示
              
                document.getElementById(id[tmpIndex]).value = (tmpValue); 


              document.getElementsByTagName("tbody")[0].innerHTML="";//////重新輸入清空
              
            for (var i=0;i<tmpValue;i++){

            var zx=['inp'+i+'1','inp'+i+'2','inp'+i+'3','inp'+i+'4','inp'+i+'5']

            var zy=["unit/dHdGlobal.gsHMIdata.sAuto.station["+i+"].r64Position","unit/dHdGlobal.gsHMIdata.sAuto.station["+i+"].r64Velo","unit/dHdGlobal.gsHMIdata.sAuto.station["+i+"].r64Accel","unit/dHdGlobal.gsHMIdata.sAuto.station["+i+"].r64Decel","unit/dHdGlobal.gsHMIdata.sAuto.station["+i+"].r64Jerk"]

            ReadValue(zx,zy);



              var btn = document.createElement("tr");
               var tds=document.createElement("td");


                if(i==0){////////////首列
                tds.innerHTML="原點"
               } else{
               tds.innerHTML=i;
               }

               btn.appendChild(tds);
                                   
               var td1=document.createElement("td");
                 var inp1=document.createElement("input");
                    inp1.setAttribute("id",'inp'+i+'1' );
                  inp1.setAttribute("type",'number' );
                 inp1.setAttribute("style",'width:80px' );
                 inp1.setAttribute("onchange","tableChange(this.id,this.value)");
                     btn.appendChild(td1);
                    td1.appendChild(inp1); 
                                  
                                   
                                                   
                 var td2=document.createElement("td");         
                 var inp2=document.createElement("input");
                  inp2.setAttribute("id",'inp'+i+'2' );
                 inp2.setAttribute("type",'number' );
               inp2.setAttribute("style",'width:80px' );
               inp2.setAttribute("onchange","tableChange(this.id,this.value)");
                  btn.appendChild(td2);
                    td2.appendChild(inp2);
                
                                   
                                   
                  var td3=document.createElement("td");         
                 var inp3=document.createElement("input");
                  inp3.setAttribute("id",'inp'+i+'3' );
                  inp3.setAttribute("type",'number' );
                 inp3.setAttribute("style",'width:80px' );
                 inp3.setAttribute("onchange","tableChange(this.id,this.value)");
                  btn.appendChild(td3);
                    td3.appendChild(inp3);
                                   
                                   
                     var td4=document.createElement("td");         
                 var inp4=document.createElement("input");
                  inp4.setAttribute("id",'inp'+i+'4' );
                 inp4.setAttribute("type",'number' );
               inp4.setAttribute("style",'width:80px' );
               inp4.setAttribute("onchange","tableChange(this.id,this.value)");
                  btn.appendChild(td4);
                    td4.appendChild(inp4);
                                   
                  var td5=document.createElement("td");         
                 var inp5=document.createElement("input");
                  inp5.setAttribute("id",'inp'+i+'5' );
                  inp5.setAttribute("type",'number' );
                  inp5.setAttribute("style",'width:80px' );
                  inp5.setAttribute("onchange","tableChange(this.id,this.value)");
                  btn.appendChild(td5);
                    td5.appendChild(inp5);
                                   
             document.getElementsByTagName("tbody")[0].appendChild(btn);
            }
           }
        }
        return true;
    }
    var tmpReadRequest = new OPCReadRequest("DE", tmpReadCB);
    for(var i = 0; i < id.length; i++)
    {
        tmpReadRequest.addItem("SIMOTION", SimotionVariable[i]);
    }
    tmpReadRequest.sendReadRequest();
}


function setTime(){
    if(document.getElementById("day").value>48){
        alert("天數不可大於48")
        return;
    }
    if(document.getElementById("hour").value>23){
        alert("小時不可大於23")
        return;
    }
    if(document.getElementById("minute").value>59){
        alert("分鐘不可大於59")
        return;
    }
     if(document.getElementById("second").value>59){
        alert("秒數不可大於59")
        return;
    }
     if(document.getElementById("millisecond").value>999){
        alert("毫秒數不可大於999")
        return;
    }

    var format = ("T#"+document.getElementById("day").value+"d"+document.getElementById("hour").value+"h"+document.getElementById("minute").value+"m"+document.getElementById("second").value+"s"+document.getElementById("millisecond").value+"ms");
     
       writeValueFN(format, "unit/dHdGlobal.gsHMIdata.sCentrifugal.t32time");
}





function tableChange(id,value){

    var idtmp1 = id.substring(0, id.length - 1);
    id1 = id.replace(idtmp1,"");//////////得到最後字元(型態)


    var id2=id.replace("inp","");
    id2 = id2.substring(0, id2.length - 1);//////去除inp 及最後字元之字元(第幾工位)
switch(id1) {
    case "1":
    writeValueFN(value, "unit/dHdGlobal.gsHMIdata.sAuto.station["+id2+"].r64Position");
        break;
    case "2":
    writeValueFN(value, "unit/dHdGlobal.gsHMIdata.sAuto.station["+id2+"].r64Velo");
        break;
    case "3":
    writeValueFN(value, "unit/dHdGlobal.gsHMIdata.sAuto.station["+id2+"].r64Accel");
        break;
    case "4":
    writeValueFN(value, "unit/dHdGlobal.gsHMIdata.sAuto.station["+id2+"].r64Decel");
        break;
    case "5":
    writeValueFN(value, "unit/dHdGlobal.gsHMIdata.sAuto.station["+id2+"].r64Jerk");
        break;

 }
}




function myFunction() {
    document.getElementsByTagName("tbody")[0].innerHTML="";//////重新輸入清空
     var x=this.value;
     if(x>200){alert("不可大於200個工位");return}////////最大數量限制
     if(x<0){alert("工位數不可小於0");return}////////最小數量限制

for (var i=0;i<x;i++){

var zx=['inp'+i+'1','inp'+i+'2','inp'+i+'3','inp'+i+'4','inp'+i+'5']

var zy=["unit/dHdGlobal.gsHMIdata.sAuto.station["+i+"].r64Position","unit/dHdGlobal.gsHMIdata.sAuto.station["+i+"].r64Velo","unit/dHdGlobal.gsHMIdata.sAuto.station["+i+"].r64Accel","unit/dHdGlobal.gsHMIdata.sAuto.station["+i+"].r64Decel","unit/dHdGlobal.gsHMIdata.sAuto.station["+i+"].r64Jerk"]

ReadValue(zx,zy);



  var btn = document.createElement("tr");
   var tds=document.createElement("td");


    if(i==0){////////////首列
    tds.innerHTML="原點"
   } else{
   tds.innerHTML=i;
   }

   btn.appendChild(tds);
                       
   var td1=document.createElement("td");
     var inp1=document.createElement("input");
        inp1.setAttribute("id",'inp'+i+'1' );
      inp1.setAttribute("type",'number' );
     inp1.setAttribute("style",'width:80px' );
     inp1.setAttribute("onchange","tableChange(this.id,this.value)");
         btn.appendChild(td1);
        td1.appendChild(inp1); 
                      
                       
                                       
     var td2=document.createElement("td");         
     var inp2=document.createElement("input");
      inp2.setAttribute("id",'inp'+i+'2' );
     inp2.setAttribute("type",'number' );
   inp2.setAttribute("style",'width:80px' );
   inp2.setAttribute("onchange","tableChange(this.id,this.value)");
      btn.appendChild(td2);
        td2.appendChild(inp2);
    
                       
                       
      var td3=document.createElement("td");         
     var inp3=document.createElement("input");
      inp3.setAttribute("id",'inp'+i+'3' );
      inp3.setAttribute("type",'number' );
     inp3.setAttribute("style",'width:80px' );
     inp3.setAttribute("onchange","tableChange(this.id,this.value)");
      btn.appendChild(td3);
        td3.appendChild(inp3);
                       
                       
         var td4=document.createElement("td");         
     var inp4=document.createElement("input");
      inp4.setAttribute("id",'inp'+i+'4' );
     inp4.setAttribute("type",'number' );
   inp4.setAttribute("style",'width:80px' );
   inp4.setAttribute("onchange","tableChange(this.id,this.value)");
      btn.appendChild(td4);
        td4.appendChild(inp4);
                       
      var td5=document.createElement("td");         
     var inp5=document.createElement("input");
      inp5.setAttribute("id",'inp'+i+'5' );
      inp5.setAttribute("type",'number' );
      inp5.setAttribute("style",'width:80px' );
      inp5.setAttribute("onchange","tableChange(this.id,this.value)");
      btn.appendChild(td5);
        td5.appendChild(inp5);
                       
 document.getElementsByTagName("tbody")[0].appendChild(btn);
}

}

//Check each item and return contain start line / end line
function findString(Array,String){
	var startLine=0;
	var endLine=0;
	for (i = 0; i < Array.length ; i++) {
		//regx check
		var patt = new RegExp(String);
		var res = patt.exec(Array[i]);
		if (res!=null){
			startLine=i;
			break;
		}
		else if (res==null && i==Array.length-1){
			startLine=i+1;
			break;
		}
	}
	//console.log("startLine="+startLine);
	
	for(i=startLine+1; i < Array.length ; i++) {
		var res = /^\*\*.*\*\*/.exec(Array[i]);
		//console.log("i="+i+",Array.length"+Array.length)
		if(res!=null){
			endLine=i;
			break;
		}
		//handle last line in CSV
		else if (res==null && i==Array.length-1){
			endLine=i+1;
			break;
		}
	}
	
	//console.log("endLine="+endLine);
	var itemList=[];
	//itemList.push(["datetime","type","value"]);
	for (i=startLine+1;i<endLine;i++){
		
		var csvArray = Array[i].split(",");
		itemList.push(csvArray);
	}
	//console.log(itemList)
	return 	itemList;
}

PES = function() {};

//Defined Title Value
PES.ParsedDataVersion="ParsedDataVersion";
PES.SttState="SttState";
PES.PowerTestConfig="PowerTestConfig";
PES.LogState="LogState";
PES.SourceDataState="SourceDataState";
PES.SyncHistory="SyncHistory";
PES.AlarmInfo="AlarmInfo";
PES.Wakelock="Wakelock";
PES.BT="BT";
PES.CPU="CPU";
PES.DataCall="DataCall";
PES.DisplayState="DisplayState";
PES.NetworkDataTransmission="NetworkDataTransmission";
PES.Package="Package";
PES.RadioSignal="RadioSignal";
PES.UIDCPU="UIDCPU";
PES.UIDNetwork="UIDNetwork";
PES.UpTime="UpTime";
PES.VoiceCall="VoiceCall";
PES.WiFi="WiFi";
PES.Gmail="Gmail";
PES.PushMail="PushMail";
PES.SMS="SMS";
PES.DetailPartialWakelock="DetailPartialWakelock";
PES.DetailAlarm="DetailAlarm";
PES.DetailQMIFW="DetailQMIFW";
PES.CriticalCondition="CriticalCondition";
PES.BatteryLevel="BatteryLevel";
PES.PackageInfo="PackageInfo";
PES.BugreportStatsSinceLastUnplugged="BugreportStatsSinceLastUnplugged";
PES.TotalNetworkStats="TotalNetworkStats";
PES.TotalUserWakelockStats="TotalUserWakelockStats";
PES.TotalKernelWakelockStats="TotalKernelWakelockStats";
PES.CPUUsageIndex="CPUUsageIndex";
PES.DetailTCXO="DetailTCXO";
PES.TCXO="TCXO";
PES.TCXO9K="TCXO9K";
PES.TCXO9KQ6="TCXO9KQ6";
PES.WakeUp="WakeUp";
PES.DeviceDetailStatus="DeviceDetailStatus";
PES.Header="Header";
PES.DetailRILActivity="DetailRILActivity";
//Defined DeviceDetail Status List

//Read CSV
PES.prototype.readCSV = function(data) {
	var csvArray = data.split("\r\n");
	
	//Generate DeviceDetailStatus data
	var DeviceDetailStatus = findString(csvArray,PES.DeviceDetailStatus);
	//console.log(DeviceDetailStatus)
	DeviceDetailStatus = this.generateData(DeviceDetailStatus,PES.DeviceDetailStatus);
	//console.log(DeviceDetailStatus);
	return DeviceDetailStatus
};

PES.prototype.convertToArrayOfObjects=function(data){
	var keys = data.shift(),
        i = 0, k = 0,
        obj = null,
        output = [];
    for (i = 0; i < data.length; i++) {
        obj = {};

        for (k = 0; k < keys.length; k++) {
            obj[keys[k]] = data[i][k];
        }

        output.push(obj);
    }
	
    return output;
}

//Generate DeviceDetailStatus Data
PES.prototype.generateData = function(data,datatype){
	try{
	var list=[];
		switch(datatype){
			case "DeviceDetailStatus":
				list.push(["datetime","level","temp","volt","wifi","brightness","data_conn","gps","plug","screen","signal_strength"]);
				for (i=0;i<data.length;i++)
				{
					var datetime=data[i][0];
					var type=data[i][1];
					var value=data[i][2];
					
					switch (type){
						case "level":
							list.push([datetime,value,null,null,null,null,null,null,null,null,null]);
							break;
							
						case "temp":
							value=value/10
							list.push([datetime,null,value,null,null,null,null,null,null,null,null]);
							break;
							
						case "volt":
							//加權
							value=value/100;
							list.push([datetime,null,null,value,null,null,null,null,null,null,null]);
							break;
							
						case "wifi":
							switch (value){
								case "ON":
									value=1
									break;
								default:
									value=0
									break;
							};
							//加權
							value=value;
							list.push([datetime,null,null,null,value,null,null,null,null,null,null]);
							break;
							
						case "brightness":
							switch (value){
								case "BRIGHT":
									value=4
									break;
								case "MEDIUM":
									value=3
									break;
								case "DARK":
									value=2
									break;
								case "DIM":
									value=1
									break;
								default:
									value=0
									break;
							}
							//加權
							value=value;
							list.push([datetime,null,null,null,null,value,null,null,null,null,null]);
							break;
							
						case "data_conn":
							switch(value){
								case "LTE":
									value=5
									break;
								case "HSPAP":
									value=4
									break;
								case "HSDPA":
									value=3
									break;
								case "UMTS":
									value=2
									break;
								case "NONE":
									value=1
									break;
								default:
									value=0
									break;
							}
							//加權
							value=value;
							list.push([datetime,null,null,null,null,null,value,null,null,null,null]);
							break;
							
						case "gps":
							switch (value){
								case "ON":
									value=1
									break;
								default:
									value=0
									break;
							};
							//加權
							value=value;
							list.push([datetime,null,null,null,null,null,null,value,null,null,null]);
							break;
							
						case "plug":
							switch (value){
								case "NONE":
									value=0
									break;
								default:
									value=1
									break;
							};
							//加權
							value=value;
							list.push([datetime,null,null,null,null,null,null,null,value,null,null]);
							break;
							
						case "screen":
							//console.log(value)
							switch (value){
								case "ON":
									value=1
									break;
								default:
									value=0
									break;
							};
							//加權
							//value=value;
							list.push([datetime,null,null,null,null,null,null,null,null,value,null]);
							break;
						case "signal_strength":
							switch(value){
								case "GREAT":
									value=5
									break;
								case "GOOD":
									value=4
									break;
								case "MODERATE":
									value=3
									break;
								case "POOR":
									value=2
									break;
								case "NONE":
									value=1
									break;
								default:
									value=0
									break;
							}
							//加權
							value=value;
							list.push([datetime,null,null,null,null,null,null,null,null,null,value]);
							break;									
						default:
								break;
					}
				}
				console.log(list)
				//update value
				for (j=1;j<11;j++)
				{
					var updatevalue=null
					for (i=1;i<=data.length;i++)
					{
						//console.log("list["+i+"]["+j+"]="+list[i][j]);
						
						if (list[i][j]!==null)
						{
							updatevalue=list[i][j];
						}
						else
						{
							list[i][j]=updatevalue
						}
						//console.log("list["+i+"]["+j+"]="+list[i][j]);
					}
				}
				console.log(list)
				return list;
				break;
			default:
				return data;
				break;
		}
	}
	catch(err)
	{
		console.log(err)
	}
};

/**
 * Controller for ssd-inventory-operations
 *
 * @module app/serverControl
 * @exports powerUsageController
 * @name powerUsageController
 *
 *
 * @author USI Steven 
 * @date   20181130
 * @brief  ssd inventory operations modify base the file of power usage controller
 */
 
window.angular && (function(angular) {
  'use strict';

  angular.module('app.serverControl').controller('powerUsageController', [
    '$scope', '$window', 'APIUtils', 'dataService',
    function($scope, $window, APIUtils, dataService) {
      $scope.dataService = dataService;
      $scope.loading = false;
	  $scope.ssdInfo = [];
	  $scope.slotInfo = [];
	  $scope.s9546Info = "";
	  $scope.cabledmodInfo = "";
	  $scope.swconfigInfo = "";
	  $scope.swstatusInfo = "";
	  $scope.psInfo = [];
	  		
	  $scope.changeStatus = function(flag){
		  if(flag == 'ssd'){
			  $scope.ssdFlag = true;
			  $scope.slotFlag = false;
			  $scope.s9546Flag = false;
			  //$scope.cabledmodFlag = false;
			  $scope.swconfigFlag = false;
			  $scope.swstatusFlag = false;
			  $scope.psFlag = false;
		  }else if(flag == 'slot'){
			  $scope.ssdFlag = false;
			  $scope.slotFlag = true;
			  $scope.s9546Flag = false;
			  //$scope.cabledmodFlag = false;
			  $scope.swconfigFlag = false;
			  $scope.swstatusFlag = false;
			  $scope.psFlag = false;
		  }else if(flag == 's9546'){
			  $scope.ssdFlag = false;
			  $scope.slotFlag = false;
			  $scope.s9546Flag = true;
			  //$scope.cabledmodFlag = false;
			  $scope.swconfigFlag = false;
			  $scope.swstatusFlag = false;
			  $scope.psFlag = false;
		  }else if(flag == 'cabledmod'){
			  $scope.ssdFlag = false;
			  $scope.slotFlag = false;
			  $scope.s9546Flag = false;
			  //$scope.cabledmodFlag = true;
			  $scope.swconfigFlag = false;
			  $scope.swstatusFlag = false;
			  $scope.psFlag = false;
		  }else if(flag == 'swconfig'){
			  $scope.ssdFlag = false;
			  $scope.slotFlag = false;
			  $scope.s9546Flag = false;
			  //$scope.cabledmodFlag = false;
			  $scope.swconfigFlag = true;
			  $scope.swstatusFlag = false;
			  $scope.psFlag = false;
		  }else if(flag == 'swstatus'){
			  $scope.ssdFlag = false;
			  $scope.slotFlag = false;
			  $scope.s9546Flag = false;
			  //$scope.cabledmodFlag = false;
			  $scope.swconfigFlag = false;
			  $scope.swstatusFlag = true;
			  $scope.psFlag = false;
		  }else if(flag == 'ps'){
			  $scope.ssdFlag = false;
			  $scope.slotFlag = false;
			  $scope.s9546Flag = false;
			  //$scope.cabledmodFlag = false;
			  $scope.swconfigFlag = false;
			  $scope.swstatusFlag = false;
			  $scope.psFlag = true;
		  }else{
			  $scope.ssdFlag = false;
			  $scope.slotFlag = false;
			  $scope.s9546Flag = false;
			  //$scope.cabledmodFlag = false;
			  $scope.swconfigFlag = false;
			  $scope.swstatusFlag = false;
			  $scope.psFlag = false;
		  }
	  };	  
	  	    
	    function showSSDData(ssdData) {
			//console.log("showSSDData");
			//console.log(ssdData);
			var ssdAddr = 0, ssdType = 0, linkSpeed = 0, state = 0, cfgWidth = 0;
			var linkWidth = 0, Resered = 0, parId = 0, Inserted = 0, linkStatus = 0;
			var ssdTypeText = "", ssdAddrText = "", stateText = "", linkSpeedText = "", linkWidthText = "";
			var cfgWidthText = "", linkStatusText = "", InsertedText = "", parIdText = "", ReseredText = "";
			for(var num = 0; num < ssdData.length; num++) {
				ssdAddr = ssdData[num].Value >>> 27 & 0x1f;
				ssdType = ssdData[num].Value >>> 24 & 0x07;
				linkSpeed = ssdData[num].Value >>> 20 & 0x0f;
				state = ssdData[num].Value >>> 16 & 0x0f;
				cfgWidth = ssdData[num].Value >>> 12 & 0x0f;
				linkWidth = ssdData[num].Value >>> 8 & 0x0f;
				Resered = ssdData[num].Value >>> 6 & 0x03;
				parId = ssdData[num].Value >>> 2 & 0x0f;
				Inserted = ssdData[num].Value >>> 1 & 0x01;
				linkStatus = ssdData[num].Value & 0x01;				
				
				if(ssdType == 0){
					ssdTypeText = "U.2";
				}else {
					ssdTypeText = "M.2";
				}
				
				switch(ssdAddr) {
					case 1: 
						ssdAddrText = "slot1"; 
						break;
					case 2: 
					    ssdAddrText = "slot2";
					    break;
					case 3: 
						ssdAddrText = "slot3"; 
						break;
					case 4: 
					    ssdAddrText = "slot4";
					    break;
					case 5: 
						ssdAddrText = "slot5"; 
						break;
					case 6: 
					    ssdAddrText = "slot6";
					    break;
					case 7: 
						ssdAddrText = "slot7"; 
						break;
					case 8: 
					    ssdAddrText = "slot8";
					    break;
					case 9: 
						ssdAddrText = "slot9"; 
						break;
					case 10: 
					    ssdAddrText = "slot10";
					    break;
					case 11: 
						ssdAddrText = "slot11"; 
						break;
					case 12: 
						ssdAddrText = "slot12"; 
						break;
					case 13: 
					    ssdAddrText = "slot13";
					    break;
					case 14: 
						ssdAddrText = "slot14"; 
						break;
					case 15: 
					    ssdAddrText = "slot15";
					    break;
					case 16: 
						ssdAddrText = "slot16"; 
						break;
					case 17: 
					    ssdAddrText = "slot17";
					    break;
					case 18: 
						ssdAddrText = "slot18"; 
						break;
					case 19: 
					    ssdAddrText = "slot19";
					    break;
					case 20: 
						ssdAddrText = "slot20"; 
						break;
					case 21: 
					    ssdAddrText = "slot21";
					    break;
					case 22: 
						ssdAddrText = "slot22"; 
						break;
					case 23: 
					    ssdAddrText = "slot23";
					    break;
					case 24: 
						ssdAddrText = "slot24"; 
						break;
					default: 
					    ssdAddrText = "none";
				}
				
				switch(state) {
					case 0:
						stateText = "ok";
						break;
					case 1:
						stateText = "absent";
						break;
					case 2:
						stateText = "poweroff";
						break;
					case 3:
						stateText = "not link";
						break;
					case 4:
						stateText = "unbind to a P2P";
						break;
					case 5:
						stateText = "poweron";
						break;	
					case 6:
						stateText = "Get status fail";
						break;
					case 15:
						stateText ="status value is invalid";
					default:
						stateText = "value error!";
				}
				
				switch(linkSpeed) {
					case 0:
						linkSpeedText = "not link";
						break;
					case 1:
						linkSpeedText = "2.5G";
						break;
					case 2:
						linkSpeedText = "5.0G";
						break;
					case 3:
						linkSpeedText = "8.0G";
						break;
					case 4:
						linkSpeedText = "16G";
						break;
					case 5:
						linkSpeedText = "unknown";
						break;	
					default:
						linkSpeedText = "value error!";
				}
				
				switch(linkWidth) {
					case 0:
						linkWidthText = "not link";
						break;
					case 1:
						linkWidthText = " x1.";
						break;
					case 2:
						linkWidthText = "x2.";
						break;
					case 3:
						linkWidthText = "x4.";
						break;
					case 4:
						linkWidthText = "x8.";
						break;
					case 5:
						linkWidthText = "x12.";
						break;	
					case 6:
						linkWidthText = "x16.";
						break;
					case 7:
						linkWidthText = "x32.";
						break;
					case 8:
						linkWidthText = "unknown";
						break;	
					default:
						linkWidthText = "value error!";
				}
				
				if(linkStatus == 0){
					linkStatusText = "link fail";
				}else{
					linkStatusText = "link success";
				}
				
				if(Inserted == 0){
					InsertedText = "not present";
				}else{
					InsertedText = "present";
				}
				
				if(parId == 0x0f){
					parIdText = "partition info error";
				}else{
					parIdText = "normal";
				}
				
				$scope.ssdInfo.push(Object.assign(
				{
					ssd_addr: ssdAddrText,
					ssd_type: ssdTypeText,
					link_sp: linkSpeedText,
					status: stateText,
					cfg_wd: cfgWidthText,
					link_wd: linkWidthText,
					resered: ReseredText,
					par_id: parIdText,
					inserted: InsertedText,
					link_st: linkStatusText,
				}, 
				{title: ssdData[num].title}));
			}
			
	    };	 
			
		function showSlotData(slotData) {
			var slotStatus = 0;
			var slotStatusText = "";
			
			for(var num = 0; num < slotData.length; num++) {
				slotStatus = slotData[num].Value & 0x01;
				if(slotStatus == 0){
					slotStatusText = "status ok";
				}else{
					slotStatusText = "status fail";
				}
				
				$scope.slotInfo.push(Object.assign(
				{
					slot_status: slotStatusText,
				},{title: slotData[num].title}));
			}
			
		};
		
		function showS9546Data(s9546Data){
			var stateText = "";
			var state = s9546Data.Value & 0x01;
			if(state == 0){
				stateText = "status ok";
			}else{
				stateText = "status fail";
			}
			
			$scope.s9546Info = Object.assign(
			{
				status: stateText,
			},{title: s9546Data.title});
		};
		
		function showCabledmodData(cabledmodData){
			var cabledmodText = "";
			var cabledmod = cabledmodData.Value & 0x01;
			if(cabledmod == 0){
				cabledmodText = "auto";
			}else{
				cabledmodText = "manual";
			}
			
			$scope.cabledmodInfo = Object.assign(
			{
				cabled_mod: cabledmodText,
			}, {title: cabledmodData.title});
		};
		
		function showSwconfigData(swconfigData){
			var swconfigText = "";
			var swconfig = swconfigData.Value & 0x01;
			if(swconfig == 0){
				swconfigText = "enable EMA";
			}else{
				swconfigText = "disable EMA";
			}
			$scope.swconfigInfo = Object.assign(
			{
				EMA_status: swconfigText,
			}, {title: swconfigData.title});
		};
		
		function showSwstatusData(swstatusData){
			var swstatusText = "";
			var swstatus = swstatusData.Value & 0x01;
			if(swstatus == 1){
				swstatusText = "MRPC status ok";
			}else{
				swstatusText = "MRPC status fail";
			}
			$scope.swstatusInfo = Object.assign(
			{
				MRPC_status: swstatusText,
			}, {title: swstatusData.title});
		};
		
		function showPsData(psData){			
			var psVout = 0, psIout = 0, psInput = 0, psPowerGood = 0, psFans = 0;
			var psOff = 0, psVoutOv = 0, psIoutOc = 0, psVinUv = 0, psTemperature = 0;			
			var psVoutText = "", psIoutText = "", psInputText = "", psPowerGoodText = "", psFansText = "";
			var psOffText = "", psVoutOvText = "", psIoutOcText = "", psVinUvText = "", psTemperatureText = "", psSensorText;
			
			for(var num = 0; num < psData.length; num++){
				var psVout = psData[num].Value >>> 15 & 0x01;
				var psIout = psData[num].Value >>> 14 & 0x01;
				var psInput = psData[num].Value >>> 13 & 0x01;
				var psPowerGood = psData[num].Value >>> 11 & 0x01;
				var psFans = psData[num].Value >>> 10 & 0x0f;
				var psOff = psData[num].Value >>> 6 & 0x01;
				var psVoutOv = psData[num].Value >>> 5 & 0x01;
				var psIoutOc = psData[num].Value >>> 4 & 0x01;
				var psVinUv = psData[num].Value >>> 3 & 0x01;
				var psTemperature = psData[num].Value >>> 2 & 0x01;
				var psSensor = psData[num].Value;
				
				if(psVout == 0){
					psVoutText = "Output voltage ok";
				}else{
					psVoutText = "Output voltage fault or warning";
				}
				if(psIout == 0){
					psIoutText = "Output current or power ok";
				}else{
					psIoutText = "Output current or power fault or warning";
				}
				if(psInput == 0){
					psInputText = "Input voltage, current or power ok";
				}else{
					psInputText = "Input voltage, current, or power fault or warning";
				}
				if(psPowerGood == 0){
					psPowerGoodText = "POWER_GOOD signal is not negated";
				}else{
					psPowerGoodText = "POWER_GOOD signal is negated";
				}
				if(psFans == 0){
					psFansText = "Fan or airflow ok";
				}else{
					psFansText = "Fan or airflow fault or warning";
				}
				if(psOff == 0){
					psOffText = "Unit is providing power to output";
				}else{
					psOffText = "Unit is not providing power to output";
				}
				if(psVoutOv == 0){
					psVoutOvText = "Output overvoltage ok";
				}else{
					psVoutOvText = "Output overvoltage fault";
				}
				if(psIoutOc == 0){
					psIoutOcText = "Output overcurrent ok";
				}else{
					psIoutOcText = "Output overcurrent fault";
				}
				if(psVinUv == 0){
					psVinUvText = "Input under voltage ok";
				}else{
					psVinUvText = "Input under voltage fault";
				}
				if(psTemperature == 0){
					psTemperatureText = " ok";
				}else{
					psTemperatureText = "fault or warning";
				}
				if(psSensor == 0xffff){
					psSensorText = "absent";
				}else{
					psSensorText = "ok";
				}
				
				$scope.psInfo.push(Object.assign(
				{
					ps_vout: psVoutText,
					ps_iout: psIoutText,
					ps_input: psInputText,
					ps_power_good: psPowerGoodText,
					ps_fans: psFansText,
					ps_off: psOffText,
					ps_vout_ov: psVoutOvText,
					ps_iout_oc: psIoutOcText,
					ps_vin_uv: psVinUvText,
					ps_temperature: psTemperatureText,
					ps_sensor: psSensorText,
				}, 
				{title: psData[num].title}));
			}
		};
		
	  $scope.getSensorData = function() {
		var ssdData = [];
		var slotData = [];
		var s9546Data = "";
		var cabledmodData = "";
		var swconfigData = "";
		var swstatusData = "";
		var psData = [];
		
		$scope.loading = true;		
        APIUtils.getAllSensorStatus(function(data, originalData) {
			for(var j = 0; j < 24; j++){
				var ssd = "Switch Ssd"+(j + 1);
				var slot = "Switch Slot"+(j + 1);
				for(var i = 0; i < data.length; i++){
					if(data[i].title == ssd){ 
						ssdData[j] = data[i];
					}else if(data[i].title == slot){
						slotData[j] = data[i];
					}else{
						continue;
					}
				}	
			}
			for(var i = 0; i < data.length; i++){
				if(data[i].title == "Switch S9546"){
					s9546Data = data[i];
				}else if(data[i].title == "Switch Cabledmod"){
					cabledmodData = data[i];
				}else if(data[i].title == "Switch Swconfig"){
					swconfigData = data[i];
				}else if(data[i].title == "Switch Swstatus"){
					swstatusData = data[i];
				}else if(data[i].title == "Sensors PSA Status"){
					psData[0] = data[i];
				}else if(data[i].title == "Sensors PSB Status"){
					psData[1] = data[i];
				}else{
					continue;
				}
			}
			
			showSSDData(ssdData);	
			showSlotData(slotData);
			showS9546Data(s9546Data);
			showCabledmodData(cabledmodData);
			showSwconfigData(swconfigData);
			showSwstatusData(swstatusData);
			showPsData(psData);
            $scope.loading = false;
        });
      };
	  
	  /*function showCableData(cableData) {
			console.log("showSlotData");
			console.log(cableData);
			var present = 0, slotAddr = 0, cableType = 0, linkActive = 0, linkWidth = 0;
			var linkStatus = 0, invalid = 0, parId = 0, state = 0, uspOrDsp = 0;
			var presentText = "", slotAddrText = "", cableTypeText = "", linkWidthText = "", linkStatusText = ""; 
			var linkActiveText = "", invalidText = "", uspOrDspText = "", parIdText = "", stateText = "";
			
			for(var num = 0; num < cableData.length; num++) {
				present = cableData[num].value >>> 31 & 0x01;
				slotAddr = cableData[num].value >>> 27 & 0x0f;
				cableType = cableData[num].value >>> 24 & 0x07;
				linkActive = cableData[num].value >>> 23 & 0x01;
				linkWidth = cableData[num].value >>> 19 & 0x0f;
				linkStatus = cableData[num].value >>> 16 & 0x07;
				invalid = cableData[num].value >>> 12 & 0x0f;;
				parId = cableData[num].value >>> 8 & 0x0f;
			    state = cableData[num].value >>> 4 & 0x0f;
				uspOrDsp = cableData[num].value & 0x0f;
				
				if(present == 0) {
					presentText = "cable is absent";
				} else {
					presentText = "cable is present";
				}
				
				switch(slotAddr) {
					case 1: 
						slotAddrText = "cable slot1"; 
						break;
					case 2: 
					    slotAddrText = "cable slot2";
					    break;
					case 3: 
						slotAddrText = "cable slot3"; 
						break;
					case 4: 
					    slotAddrText = "cable slot4";
					    break;
					case 5: 
						slotAddrText = "cable slot5"; 
						break;
					case 6: 
					    slotAddrText = "cable slot6";
					    break;
					case 7: 
						slotAddrText = "cable slot7"; 
						break;
					case 8: 
					    slotAddrText = "cable slot8";
					    break;
					case 9: 
						slotAddrText = "cable slot9"; 
						break;
					case 10: 
					    slotAddrText = "cable slot10";
					    break;
					case 11: 
						slotAddrText = "cable slot11"; 
						break;
					default: 
					    slotAddrText = "none cable";
				}
				
				switch(linkWidth) {
					case 0:
						linkWidthText = "SSD is not link";
						break;
					case 1:
						linkWidthText = "link width is x1";
						break;
					case 2:
						linkWidthText = "link width is x2";
						break;
					case 3:
						linkWidthText = "link width is x4";
						break;
					case 4:
						linkWidthText = "link width is x8";
						break;
					case 5:
						linkWidthText = "link width is x12";
						break;	
					case 6:
						linkWidthText = "link width is x16";
						break;
					case 7:
						linkWidthText = "link width is x32";
						break;	
					case 8:
						linkWidthText = "link width unknow";
						break;
					default:
						linkWidthText = "value error!";
				}
				
				switch(linkStatus) {
					case 0:
						linkStatusText = "cable link ok";
						break;
					case 1:
						linkStatusText = "cable is absent";
						break;
					case 2:
						linkStatusText = "cable link fail";
						break;
					case 3:
						linkStatusText = "cable not link";
						break;
					case 4:
						linkStatusText = "value invalid";
						break;
					default:
						linkStatusText = "value error!";
				}
				
				if(linkActive == 0) {
					linkActiveText = "not link active";
				}else if (linkActive == 1) {
					linkActiveText = "link active";
				}else{
					linkActiveText = "value error!";
				}
				
				if(invalid == 0) {
					invalidText = "physical port is valid";
				}else if(invalid == 0x0f) {
					invalidText = "physical port is invalid";
				}else{
					invalidText = "value error!";
				}
				
				if(uspOrDsp == 0x0f) {
					uspOrDspText = "fail or abnormal";
				}else if(uspOrDsp == 1) {
					uspOrDspText = "upstream port";
				}else if(uspOrDsp == 2) {
					uspOrDspText = "downstream port";
				}else{
					uspOrDspText = "value error!";
				}
				
				if(state == 0){
					stateText = "valid cable";
				}else if(state == 0x0f) {
					stateText = "invalid cable";
				}else{
					stateText = "valeu error!";
				}
				
				
				$scope.cableInfo.push(Object.assign(
				{
					present: presentText,
					slot_addr: slotAddrText,
					cable_type: cableTypeText,
					link_active: linkActiveText,
					link_wd: linkWidthText,
					link_st: linkStatusText,
					invalid: invalidText,
					par_id: parIdText,
					status: stateText,
					usp_or_dsp: uspOrDspText,
				},
				{title: cableData[num].title}));
			}
			
		};*/
	  
	  $scope.getSensorData();
	  
    }
  ]);
})(angular);

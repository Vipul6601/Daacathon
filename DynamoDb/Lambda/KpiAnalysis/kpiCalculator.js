var kpiCalculator = {
	calculatePumpEffeciency : function(efficiencyRequest){
        var suctionPressure = efficiencyRequest.suctionPressure;
        var dischargePressure = efficiencyRequest.dischargePressure;
        var flowRate =  efficiencyRequest.flowRate;
        var motorPowerInput =  efficiencyRequest.motorPowerInput;
        var motorEfficiency =  efficiencyRequest.motorEfficiency;

        var pumpEffeciency = ((dischargePressure - suctionPressure)*flowRate)*100/(2298*motorEfficiency*motorPowerInput);
        return pumpEffeciency;
	},
	calculateDynamicHead : function(dynamicHeadRequest){
        var suctionPressure = dynamicHeadRequest.suctionPressure;
        var dischargePressure = dynamicHeadRequest.dischargePressure;
        var flowRate =  dynamicHeadRequest.flowRate;
        var suctionDiameter = dynamicHeadRequest.suctionDiameter;
        var dischargeDiameter = dynamicHeadRequest.dischargeDiameter;
        var suctionHeight = dynamicHeadRequest.suctionHeight;
        var dischargeHeight = dynamicHeadRequest.dischargeHeight;
        var density = dynamicHeadRequest.density;

        //Discharge Calculations 
        var pipeAreaDischarge = (3.14/4)*dischargeDiameter*dischargeDiameter;
        var velocityDischarge = flowRate*0.321/pipeAreaDischarge;
        var velocityHeadDischarge = velocityDischarge*velocityDischarge/64.4;
        var absoluteDischargePressureHead = (dischargePressure + 14.7)*2.31/density;
        var dischargeHead = absoluteDischargePressureHead + velocityHeadDischarge;

        //Suction Calculations 
        var pipeAreaSuction = (3.14/4)*suctionDiameter*suctionDiameter;
        var velocitySuction = flowRate*0.321/pipeAreaSuction;
        var velocityHeadSuction = velocitySuction*velocitySuction/64.4;
        var absoluteSuctionPressureHead= (suctionPressure + 14.7)*2.31/density;
        var suctionHead = absoluteSuctionPressureHead + velocityHeadSuction;
       
        //gauge caculation
        var gauageElevationDifference = dischargeHeight - suctionHeight;

        var pumpHead = dischargeHead - suctionHead + gauageElevationDifference;

        return pumpHead;
        },
        calculateMotorStatus : function(motorStatusRequest){
                var suctionPressure = motorStatusRequest.suctionPressure;
                var dischargePressure = motorStatusRequest.dischargePressure;
                var flowRate =  motorStatusRequest.flowRate;
                var motorStatus = "Normal";
                 if(suctionPressure == 0 && dischargePressure == 0 && flowRate == 0)
                 {
                        motorStatus = "Dry Running";
                 }else if(suctionPressure > 0 && dischargePressure > 0 && flowRate == 0)
                 {
                        motorStatus = "Blockage";
                 }
                return motorStatus;
        }
};
console.log('[@kpiCalculator] kpiCalculator = ', kpiCalculator);
module.exports = kpiCalculator;
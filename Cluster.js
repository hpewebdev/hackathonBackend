const express = require("express");
const connection = require("./connection");
module.exports = function calculate(data) {
  let index1 = -1, index2 = -1, index3 = -1;
  global.ClusterArray.forEach((row) => {   

  index1 = data.findIndex(item => item.server_ip === row.ip1);
   index2 = data.findIndex(item => item.server_ip === row.ip2);
if(row.Cluster_Type==='Active Passive')
{
   if (index1 !== -1 && index2 !== -1) {
    row1 = data[index1];
    row1.clusterColor=row.clusterColor;
    row2 = data[index2];
    row2.clusterColor=row.clusterColor;
    if ((row1.srv_stat==="running" || row1.srv_stat === 'active') && row1.app_stat!=="error" && row2.CD==="C") {
        row2.colorCode="#71c80c";
        row2.appStatColor='green';
        row2.srvStatusColor='green';
        row2=colorcount(row2);
        
      }
      if ((row2.srv_stat==="running" || row2.srv_stat === 'active') && row2.app_stat!=="error" && row1.CD==="C") {
        row1.colorCode="#71c80c";
        row1.appStatColor='green';
        row1.srvStatusColor='green';
        row1=colorcount(row1);
        
      }
     
  }
}
else
{
  index3 = data.findIndex(item => item.server_ip === row.ip3);
  index4 = data.findIndex(item => item.server_ip === row.ip4);
  
  if (index1 !== -1 && index2 !== -1 && index3 !== -1 && index4 !== -1) {
  row1 = data[index1];
    row1.clusterColor=row.clusterColor;
    row2 = data[index2];
    row2.clusterColor=row.clusterColor;
    row3 = data[index3];
    row3.clusterColor=row.clusterColor;
	row4 = data[index4];
    row4.clusterColor=row.clusterColor;
  }

}
index1 = -1, index2 = -1, index3 = -1, index4 = -1;

  });  

  return data;
}
function colorcount(row) {
 
  let props = ["cpuUtilColor", "memUtilColor", "fdelayColor", "rootVolColor", "loadAverageColor", "useLevelColor", "ntpStatusColor", "upTimeColor"];
 
  let error_count = props.filter(prop => row[prop] === "orange" || row[prop] === "red").length;
  let has_red = props.some(prop => row[prop] === "red");
 
  row.error_count = error_count;
  if (error_count > 0) {
    row.colorCode = has_red ? "red" : "orange";
  }
  return row;
}
  

var globalVar=require('./global.js');
var fs = require("fs");


module.exports={
  appendLog:async function(type,action,name,reason){
  	fs.appendFile('result.log',type+' --> '+action+' - '+name+' - '+ reason+'\r\n',function(err){
      if(err)  throw err;
     })
  }

}


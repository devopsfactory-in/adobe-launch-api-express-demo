  

var globalVar=require('./global.js');
var fs = require("fs");


module.exports={
  appendLog:async function(type,action,name,reason){
  	fs.appendFile('result.log',type+' --> '+action+' - '+name+' - '+ reason+'\r\n',function(err){
      if(err)  throw err;
     })
  },
  readJsonFiles: async function(path){
  var jsonContent=[];
  var filesTemp=await fs.readdirSync("dataelements");

  for(var file of filesTemp){
      var content= await fs.readFileSync(path+'/'+file);
      jsonContent.push(JSON.parse(content));
    }

  return jsonContent;
  }

}


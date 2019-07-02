var common=require('./common.js');
var globalVar=require('./services.js');

const Reactor = require('@adobe/reactor-sdk').default;


module.exports={
  getCompanyDetails: async function (companyId,accessToken) {
	    var reactor=await this.buildReactor(companyId,accessToken);

	    const company = await reactor.getCompany(companyId);
	    return company;
  },
  getProperties: async function (req) {
	    var reactor=await this.buildReactor(req.session.companyId,req.session.accessToken);
	    const list = await reactor.listPropertiesForCompany(req.session.companyId,{'page[size]':999});
	    return list;
  },
  buildReactor: async function (companyId,accessToken) {
	    const reactorUrl = 'https://reactor.adobe.io';
	    if(typeof companyId!='undefined' && companyId){
	      return await new Reactor(accessToken, companyId,{ reactorUrl: reactorUrl });
	    }else{
	      return await new Reactor(accessToken, { reactorUrl: reactorUrl });
	    }
  },
  createDataElement: async function (req,jsonData,coreExtension,propertyId) {
	    var reactor=await this.buildReactor(req.session.companyId,req.session.accessToken);
	    jsonData.relationships.extension.data.id=coreExtension;
	    try{
	     const response = await reactor.createDataElement(propertyId, jsonData);
	     common.appendLog(globalVar.SUCCESS,'CreateDE',jsonData.attributes.name,'');
	    }catch(error){
	      console.error('Error....?'+error);
	      common.appendLog(globalVar.ERROR,'CreateDE',jsonData.attributes.name,error);
	    }
        console.log('--Data Element Created--');
  },  
  createDataElements: async function (req,propertyId) {
	    var reactor=await this.buildReactor(req.session.companyId,req.session.accessToken);
	    var coreExtension=await this.findCoreExtension(req,propertyId);
	    var jsonArray=await common.readJsonFiles('dataelements');
	      for(var jsonData of jsonArray){
	       common.appendLog('---------------------------------','-','-----------------','-------------------------');
	       for(var jsonAttr of jsonData){
	        response=await  this.createDataElement(req,jsonAttr,coreExtension,propertyId);
	       }
	      }      
	    console.log('--Data Element Created--');
  },
  getExtensions: async function (req,propertyId) {
      var reactor=await this.buildReactor(req.session.companyId,req.session.accessToken);
      console.log('1111111111111111');
	  const response = await reactor.listExtensionsForProperty(propertyId);
	  return response;
  },
  getAllExtensionPackages: async function (req,propertyId) {
	  const ls = [];
	  let pagination = { next_page: 1 };
	  do {
      	  var reactor=await this.buildReactor(req.session.companyId,req.session.accessToken);
      	        console.log('2222222222222222222');

	      const listResponse = await reactor.listExtensionPackages({
	      'filter[platform]': 'EQ web',
	      /*eslint-disable camelcase*/
	      max_availability: 'private',
	      /*eslint-enable camelcase*/
	      sort: '+name',
	      'page[number]': pagination.next_page,
	      'page[size]': 100
	    });

	    listResponse.data.forEach(p => {
	      ls.push({ name: p.attributes.name, id: p.id });
	    });

	    pagination = listResponse.meta && listResponse.meta.pagination;
	  } while (pagination.next_page);

	  return ls;
 },
 findCoreExtension: async function (req,propertyId) {
	  const response = await this.getExtensions(req,propertyId);
	        console.log('333333333333333333333333');

	  const extnPa=await this.findCoreExtensionPackage(req,propertyId);

	  const exts = response.data;
	  exts.forEach(function(element){
	    console.log('relationships.extension_package---'+element.attributes.name);
	  });
	  var coreExtension;
	 if(typeof exts!='undefined' && exts){
	 coreExtension = exts.find(
	   ep => ep.attributes.name ==='core' 
	  );
	  console.log("%j %j", 'coreEX>>>>>>>', coreExtension);
	 } 
	return coreExtension.id;
},
findCoreExtensionPackage: async function (req,propertyId) {
	      console.log('444444444444444');

	  const eps = await this.getAllExtensionPackages(req,propertyId);
	  const rc = eps.find(ep => ep.name === 'core');
	  coreEP = rc.id;
	  return coreEP;
}

}
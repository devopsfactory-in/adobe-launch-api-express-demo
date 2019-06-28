var common=require('./common.js');
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
  }

}
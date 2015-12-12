module.exports = {
	handleError: function(err){
		console.error(err);
	},

  getIp: function(req) {
    var ipRegex = /[0-9.]+$/;
    var ip = ipRegex.exec(req.ip);
    return ip[0];
  },


}
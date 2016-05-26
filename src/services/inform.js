/**
 * Created by roger on 26/05/16.
 */


module.exports = (namespace) => ({

	throwError(msg) {
		throw new Error(this.namespace(msg));
	},

	log(msg) {
		console.log(this.namespace(msg));
	},

	namespace(msg) {
		return namespace + ': ' + msg;
	}

});

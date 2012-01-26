var EXPORTED_SYMBOLS = [ "PocketChange" ];

const Cc = Components.classes;
const Ci = Components.interfaces;

if ("undefined" == typeof(PocketChange)) {
  var PocketChange = {};
};

PocketChange.Fubar = {
	_rhString : 'fubar string',

	get rhString() { return this._rhString; },

	changeString : function(newString) {
		this._rhString = newString;
	}
}

PocketChange.FormController = {	
	_formHeader : 'Pocket Change',
	_orderAmount : 17.02,
	_donationRate : 0.01,

	setHeader : function(newHeader) {
		this._formHeader = newHeader;
	},

	getHeader : function(){
		return this._formHeader;
	},	
}




// var EXPORTED_SYMBOLS = [ "PocketChange" ];

// const Cc = Components.classes;
// const Ci = Components.interfaces;

// if ("undefined" == typeof(PocketChange)) {
//   var PocketChange = {};
// };

// /**
//  * A very simple counter.
//  */
// PocketChange.MessageCount = {

//   /* Current message count.  */
//   _count : 0,

//   /**
//    * Returns the current message count.
//    * @return the current message count.
//    */
//   get count() { return this._count; },

//   /**
//    * Increments the message count by one.
//    */
//   increment : function() {
//     this._count++;
//   }
// };


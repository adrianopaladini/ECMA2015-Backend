module.exports = {
	getAllDocs: {
		map: function(doc) {
			if(doc.type === "EXAMPLE" && !doc.deleted) {
				emit(doc.uid, null);
			}
		}
	}
};

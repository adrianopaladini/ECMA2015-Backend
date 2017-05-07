module.exports = {
	getAllDeletedDocs: {
		map: function(doc) {
			if(doc.type === "EXAMPLE" && doc.deleted) {
				emit(doc.uid, null);
			}
		}
	}
};

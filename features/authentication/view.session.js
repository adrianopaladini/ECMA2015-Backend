module.exports = {
	getAllSessions: {
		map: function(doc) {
			if(doc.type === "SESSION" && !doc.deleted) {
				emit(doc.token, null);
			}
		}
	}
};

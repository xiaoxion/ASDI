function(doc) {
  if (doc._id === "dummyData") {
    emit(doc._id, doc.data);
  }
};
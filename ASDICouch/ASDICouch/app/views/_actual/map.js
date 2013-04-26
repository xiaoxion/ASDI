function(doc) {
  if (doc._id === "userData") {
    emit(doc._id, doc.data);
  }
};
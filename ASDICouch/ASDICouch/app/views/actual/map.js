function(doc) {
  if (doc._id !== "dummyData") {
    emit(doc._id, {
        "location": doc.location,
        "worktype": doc.worktype,
        "priority": doc.priority,
        "people": doc.people,
        "finishby": doc.finishby,
        "notes": doc.notes
    });
  }
};
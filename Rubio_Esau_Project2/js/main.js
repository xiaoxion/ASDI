$(function(){
    var maintenanceTypes = [ "Cleaning" , "Painting", "Electric" , "Plumbing"],
        priority;
    //errorMessage = ids('error');

    //Add Category
    var addCat = function(){
        $("<select></select>")
            .appendTo('#typeOfWork')
            .attr("id","worktype")
            .attr("name","worktype")
            .attr("data-native-menu","false");
        for(var i=0,n=maintenanceTypes.length; i<n ; i++){
            $('<option></option>')
                .appendTo('#worktype')
                .attr("value", maintenanceTypes[i])
                .text(maintenanceTypes[i])
        }
    };
    addCat();
});


$('#additem').on('pageinit', function(){
    var aiform = $('#additemform');
    aiform.validate({
        invalidHandler: function(form, validator) {},
        submitHandler: function() {
            var data = aiform.serializeArray();
            storeData(data);
        }
    });
});

 /*
var storeData = function(data){
    var d = new Date();
    keyGen = d.getTime();
    var userInput = {};
    console.log(data);
    userInput.location = ["Location:" , data[0].value ];
    userInput.worktype = ["Work Type:" , data[1].value ];
    userInput.priority = ["Priority:" , data[2].value ];
    userInput.people   = ["Workers Sent:" , data[3].value ];
    userInput.finishby = ["Finish By:" , data[4].value ];
    userInput.notes    = ["Notes:" , data[5].value ];
    localStorage.setItem(keyGen , JSON.stringify(userInput));
    alert("Job Saved!");
};
*/
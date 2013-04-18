$(document).ready(function(){
    // Optimization
    var ids = function(x) {
        var element = document.getElementById(x);
        return element;
    };

// Default Values
    var maintenanceTypes = [ "Cleaning" , "Painting", "Electric" , "Plumbing"],
        priority;
    errorMessage = ids('error');

// Add Category
    var addCat = function() {
        var selectForm = document.getElementById("aiform"),
            selectLi = ids("typeOfWork");
        selection = document.createElement("select");
        selection.setAttribute( "id" , "worktype" );
        selection.setAttribute("name" , "worktype");
        selection.setAttribute("data-native-menu","false");
        for(var i=0, n=maintenanceTypes.length ; i<n ; i++ ) {
            var makeOption = document.createElement("option"),
                text = maintenanceTypes[i];
            makeOption.setAttribute("value", text);
            makeOption.innerHTML = text;
            selection.appendChild(makeOption);
        }
        selectLi.appendChild(selection)
    };

    addCat();
});

$('#home').on('pageinit', function(){


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
    //any other code needed for addItem page goes here

});

//The functions below can go inside or outside the pageinit function for the page in which it is needed.

var autofillData = function (){

};

var getData = function(){

};

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

var	deleteItem = function (){

};

var clearLocal = function(){

};
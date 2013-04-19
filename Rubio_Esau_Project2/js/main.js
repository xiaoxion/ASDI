// **Add Jobs page interactions**
$(function(){

    // Change to Display
    $('<button></button>')
        .prependTo('#addjobs')
        .attr('data-role', 'button')
        .attr('data-inline', 'true')
        .text('Display Jobs')
        .on('click', function(){
            $('#addjobs').css('display', 'none');
            $('#disitem').css('display', 'block');
        });

    // Needed static variables
    var maintenanceTypes = [ "Cleaning" , "Painting", "Electric" , "Plumbing"],
        priority;

    // Add Select Option
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

    // Validate the Data
    $('#additemform').validate({
        invalidHandler: function(form, validator) {},
        submitHandler: function() {
            storeData($('#additemform').serializeArray());
        }
    });

    //Store the Data
    var storeData = function(data){
        var d = new Date();
        keyGen = d.getTime();
        var userInput = {};
        userInput.location = ["Location:" , data[0].value ];
        userInput.worktype = ["Work Type:" , data[1].value ];
        userInput.priority = ["Priority:" , data[2].value ];
        userInput.people   = ["Workers Sent:" , data[3].value ];
        userInput.finishby = ["Finish By:" , data[4].value ];
        userInput.notes    = ["Notes:" , data[5].value ];
        localStorage.setItem(keyGen , JSON.stringify(userInput));
        alert("Job Saved!");
        location.reload();
    };
});

// **Display Jobs Page Interactions**
$(function(){

    // Delete All Button
    $('<button></button>')
        .appendTo('#set')
        .attr('id', 'delall')
        .text("Delete All")
        .on('click', function(){
            if (localStorage.length !== 0) {
                var areYouSure = confirm("Are you sure you want to clear all Jobs??");
                if(areYouSure ==  true) {
                    localStorage.clear();
                    alert("Jobs Cleared!");
                    location.reload();
                }
            }
        });

    // Generate Jobs from Local Storage
    if(localStorage.length > 0) {
        $('<ul></ul>')
            .appendTo('#set')
            .attr('data-role', 'listview')
            .attr('data-inset', 'true')
            .attr('id',"listofjobs");
        for(var i=0, l=localStorage.length; i<l; i++){
            var parsed = JSON.parse(localStorage.getItem(localStorage.key(i)));
            $('<li></li>')
                .appendTo("#listofjobs")
                .attr("id","job"+i);
            $('<h2></h2>')
                .appendTo("#job"+i)
                .text(parsed.location[1]);
            for(var n in parsed){
                $('<p></p>')
                    .appendTo("#job"+i)
                    .text(parsed[n][0] + " " + parsed[n][1]);
            }

            // Edit Link
            $('<button></button>')
                .appendTo('#job'+i)
                .attr('data-inline', 'true')
                .text("Edit Job")
                .on('click',function(i){
                    var userInput = JSON.parse(localStorage.getItem(localStorage.key(i)));
                    $('#location').attr('value', userInput.location[1]);
                    $('#worktype').attr('value', userInput.worktype[1]);
                    $('#people').attr('value', userInput.people[1]);
                    $('#finishby').attr('value', userInput.finishby[1]);
                    $('#notes').attr('value', userInput.notes[1]);
                    var rad = document.forms[0].priority;
                    for (var i=0 , len=rad.length; i<len; i++) {
                        if (rad[i].value == "High" && userInput.priority[1] == "High") {
                            rad[i].setAttribute('checked' , 'checked')
                        } else if (rad[i].value == "Medium" && userInput.priority[1] == "Medium") {
                            rad[i].setAttribute('checked' , 'checked')
                        } else if (rad[i].value == "Low" && userInput.priority[1] == "Low") {
                            rad[i].setAttribute('checked' , 'checked')
                        }
                    }
                    $('#addjobs').css('display', 'block');
                    $('#disitem').css('display', 'none');
                });

            // Delete Link
            $('<button></button>')
                .appendTo('#job'+i)
                .attr('href', '#')
                .attr('data-role', 'button')
                .attr('data-inline', 'true')
                .text('Delete Job')
                .on('click',function(i){
                        ask = confirm('Are you Sure?');
                    if (ask) {
                        localStorage.removeItem(localStorage.key(i));
                        location.reload();
                        alert('Job Deleted!')
                    }
                });
        }
    } else {
        $("#set").contents().text("No Jobs to Display!");
        $('#delall')
            .text('Return to add Jobs!')
            .on('click', function(){
                location.reload();
            })
    }
});
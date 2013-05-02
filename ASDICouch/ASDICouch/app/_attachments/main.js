/*
* Esau Rubio
* Workganize
* 0413
*/

//Global Variables
var maintenanceTypes = [ "Cleaning" , "Painting", "Electric" , "Plumbing"],
    priority,
    dataKey;

$(document).on('pageinit','#additem',function(){
    // Add Select Label
    $("<label></label>")
        .appendTo('#typeOfWork')
        .prop('for', 'worktype')
        .text('What type of work is it?');

    // Add Select Option
    $("<select></select>")
        .appendTo('#typeOfWork')
        .attr("id","worktype")
        .attr("name","worktype")
        .attr("data-native-menu","false");
    for(var i=0,m=maintenanceTypes.length; i<m ; i++){
        $('<option></option>')
            .appendTo('#worktype')
            .attr("value", maintenanceTypes[i])
            .text(maintenanceTypes[i])
    }

    // Refresh Style
    $("#additemform").trigger("create");

    // Validate the Data & Store
    $('#additemform').validate({
        invalidHandler: function(form, validator) {},
        submitHandler: function() {
            // Store Data
            var data = $('#additemform').serializeArray(),
                userInput = {};
            if(!dataKey){
                var d = new Date(),
                    keyGen = d.getTime();
            } else {
                var keyGen = dataKey
            }
            userInput.location = ["Location:" , data[0].value ];
            userInput.worktype = ["Work Type:" , data[1].value ];
            userInput.priority = ["Priority:" , data[2].value ];
            userInput.people   = ["Workers Sent:" , data[3].value ];
            userInput.finishby = ["Finish By:" , data[4].value ];
            userInput.notes    = ["Notes:" , data[5].value ];
            localStorage.setItem(keyGen , JSON.stringify(userInput));
            location.reload();
        }
    });
});

$(document).on('pageinit','#display',function(){
    // Delete All Button
    $('<button></button>')
        .insertBefore('#listofjobs')
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

    // AJAX
    $('<button></button>')
        .insertBefore('#listofjobs')
        .prop('id','addAJAX')
        .text('Add AJAX Data')
        .on('click', function(){
            $.ajax({
                url      : "_view/_dummy",
                type     : "GET",
                dataType : "json",
                success  : function(ajax) {
                    var data = ajax.rows[0].value;
                    for(var n in data){
                        $('<li>'+
                            '<h2>' + data[n].location[1] + '</h2>'+
                            '<p>' + data[n].location[0] + ' ' + data[n].location[1] + '</p>' +
                            '<p>' + data[n].worktype[0] + ' ' + data[n].worktype[1] + '</p>' +
                            '<p>' + data[n].priority[0] + ' ' + data[n].priority[1] + '</p>' +
                            '<p>' + data[n].people[0] + ' ' + data[n].people[1] + '</p>' +
                            '<p>' + data[n].finishby[0] + ' ' + data[n].finishby[1] + '</p>' +
                            '<p>' + data[n].notes[0] + ' ' + data[n].notes[1] + '</p>' +
                            '</li>'
                        ).appendTo('#listofjobs')}
                    $('#listofjobs').listview('refresh');
                    $('#addAJAX').remove()
                },
                error    : function(){
                    alert("Failed!")
                }
            })
        });

    // Generate Jobs from Local Storage
    if(localStorage.length > 0) {
        for(var i=0, l=localStorage.length; i<l; i++){
            var key = localStorage.key(i),
                parsed = JSON.parse(localStorage.getItem(key));
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
                .attr('key', key)
                .attr('data-inline', 'true')
                .text("Edit Job")
                .on('click',function(info){
                    var userInput = JSON.parse(localStorage.getItem($(info.currentTarget).attr('key')));
                    $('#location').prop('value', userInput.location[1]);
                    $('#' + userInput.priority[1].toLowerCase()).attr('checked', true);
                    $('#people').prop('value', userInput.people[1]);
                    $('#finishby').prop('value', userInput.finishby[1]);
                    $('#notes').prop('value', userInput.notes[1]);
                    $('option[value=' + userInput.worktype[1] + ']').prop('selected', true);

                    $('#addjobs').css('display', 'block');
                    $('#disitem').css('display', 'none');

                    var keyGen = $(info.currentTarget).attr('key');
                });

            // Delete Link
            $('<button></button>')
                .appendTo('#job'+i)
                .attr('key', key)
                .attr('data-role', 'button')
                .attr('data-inline', 'true')
                .text('Delete Job')
                .on('click',function(info){
                    var
                        ask = confirm('Are you Sure?');
                    if (ask) {
                        localStorage.removeItem($(info.currentTarget).attr('key'));
                        location.reload();
                    }
                });
        }
    } else {
        $("#heads").text("No Jobs to Display!");
        $('#delall')
            .text('Return to add Jobs!')
            .on('click', function(){
                window.location = index.hmtl
            })
    }
});
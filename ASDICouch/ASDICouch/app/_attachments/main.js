/*
* Esau Rubio
* Workganize
* 0413
*/

//Global Variables
var maintenanceTypes = [ "Cleaning" , "Painting", "Electric" , "Plumbing"],
    priority;

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

    // Validate the Data & Store & Check Against Data
    $('#additemform').validate({
        invalidHandler: function(form, validator) {},
        submitHandler: function() {
            // Store Data
            var userInput = {};
            if($('form').attr('id') !== 'additemform'){
                $.couch.db('workganize').openDoc($('form').attr('id'), {
                    success: function(data){
                        var userInput = {
                            _id: data._id,
                            _rev: data._rev
                        };
                    },
                    error: function(status){
                        console.log(status)
                    }
                });
            }
            console.log(userInput);
            var data = $('form').serializeArray();
                userInput.location = ["Location:" , data[0].value ];
                userInput.worktype = ["Work Type:" , data[1].value ];
                userInput.priority = ["Priority:" , data[2].value ];
                userInput.people   = ["Workers Sent:" , data[3].value ];
                userInput.finishby = ["Finish By:" , data[4].value ];
                userInput.notes    = ["Notes:" , data[5].value ];
            $.couch.db('workganize').saveDoc(userInput, {
                success: function(data) {
                }
            });
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
                url      : "_view/dummy",
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

    // Generate Jobs from Couch DB
    $.couch.db('workganize').view("workganize/actual", {
        success: function(data) {
            if(data.total_rows>0) {
                for(var i=0, l=data.rows.length; i<l ; i++) {
                    var parsed = data.rows[i].value;
                    $('<div></div>')
                        .appendTo("#listofjobs")
                        .attr('data-role','collapsible')
                        .attr("id","job"+i);
                    $('<h3></h3>')
                        .appendTo("#job"+i)
                        .text(parsed.location[1]);
                    for(var n in parsed){
                        if(n == 'keyGen'){} else {
                            $('<p></p>')
                                .appendTo("#job"+i)
                                .text(parsed[n][0] + " " + parsed[n][1]);
                        }
                    }
                    $('#listofjobs').trigger('create');
                    // Edit Link
                    $('<button></button>')
                        .appendTo('#job'+i)
                        .prop('id',i)
                        .attr('data-role', 'button')
                        .attr('data-inline', 'true')
                        .text("Edit Job")
                        .button()
                        .on('click',function(info){
                            var userInput = data.rows[$(info.currentTarget).attr('id')].value;
                            window.location.assign('#additem');
                            $('#location').prop('value', userInput.location[1]);
                            $('#' + userInput.priority[1].toLowerCase()).prop('checked', true);
                            $("input[type='radio']").checkboxradio("refresh");
                            $('#people').prop('value', userInput.people[1]).slider('refresh');
                            $('#finishby').prop('value', userInput.finishby[1]);
                            $('#notes').prop('value', userInput.notes[1]);
                            $('#worktype').val(userInput.worktype[1]).selectmenu('refresh');
                            $('#additemform').removeAttr('id').attr('id',data.rows[$(info.currentTarget).attr('id')].id);
                        });

                    // Delete
                    $('<button></button>')
                        .appendTo('#job'+i)
                        .prop('id', i)
                        .attr('data-role', 'button')
                        .attr('data-inline', 'true')
                        .text('Delete Job')
                        .button()
                        .on('click',function(info){
                            var
                                ask = confirm('Are you Sure?');
                            if (ask) {
                                console.log(data.rows[$(info.currentTarget).attr('id')].id);
                                $.couch.db('workganize').openDoc(data.rows[$(info.currentTarget).attr('id')].id, {
                                    success: function(info){
                                        var userInput = {
                                            _id: info._id,
                                            _rev: info._rev
                                        };
                                        $.couch.db('workganize').removeDoc(userInput, {
                                            success: function(data) {
                                                console.log(data);
                                            },
                                            error: function(status) {
                                                console.log(status);
                                            }
                                        })
                                    },
                                    error: function(status){
                                        console.log(status)
                                    }
                                });
                                window.location.assign('#additem');
                            }
                        });
                }
            } else {
                $("#heads").text("No Jobs to Display!");
                $('#delall')
                    .text('Return to add Jobs!')
                    .on('click', function(){
                        window.location = "index.html#additem"
                    })
            }
        },
        error: function(status){console.log(status)}
    });
    $('#set').trigger('create');
});
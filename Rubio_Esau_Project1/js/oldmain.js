// Project 2 : WOrkganize
// Author: Esau Rubio
// MIU 0213
// 2/14/13

// DOM Loaded
window.addEventListener( "DOMContentLoaded" , function() {

    // Get Priority of the options
    function getPriority() {
        var radio = document.forms[0].priority;
        console.log(radio);
        console.log(radio.checked);
        for (var i=0 , rl=radio.length; i<rl ; i++) {
            if (radio[i].checked) {
                priority = radio[i].value
            }
        }
    }

    // Save Data
    function storeData(key) {
        if (!key) {
            var d = new Date();
            keyGen = d.getTime();
        } else {
            var keyGen = key;
        }
        getPriority ();
        var	userInput = {};
        userInput.location = ["Location:" , ids("location").value];
        userInput.worktype = ["Work Type:" , ids("worktype").value];
        userInput.priority = ["Priority:" , priority ];
        userInput.people   = ["Workers Sent:" , ids("people").value];
        userInput.finishby = ["Finish By:" , ids("finishby").value];
        userInput.notes    = ["Notes:" , ids("notes").value];
        localStorage.setItem(keyGen , JSON.stringify(userInput));
        alert("Job Saved!");
    }

    // Display Data
    function getData() {
        if (localStorage.length > 0 ) {
            switchControl("on");
            var makeDiv = document.createElement('div');
            makeDiv.setAttribute('id', 'list');
            document.body.appendChild(makeDiv);
            ids('list').style.display = 'block';
            for(var i=0, l=localStorage.length; i<l; i++) {
                var makeList = document.createElement('ul');
                makeLink = document.createElement('li');
                key = localStorage.key(i);
                value = localStorage.getItem(key);
                parsed = JSON.parse(value);
                makeBreak = document.createElement('br');
                imageGen(parsed.worktype[1] , makeList);
                for(var n in parsed) {
                    var moreLi = document.createElement('li');
                    text = parsed[n][0] + " " + parsed[n][1];
                    makeList.appendChild(moreLi);
                    moreLi.innerHTML = text;
                }
                makeDiv.appendChild(makeList);
                makeList.appendChild(makeLink);
                makeList.appendChild(makeBreak);
                editDeleteLinks(localStorage.key(i) , makeLink);
            }
        } else {
            alert("No Data to display! Default data Added.");
            insertData();
        }
    }

    // Access Image and Display
    function imageGen( parsedWork , makeList) {
        var imageLi = document.createElement('li'),
            imageTag = document.createElement('img'),
            source = imageTag.setAttribute('src', 'img/'+ parsedWork +'.png');
        makeList.appendChild(imageLi);
        imageLi.appendChild(imageTag);

    }

    // Add generic Data
    function insertData() {
        for(var n in json) {
            var d = new Date();
            var keyGen = d.getTime();
            localStorage.setItem(keyGen , JSON.stringify(json[n]));
            pause(keyGen,d);
        }
        getData();
    }

    // Pause the function
    function pause(keyGen , d) {
        if (keyGen <= d.getTime()){
            var newD = new Date();
            keyGen = newD.getTime();
            pause(keyGen,d);
        } else {
            return false
        }
    }

    // Create Edit and Delete Links
    function editDeleteLinks(key , makeLink) {
        var edit = document.createElement('a');
        edit.href = '#';
        edit.key = key;
        editText = "Edit Job";
        edit.addEventListener( 'click' , editor);
        edit.innerHTML = editText;
        makeLink.appendChild(edit);

        var del = document.createElement('a');
        del.href = '#';
        del.key = key;
        delText = "Delete Job";
        del.addEventListener( 'click' , deletor);
        del.innerHTML = delText;
        makeLink.appendChild(del);
    }

    // Edit a chosen Job
    function editor() {
        var getInput = localStorage.getItem(this.key);
        userInput = JSON.parse(getInput);
        switchControl("off");
        ids('location').value = userInput.location[1];
        ids('worktype').value = userInput.worktype[1];
        ids('people').value = userInput.people[1];
        ids('finishby').value = userInput.finishby[1];
        ids('notes').value = userInput.notes[1];
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
        submit.removeEventListener('click' , storeData);
        var editSubmit = ids('submit');
        editSubmit.addEventListener('click' , validate);
        editSubmit.key = this.key;
    }

    // Delete a chosen Job
    function deletor() {
        var ask = confirm('Are you Sure?');
        if (ask) {
            localStorage.removeItem(this.key);
            window.location.reload();
            alert('Job Deleted!')
        } else {
            alert('Job NOT Deleted')
        }
    }

    // Validate the user input
    function validate(e) {
        var errorArray = [];
        getLocation = ids('location');
        getWorktype = ids('worktype');
        getFinishby = ids('finishby');
        getNotes = ids('notes');

        // Reset
        errorMessage.innerHTML = '';
        getWorktype.style.border = '1px solid black';
        getLocation.style.border = '1px solid black';
        getFinishby.style.border = '1px solid black';
        getNotes.style.border = '1px solid black';

        // Location Validation
        if (getLocation.value === '') {
            var locationError = "Please choose a valid Location";
            getLocation.style.border = '1px solid red';
            errorArray.push(locationError)
        }

        // Work Type Validation
        if (getWorktype.value==='--Maintenance--') {
            var worktypeError = "Please choose a valid Work Type";
            getWorktype.style.border = '1px solid red';
            errorArray.push(worktypeError)
        }
        // Date validation
        var checkDate = /^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$/;
        if (!(checkDate.exec(getFinishby.value))) {
            var finishbyError = "Please choose a valid Finish Date";
            getFinishby.style.border = '1px solid red';
            errorArray.push(finishbyError)
        }
        // Notes Validation
        if (getNotes.value === '') {
            var notesError = "Please enter Notes";
            getNotes.style.border = '1px solid red';
            errorArray.push(notesError)
        }
        // Display Error Message
        if(errorArray.length>0) {
            for(var i=0,len=errorArray.length; i<len; i++) {
                var info = document.createElement('li');
                info.innerHTML = errorArray[i];
                errorMessage.appendChild(info)
            }
            e.preventDefault();
            return false;
        } else {
            storeData(this.key);
        }
    }

    // Switch between Add Job and Display Jobs
    function switchControl(n) {
        switch(n) {
            case "on":
                ids('mainform').style.display = 'none';
                ids('clear').style.display = "inline";
                ids('display').style.display = 'none';
                ids('reload').style.display = 'inline';
                break;
            case "off":
                ids('mainform').style.display = 'block';
                ids('clear').style.display = "inline";
                ids('display').style.display = 'inline';
                ids('reload').style.display = 'none';
                ids('list').style.display = 'none';
                break;
            default:
                return false
        }
    }

    // Clear Data
    function clearData() {
        if (localStorage.length===0) {
            alert("No Jobs to clear!");
        } else {
            var areYouSure = confirm("Are you sure you want to clear all Jobs??");
            if(areYouSure ==  true) {
                localStorage.clear();
                alert("Jobs Cleared!");
                return false;
            }
        }
    }


    addCat();
    //Clear and Display Data
    var display = ids("display");
    clear = ids("clear");
    submit = ids("submit");
    display.addEventListener( "click" , getData );
    clear.addEventListener( "click" , clearData );
    submit.addEventListener( "click" , validate );
});
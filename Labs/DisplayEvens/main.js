function isEven(num) {
    return (num % 2) == 0;
}
/* returns all evens in a range, width the given step. For example:
getEvens(0,5,1)

This function assumes valid numeric input, start < end, step > 0 */
function getEvens(start, end, step) {
    var evens = [];
    for (var i = start; i <= end; i += step) {
        if (isEven(i)) {
            evens.push(i);
        }
    }
    return evens;
}
function getResultMsgElement() {
    return document.getElementById("results");
}

/** append 'error: "fieldname" is empty' to results div */
function appendEmptyInputMsg(name) {
    getResultMsgElement().innerHTML += "<span style='color:red;'></br>Error: " + name + " is empty</span>";
}

/** append 'error: "fieldname" is not a number' to results div */
function appendNaNInputMsg(name) {
    getResultMsgElement().innerHTML += "<span style='color:red;'></br>Error: " + name + " is not a number</span>";
}

/** append 'start must be < end' to results div */
function appendStartGreaterThanEndMsg() {
    getResultMsgElement().innerHTML += "<span style='color:red;'></br>Error: start must be < end</span>";
}

function appendStepIsNegativeMsg() {
    getResultMsgElement().innerHTML += "<span style='color:red;'></br>Error: step must be > 0</span>";
}

/** id is assumed to be the id of a valid form input
 * append "has-error" to className of the given input */
function markInputAsError(id) {
    document.getElementById(id).parentElement.className = "form-group has-error";
}

/** id is assumed to be the id of a valid form input
 * if the element is empty append the proper error message below the forms
 * if the element is not a number append the proper error message below the forms
 */
function markInvalidInput(id) {
    var elementVal = document.getElementById(id).value;
    if (isNaN(elementVal)) {
        markInputAsError(id);
        appendNaNInputMsg(id);
        return true;
    } else if (elementVal == "") {
        markInputAsError(id);
        appendEmptyInputMsg(id);
        return true;
    }
    return false;
}

/** validates the input fields, if any input form has a error message is displayed
 *  returns true if there is a error in any of the inputs
*/
function validateInput() {
    var startHasError = markInvalidInput("start");
    var endHasError = markInvalidInput("end");
    var stepHasError = markInvalidInput("step");
    var inputHasError = startHasError || endHasError || stepHasError;

    var start = document.getElementById("start").value;
    var end = document.getElementById("end").value;
    var step = document.getElementById("step").value;

    if (Number(step) < 0) {
        markInputAsError("step");
        appendStepIsNegativeMsg();
        inputHasError = true;
    }

    // if start and end are valid then check that start < end
    if (inputHasError == false && Number(start) >= Number(end)) {
        // start must be < end
        markInputAsError("start");
        appendStartGreaterThanEndMsg();
        inputHasError = true;
    }
    // return false if inputHasError == true
    return !inputHasError;
}

/** id is assumed to be a valid form input id */
function clearErrorClassFromFromInput(id) {
    document.getElementById(id).parentElement.className = "form-group"
}

function resetInputAndErrorMessages() {
    var resultElement = getResultMsgElement();
    resultElement.innerHTML = "";
    clearErrorClassFromFromInput("start");
    clearErrorClassFromFromInput("end");
    clearErrorClassFromFromInput("step");
}

/** displays either a error message if there is a erro in the form input otherwise display every even value between start, end, with the given step */
function displayMsg() {
    resetInputAndErrorMessages();
    if (validateInput()) {
        var start = Number(document.getElementById("start").value);
        var end = Number(document.getElementById("end").value);
        var step = Number(document.getElementById("step").value);
        var evens = getEvens(start, end, step);
        // build innerHTML
        var innerHTMLString = "<span><br/>Here are the even numbers between " + start + " and " + end + " by " + step + "'s</span>";
        for (var i = 0; i < evens.length; i++) {
            innerHTMLString += "<span><br/>" + evens[i] + "</span>";
        }
        // set
        getResultMsgElement().innerHTML += innerHTMLString;
    } else {
        // do nothing, validate input will handle displaying errors
    }
    // return false to prevent submitting
    return false;
}
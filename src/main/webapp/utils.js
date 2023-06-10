function makeCall(method, url, formElement, cback, reset = true) {
    let req = new XMLHttpRequest(); // visible by closure
    req.onreadystatechange = function() {
        cback(req)
    }; // closure
    req.open(method, url);
    if (formElement == null) {
        req.send();
    } else {
        req.send(new FormData(formElement));
    }
    if (formElement !== null && reset === true) {
        formElement.reset();
    }
}

function show(elementId, visibility) { //to show/hide an element
    let page = document.getElementById(elementId);
    if (visibility) {
        page.className = "visible";
    }
    else {
        page.className = "hidden";
    }
}

function warn(currentPage, status, message) { //to show the error page
    let error = document.getElementById("error");
    error.innerHTML = "Error: " + status + "<br />" + message;
    show(currentPage, false);
    show("errorPage", true);
}
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
    let text = "Error: " + status + "\n" + message;
    alert(text);
    show(currentPage, false);
    show("HomePage", true);
}
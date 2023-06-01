(function() { // avoid variables ending up in the global scope

    document.getElementById("loginbutton").addEventListener('click', (e) => {
        var form = e.target.closest("form");
        if (form.checkValidity()) {
            makeCall("POST", 'CheckLogin', e.target.closest("form"),
                function(x) {
                    if (x.readyState == XMLHttpRequest.DONE) {
                        let message = x.responseText;
                        switch (x.status) {
                            case 200:
                                sessionStorage.setItem('username', message);
                                window.location.href = "HomeCS.html";
                                console.log("Welcome "+sessionStorage.getItem('username'));
                                break;
                            case 400: // bad request
                                document.getElementById("err").textContent = message;
                                break;
                            case 401: // unauthorized
                                document.getElementById("err").textContent = message;
                                break;
                            case 500: // server error
                                document.getElementById("err").textContent = message;
                                break;
                        }
                    }
                }
            );
        } else {
            form.reportValidity();
        }
    });

})();
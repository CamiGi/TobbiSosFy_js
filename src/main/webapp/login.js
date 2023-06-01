window.onload = function() {
    let register = document.getElementById("register");
    //register.onclick = show("registration", true);
    register.addEventListener('click',
        (e) => {
            e.preventDefault();
            show("login", false);
            show("registration", true);
    });
};

let show = function show(el, visibility) { //to show/hide an element
    let page = document.getElementById(el);
    if (visibility) {
        page.className = "visible";
    }
    else {
        page.className = "hidden";
    }
};

(function() { // avoid variables ending up in the global scope
    document.getElementById("loginButton").addEventListener('click', (e) => {
        let form = e.target.closest("form");
        if (form.checkValidity()) {
            makeCall("POST", 'CheckLogin', form,
                function(x) {
                    if (x.readyState === XMLHttpRequest.DONE) {
                        let message = x.responseText;
                        switch (x.status) {
                            case 200:
                                sessionStorage.setItem('username', message);
                                window.location.href = "/Home";
                                console.log("Welcome "+sessionStorage.getItem('username'));
                                break;
                            case 400: // bad request
                                document.getElementById("errLog").textContent = message;
                                break;
                            case 401: // unauthorized
                                document.getElementById("errLog").textContent = message;
                                break;
                            case 500: // server error
                                document.getElementById("errLog").textContent = message;
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

(() => {
    document.getElementById("regButton").addEventListener('click',
        (e) => {
            let form = e.target.closest("form");
            if (form.checkValidity()) {

                makeCall("POST", 'Register', form,
                    (x) => {
                        if (x.readyState === XMLHttpRequest.DONE) {
                            let message = x.responseText;
                            switch (x.status) {
                                case 200:
                                    show("registration", false);
                                    show("userRegistered", true);
                                    break;
                                case 400: // bad request
                                    document.getElementById("errReg").textContent = message;
                                    break;
                                case 401: // unauthorized
                                    document.getElementById("errReg").textContent = message;
                                    break;
                                case 500: // server error
                                    document.getElementById("errReg").textContent = message;
                                    break;
                            }
                        }
                    }
                );
            }
            else {
                form.reportValidity();
            }
        });
})();
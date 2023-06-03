window.onload = () => {
    let register = document.getElementById("register");
    //register.onclick = show("registration", true);
    register.addEventListener('click',
        (e) => {
            e.preventDefault();
            show("login", false);
            show("registration", true);
    });
};

(() => { // avoid variables ending up in the global scope
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
            e.preventDefault();
            let form = e.target.closest("form");
            let err = document.getElementById("errReg");
            let pwd = form.elements[1].value;

            if (form.checkValidity()) {
                if (pwd.length < 8) {
                    err.textContent = "Password length must be at least 8 chars";
                    return;
                }
                if (pwd.length > 20) {
                    err.textContent = "Password length must be at most 20 chars";
                    return;
                }
                if (pwd.toLowerCase() === pwd) {
                    err.textContent = "Password must contain at least one uppercase char";
                    return;
                }
                if (pwd.toUpperCase() === pwd) {
                    err.textContent = "Password must contain at least one lowercase char";
                    return;
                }
                if (!pwd.includes("0") &&
                    !pwd.includes("1") &&
                    !pwd.includes("2") &&
                    !pwd.includes("3") &&
                    !pwd.includes("4") &&
                    !pwd.includes("5") &&
                    !pwd.includes("6") &&
                    !pwd.includes("7") &&
                    !pwd.includes("8") &&
                    !pwd.includes("9")) {
                    err.textContent = "Password must contain at least one number";
                    return;
                }
                if (!pwd.includes("-") &&
                    !pwd.includes("_") &&
                    !pwd.includes("=") &&
                    !pwd.includes("+") &&
                    !pwd.includes("/") &&
                    !pwd.includes("£") &&
                    !pwd.includes("&") &&
                    !pwd.includes("%") &&
                    !pwd.includes("^") &&
                    !pwd.includes("@") &&
                    !pwd.includes("`") &&
                    !pwd.includes("#") &&
                    !pwd.includes(".") &&
                    !pwd.includes(",") &&
                    !pwd.includes("!") &&
                    !pwd.includes("?") &&
                    !pwd.includes(">") &&
                    !pwd.includes("<") &&
                    !pwd.includes(":")) {
                    err.textContent = "Password must contain at least one special char";
                    return;
                }
                if (!pwd.localeCompare(form.elements[2])) {
                    err.textContent = "Password and confirmation are different";
                    return;
                }
                makeCall("POST", 'Register', form,
                    (x) => {
                        if (x.readyState === XMLHttpRequest.DONE) {
                            let message = x.responseText;

                            if (x.status === 200) {
                                show("registration", false);
                                show("userRegistered", true);
                            }
                            else {
                                err.textContent = message;
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
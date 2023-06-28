//SECURYTY UPDATE:
// mandando una o piu' tracce come stringa JSON si vedono tutti gli attributi, tra cui lo user, quindi
// é possibile vedere la password di uno user dalle sue tracce! Per risolvere ho fatto che l'attributo user
// della classe Track é solo lo username

//Grande Marco!!
//Grazie Cami!!!

var tracks; //da rendere pubblico che serve anche a Marco ~ update: ora é nello scope globale
let playlists;
let u_name;
let u;
let u_psw;
let no_pl;

window.onload = function() {

    console.log("Hello world!");

    makeCall("GET", 'Home', null,
        (x) => {
            switch(x.readyState){
                case XMLHttpRequest.DONE:

                    no_pl = false;

                    //document.getElementById("empty_pl").style.visibility = 'hidden';

                    document.getElementById("myplaylists").style.visibility = 'visible';
                    document.getElementById("newPlaylist").style.visibility = 'hidden';
                    document.getElementById("newTrack").style.visibility = 'hidden';

                    showDivs(true, false, false);

                    document.getElementById("navMP").onclick = function(){showDivs(true, false, false)};
                    document.getElementById("navNP").onclick = function(){showDivs(false,true,false)};
                    document.getElementById("navNT").onclick = function(){showDivs(false,false,true)};

                    let testo_risposta = x.responseText;
                    let res = JSON.parse(testo_risposta);
                    let ans = res["Answer"];

                    //setto i dati
                    tracks = ans[1];
                    playlists = ans[0];
                    tracks = tracks["Tracks"];
                    playlists = playlists["Playlists"];
                    let t = tracks[0];
                    u = ans[2];
                    u_name = u["Us_name"];
                    u_psw = u["Us_psw"];

                    //setto lo username, playlists e tracks
                    document.getElementById("username").innerText = u_name;

                    //setto la pagina playlist
                    let dl = document.getElementById("pllysts");
                    let anchor;
                    let dt;
                    let dd;

                    if(playlists.length === 0){
                        no_pl = true;
                    } else {
                        dl.replaceChildren();

                        for (let i = 0; i < playlists.length; i++) {
                            anchor = document.createElement("A");
                            dt = document.createElement("DT");
                            dt.setAttribute("name", "halo");
                            dd = document.createElement("DD");
                            anchor.setAttribute("id", "p" + i);
                            anchor.className = "ply";
                            anchor.setAttribute("href", "ShowPlaylist?playlist=" + playlists[i].id);
                            anchor.innerHTML = playlists[i].title;
                            dt.appendChild(anchor);
                            dl.appendChild(dt);
                            dd.setAttribute("id", "pdate" + i);
                            dd.innerHTML = playlists[i].date;
                            dl.appendChild(dd);
                        }
                    }
                    if(no_pl){
                        dt = document.createElement("DT");
                        dt.innerText = "You don't have any playlist yet";
                        dl.replaceChildren(dt)
                    }

                    //setto la pagina NewTrack
                    let select = document.getElementById("dalbum");
                    for(let i =2024; i>1899; i--){
                        let h = document.createElement("OPTION");
                        h.innerText = i;
                        h.setAttribute("name", "year");
                        select.appendChild(h);
                    }


                    //setto la pagina NewPlaylist
                    let selection = document.getElementById("selectionSong");
                    let inp;
                    let lab;
                    let li;

                    if(tracks.length === 0){
                        selection.innerText = "You don't have any song";
                    } else {
                        selection.replaceChildren();
                        for (let i = 0; i < tracks.length; i++) {
                            li = document.createElement("BR");
                            inp = document.createElement("INPUT");
                            inp.setAttribute("type", "checkbox");
                            inp.setAttribute("name", "song");
                            inp.setAttribute("value", tracks[i].id);
                            lab = document.createElement("LABEL");
                            lab.setAttribute("class", "lalabel");
                            lab.innerText = tracks[i].title + " - " + tracks[i].album.title + " - " + tracks[i].album.genre + " - " + tracks[i].album.artist.artistName;

                            selection.appendChild(inp);
                            selection.appendChild(lab);
                            selection.appendChild(li);

                        }
                    }

                    initPlPage();
                    break;
                case XMLHttpRequest.UNSENT:
                    window.reportError("Couldn't send the request, try later");
                    break;
                case XMLHttpRequest.LOADING:
                    document.getElementById("pllysts").innerText = "Home page is loading, please wait...";
                    break;
            }
        }
    );


};

function showDivs(mp, np, nt){
    if(mp){
        document.getElementById("myplaylists").style.visibility = 'visible';
        document.getElementById("newPlaylist").style.visibility = 'hidden';
        document.getElementById("newTrack").style.visibility = 'hidden';
        //document.getElementById("empty_pl").style.visibility = 'hidden';
        if(no_pl){
            document.getElementById("empty_pl").style.visibility = 'visible';
        }
    } else if(np){
        document.getElementById("myplaylists").style.visibility = 'hidden';
        document.getElementById("newPlaylist").style.visibility = 'visible';
        document.getElementById("newTrack").style.visibility = 'hidden';
        //document.getElementById("empty_pl").style.visibility = 'hidden';
    } else if(nt){
        document.getElementById("myplaylists").style.visibility = 'hidden';
        document.getElementById("newPlaylist").style.visibility = 'hidden';
        document.getElementById("newTrack").style.visibility = 'visible';
        //document.getElementById("empty_pl").style.visibility = 'hidden';
    }
}

(function() { // avoid variables ending up in the global scope
    document.getElementById("addNewPlaylist").addEventListener('click', (e) => {
        e.preventDefault();
        let form = e.target.closest("form");
        let p_title = form.elements[0].value;
        let p_songs = document.getElementsByName("song");
        let ss = [];
        for(let i = 0; i < p_songs.length; i++){
            if(p_songs[i].checked){
                ss.push(p_songs[i]);
            }
        }

        let username = document.getElementById("username").innerText;

        if (form.checkValidity()) {
            if(p_title === '' || ss.length === 0){
                console.log("ERRORE");
                return;
            }

            makeCall("POST", 'PLinsert', form,
                function(x) {
                    if (x.readyState === XMLHttpRequest.DONE) {
                        let message = x.responseText;
                        switch (x.status) {
                            case 200:
                                location.reload();
                                alert("Playlist added to your collection");
                                break;
                            default:
                                warn(x.status, x.responseText);
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
    document.getElementById("2Step2").addEventListener('click', (e) => {
        let form = e.target.closest("form");
        let t_title = form.elements[0].value;
        let t_file = form.elements[1].files.length;

        e.preventDefault();
        if (t_title !== "" && t_file > 0) {
            document.getElementById("error1").innerText = "";
            show("step1", false);
            show("step2", true);
        } else {
            document.getElementById("error1").innerText = "Compile all the fields and upload all the required files to go on";
        }
    });

    document.getElementById("2Step3").addEventListener('click', (e) => {
        let form = e.target.closest("form");
        let t_artname = form.elements[3].value;
        let t_aname = form.elements[4].value;
        let t_ayear = form.elements[5].value;
        let t_albumArt = form.elements[6].files.length;

        e.preventDefault();
        if(t_artname !== "" && t_aname !== "" && t_ayear !== "" && t_albumArt > 0) {
            document.getElementById("error2").innerText = "";
            show("step2", false);
            show("step3", true);
        } else {
            document.getElementById("error2").innerText = "Compile all the fields and upload all the required files to go on";
        }
    });

    document.getElementById("backStep1").addEventListener('click', (e) => {
        e.preventDefault();
        show("step2", false);
        show("step1", true);
    });

    document.getElementById("backStep2").addEventListener('click', (e) => {
        e.preventDefault();;
        show("step3", false);
        show("step2", true);
    });

    document.getElementById("addNewTrack").addEventListener('click', (e) => {
        e.preventDefault();
        let form = e.target.closest("form");

        if (confirm("Everything is correct?")) {
            makeCall("POST", 'Home', form,
                function (x) {
                    if (x.readyState === XMLHttpRequest.DONE) {
                        let message = x.responseText;
                        switch (x.status) {
                            case 200:
                                location.reload();
                                alert("Song added to your collection");
                                break;
                            default:
                                warn(x.status, x.responseText);
                                break;
                        }
                    }
                }
            );
        }
    });
})();
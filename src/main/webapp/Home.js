//SECURYTY UPDATE:
// mandando una o piu' tracce come stringa JSON si vedono tutti gli attributi, tra cui lo user, quindi
// é possibile vedere la password di uno user dalle sue tracce! Per risolvere ho fatto che l'attributo user
// della classe Track é solo lo username

//Grande Marco!!

let tracks; //da rendere pubblico che serve anche a Marco
let playlists;
let u_name;

window.onload = function() {
    /*if(username.toString().length>0){
        document.getElementById("username").textContent = username.toString();
    } else {
        document.getElementById("username").textContent = "Null";
    };*/
    console.log("Hello world!");

    makeCall("GET", 'Home', null, //con le get non si inviano form, quindi al suo posto metti null
        (x) => {
            switch(x.readyState){
                case XMLHttpRequest.DONE:

                    document.getElementById("myplaylists").style.visibility = 'visible';
                    document.getElementById("newPlaylist").style.visibility = 'hidden';
                    document.getElementById("newTrack").style.visibility = 'hidden';

                    showDivs(true, false, false);

                    document.getElementById("PlaylistPage").style.visibility = 'hidden';
                    document.getElementById("PlayerPage").style.visibility = 'hidden';
                    document.getElementById("ErrorPage").style.visibility = 'hidden';

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
                    console.log(playlists);
                    console.log(tracks);
                    let t = tracks[0];
                    console.log(t);
                    u_name = t["user"];
                    console.log(u_name);

                    //setto lo username, playlists e tracks
                    document.getElementById("username").innerText = u_name;

                    //setto la pagina playlist : FARE IL CASO IN CUI TRACKS O PLAYLISTS è VUOTA
                    let dl = document.getElementById("ply");
                    let anchor;
                    let dt;
                    let dd;

                    //if(playlists.length == 0){
                    //    dl.innerText = "You don't have any palylist yet";
                    //}

                    for(let i=0; i < playlists.length; i++){
                        anchor = document.createElement("A");
                        dt = document.createElement("DT");
                        dd = document.createElement("DD");
                        anchor.setAttribute("id", "ply");
                        anchor.setAttribute("class", "ply");
                        anchor.setAttribute("href", "ShowPlaylist?playlist="+playlists[i].id);
                        anchor.innerHTML = playlists[i].title;
                        dt.appendChild(anchor);
                        dl.appendChild(dt);
                        dd.setAttribute("id", "pdate");
                        dd.innerHTML = playlists[i].date;
                        dl.appendChild(dd);
                    }

                    //preventdefault: fa in modo che la href non vadano alla pagina

                    //setto la pagina NewTrack

                    //creare script con il controllo dei dati inseriti e invio form

                    //setto la pagina NewPlaylist

                    //creare script per inviare nuova playlist e controllo dati inseriti
                    break;
                case XMLHttpRequest.UNSENT:
                    window.reportError("Couldn't send the request, try later");
                    break;
                case XMLHttpRequest.LOADING:
                    document.getElementById("tab").textContent = "Home page is loading, please wait...";
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
    } else if(np){
        document.getElementById("myplaylists").style.visibility = 'hidden';
        document.getElementById("newPlaylist").style.visibility = 'visible';
        document.getElementById("newTrack").style.visibility = 'hidden';
    } else if(nt){
        document.getElementById("myplaylists").style.visibility = 'hidden';
        document.getElementById("newPlaylist").style.visibility = 'hidden';
        document.getElementById("newTrack").style.visibility = 'visible';
    }
}

export class Playlist{
    id;
    title;
    date;
    user;
}

export class Track{
    id;
    title;
    album;
    mp3Uri;
    user;
}

function showHome(){
}

(function() { // avoid variables ending up in the global scope
    document.getElementById("addNewTrack").addEventListener('click', (e) => {
        let form = e.target.closest("form");
        if (form.checkValidity()) {
            makeCall("POST", 'Home', form,
                function(x) {
                    if (x.readyState === XMLHttpRequest.DONE) {
                        let message = x.responseText;
                        switch (x.status) {
                            case 200:
                                /*sessionStorage.setItem('username', message);
                                console.log("Welcome "+sessionStorage.getItem('username'));*/
                                window.location.href = "/Home";
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

function logout(){
    //redirecta a alla pagina di login
}

function playlistSelected(id){
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", "/ShowPlaylist?playlist="+id+"&group=0", false ); // false for synchronous request
    xmlHttp.send( null );
    return xmlHttp.responseText; //mandare la risposta a chi gestisce la pagina delle playlist
}

function songSelected(){
    //apre il palyer della canzone
}

function redirectHome(){
    //torna alla home page
}

function redirectError(){
    //va alla pagina di errore
}
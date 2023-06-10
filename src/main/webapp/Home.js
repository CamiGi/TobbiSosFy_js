//SECURYTY UPDATE:
// mandando una o piu' tracce come stringa JSON si vedono tutti gli attributi, tra cui lo user, quindi
// é possibile vedere la password di uno user dalle sue tracce! Per risolvere ho fatto che l'attributo user
// della classe Track é solo lo username

window.onload = function() {
    /*if(username.toString().length>0){
        document.getElementById("username").textContent = username.toString();
    } else {
        document.getElementById("username").textContent = "Null";
    };*/
    console.log("Hello world!");

    makeCall("GET", 'Home', form, //con le get non si inviano form, quindi al suo posto metti null
        function(x) {
            if (x.readyState === XMLHttpRequest.DONE) {
                //let username= x.responseText;
                const username = JSON.parse(x);
                switch (x.status) {
                    case 200:
                        sessionStorage.setItem('username', x.user); // Lo username lo c'é gia' da dopo il login, non serve risettarlo
                        sessionStorage.setItem('myPlaylists', []<Playlist>(x.playlists));
                        sessionStorage.setItem('myTracks', []<Track>(x.tracks));
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

    document.getElementById("username").innerHTML = sessionStorage.getItem('username');
    let playlists = []<Playlist>sessionStorage.getItem('myPlaylists');
    document.getElementById("pllysts").innerHTML = playlists;
    for(let i=0; i < playlists.length; i++){
        document.getElementById("ply").innerHTML = playlists[i].title;
        document.getElementById("pdate").innerHTML = playlists[i].date;
    }

    document.getElementById("myplaylists").style.visibility = 'hidden';
    document.getElementById("newPlaylist").style.visibility = 'hidden';
    document.getElementById("newTrack").style.visibility = 'hidden';

    showDivs(true, false, false);

    document.getElementById("PlaylistPage").style.visibility = 'hidden';
    document.getElementById("PlayerPage").style.visibility = 'hidden';
    document.getElementById("ErrorPage").style.visibility = 'hidden';

    document.getElementById("navMP").onclick = function(){showDivs(true, false, false)};
    document.getElementById("navNP").onclick = function(){showDivs(false,true,false)};
    document.getElementById("navNT").onclick = function(){showDivs(false,false,true)};

    //setto la pagina playlist
    document.getElementById("ply").innerHTML = "Playlist 1";
    document.getElementById("pdate").innerHTML = "Date 1";
    document.getElementById("ply").onclick = function(){playlistSelected(id)} //capire come mettergli l'id

    //preventdefault: fa in modo che la href non vadano alla pagina

    //setto la pagina NewTrack
        //creare script con il controllo dei dati inseriti e invio form

    //setto la pagina NewPlaylist
    document.getElementById("song").innerHTML = "track1 - album1 - artist 1"
        //creare script per inviare nuova playlist e controllo dati inseriti
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
window.onload = function() {
    /*if(username.toString().length>0){
        document.getElementById("username").textContent = username.toString();
    } else {
        document.getElementById("username").textContent = "Null";
    };*/
    console.log("Hello world!");

    document.getElementById("myplaylists").style.visibility = 'hidden';
    document.getElementById("newPlaylist").style.visibility = 'hidden';
    document.getElementById("newTrack").style.visibility = 'hidden';

    showDivs(true, false, false);

    document.getElementById("PlaylistPage").style.visibility = 'hidden';
    document.getElementById("PlayerPage").style.visibility = 'hidden';
    document.getElementById("ErrorPage").style.visibility = 'hidden';

    /*document.getElementById("navMP").addEventListener("click", showDivs(true,false,false), false);
    document.getElementById("navNP").addEventListener("click", showDivs(false,true,false), false);
    document.getElementById("navNT").addEventListener("click", showDivs(false,false,true), false);*/
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

function showHome(){
}

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
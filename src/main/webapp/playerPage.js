{
    var initPlayer = () => {

        document.querySelectorAll(".il").forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                show("PlaylistPage", false);

                makeCall("GET", e.target.getAttribute("href"), null,
                    (x) => {
                    let track;
                    const url = e.target.getAttribute("href");
                    const qs = url.substring(url.indexOf('?') + 1);
                    const urlParams = new URLSearchParams(qs);

                    switch(x.readyState) {
                    case XMLHttpRequest.UNSENT:
                        alert("Couldn't send the request, please try later");
                        show("PlaylistPage", true);
                        break;
                    case XMLHttpRequest.LOADING:
                        document.getElementById("info").textContent = "Song loading, please wait...";
                        break;
                    case XMLHttpRequest.DONE:
                        if (x.status === 200) {
                            for (let i=0; i<playlistTracks.length; i++) {
                                if (playlistTracks[i].id == urlParams.get('track')) {
                                    track = playlistTracks[i];
                                    break;
                                }
                            }
                            printInfo(track);
                            printAudio(track);
                            document.body.style.backgroundImage = "url(" + track.album.image + ")";
                            document.body.style.backgroundPosition = "center";
                            document.body.style.backgroundRepeat = "none";
                            document.body.style.backgroundSize = "cover";
                            show("PlayerPage", true);
                        }
                        else {
                            warn(x.status, x.responseText);
                            show("PlaylistPage", true);
                        }
                    }
                })
            })
        });

        document.getElementById("goHome").addEventListener('click',
            (e) => {
                e.preventDefault();
                document.body.style.removeProperty("background-image");
                show("PlayerPage", false);
                show("HomePage", true);
            });

        document.getElementById("backPlaylist").addEventListener('click',
            (e) => {
                e.preventDefault();
                document.body.style.removeProperty("background-image");
                show("PlayerPage", false);
                show("PlaylistPage", true);
            });
    }

    function printInfo(track) {
        let info = document.getElementById("info");
        let tab1 = document.createElement("TABLE");
        let tab2 = document.createElement("TABLE");
        let row = tab1.insertRow(0);
        let data = row.insertCell(0);
        let image = document.createElement("IMG");

        image.className = "albumArt";
        image.setAttribute("src", track.album.image);
        image.setAttribute("alt", "Album Cover");
        data.appendChild(image);
        data.className = "entry";

        createRow(tab2, 0, "Title:", track.title);
        createRow(tab2, 1, "Album:", track.album.title);
        createRow(tab2, 2, "Artist:", track.album.artist);
        createRow(tab2, 3, "Year:", track.album.year);
        createRow(tab2, 4, "Genre:", track.album.genre);

        data = row.insertCell(1);
        data.className = "entry";
        data.appendChild(tab2);
        info.replaceChildren(tab1);
    }

    function createRow(tab, num, arg, val) {
        let row = tab.insertRow(num);
        let data = row.insertCell(0);
        data.className = "data";
        data.innerText = arg;
        data = row.insertCell(1);
        data.className = "data";
        data.innerText = val;
    }

    function printAudio(track) {
        let player = document.getElementById("player");
        let audio = document.createElement("AUDIO");
        let source;
        let extensions = ["mpeg", "mp4", "wav", "aac", "ogg", "webm", "x-caf", "flac"];
        let error = document.createTextNode("Your browser does not support this audio extension");

        audio.setAttribute("controls", "true");
        extensions.forEach(ext => {
            source = document.createElement("SOURCE");
            source.setAttribute("src", track.uri);
            source.setAttribute("type", "audio/" + ext);
            audio.appendChild(source);
        });
        audio.appendChild(error);
        player.replaceChildren(audio);
    }
}
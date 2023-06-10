{
    let playlistTracks;

    (() => {
        document.getElementById("ply").addEventListener('click',
            (e) => {
                e.preventDefault();
                makeCall("GET", "ShowPlaylist?playlist=" + jQuery.url.param("playlist")
                    + "&group=0", null, (x) => {
                        switch (x.readyState) {
                            case XMLHttpRequest.UNSENT:
                                window.reportError("Couldn't send the request, try later");
                                break;
                            case XMLHttpRequest.LOADING:
                                document.getElementById("tab").textContent = "Playlist loading, please wait...";
                                break;
                            case XMLHttpRequest.DONE:
                                let resp = x.responseText;
                                let tracks = JSON.parse(resp);

                                if (x.status === 200) {
                                    for (let i=0; i<tracks.length; i++) {
                                        playlistTracks.push(new Track(tracks[i][0], tracks[i][1],
                                            tracks[i][2], tracks[i][3]));
                                    }
                                    printButtons();
                                    printGroup();
                                    printTracksToAdd();
                                } else {//errorpage
                                    warn("playlistPage", x.status, x.responseText);
                                }
                        }
                    }
                );
            });

        document.getElementById("prevButton").addEventListener('click',
            (e) => {
                e.preventDefault();
                printButtons();
                printGroup();
            });

        document.getElementById("nextButton").addEventListener('click',
            (e) => {
                e.preventDefault();
                printButtons();
                printGroup();
            });

        document.getElementById("backPlaylist").addEventListener('click',
            (e) => {
                e.preventDefault();
                show("playerPage", false);
                show("playlistPage", true);
                /*
                PrintButtons();
                printGroup();
                printTracksToAdd();
                */
            });

        document.getElementById("backHome").addEventListener('click',
            (e) => {
                e.preventDefault();
                show("playlistPage", false);
                show("HomePage", true);
                //da fare roba in caso fosse cambiato qualcosa
                /*
                PrintButtons();
                printGroup();
                printTracksToAdd();
                */
            });

        document.getElementById("goHome").addEventListener('click',
            (e) => {
                e.preventDefault();
                show("playerPage", false);
                show("HomePage", true);
                //da fare roba in caso fosse cambiato qualcosa
                /*
                PrintButtons();
                printGroup();
                printTracksToAdd();
                */
            });

        document.getElementById("showForm").addEventListener('click',
            (e) => {
                e.preventDefault();
                show("trks", false);
                show("order", false);
                e.target.className = "activeTab";
                show("frm", true);
                document.getElementById("showTab").className = "backgroundTab";
                document.getElementById("showMod").className = "backgroundTab";
            });

        document.getElementById("showTab").addEventListener('click',
            (e) => {
                e.preventDefault();
                show("frm", false);
                show("order", false);
                e.target.className = "activeTab";
                show("trks", true);
                document.getElementById("showForm").className = "backgroundTab";
                document.getElementById("showMod").className = "backgroundTab";
            });

        document.getElementById("showMod").addEventListener('click',
            (e) => {
                e.preventDefault();
                show("frm", false);
                show("trks", false);
                e.target.className = "activeTab";
                show("order", true);
                document.getElementById("showForm").className = "backgroundTab";
                document.getElementById("showTab").className = "backgroundTab";
            }
        );
    })();

    function Track (title, album, uri, user) {
        this.title = title;
        this.album = new Album(album[0], album[1], album[2], album[3], album[4]);
        this.uri = uri;
        this.user = user;
    }

    function Album (title, year, genre, artist, image) {
        this.title = title;
        this.year = year;
        this.genre = genre;
        this.artist = artist;
        this.image = image;
    }

    function printButtons() {     //shows/hides prev/next button in the playlist page
        let prevB = "prevButton";
        let nextB = "nextButton";
        let group = jQuery.url.param("group");

        if (group > 0) {
            show(prevB, true);
        } else {
            show(prevB, false);
        }

        if (5 * group < playlistTracks.length) {
            show(nextB, true);
        } else {
            show(nextB, false);
        }
    }

    function printGroup() {     //prints a group of 1~5 tracks in the playlist page
        let tab = document.getElementById("tab");
        let table = document.createElement("TABLE");
        let row = table.insertRow(0);
        let data;
        let group = 5 * jQuery.url.param("group");
        let anchor;
        let image;

        if (playlistTracks.length > 0) {
            for (let i = group; i < group + 5 && i < playlistTracks.length; i++) {
                data = row.insertCell(i - group);
                data.className = "shine";

                anchor = document.createElement("A");
                anchor.setAttribute("href", "/StartPlayer?track=" + playlistTracks[i].id);
                anchor.innerText = playlistTracks[i].title;
                data.appendChild(anchor);

                image = document.createElement("IMG");
                image.setAttribute("src", playlistTracks[i].image);
                data.appendChild(image);
            }

            table.appendChild(row);
            tab.appendChild(table);
        } else {
            tab.innerText = "This playlist does not contain any tracks yet";
        }
    }

    function printTracksToAdd() {   //prints the tracks a user can add to a playlist in the playlist page
        let form = document.getElementById("frm").lastElementChild.parentElement;
        let input;
        let label;
        let t;

        for (let i = 0; i < playlistTracks.length; i++) {
            t = userTracks.tracks[i];

            if (!playlistTracks.includes(t)) {
                input = document.createElement("INPUT");
                input.setAttribute("type", "checkbox");
                input.setAttribute("name", "tracks");
                input.id = t.id;
                //input.setAttribute("id", t.id);
                form.appendChild(input);

                label = document.createElement("LABEL");
                label.setAttribute("for", t.id);
                label.innerText = t.title + " - " + t.album.title + " - " + t.album.genre +
                    +" - " + t.album.artist;
                form.appendChild(label);
            }
        }

        if (input !== null) {
            form.innerText = "";
            input = document.createElement("input");
            input.setAttribute("type", "submit");
            //input.setAttribute("id", "addTracksToPlaylist");
            input.setAttribute("value", "Submit");
            input.id = "addTracksToPlaylist";
            input.className = "center";
            form.appendChild(input);
        } else {
            form.innerText = "There are no tracks to add to this playlist";
        }
    }
}
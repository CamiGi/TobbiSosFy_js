{
    let playlistTracks = [];
    let group;

    var initPlPage = () => {
        document.querySelectorAll('.ply').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            makeCall("GET", e.target.getAttribute("href"), null, (x) => {
                    switch (x.readyState) {
                        case XMLHttpRequest.UNSENT:
                            window.reportError("Couldn't send the request, please try later");
                            break;
                        case XMLHttpRequest.LOADING:
                            document.getElementById("tab").textContent = "Playlist loading, please wait...";
                            break;
                        case XMLHttpRequest.DONE:
                            let resp = x.responseText;

                            if (x.status === 200) {
                                let trs = JSON.parse(resp);
                                let t;
                                group = 0;
                                for (let i = 0; i < trs.length; i++) {
                                    t = trs[i];
                                    playlistTracks.push(new Track(t["id"], t["title"],
                                        t["album"], t["mp3Uri"], t["user"]));
                                }
                                printButtons();
                                printGroup();
                                printTracksToAdd();
                                show("HomePage", false);
                                show("PlaylistPage", true);
                            } else {//errorpage
                                warn("PlaylistPage", x.status, x.responseText);
                            }
                    }
                });
            })
        });

        document.getElementById("prevButton").addEventListener('click',
            (e) => {
                e.preventDefault();

                if(group > 0) {
                    group -= 5;
                }
                printButtons();
                printGroup();
            });

        document.getElementById("nextButton").addEventListener('click',
            (e) => {
                e.preventDefault();
                group += 5;
                printButtons();
                printGroup();
            });

        document.getElementById("backPlaylist").addEventListener('click',
            (e) => {
                e.preventDefault();
                show("playerPage", false);
                show("PlaylistPage", true);
                /*
                PrintButtons();
                printGroup();
                printTracksToAdd();
                */
            });

        document.getElementById("backHome").addEventListener('click',
            (e) => {
                e.preventDefault();
                show("PlaylistPage", false);
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

        document.getElementById("return").addEventListener('click',
            (e) => {
                e.preventDefault();
                show("errorPage", false);
                show("HomePage", true);
            })
    };

    function Track (id, title, album, uri, user) {
        this.id = id;
        this.title = title;
        this.album = new Album(album["title"], album["year"], album["genre"], album["artist"], album["imgUri"]);
        this.uri = uri;
        this.user = user;
    }

    function Album (title, year, genre, artist, image) {
        this.title = title;
        this.year = year;
        this.genre = genre;
        this.artist = artist["artistName"];
        this.image = image;
    }

    function printButtons() {     //shows/hides prev/next button in the playlist page
        let prevB = "prevButton";
        let nextB = "nextButton";

        if (group > 0) {
            show(prevB, true);
        } else {
            show(prevB, false);
        }

        if (group+5 < playlistTracks.length) {
            show(nextB, true);
        } else {
            show(nextB, false);
        }
    }

    function printGroup() {     //prints a group of 1~5 tracks in the playlist page
        let tab = document.getElementById("tab");
        let table = document.createElement("TABLE");
        let row = table.insertRow(0);
        let track;
        let data;
        let anchor;
        let image;

        if (playlistTracks.length > 0) {
            for (let i = group; i < group+5 && i < playlistTracks.length; i++) {
                track = playlistTracks[i];
                data = row.insertCell(i - group);
                data.className = "shine";

                anchor = document.createElement("A");
                anchor.setAttribute("href", "/StartPlayer?track=" + track.id);
                anchor.innerText = track.title;
                data.appendChild(anchor);

                image = document.createElement("IMG");
                image.setAttribute("src", track.album.image);
                image.innerText = "Album art";
                data.appendChild(image);
            }

            table.appendChild(row);
            tab.replaceChildren(table);
        } else {
            tab.innerText = "This playlist does not contain any tracks yet";
        }

        if (group >= playlistTracks.length || group < 0) {
            tab.innerText = "You trespass, Jedi"
        }
    }

    function printTracksToAdd() {   //prints the tracks a user can add to a playlist in the playlist page
        let form = document.getElementById("frm").lastElementChild.parentElement;
        let input;
        let label;
        let t;

        for (let i = 0; i < playlistTracks.length; i++) {
            t = tracks[i];

            if (!playlistTracks.includes(t)) {
                input = document.createElement("INPUT");
                input.setAttribute("type", "checkbox");
                input.setAttribute("name", "tracks");
                input.setAttribute("id", t.id);
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
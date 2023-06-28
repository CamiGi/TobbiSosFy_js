{
    var playlistTracks = [];
    let group;
    let playlist;
    let ctx;

    var initPlPage = () => {
        document.querySelectorAll('.ply').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();

            makeCall("GET", e.target.getAttribute("href"), null,
                (x) => {
                    const url = e.target.getAttribute("href");
                    const qs = url.substring(url.indexOf('?') + 1);
                    const urlParams = new URLSearchParams(qs);

                    ctx = window.location.pathname.substring(0, window.location.pathname.indexOf("/", 1));
                    console.log(ctx);
                    playlist = urlParams.get('playlist');
                    document.getElementById("title").lastElementChild.innerText = e.target.innerText;
                    show("HomePage", false);

                    switch (x.readyState) {
                    case XMLHttpRequest.UNSENT:
                        alert("Couldn't send the request, please try later");
                        show("HomePage", true);
                        break;
                    case XMLHttpRequest.LOADING:
                        document.getElementById("tab").textContent = "Playlist loading, please wait...";
                        break;
                    case XMLHttpRequest.DONE:
                        let resp = x.responseText;

                        if (x.status === 200) {
                            parseJSON(resp);
                            printButtons();
                            printGroup();
                            printTracksToAdd();
                            show("PlaylistPage", true);
                            go(playlist);
                            initPlayer();
                        }
                        else {//errorpage
                            warn(x.status, x.responseText);
                            show("HomePage", true);
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
        /*
        document.getElementById("return").addEventListener('click',
            (e) => {
                e.preventDefault();
                show("errorPage", false);
                show("HomePage", true);
            })
         */
    };

    function Track (id, title, album, uri, user) {
        this.id = id;
        this.title = title;
        this.album = new Album(album["title"], album["year"], album["genre"], album["artist"], album["imgUri"]);
        this.uri = ctx + "/resources/tracks/" + uri;
        this.user = user;
    }

    function Album (title, year, genre, artist, image) {
        this.title = title;
        this.year = year;
        this.genre = genre;
        this.artist = artist["artistName"];
        this.image = ctx + "/resources/images/" + image;
    }

    function parseJSON (resp) {
        let trs = JSON.parse(resp);
        let t;
        group = 0;

        while(playlistTracks.length > 0) {
            playlistTracks.pop();
        }

        for (let i = 0; i < trs.length; i++) {
            t = trs[i];
            playlistTracks.push(new Track(t["id"], t["title"],
                t["album"], t["mp3Uri"], t["user"]));
        }
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

                image = document.createElement("IMG");
                image.setAttribute("src", track.album.image);
                image.setAttribute("alt", "Album art");
                data.appendChild(image);

                anchor = document.createElement("A");
                anchor.setAttribute("href", "StartPlayer?track=" + track.id);
                anchor.innerText = track.title;
                anchor.className = "il";
                data.appendChild(anchor);
            }

            table.appendChild(row);
            tab.replaceChildren(table);
        } else {
            tab.innerText = "This playlist does not contain any tracks yet";
        }

        if (group >= playlistTracks.length || group < 0) {
            tab.innerText = "You trespass, jedi."
        }
    }

    function printTracksToAdd() {   //prints the tracks a user can add to a playlist in the playlist page
        let form = document.querySelector('.frm');
        let el;
        let input;
        let label;
        let t;
        let check;
        form.replaceChildren();

        for (let i = 0; i < tracks.length; i++) {
            t = tracks[i];
            check = true;

            for (let i=0; i<playlistTracks.length && check; i++) {
                if (t.id === playlistTracks[i].id) {
                    check = false;
                }
            }

            if (check) {
                el = document.createElement("DIV");

                input = document.createElement("INPUT");
                input.setAttribute("type", "checkbox");
                input.setAttribute("name", "tracks");
                input.setAttribute("id", "tta" + t.id);
                input.setAttribute("value", t.id);
                el.appendChild(input);

                label = document.createElement("LABEL");
                label.setAttribute("for", "tta" + t.id);
                label.innerText = t.title + " - " + t.album.title + " - " + t.album.genre + " - "
                    + t.album.artist.artistName;
                label.className = "lalabel";
                el.appendChild(label);

                form.appendChild(el)
            }
        }

        if (input !== undefined) {
            if (document.getElementById("addTracksToPlaylist") === null) {
                input = document.createElement("input");
                input.setAttribute("type", "submit");
                input.setAttribute("id", "addTracksToPlaylist");
                input.setAttribute("value", "Submit");
                input.className = "center";
                form.parentNode.appendChild(input);
            }
            form.parentElement.setAttribute("action", "ShowPlaylist?playlist=" + playlist);

            document.getElementById("addTracksToPlaylist").addEventListener('click',
                (e) => {
                    e.preventDefault();
                    let tracks = document.getElementsByName("tracks");

                    if (tracks.length > 0) {
                        makeCall("POST", form.parentElement.getAttribute("action"),
                            form.parentNode, (x) => {
                                if (x.readyState === XMLHttpRequest.DONE) {
                                    let message = x.responseText;
                                    if (x.status === 200) {
                                        parseJSON(message);
                                        printButtons();
                                        printGroup();
                                        printTracksToAdd();
                                        //show("HomePage", false);
                                        //show("PlaylistPage", true);
                                    }
                                    else {
                                        warn("PlaylistPage", x.status, x.responseText);
                                    }
                                }
                            }
                        );
                    } else {
                        alert("Check at least one track");
                    }
                });
        } else {
            form.innerText = "This playlist already contains all your tracks";
        }
    }
}
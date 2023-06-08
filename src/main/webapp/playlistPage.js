(() => {
    document.getElementById("ply").addEventListener('click',
        (e) => {
            e.preventDefault();
            makeCall("GET", "Showaplaylist?playlist="+/*prende il numero della playlist dall'html*/
                +"&group=0", null, (x) => {
                    switch (x.readyState) {
                        case XMLHttpRequest.UNSENT:
                            window.reportError("Couldn't send the request, try later");
                            break;
                        case XMLHttpRequest.LOADING:
                            document.getElementById("tab").textContent = "Playlist loading, please wait...";
                            break;
                        case XMLHttpRequest.DONE:
                            let resp = x.responseText;
                            if (x.status === 200) {
                                //lettura JSON delle tracce della playlist
                                //lettura JSON delle tracce che si possono aggiungere
                                PrintButtons();
                                printGroup();
                                printTracksToAdd();
                            }
                            else {
                                //errorpage
                            }
                    }
                }
            );
        });

    document.getElementById("prevButton").addEventListener('click',
        (e) => {
            e.preventDefault();
            PrintButtons();
            printGroup();
        });

    document.getElementById("nextButton").addEventListener('click',
        (e) => {
            e.preventDefault();
            PrintButtons();
            printGroup();
        });

    document.getElementById("back").addEventListener('click',
        (e) => {
        //necessario?
            e.preventDefault();
            PrintButtons();
            printGroup();
            printTracksToAdd();
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

function PrintButtons() {     //shows/hides prev/next button in the playlist page
    let prevB = "prevButton";
    let nextB = "nextButton";
    let group = jQuery.url.param("group");

    if(group > 0) {
        show(prevB, true);
    }
    else {
        show(prevB, false);
    }

    if(5*group < tracce.daJSON.size) {
        show(nextB, true);
    }
    else {
        show(nextB, false);
    }
}

function printGroup() {     //prints a group of 1~5 tracks in the playlist page
    let tab = document.getElementById("tab");
    let table = document.createElement("TABLE");
    let row = table.insertRow(0);
    let data;
    let group = 5*jQuery.url.param("group");
    let anchor;
    let image;

    for (let i=group; i<group+5 && i<playlistTracks.length; i++) {
        data = row.insertCell(i-group);
        data.className = "shine";

        anchor = document.createElement("A");
        anchor.setAttribute("href", "/StartPlayer?track="+playlistTracks.elements[i].id);
        anchor.innerText = tracce.elements[i].title;
        data.appendChild(anchor);

        image = document.createElement("IMG");
        image.setAttribute("src", playlistTracks.elements[i].image);
        data.appendChild(image);
    }

    table.appendChild(row);
    tab.appendChild(table);
}

function printTracksToAdd() {   //prints the tracks a user can add to a playlist in the playlist page
    let element = document.getElementById("frm");
    let form = document.createElement("FORM");
    let input;
    let label;
    let t;

    for (let i=0; i<userTracks.length; i++) {
        t = userTracks[i];

        if (!tracks.includes(t)) {
            input = document.createElement("INPUT");
            input.setAttribute("type", "checkbox");
            input.setAttribute("name", "tracks");
            input.id = t.id;
            //input.setAttribute("id", t.id);
            form.appendChild(input);

            label = document.createElement("LABEL");
            label.setAttribute("for", t.id);
            label.innerText = t.title + " - " + t.album.title + " - " + t.album.genre +
                +" - " + t.album.artist.artistName;
            form.appendChild(label);
        }
    }

    if (input !== null) {
        element.innerText = "";
        input = document.createElement("input");
        input.setAttribute("type", "submit");
        //input.setAttribute("id", "addTracksToPlaylist");
        input.setAttribute("value", "Submit");
        input.id = "addTracksToPlaylist";
        input.className = "center";
        form.appendChild(input);
        element.appendChild(form);
    }
}
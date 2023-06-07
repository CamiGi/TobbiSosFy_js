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
                                checkGroup();
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
            checkGroup();
            printGroup();
        });

    document.getElementById("nextButton").addEventListener('click',
        (e) => {
            e.preventDefault();
            checkGroup();
            printGroup();
        });

    document.getElementById("back").addEventListener('click',
        (e) => {
        //necessario?
            e.preventDefault();
            checkGroup();
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

function checkGroup() {     //shows/hides prev/next button in the playlist page

}

function printGroup() {     //prints a group of 1~5 tracks in the playlist page
    
}

function printTracksToAdd() {   //prints the tracks a user can add to a playlist in the playlist page
    
}
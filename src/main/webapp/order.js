


function go(pid) {
    const list = document.getElementById("sortable-list");
    let form = document.getElementById("ffoorrmm");
    form.setAttribute("action", "UpdateOrder?pID="+pid);
    let item;
    let div;
    let img;
    let span;
    let submit;


    submit = document.createElement("INPUT");
    document.getElementById("updatePlaylist").style.visibility='hidden';

    if (playlistTracks.length == 0) {
        div = document.createElement("DIV");
        div.innerText = "Non ci sono canzoni in questa playlist";
    } else {

        submit.style.zIndex=3;

        list.replaceChildren();

        for (let i = 0; i < playlistTracks.length; i++) {

            div = document.createElement("DIV");
            item = document.createElement("LI");
            img = document.createElement("IMG");
            span = document.createElement("SPAN");


            item.setAttribute("class", "item");
            item.setAttribute("draggable", "true");
            item.setAttribute("name", "sng");
            item.setAttribute("value",playlistTracks[i].id);
            div.setAttribute("class", "details");
            span.innerText = playlistTracks[i].title + " - " + playlistTracks[i].album.title + " - " + playlistTracks[i].album.genre + " - " + playlistTracks[i].album.artist.artistName;
            img.setAttribute("src", playlistTracks[i].album.image);



            div.appendChild(img);
            div.appendChild(span);
            item.appendChild(div);
            list.appendChild(item);
        }
    }

    const items = document.querySelectorAll(".item");
    const sortableList = document.getElementById("sortable-list");


    items.forEach(item => {
        item.addEventListener("dragstart", () => {
            //Adding dragging class to item after a delay
            setTimeout(() => item.classList.add("dragging"), 0);
            document.getElementById("updatePlaylist").style.visibility='visible';
        });
        //Removing dragging cass from item on dragend event
        item.addEventListener("dragend", () => item.classList.remove("dragging"));
    });

    const initSortableList = (e) => {
        e.preventDefault();
        const draggingItem = sortableList.querySelector(".dragging");

        //Getting all items except currently dragging and making array of them
        const siblings = [...sortableList.querySelectorAll(".item:not(.dragging)")];

        //Finding the sibling after which the dragging item should be placed
        let nextSibling = siblings.find(sibling => {
            return e.clientY <= (sibling.offsetTop + 100) + (sibling.offsetHeight);
        });

        sortableList.insertBefore(draggingItem, nextSibling);
    }

    sortableList.addEventListener("dragover", initSortableList);
    sortableList.addEventListener("dragenter", e => e.preventDefault());

    let gigi;

    (function() {
        document.getElementById("ffoorrmm").addEventListener('click', (e) => {
            e.preventDefault();
            let form = document.getElementById("ffoorrmm");
            console.log(form.elements);
            let p_songs = document.getElementsByName("sng");
            console.log(p_songs);
            let ss = [];
            for(let i = 0; i < p_songs.length; i++){
                ss.push(p_songs[i].value);
            }

            for(let i = 0; i < ss.length; i++) {
                gigi = document.createElement("INPUT");
                gigi.setAttribute("visibility", "hidden");
                gigi.setAttribute("type", "checkbox");
                gigi.setAttribute("name", "gigi");
                gigi.setAttribute("checked", "checked");
                gigi.setAttribute("value", ss[i]);
                console.log(gigi);
                form.appendChild(gigi);
            }


            makeCall("POST", form.getAttribute("action"), form,
                function(x) {
                    if (x.readyState === XMLHttpRequest.DONE) {
                        let message = x.responseText;
                        switch (x.status) {
                            case 200:
                                location.reload();
                                break;
                            default:
                                warn(x.status, x.responseText);
                                break;
                        }
                    }
                }
            );

        });

    })();
}
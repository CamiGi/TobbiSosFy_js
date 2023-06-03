(() => {
    document.getElementById("ply").addEventListener('click',
        (e) => {
            e.preventDefault();
            checkGroup();
            printGroup();
            printTracksToAdd();
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
})();

function checkGroup() {     //shows/hides prev/next button in the playlist page

}

function printGroup() {     //prints a group of 1~5 tracks in the playlist page
    
}

function printTracksToAdd() {   //prints the tracks a user can add to a playlist in the playlist page
    
}
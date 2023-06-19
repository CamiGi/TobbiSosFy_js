package it.polimi.tiw.tobbisosfy_js.DAOs;

import it.polimi.tiw.tobbisosfy_js.beans.Playlist;
import it.polimi.tiw.tobbisosfy_js.beans.Track;
import it.polimi.tiw.tobbisosfy_js.beans.User;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;

public class PlaylistDAO {

    TrackDAO td;
    private final Connection con;
    private PreparedStatement ps;
    private ResultSet result;


    public PlaylistDAO(Connection con, String trackPath, String imgPath){
        this.con = con;
        td = new TrackDAO(con, trackPath, imgPath);
    }

    /**
     * @param playlist
     * @param tracks
     * @throws SQLException Vuol dire che già esiste nel DB
     * @throws Exception
     */
    public void addPlaylist(Playlist playlist, ArrayList<Track> tracks) throws SQLException, Exception{

        String queryplst = "SELECT * FROM playlist WHERE title=? AND userID=?";

        ps = con.prepareStatement(queryplst);
        ps.setString(1,playlist.getTitle());
        ps.setString(2,playlist.getUser());
        result = ps.executeQuery();

        result.next();

        int code;
        if(!result.isBeforeFirst()){  //se non ho già la playlist
            String queryNewPlaylist = "INSERT INTO playlist VALUES (?, ?, ?, ?)";
            ps = con.prepareStatement(queryNewPlaylist);
            ps.setString(1, null);
            ps.setString(2,playlist.getTitle());
            ps.setDate(3,playlist.getDate());
            ps.setString(4,playlist.getUser());
            code = ps.executeUpdate();
        } else {
            throw new Exception("ATTENZIONE qualcosa non è andato bene: 500");
        }

        if (!(code == 1)){
            con.rollback();
            throw new Exception("ATTENZIONE qualcosa è andato storto: 501");
        }

        String queryPlID = "SELECT ID FROM playlist WHERE title=? AND userID=?";
        ps = con.prepareStatement(queryPlID);
        ps.setString(1,playlist.getTitle());
        ps.setString(2, playlist.getUser());
        result = ps.executeQuery();
        result.next();
        int h = result.getInt("ID");

        String querycnts = "SELECT * FROM contains WHERE playlistID=?";

        ps = con.prepareStatement(querycnts);
        ps.setInt(1,h);
        result = ps.executeQuery();
        result.next();

        if(!result.isBeforeFirst()){  //se non ho già la tupla

            for (Track t : tracks){
                String queryNewContains = "INSERT INTO contains VALUES(?, ?)";
                ps = con.prepareStatement(queryNewContains);
                //ps.setString(1,null);
                ps.setInt(1,h);
                try {
                    ps.setInt(2, t.getId());
                } catch (SQLException e){
                    System.out.println("ATTENZIONE qualcosa non funziona: 502");
                }
                code = ps.executeUpdate();
            }
        } else {
            throw new Exception("ATTENZIONE qualcosa è andato storto: 503");
        }
        if (!(code == 1)){
            con.rollback();
            throw new Exception("ATTENZIONE qualcosa è andato storto: 504");
        }
    }

    /**
     *
     * @param user utente che sta interagendo
     * @return un arreylist di tutte le playlist dell'utente
     * @throws SQLException
     */
    public ArrayList<Playlist> getPlaylists(User user) throws  SQLException{
        ArrayList<Playlist> r = new ArrayList<>();
        Playlist pl;

        String query = "SELECT * FROM playlist WHERE userID=?";
        ps = con.prepareStatement(query);
        ps.setString(1,user.getUsername());
        result = ps.executeQuery();

        if(result.isBeforeFirst()){
            result.next();

            while (!result.isAfterLast()){
                pl= new Playlist(result.getString("title"), (java.sql.Date) result.getObject("creationDate"), user);
                pl.setId(result.getInt("ID"));
                r.add(pl);
                result.next();
            }
        } else {
            return new ArrayList<>();
        }
        return r;
    }

    public boolean isTrackContained(Track track, Playlist playlist) throws SQLException{
        String query = "SELECT * FROM contains WHERE playlistID=? AND trackID=?";
        ps = con.prepareStatement(query);
        ps.setInt(1, playlist.getId());
        ps.setInt(2, track.getId());
        result = ps.executeQuery();

        result.next();

        if(result.isBeforeFirst()){
            return true;
        } else if (!result.isBeforeFirst()) {
            return false;
        }
        return false;
    }

    /**
     * Tu mi dai la playlist e io ti restituisco una mappa (ID, Track), così quando scegli la canzone può partire automaticamente il player
     * @param playlist
     * @return
     * @throws SQLException
     */
    public ArrayList<Track> getTracksFromPlaylist(Playlist playlist) throws SQLException, Exception{
        ArrayList<Track> rs = new ArrayList<>();
        ResultSet resultTrack;
        int tid;


        String queryTracks =
                "SELECT tr.ID, year " +
                "FROM playlist as pl INNER JOIN contains as ct ON ct.playlistID=pl.id " +
                        "INNER JOIN track as tr on ct.trackID=tr.ID " +
                        "INNER JOIN album as al on tr.albumID=al.ID " +
                "WHERE pl.ID=? ORDER BY year DESC";  //creo query che seleziona le canzoni (tentativo di JOIN)

        ps = con.prepareStatement(queryTracks);  //settaggio altro statement
        ps.setInt(1,result.getInt("ID"));
        resultTrack = ps.executeQuery();  //mando la query definitiva che mi da tutte le canzoni

        if (resultTrack.isBeforeFirst()) {
            resultTrack.next();
            while (!resultTrack.isAfterLast()) {
                tid = resultTrack.getInt("tr.ID");
                //rs.add(td.getTrack(tid));  //uso il metodo privato che dato un id di Track restituisce l'oggetto Track
                rs.add(td.getTrack(tid, playlist.getUser()));
                resultTrack.next();
            }
        } else {
            return new ArrayList<>();
        }

        return  rs;
    }

    /**
     * Ritorna l'ID della playlist
     * @param playlist
     * @return -1 se sbagliato, un numero maggiore di zero se giusto (che sarebbe l'id)
     * @throws SQLException
     */
    public int getIdOfPlaylist(Playlist playlist) throws SQLException{
        String queryIdP = "SELECT ID FROM playlist WHERE title=? AND creationDate=? AND userID=?";
        int id = -1;

        ps = con.prepareStatement(queryIdP);
        ps.setString(1,playlist.getTitle());
        ps.setDate(2,playlist.getDate());
        ps.setString(3,playlist.getUser());

        result = ps.executeQuery();
        if (result.isBeforeFirst()){
            result.next();
            id = result.getInt("ID");
        }

        return id;
    }

    /**
     * Inserisce una canzone nella playlist
     * @param playlist
     * @throws SQLException
     * @throws Exception
     */
    public void addSongsToPlaylist(Playlist playlist, ArrayList<Integer> tracks) throws Exception{
        int code;
        int idp;
        con.setAutoCommit(false);

        idp = this.getIdOfPlaylist(playlist);

        String query1 = "SELECT * FROM contains WHERE playlistID=? AND trackID=?";
        String query2 = "INSERT INTO contains VALUES(?, ?)";

        try {
            for (Integer i : tracks) {
                ps = con.prepareStatement(query1);
                ps.setInt(1, idp);
                ps.setInt(2, i);
                result = ps.executeQuery();
                result.next();

                if (!result.isBeforeFirst()) {
                    ps = con.prepareStatement(query2);
                    ps.setInt(1, idp);
                    ps.setInt(2, i);
                    code = ps.executeUpdate();
                } else {
                    throw new Exception("ATTENZIONE la canzone è già nella playlist: " + playlist.getTitle());
                }
                if (code != 1) {
                    con.rollback();
                    throw new Exception("ATTENZIONE qualcosa è andato storto: 505");
                }
            }
        } catch (SQLException e) {
            con.rollback();
            throw new Exception("C'è una canzone che non va bene: 506");
        }

        con.setAutoCommit(true);
    }

    public Playlist getPlaylistFromId(int id, User user) throws SQLException, Exception {

        String query = "SELECT * FROM playlist WHERE ID=? AND userID=?";
        Playlist plst;

        ps = con.prepareStatement(query);
        ps.setInt(1, id);
        ps.setString(2, user.getUsername());

        result = ps.executeQuery();
        result.next();

        if (user.getUsername().equals(result.getString("userID"))) {
            plst = new Playlist(result.getString("title"), result.getDate("creationDate"), user);
        } else {
            throw new Exception("ATTENZIONE la playlist selezionata non appartiene all'utente: 700");
        }
        plst.setId(id);

        return plst;
    }

}

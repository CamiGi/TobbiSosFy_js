package it.polimi.tiw.tobbisosfy_js.controllers;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import it.polimi.tiw.tobbisosfy_js.DAOs.PlaylistDAO;
import it.polimi.tiw.tobbisosfy_js.DAOs.TrackDAO;
import it.polimi.tiw.tobbisosfy_js.beans.*;

import javax.servlet.ServletException;
import javax.servlet.UnavailableException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.Part;
import java.io.*;
import java.nio.charset.StandardCharsets;
import java.nio.file.FileAlreadyExistsException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.ArrayList;

@MultipartConfig
@WebServlet("/Home")
public class TrackLet extends HttpServlet { //SERVLET DA SPECIFICARE E FARNE UN ALTRA SOLO PER L?ALTRA COSA playlist - track

    @Serial
    private static final long serialVersionUID = 1L;
    private Connection connection = null;
    private User u;
    private String audioFP = "";
    private String imgFP = "";

    public TrackLet() {
        super();
    }

    @Override
    public void init() throws ServletException {
        try {
            connection = DBServletInitializer.init(getServletContext());
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
            throw new UnavailableException("Can't load database driver");
        } catch (SQLException e) {
            e.printStackTrace();
            throw new UnavailableException("Couldn't get db connection");
        } catch (Exception e) {
            e.printStackTrace();
        }

        imgFP = getServletContext().getInitParameter("imgpath");
        audioFP = getServletContext().getInitParameter("trackpath");
    }

    private void setU(User user){
        this.u = user;
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        PlaylistDAO playlistDAO = new PlaylistDAO(connection);
        TrackDAO trackDAO = new TrackDAO(connection);
        this.setU((User) req.getSession().getAttribute("user"));  //setto lo user che mi serve per tutta la classe
        ArrayList<Playlist> playlists;
        ArrayList<Track> songs;

        String jsonPTracks;
        String jsonPPlaylists;

        Gson gson;
        PrintWriter out = resp.getWriter();

        try {
            playlists = playlistDAO.getPlaylists(u);
        } catch (SQLException e) {

            resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            out.println( "Error occurred while loading playlists");
            return;
        }

        try {
            songs = trackDAO.getTracksFromUser(u);
        } catch (SQLException e) {
            e.printStackTrace();
            resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            out.println( "Error occurred while loading tracks of the user (SQL exception)");
            return;
        } catch (Exception e) {
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            out.println("Error occurred while loading tracks of the user");
            return;
        }


        gson = new GsonBuilder().create();
        jsonPTracks = gson.toJson(songs);
        jsonPPlaylists = gson.toJson(playlists);


        resp.setStatus(HttpServletResponse.SC_OK);
        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");
        String st1="{\"Playlists\":";
        String st2="{\"Tracks\":";
        out.println("{\"Answer\":["+st1+jsonPPlaylists+"},"+st2+jsonPTracks+"},"+"{\"Us_name\":"+"\""+u.getUsername()+"\", \"Us_psw\":"+"\""+u.getPassword()+"\"}"+"]}");
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {

        TrackDAO td = new TrackDAO(connection);
        String ctxPath = req.getContextPath();
        PrintWriter out = resp.getWriter();

        Part trackTitle;
        Part albumDate;
        Part albumTitle;
        Part albumGenre;
        Part artistName;
        Part taudio;
        Part img;

        try {
            trackTitle = req.getPart("ttitle");
            albumDate = req.getPart("dalbum");
            albumTitle = req.getPart("talbum");
            albumGenre = req.getPart("g");
            artistName = req.getPart("aname");
            taudio = req.getPart("audio");
            img = req.getPart("img");
        } catch (Exception e) {
            e.printStackTrace();
            resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            out.println("Error occurred while reading the form: Add a new track");
            return;
        }

        if(!(albumTitle == null || albumTitle.getSize() <= 0 ||
                trackTitle == null || trackTitle.getSize() <= 0 ||
                albumDate == null || albumDate.getSize() <= 0 ||
                albumGenre == null || albumGenre.getSize() <= 0 ||
                artistName == null || artistName.getSize() <= 0 ||
                img == null || img.getSize() <= 0 ||
                taudio == null || taudio.getSize() <= 0)) {
            String aTitle = new String(albumTitle.getInputStream().readAllBytes(), StandardCharsets.UTF_8);
            String tTitle = new String(trackTitle.getInputStream().readAllBytes(), StandardCharsets.UTF_8);
            String aName = new String(artistName.getInputStream().readAllBytes(), StandardCharsets.UTF_8);
            String adate = new String(albumDate.getInputStream().readAllBytes(), StandardCharsets.UTF_8);
            int aDate = Integer.parseInt(adate);
            String agenre = new String(albumGenre.getInputStream().readAllBytes(), StandardCharsets.UTF_8);
            Genre aGenre = Genre.valueOf(agenre.toUpperCase());

            // We then check the parameter is valid (in this case right format)
            String contentTypeImg = img.getContentType();

            if (!contentTypeImg.startsWith("image")) {

                resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                out.println( "Image file format not permitted! Retry");

                return;
            }


            // We then check the parameter is valid (in this case right format)
            String contentTypeAudio = taudio.getContentType();

            if (!contentTypeAudio.startsWith("audio")) {
                resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                out.println("Audio file format not permitted! Retry");
                return;
            }

            String imgName = Paths.get(img.getSubmittedFileName()).getFileName().toString().replaceAll("\\s","");

            String audioName = Paths.get(taudio.getSubmittedFileName()).getFileName().toString().replaceAll("\\s","");

            String imgOutputPath = imgFP + imgName; //folderPath inizialized in init

            File imgFile = new File(imgOutputPath);

            String audioOutputPath = audioFP + audioName; //folderPath inizialized in init

            File audioFile = new File(audioOutputPath);

            try (InputStream imgContent = img.getInputStream()) {

                Files.copy(imgContent, imgFile.toPath());
                System.out.println("Image saved correctly!");

            } catch (FileAlreadyExistsException e) {

                System.out.println("Image saved correctly!");

            } catch (Exception e) {

                e.printStackTrace();
                resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                out.println("Error occurred while saving the image! Retry");

                return;
            }


            try (InputStream audioContent = taudio.getInputStream()) {

                Files.copy(audioContent, audioFile.toPath());
                System.out.println("Track audio saved correctly!");

            } catch (FileAlreadyExistsException e) {

                System.out.println("Track audio saved correctly!");

            } catch (Exception e) {

                e.printStackTrace();
                resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                out.println("Error occurred while saving the audio file! Retry");

                return;
            }


            Artist artist = new Artist(aName);
            Album album = new Album(aTitle, aDate, aGenre, artist,  imgName);
            Track track = new Track(tTitle, album, audioName, u.getUsername());

            try {

                td.addTrack(track.getTitle(), track.getAlbum(), track.getMp3Uri(), track.getUser());
                System.out.println("Track aggiunta corettamente al server");

            } catch (SQLException e){

                e.printStackTrace();
                resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                out.println("Error occurred while saving the track in the database (SQL exception)");
                return;

            } catch (Exception e) {

                resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                out.println("Error occurred while saving the track in the database");
                return;
            }
        } else {

            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            out.println("Missing parameters in the 'Add a new track' form");
            return;
        }
        resp.setStatus(HttpServletResponse.SC_OK);
        resp.sendRedirect(ctxPath+"/Home");
    }

    @Override
    public void destroy() {
        if (connection != null) {
            try {
                connection.close();
            } catch (SQLException e){
                e.printStackTrace();
            }
        }
    }
}

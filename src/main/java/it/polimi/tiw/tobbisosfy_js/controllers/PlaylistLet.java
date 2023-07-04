package it.polimi.tiw.tobbisosfy_js.controllers;

import it.polimi.tiw.tobbisosfy_js.DAOs.PlaylistDAO;
import it.polimi.tiw.tobbisosfy_js.DAOs.TrackDAO;
import it.polimi.tiw.tobbisosfy_js.beans.*;

import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.UnavailableException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.Part;
import java.io.IOException;
import java.io.PrintWriter;
import java.io.Serial;
import java.nio.charset.StandardCharsets;
import java.sql.Connection;
import java.sql.Date;
import java.sql.SQLException;
import java.util.ArrayList;

@MultipartConfig
@WebServlet("/PLinsert")
public class PlaylistLet  extends HttpServlet {
    @Serial
    private static final long serialVersionUID = 1L;
    private Connection connection = null;
    private User u;

    public PlaylistLet() {
        super();
    }

    private void setU(User user){
        this.u = user;
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
        }
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        ServletContext ctx = getServletContext();
        String ctxPath = req.getContextPath();
        PrintWriter out = resp.getWriter();

        this.setU((User) req.getSession().getAttribute("user"));
        String trackPath = ctx.getInitParameter("trackpath").substring(25),
                imgPath = ctx.getInitParameter("imgpath").substring(25);

        PlaylistDAO pd = new PlaylistDAO(connection);
        TrackDAO td = new TrackDAO(connection);
        ArrayList<Integer> songs = new ArrayList<>();

        Part ptitle;
        String[] songs_s;


        try{
            ptitle = req.getPart("ptitle");
            songs_s = req.getParameterValues("song");
            for (String s : songs_s) {
                songs.add(Integer.parseInt(s));
            }
        } catch (Exception e) {
            e.printStackTrace();
            resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            out.println("Error occurred while reading the form: Add a new playlist");
            return;
        }

        System.out.println(ptitle);

        if(!(ptitle == null || songs.size() == 0 )  ) {

            String playlistTitle = new String(ptitle.getInputStream().readAllBytes(), StandardCharsets.UTF_8);
            ArrayList<Track> sng = new ArrayList<>();

            for (int song : songs) {
                try {
                    sng.add(td.getTrack(song, u.getUsername()));
                } catch (Exception e) {
                    resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                    out.println( "Something wrong during the add of the playlist in the database");
                    return;
                }
            }

            Date d = new Date(System.currentTimeMillis());
            Playlist playlist = new Playlist(playlistTitle, d, u, true);

            try {
                pd.addPlaylist(playlist, sng);
            } catch (SQLException e){
                e.printStackTrace();
                resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                out.println("Error occurred while saving the playlist in the database (SQL exception)");
                return;
            } catch (Exception e) {
                resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                out.println("Error occurred while saving the playlist in the database");
                return;
            }
        } else {
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            out.println("Missing parameters in the 'Add a new playlist' form");
            return;
        }
        resp.setStatus(HttpServletResponse.SC_OK);
        resp.sendRedirect(ctxPath+"/Home");
    }
}

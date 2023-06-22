package it.polimi.tiw.tobbisosfy_js.controllers;

import it.polimi.tiw.tobbisosfy_js.DAOs.PlaylistDAO;
import it.polimi.tiw.tobbisosfy_js.DAOs.TrackDAO;
import it.polimi.tiw.tobbisosfy_js.DAOs.UserDAO;
import it.polimi.tiw.tobbisosfy_js.beans.*;
import org.apache.commons.lang3.StringEscapeUtils;

import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.UnavailableException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.Date;
import java.sql.SQLException;
import java.util.ArrayList;

@WebServlet("/PLinsert")
public class PlaylistLet  extends HttpServlet {
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
        this.setU((User) req.getSession().getAttribute("user"));
        String trackPath = ctx.getInitParameter("trackpath"),
                imgPath = ctx.getInitParameter("imgpath");

        PlaylistDAO pd = new PlaylistDAO(connection, trackPath, imgPath);
        TrackDAO td = new TrackDAO(connection, trackPath, imgPath);
        System.out.println(u);
        String ctxPath = req.getContextPath();
        String[] songs = req.getParameterValues("song");
        String ptitle = StringEscapeUtils.escapeJava(req.getParameter("ptitle"));
        PrintWriter out = resp.getWriter();
        System.out.println(ptitle);

        if(!(ptitle.isEmpty() || songs == null )  ) {

            String playlistTitle = ptitle;
            System.out.println("Titolo preso: "+playlistTitle+" "+ trackPath + " " + imgPath);
            ArrayList<Track> sng = new ArrayList<>();

            for (String song : songs) {
                try {
                    sng.add(td.getTrack(Integer.parseInt(song), u.getUsername()));
                } catch (Exception e) {
                    resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                    out.println( "Something wrong during the add of the playlist in the database");
                    return;
                }
            }

            System.out.println("Canzoni prese");

            Date d = new Date(System.currentTimeMillis());
            Playlist playlist = new Playlist(playlistTitle, d, u);

            int i = -1;

            try {
                System.out.println("Invio nuova playlist");
                pd.addPlaylist(playlist, sng);
                System.out.println("Inviata nuova playlist");
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
        System.out.println("è andato tutto bene");
        resp.setStatus(HttpServletResponse.SC_OK);
        resp.sendRedirect(ctxPath+"/Home");
    }
}

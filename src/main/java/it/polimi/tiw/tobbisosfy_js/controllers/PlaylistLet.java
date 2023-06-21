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
        UserDAO uDao = new UserDAO(connection);
        String trackPath = ctx.getInitParameter("trackpath"),
                imgPath = ctx.getInitParameter("imgpath");
        //this.setU(new User(StringEscapeUtils.escapeJava(req.getParameter("user")), StringEscapeUtils.escapeJava(req.getParameter("password"))));
        //this.setU((User) req.getSession().getAttribute("user"));
        try {
            User use = uDao.findUser(StringEscapeUtils.escapeJava(req.getParameter("username")));
            this.setU(use);
        } catch (SQLException e){
            e.printStackTrace();
        } catch (Exception e){
            e.printStackTrace();
        }
        //this.setU(new User(StringEscapeUtils.escapeJava(req.getParameter("u_name")), StringEscapeUtils.escapeJava(req.getParameter("u_psw"))));
        PlaylistDAO pd = new PlaylistDAO(connection, trackPath, imgPath);
        TrackDAO td = new TrackDAO(connection, trackPath, imgPath);
        System.out.println(u);
        String ctxPath = req.getContextPath();
        String[] songs = req.getParameterValues("song");
        PrintWriter out = resp.getWriter();

        if(!(req.getParameter("ptitle").isEmpty() || songs == null )  ) {

            String playlistTitle = req.getParameter("ptitle");
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

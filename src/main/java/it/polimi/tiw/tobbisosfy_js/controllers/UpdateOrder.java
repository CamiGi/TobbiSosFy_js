package it.polimi.tiw.tobbisosfy_js.controllers;

import it.polimi.tiw.tobbisosfy_js.DAOs.PlaylistDAO;
import it.polimi.tiw.tobbisosfy_js.DAOs.TrackDAO;
import it.polimi.tiw.tobbisosfy_js.beans.Playlist;
import it.polimi.tiw.tobbisosfy_js.beans.User;

import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.UnavailableException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.ArrayList;
@MultipartConfig
@WebServlet("/UpdateOrder")
public class UpdateOrder extends HttpServlet {

    private Connection connection = null;

    public UpdateOrder(){
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

        ServletContext servletContext = getServletContext();
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {

        ServletContext ctx = getServletContext();
        String trackPath = ctx.getInitParameter("trackpath"),
                imgPath = ctx.getInitParameter("imgpath");
        PlaylistDAO playlistDAO = new PlaylistDAO(connection);
        TrackDAO trackDAO = new TrackDAO(connection);
        String ctxPath = req.getContextPath();

        ArrayList<Integer> trIDs = new ArrayList<>();
        User user = (User) req.getSession().getAttribute("user");

        String[] sngs_s = req.getParameterValues("gigi");
        PrintWriter out = resp.getWriter();


        int pID = Integer.parseInt(req.getParameter("pID"));

        if(sngs_s.length != 0) {

            for (int i = 0; i < sngs_s.length; i++) {
                trIDs.add(Integer.parseInt(sngs_s[i]));
            }

        } else {
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            out.println("Error: there is no songs to order");
        }

        Playlist playlist;


        try {

            playlist = playlistDAO.getPlaylistFromId(pID, user);

        } catch (SQLException e){

            e.printStackTrace();
            resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            out.println("Error occurred while finding the playlist in the database (SQL exception)");
            return;

        } catch (Exception e) {

            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            out.println("Error occurred while finding the playlist in the database");
            return;
        }

        for(int j = 0; j < trIDs.size(); j++){
            try {
                if (!(playlistDAO.isTrackContained(trackDAO.getTrack(trIDs.get(j), user.getUsername()), playlist))) {
                    resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                    out.println("You are modifying the wrong playlist. Retry");
                    return;
                }
            } catch (Exception e){
                resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                out.println("An error occurred during the update of the playlist. Retry (SQLException)");
                return;
            }
        }

        try {
            playlistDAO.setDefFalse(playlist);
        } catch (SQLException e){
            e.printStackTrace();
            resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            out.println("Error occurred while finding the playlist in the database (SQL exception)");
            return;
        } catch (Exception e) {
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            out.println("Error occurred while finding the playlist in the database");
            return;
        }

        try {
            playlistDAO.resetContains(trIDs, playlist.getId());
        } catch (SQLException e){
            e.printStackTrace();
            resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            out.println("Error occurred while finding the update of contains in the database (SQL exception)");
            return;
        } catch (Exception e) {
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            out.println("Error occurred while finding the update of contains in the database");
            return;
        }

        resp.setStatus(HttpServletResponse.SC_OK);
        resp.sendRedirect(ctxPath+"/ShowPlaylist?playlist="+playlist.getId());

    }
}

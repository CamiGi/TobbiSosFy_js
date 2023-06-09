package it.polimi.tiw.tobbisosfy_js.controllers;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import it.polimi.tiw.tobbisosfy_js.DAOs.PlaylistDAO;
import it.polimi.tiw.tobbisosfy_js.beans.Playlist;
import it.polimi.tiw.tobbisosfy_js.beans.Track;
import it.polimi.tiw.tobbisosfy_js.beans.User;

import javax.servlet.ServletException;
import javax.servlet.UnavailableException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.io.Serial;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.ArrayList;

@WebServlet("/ShowPlaylist")
@MultipartConfig
public class ShowPlaylist extends HttpServlet {
    @Serial
    private static final long serialVersionUID = 1L;
    private Connection connection = null;

    public ShowPlaylist() {
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
        }
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        int plID;
        User user = (User) req.getSession().getAttribute("user");
        Playlist playlist;
        ArrayList<Track> tracks;
        PlaylistDAO plFinder = new PlaylistDAO(connection);
        Gson gson;
        String jsonPTracks;
        PrintWriter out = resp.getWriter();

        try {
            plID = Integer.parseInt(req.getParameter("playlist"));
            playlist = plFinder.getPlaylistFromId(plID, user);
            tracks = plFinder.getTracksFromPlaylist(playlist);
        } catch (NumberFormatException e) {
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            out.println("Invalid playlist ID");
            return;
        } catch (SQLException e) {
            resp.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            out.println("This playlist does not exist or you haven't got the authorization to see it");
            return;
        } catch (Exception e) {
            resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            out.println(e.getMessage());
            return;
        }
        gson = new GsonBuilder().create();
        jsonPTracks = gson.toJson(tracks);

        resp.setStatus(HttpServletResponse.SC_OK);
        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");
        out.println(jsonPTracks);
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String[] tracks = req.getParameterValues("tracks");
        String ctxPath = req.getContextPath();
        System.out.println(tracks);
        ArrayList<Integer> trIDs;
        PlaylistDAO plfinder = new PlaylistDAO(connection);
        Playlist playlist;
        PrintWriter out = resp.getWriter();

        try {
            playlist = plfinder.getPlaylistFromId(Integer.parseInt(req.getParameter("playlist")),
                    (User) req.getSession().getAttribute("user"));
        } catch (NumberFormatException e) {
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            out.println("Invalid playlist ID");
            return;
        } catch (SQLException e) {
            resp.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            out.println("Playlist cannot be found or you haven't got the rights to see it");
            return;
        } catch (Exception e) {
            resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            out.println(e.getMessage());
            return;
        }

        trIDs = new ArrayList<>();

        for (String track : tracks) {
            trIDs.add(Integer.parseInt(track));
        }

        System.out.println(trIDs);

        if (trIDs.size() == 0) {
            resp.setStatus(HttpServletResponse.SC_LENGTH_REQUIRED);
            out.println("Add at least one song to the playlist");
            return;
        }

        try {
            plfinder.addSongsToPlaylist(playlist, trIDs);
        } catch (NumberFormatException e) {
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            out.println("The song you're trying to add does not exist or you haven't the authorization to see it");
            return;
        } catch (Exception e) {
            resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            out.println(e.getMessage());
            return;
        }

        resp.setStatus(HttpServletResponse.SC_OK);
        resp.sendRedirect(ctxPath+"/ShowPlaylist?playlist="+playlist.getId());
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

package it.polimi.tiw.tobbisosfy_js.controllers;

import it.polimi.tiw.tobbisosfy_js.DAOs.TrackDAO;
import it.polimi.tiw.tobbisosfy_js.beans.Track;
import it.polimi.tiw.tobbisosfy_js.beans.User;

import javax.servlet.ServletException;
import javax.servlet.UnavailableException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.io.Serial;
import java.sql.Connection;
import java.sql.SQLException;

@WebServlet ("/StartPlayer")
public class StartPlayer extends HttpServlet {
    @Serial
    private static final long serialVersionUID = 1L;
    private Connection connection = null;

    public StartPlayer() {
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
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        Track track;
        TrackDAO trFinder = new TrackDAO(connection);
        int trID;
        PrintWriter out = response.getWriter();

        try {
            trID = Integer.parseInt(request.getParameter("track"));
            track = trFinder.getTrack(trID, ((User)request.getSession().getAttribute("user")).getUsername());
        } catch (NumberFormatException e) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            out.println("Invalid track ID");
            return;
        } catch (SQLException e) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            out.println("The track you're searching for doesn't exist or you haven't the authorization to access it");
            return;
        } catch (Exception e){
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            out.println(e.getMessage());
            return;
        }

        response.setStatus(HttpServletResponse.SC_OK);
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

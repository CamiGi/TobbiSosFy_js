package it.polimi.tiw.tobbisosfy_js.controllers;

import it.polimi.tiw.tobbisosfy_js.DAOs.TrackDAO;
import it.polimi.tiw.tobbisosfy_js.beans.Track;
import it.polimi.tiw.tobbisosfy_js.beans.User;

import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.UnavailableException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.sql.Connection;
import java.sql.SQLException;

@WebServlet ("/StartPlayer")
public class StartPlayer extends HttpServlet {
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
        ServletContext servletContext = getServletContext();
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        Track track;
        TrackDAO trFinder = new TrackDAO(connection, getServletContext().getInitParameter("trackpath"),
                getServletContext().getInitParameter("imgpath"));
        String path = request.getContextPath();
        int trID;

        try {
            trID = Integer.parseInt(request.getParameter("track"));
            track = trFinder.getTrack(trID, ((User)request.getSession().getAttribute("user")).getUsername());
        } catch (NumberFormatException e) {
            response.sendRedirect(path+"/ShowError");
            return;
        } catch (SQLException e) {
            response.sendRedirect(path+"/ShowError");
            return;
        } catch (Exception e){
            e.printStackTrace();
            response.sendRedirect(path+"/ShowError");
            return;
        }

        /*ctx.setVariable("track", track);
        ctx.setVariable("playlist", request.getParameter("playlist"));
        ctx.setVariable("group", request.getParameter("group"));
        //o le mandi nella request o provi a beccarle da ctx
        templateEngine.process("/PlayerPage.html", ctx, response.getWriter());*/
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

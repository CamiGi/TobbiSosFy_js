package it.polimi.tiw.tobbisosfy_js.controllers;

import it.polimi.tiw.tobbisosfy_js.DAOs.*;
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

@WebServlet("/CheckLogin")
public class CheckLogin extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private Connection connection = null;

    public CheckLogin() {
        super();
        // TODO Auto-generated constructor stub
    }

    public void init() throws ServletException {
        try {
            connection = DBServletInitializer.init(getServletContext());
        } catch (ClassNotFoundException e) {
            throw new UnavailableException("Can't load database driver");
        } catch (SQLException e) {
            throw new UnavailableException("Couldn't get db connection");
        }
        ServletContext servletContext = getServletContext();
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        // TODO Auto-generated method stub
        response.getWriter().append("Served at: ").append(request.getContextPath());
    }

    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String usrn = request.getParameter("username");
        String pwd = request.getParameter("pwd");
        String path = getServletContext().getContextPath();

        if (usrn == null || usrn.isEmpty() || pwd == null || pwd.isEmpty()) {
            return;
        }

        UserDAO usr = new UserDAO(connection);
        User u;
        try {
            u = usr.login(usrn, pwd);
        } catch (Exception e) {
            return;
        }
        if (u == null) {
            return;
        } else {
            request.getSession().setAttribute("user", u);
        }
        response.sendRedirect(path+"/Home");
        //response.sendRedirect(path+"/ShowPlaylist?playlist=1&group=0");
    }

    public void destroy() {
        try {
            if (connection != null) {
                connection.close();
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
}

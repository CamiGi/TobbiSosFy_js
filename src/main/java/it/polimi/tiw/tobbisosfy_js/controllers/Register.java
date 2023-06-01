package it.polimi.tiw.tobbisosfy_js.controllers;

import it.polimi.tiw.tobbisosfy_js.DAOs.UserDAO;
import org.apache.commons.lang3.StringEscapeUtils;

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

@WebServlet("/Register")
@MultipartConfig
public class Register extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private Connection connection = null;

    public Register() {
        super();
    }
    @Override
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

    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String usrn = StringEscapeUtils.escapeJava(request.getParameter("nickname"));
        String pwd = StringEscapeUtils.escapeJava(request.getParameter("password"));
        PrintWriter out = response.getWriter();
        UserDAO creator = new UserDAO(connection);

        if (usrn == null || usrn.isEmpty() || pwd == null || pwd.isEmpty()) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            out.println("All fields must not be empty");
            return;
        }

        //does all the controls on the password
        if (pwd.length() < 8) {
            response.setStatus(HttpServletResponse.SC_NOT_ACCEPTABLE);
            out.println("Password length must be at least 8 chars");
            return;
        }
        if (pwd.length() > 20) {
            response.setStatus(HttpServletResponse.SC_NOT_ACCEPTABLE);
            out.println("Password length must be at most 20 chars");
            return;
        }
        if (pwd.toLowerCase().equals(pwd)) {
            response.setStatus(HttpServletResponse.SC_NOT_ACCEPTABLE);
            out.println("Password must contain at least one uppercase char");
            return;
        }
        if (pwd.toUpperCase().equals(pwd)) {
            response.setStatus(HttpServletResponse.SC_NOT_ACCEPTABLE);
            out.println("Password must contain at least one lowercase char");
            return;
        }
        if (!pwd.contains("0") &&
            !pwd.contains("1") &&
            !pwd.contains("2") &&
            !pwd.contains("3") &&
            !pwd.contains("4") &&
            !pwd.contains("5") &&
            !pwd.contains("6") &&
            !pwd.contains("7") &&
            !pwd.contains("8") &&
            !pwd.contains("9")) {
            response.setStatus(HttpServletResponse.SC_NOT_ACCEPTABLE);
            out.println("Password must contain at least one number");
            return;
        }
        if (!pwd.contains("-") &&
            !pwd.contains("_") &&
            !pwd.contains("=") &&
            !pwd.contains("+") &&
            !pwd.contains("/") &&
            !pwd.contains("£") &&
            !pwd.contains("&") &&
            !pwd.contains("%") &&
            !pwd.contains("^") &&
            !pwd.contains("@") &&
            !pwd.contains("`") &&
            !pwd.contains("#") &&
            !pwd.contains(".") &&
            !pwd.contains(",") &&
            !pwd.contains("!") &&
            !pwd.contains("?") &&
            !pwd.contains(">") &&
            !pwd.contains("<") &&
            !pwd.contains(":")) {
            response.setStatus(HttpServletResponse.SC_NOT_ACCEPTABLE);
            out.println("Password must contain at least one special char");
            return;
        }
        if (!pwd.equals(request.getParameter("conf"))) {
            response.setStatus(HttpServletResponse.SC_NOT_ACCEPTABLE);
            out.println("Password and confirmation are different");
            return;
        }

        try {
            creator.addUser(usrn, pwd);
        } catch (Exception e) {
            if (e.getMessage().contains("Duplicate entry")) {
                response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                out.println("Username already taken");
            }
            else{
                response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                out.println(e.getMessage());
                return;
            }
        }
        //response.sendRedirect(path + "/UserRegisteredPage.html");
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

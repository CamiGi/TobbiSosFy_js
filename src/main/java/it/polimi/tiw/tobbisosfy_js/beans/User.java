package it.polimi.tiw.tobbisosfy_js.beans;

import java.beans.JavaBean;

@JavaBean
public class User {
    private final String username;
    private final String password;

    public User(String username, String password) {
        this.username = username;
        this.password = password;
    }

    public String getUsername() {
        return username;
    }

    public String getPassword() {
        return password;
    }

    @Override
    public String toString(){
        return "User={username="+this.username+", password="+this.getPassword()+"}";
    }
}

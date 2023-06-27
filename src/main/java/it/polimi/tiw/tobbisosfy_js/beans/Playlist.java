package it.polimi.tiw.tobbisosfy_js.beans;

import java.beans.JavaBean;
import java.sql.Date;

@JavaBean
public class Playlist {
    private int id;
    private final String title;
    private final Date date;
    private final String user;
    private final Boolean def;

    public Playlist(String title, Date date, User user, Boolean def) {
        this.title =title.toLowerCase();
        this.date=date;
        this.user = user.getUsername();
        this.def = def;
    }

    public void setId(int id){
        this.id = id;
    }

    public int getId() {
        return id;
    }

    public String getUser() {
        return user;
    }

    public String getTitle() {
        return title;
    }

    public Date getDate() {
        return date;
    }

    @Override
    public String toString(){
        return "Playlist={title="+this.title+", date="+this.date.toString()+", user="+this.user.toString()+"}";
    }

    public String getDateString(){
        return this.date.toString();
    }

    public Boolean getDef() {
        return def;
    }
}

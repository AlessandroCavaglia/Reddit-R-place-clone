package alecava.redisexercise.model.DTO;

import java.io.Serializable;

public class Config implements Serializable {
    private Integer width;
    private Integer height;
    private Float refresh_time;
    private Float insert_delay;
    private String[] colours;

    public Integer getWidth() {
        return width;
    }

    public void setWidth(Integer width) {
        this.width = width;
    }

    public Integer getHeight() {
        return height;
    }

    public void setHeight(Integer height) {
        this.height = height;
    }

    public Float getRefresh_time() {
        return refresh_time;
    }

    public void setRefresh_time(Float refresh_time) {
        this.refresh_time = refresh_time;
    }

    public Float getInsert_delay() {
        return insert_delay;
    }

    public void setInsert_delay(Float insert_delay) {
        this.insert_delay = insert_delay;
    }

    public String[] getColours() {
        return colours;
    }

    public void setColours(String[] colours) {
        this.colours = colours;
    }
}

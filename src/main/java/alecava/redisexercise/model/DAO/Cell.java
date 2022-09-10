package alecava.redisexercise.model.DAO;

import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;

import java.io.Serializable;

@RedisHash("Cell")
public class Cell implements Serializable {
    private String id;
    private String colour;

    @Override
    public String toString() {
        return "{" +
                "\"id\":\"" + id +
                "\", \"colour\":\"" + colour +
                "\"}";
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getColour() {
        return colour;
    }

    public void setColour(String colour) {
        this.colour = colour;
    }
}

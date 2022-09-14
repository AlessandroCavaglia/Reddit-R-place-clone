package alecava.redisexercise.controller;

import alecava.redisexercise.model.DAO.Cell;
import alecava.redisexercise.model.DAO.CellRepository;
import alecava.redisexercise.model.DTO.Config;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@CrossOrigin
public class mainController {

    @Autowired
    CellRepository cellRepository;

    @Value("${mapwidth}")
    private Integer width;
    @Value("${mapheight}")
    private Integer height;
    @Value("${startRefreshTime}")
    private Float startRefreshTime;
    @Value("${startInsertDelay}")
    private Float startInsertDelay;
    @Value("${colours}")
    private String[] cellColours;

    @RequestMapping(value = "/get", method = RequestMethod.GET)
    String getAllCells(){
        return  cellRepository.findAll().toString();
    }

    @RequestMapping(value = "/set", method = RequestMethod.POST)
    String setCell(@RequestBody Cell cell){
        int cid=0,color=0;
        try{
            cid=Integer.parseInt(cell.getId());
            color=Integer.parseInt(cell.getColour());
        }catch (Exception ex){
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "One of the parameters isn't numeric");
        }
        if(cid<0 || cid>=width*height){
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Invalid cell_id");
        }
        if(color<0 || color>=cellColours.length){
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Invalid color_id");
        }
        cellRepository.save(cell);
        return("OK");
    }

    @RequestMapping(value = "/config", method = RequestMethod.GET)
    Config getConfigs(){
        Config configs=new Config();
        configs.setHeight(height);
        configs.setWidth(width);
        configs.setRefresh_time(startRefreshTime);
        configs.setInsert_delay(startInsertDelay);
        configs.setColours(cellColours);
        return configs;
    }
}

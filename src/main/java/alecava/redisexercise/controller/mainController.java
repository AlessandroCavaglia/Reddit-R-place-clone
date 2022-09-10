package alecava.redisexercise.controller;

import alecava.redisexercise.model.DAO.Cell;
import alecava.redisexercise.model.DAO.CellRepository;
import alecava.redisexercise.model.DTO.Config;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;

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
        System.out.println(cell.getId());
        System.out.println(cell.getColour());
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

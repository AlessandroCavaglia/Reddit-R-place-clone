package alecava.redisexercise.controller;

import alecava.redisexercise.model.Cell;
import alecava.redisexercise.model.CellRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin
public class cellController {

    @Autowired
    CellRepository cellRepository;

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

}

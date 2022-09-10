package alecava.redisexercise.model.DAO;

import alecava.redisexercise.model.DAO.Cell;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CellRepository extends CrudRepository<Cell, String> {}

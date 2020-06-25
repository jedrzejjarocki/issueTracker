package issuetracker.repositories;

import issuetracker.models.Sprint;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SprintRepository extends JpaRepository<Sprint, Integer> {
}

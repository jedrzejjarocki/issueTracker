package issuetracker.repositories;

import issuetracker.models.issueContainer.Sprint;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SprintRepository extends JpaRepository<Sprint, Integer> {
}

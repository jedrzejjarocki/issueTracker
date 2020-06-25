package issuetracker.repositories;

import issuetracker.models.common.IssueContainer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IssueContainerRepository extends JpaRepository<IssueContainer, Integer> {
}

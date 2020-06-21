package issuetracker.repositories;

import issuetracker.models.issueContainer.IssueContainer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IssueContainerRepository extends JpaRepository<IssueContainer, Integer> {
}

package issuetracker.repositories;

import issuetracker.models.issue.Issue;
import issuetracker.models.issueContainer.IssueContainer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.history.RevisionRepository;

public interface IssueRepository extends JpaRepository<Issue, Integer>, RevisionRepository<Issue, Integer, Integer> {
    @Modifying
    @Query("UPDATE Issue i SET i.list = :to WHERE i.list = :from")
    void replaceList(IssueContainer from, IssueContainer to);
}

package issuetracker.repositories;

import issuetracker.models.TeamMember;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TeamMemberRepository extends JpaRepository<TeamMember, Integer> {
}

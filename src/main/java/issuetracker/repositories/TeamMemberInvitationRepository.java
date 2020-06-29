package issuetracker.repositories;

import issuetracker.models.TeamMemberInvitationToken;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TeamMemberInvitationRepository extends JpaRepository<TeamMemberInvitationToken, Integer> {
    Optional<TeamMemberInvitationToken> findByToken(String token);
}

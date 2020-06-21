package issuetracker.repositories;

import issuetracker.models.PasswordResetToken;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PasswordTokenRepository extends JpaRepository<PasswordResetToken, Integer> {
    Optional<PasswordResetToken> getByToken(String token);
}

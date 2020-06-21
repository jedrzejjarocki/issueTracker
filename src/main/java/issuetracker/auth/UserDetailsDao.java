package issuetracker.auth;

import org.springframework.security.core.userdetails.UserDetails;

import java.util.Optional;

public interface UserDetailsDao {
    Optional<UserDetails> selectByUsername(String username);
}

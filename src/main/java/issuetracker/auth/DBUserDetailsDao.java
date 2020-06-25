package issuetracker.auth;

import issuetracker.models.User;
import issuetracker.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Repository;

import java.util.HashSet;
import java.util.Optional;

@Repository("db")
@RequiredArgsConstructor
public class DBUserDetailsDao implements UserDetailsDao {
    private final UserService userService;

    //@Todo
    @Override
    public Optional<UserDetails> selectByUsername(String username) {
        User user = userService.getByUsername(username);
        UserDetails userDetails = new UserDetailsImpl(
                user.getUsername(),
                user.getPassword(),
                user.getEmail(),
                true,
                true,
                true,
                true,
                new HashSet<>());
        return Optional.of(userDetails);
    }
}

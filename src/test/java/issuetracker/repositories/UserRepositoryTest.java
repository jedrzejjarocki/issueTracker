package issuetracker.repositories;

import issuetracker.models.User;
import org.junit.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.MethodSource;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.test.context.junit4.SpringRunner;

import javax.validation.ConstraintViolationException;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

@RunWith(SpringRunner.class)
@DataJpaTest
public class UserRepositoryTest {
    @Autowired
    UserRepository repository;

    private static User getUser(String username, String password) {
        User user = new User();
        user.setUsername(username);
        user.setPassword(password);
        return user;
    }

    private static User getUser(String username, String password, String email) {
        User user = getUser(username, password);
        user.setEmail(email);
        return user;
    }

    private static List<User> invalidUsers() {
        User empty = new User();
        User passwordToShort = getUser("abc", "p");
        User blankUsername = getUser("     ", "12345678");
        User passwordToLong = getUser("username", String.join("", Collections.nCopies(129, "p")));
        User invalidEmail = getUser("user", "password", "email");

        return Arrays.asList(empty, passwordToShort, passwordToLong, blankUsername, invalidEmail);
    }

    @Test
    public void savesValidUserEntity() {
        User user = getUser("username", "password");
        repository.save(user);
        assertEquals(repository.findByUsername(user.getUsername()), Optional.of(user));
    }

    @ParameterizedTest
    @MethodSource("invalidUsers")
    public void throwsWhenUserIsNotValid(User user) {
        assertThrows(ConstraintViolationException.class, () -> repository.save(user));
    }

    @Test
    public void throwsWhenUsernameIsAlreadyInUse() {
        User u = getUser("username", "password");
        User u2 = getUser("username", "password");
        repository.save(u);
        assertThrows(DataIntegrityViolationException.class, () -> repository.save(u2));
    }

    @Test
    public void findsUserByUsername() {
        User user = getUser("user", "password");
        repository.save(user);
        Optional<User> byUsername = repository.findByUsername(user.getUsername());
        assertEquals(byUsername.get(), user);
    }

    @Test
    public void findsUserByEmail() {
        User user = getUser("user", "password");
        repository.save(user);
        Optional<User> byEmail = repository.findByEmail(user.getEmail());
        assertEquals(byEmail.get(), user);
    }
}
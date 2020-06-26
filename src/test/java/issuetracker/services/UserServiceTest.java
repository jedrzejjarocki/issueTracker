package issuetracker.services;

import issuetracker.exceptions.ResourceNotFoundException;
import issuetracker.exceptions.TokenExpiredException;
import issuetracker.exceptions.UsernameExistsException;
import issuetracker.models.PasswordResetToken;
import issuetracker.models.User;
import issuetracker.repositories.PasswordTokenRepository;
import issuetracker.repositories.UserRepository;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

@RunWith(MockitoJUnitRunner.class)
public class UserServiceTest {
    @Mock
    PasswordEncoder passwordEncoder;
    @Mock
    UserRepository userRepository;
    @Mock
    PasswordTokenRepository passwordTokenRepository;

    @InjectMocks
    private UserService service;


    // GET BY USERNAME
    @Test
    public void getByUsernameReturnsUser() {
        User user = new User();
        user.setUsername("username");

        when(userRepository.findByUsername(user.getUsername())).thenReturn(Optional.of(user));

        User byUsername = service.getByUsername(user.getUsername());

        verify(userRepository).findByUsername(user.getUsername());
        assertEquals(byUsername, user);
    }

    @Test
    public void throwsWhenUserByUsernameNotFound() {
        String username = "abc";
        when(userRepository.findByUsername(username)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class,
                () -> { service.getByUsername(username); }
                );
    }

    // GET BY EMAIL
    @Test
    public void getByEmailReturnsUser() {
        User user = new User();
        user.setEmail("abc@abc.pl");

        when(userRepository.findByEmail(user.getEmail())).thenReturn(Optional.of(user));

        User byEmail = service.getByEmail(user.getEmail());

        verify(userRepository).findByEmail(user.getEmail());
        assertEquals(byEmail, user);
    }

    @Test
    public void throwsWhenUserByEmailNotFound() {
        String email = "abc@abc.pl";
        when(userRepository.findByEmail(email)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class,
                () -> { service.getByEmail(email); }
        );
    }


    // CREATE
    @Test
    public void encodesPasswordWhenCreatingUser() {
        User user = new User();
        user.setPassword("password");

        service.create(user);
        verify(passwordEncoder).encode("password");
    }

    @Test
    public void savesUserWhenValid() {
    public void saves_user_when_valid() {
        User user = new User();

        when(userRepository.save(user)).thenReturn(user);

        User created = service.create(user);

        verify(userRepository).save(user);
        assertEquals(user, created);
    }

    @Test
    public void throwsWhenUsernameInUse() {
        User user = new User();
        when(userRepository.save(user)).thenThrow(DataIntegrityViolationException.class);

        assertThrows(UsernameExistsException.class, () -> service.create(user));
    }


    // DELETE
    @Test
    public void callsDeleteById() {
        String username = "user";
        service.delete(username);
        verify(userRepository).deleteByUsername(username);
    }

    @Test
    public void throwsWhenResourceWithGivenIdNonexistent() {
        String username = "user";
        doThrow(EmptyResultDataAccessException.class).when(userRepository).deleteByUsername(username);
        assertThrows(ResourceNotFoundException.class, () -> service.delete(username));
    }

    //CHANGE PASSWORD
    @Test
    public void throwsWhenTokenIsExpired() {
        PasswordResetToken passwordResetToken = new PasswordResetToken();
        passwordResetToken.setExpiryDate(LocalDate.now().minusDays(1));
        passwordResetToken.setToken("token");

        when(passwordTokenRepository.getByToken("token")).thenReturn(Optional.of(passwordResetToken));
        assertThrows(TokenExpiredException.class, () -> service.changePassword("token", "password"));
    }

    @Test
    public void savesUserWithEncodedPasswordAndDeletesTokenEntity() {
        User user = new User();
        user.setId(1);
        user.setUsername("a");
        user.setPassword("12345678");

        ArgumentCaptor<User> argument = ArgumentCaptor.forClass(User.class);

        PasswordResetToken passwordResetToken = new PasswordResetToken();
        passwordResetToken.setExpiryDate(LocalDate.now().plusDays(1));
        passwordResetToken.setToken("token");
        passwordResetToken.setUser(user);

        when(passwordTokenRepository.getByToken("token")).thenReturn(Optional.of(passwordResetToken));
        when(passwordEncoder.encode("changed")).thenReturn("changed-encoded");

        service.changePassword("token", "changed");

        verify(passwordEncoder).encode("changed");

        verify(userRepository).save(argument.capture());
        assertEquals(argument.getValue().getPassword(), "changed-encoded");

        verify(passwordTokenRepository).delete(passwordResetToken);
    }
}
package issuetracker.services;

import issuetracker.exceptions.ResourceNotFoundException;
import issuetracker.exceptions.TokenExpiredException;
import issuetracker.exceptions.UsernameExistsException;
import issuetracker.models.PasswordResetToken;
import issuetracker.models.User;
import issuetracker.repositories.PasswordTokenRepository;
import issuetracker.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {
    private final PasswordEncoder passwordEncoder;
    private final UserRepository repository;
    private final TeamMemberService teamMemberService;
    private final PasswordTokenRepository passwordTokenRepository;
    private final MailSenderService mailSenderService;

    public List<User> getAll() {
        return repository.findAll();
    }

    public User getByUsername(String username) {
        return repository.findByUsername(username).orElseThrow(ResourceNotFoundException::new);
    }

    public User getByEmail(String email) {
        return repository.findByEmail(email).orElseThrow(ResourceNotFoundException::new);
    }


    public User create(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        try {
            return repository.save(user);
        } catch (DataIntegrityViolationException exception) {
            throw new UsernameExistsException();
        }
    }

    public void delete(String username) {
        try {
            repository.deleteByUsername(username);
        } catch (EmptyResultDataAccessException exception) {
            throw new ResourceNotFoundException();
        }
    }

    public void changePassword(String token, String password) {
        PasswordResetToken passwordResetToken = passwordTokenRepository.findByToken(token).orElseThrow(ResourceNotFoundException::new);
        ensureTokenNotExpired(passwordResetToken);

        User user = passwordResetToken.getUser();
        user.setPassword(passwordEncoder.encode(password));

        repository.save(user);
        passwordTokenRepository.delete(passwordResetToken);
    }

    public void createPasswordResetToken(String email) throws IOException {
        PasswordResetToken resetToken = new PasswordResetToken();
        resetToken.setUser(getByEmail(email));
        String token = passwordTokenRepository.save(resetToken).getToken();
        mailSenderService.resetPassword(email, token);
    }

    private void ensureTokenNotExpired(PasswordResetToken token) {
        if(token.getExpiryDate().isBefore(LocalDate.now())) {
            throw new TokenExpiredException();
        }
    }
}

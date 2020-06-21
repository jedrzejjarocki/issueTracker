package issuetracker.services;

import issuetracker.exceptions.ResourceNotFoundException;
import issuetracker.exceptions.TokenExpiredException;
import issuetracker.exceptions.UsernameExistsException;
import issuetracker.models.PasswordResetToken;
import issuetracker.models.user.User;
import issuetracker.repositories.PasswordTokenRepository;
import issuetracker.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class UserService {
    private final PasswordEncoder passwordEncoder;
    private final UserRepository repository;
    private final PasswordTokenRepository passwordTokenRepository;

    public User getByUsername(String username) {
        return repository.findByUsername(username).orElseThrow(ResourceNotFoundException::new);
    }

    public User getByEmail(String email) {
        return repository.findByEmail(email).orElseThrow(ResourceNotFoundException::new);
    }

    public User getById(int id) {
        return repository.findById(id).orElseThrow(ResourceNotFoundException::new);
    }

    public User create(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        try {
            return repository.save(user);
        } catch (Exception exception) {
            throw new UsernameExistsException();
        }
    }

    public void delete(int id) {
        try {
            repository.deleteById(id);
        } catch (EmptyResultDataAccessException exception) {
            throw new ResourceNotFoundException();
        }
    }

    public void changePassword(String token, String password) {
        PasswordResetToken tokenEntity = passwordTokenRepository.getByToken(token).orElseThrow(ResourceNotFoundException::new);
        System.out.println(tokenEntity);
        ensureTokenNotExpired(tokenEntity);

        User user = tokenEntity.getUser();
        user.setPassword(passwordEncoder.encode(password));
        System.out.println(user);

        repository.save(user);
        passwordTokenRepository.delete(tokenEntity);
    }

    private void ensureTokenNotExpired(PasswordResetToken token) {
        if(token.getExpiryDate().isBefore(LocalDate.now())) {
            throw new TokenExpiredException();
        }
    }
}

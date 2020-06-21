package issuetracker.exceptions;

import lombok.Getter;

@Getter
public class UsernameExistsException extends ConflictException {
    String message = "User with a given username already exists, try something different";
}

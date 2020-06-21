package issuetracker.exceptions;

import lombok.Getter;

@Getter
public class UnauthorizedException extends RuntimeException{
    String message = "Authentication required";
}

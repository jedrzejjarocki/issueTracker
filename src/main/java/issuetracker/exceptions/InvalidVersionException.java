package issuetracker.exceptions;

import lombok.Getter;

@Getter
public class InvalidVersionException extends ConflictException {
    private final String message = "Invalid version. Entity was updated or deleted.";
}

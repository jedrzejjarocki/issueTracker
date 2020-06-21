package issuetracker.exceptions;

import lombok.Getter;

@Getter
public class LackOfProjectLeaderNotAllowed extends ConflictException {
    private final String message = "At least one team member with a leader role required";
}

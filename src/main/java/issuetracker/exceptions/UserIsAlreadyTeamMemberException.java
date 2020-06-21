package issuetracker.exceptions;

import lombok.Getter;

@Getter
public class UserIsAlreadyTeamMemberException extends ConflictException {
    private final String message = "User is a team member already";
}

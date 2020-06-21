package issuetracker.dtos.user;

import lombok.Getter;

@Getter
public class ChangePasswordDto {
    String token;
    String password;
}

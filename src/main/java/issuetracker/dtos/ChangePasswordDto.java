package issuetracker.dtos;

import lombok.Getter;

@Getter
public class ChangePasswordDto {
    String token;
    String password;
}

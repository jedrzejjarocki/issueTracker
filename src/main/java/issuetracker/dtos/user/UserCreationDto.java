package issuetracker.dtos.user;

import lombok.Data;

@Data
public class UserCreationDto extends UserDto {
    String password;
    String email;
}

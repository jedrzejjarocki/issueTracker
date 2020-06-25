package issuetracker.dtos;

import lombok.Data;

@Data
public class UserCreationDto extends UserDto {
    String password;
    String email;
}

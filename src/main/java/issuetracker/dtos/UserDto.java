package issuetracker.dtos;

import issuetracker.dtos.common.Dto;
import issuetracker.models.User;
import lombok.Data;

import java.util.Set;

@Data
public class UserDto implements Dto<User> {
    private int id;
    private Set<ProjectDto> projects;
    private String username;
}

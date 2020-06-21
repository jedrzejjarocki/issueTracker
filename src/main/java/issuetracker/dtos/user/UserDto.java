package issuetracker.dtos.user;

import issuetracker.dtos.common.Dto;
import issuetracker.dtos.project.ProjectDto;
import issuetracker.models.user.User;
import lombok.Data;

import java.util.Set;

@Data
public class UserDto implements Dto<User> {
    private int id;
    private Set<ProjectDto> projects;
    private String username;
}

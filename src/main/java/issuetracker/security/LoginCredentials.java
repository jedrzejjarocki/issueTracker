package issuetracker.security;

import lombok.Getter;

@Getter
class LoginCredentials {
    private String username;
    private String password;
}
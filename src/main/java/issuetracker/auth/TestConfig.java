package issuetracker.auth;

import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Primary;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;

import java.util.Arrays;
import java.util.Collections;

@TestConfiguration
public class TestConfig {

    @Bean
    @Primary
    public UserDetailsService userDetailsService() {
        UserDetailsImpl u1 = new UserDetailsImpl(
                "first",
                "abcabcabc",
                "mail@mail.com",
                true,
                true,
                true,
                true,
                Collections.emptySet()
        );

        UserDetailsImpl u2 = new UserDetailsImpl(
                "second",
                "abcabcabc",
                "mail@mail.com",
                true,
                true,
                true,
                true,
                Collections.emptySet()
        );


        return new InMemoryUserDetailsManager(Arrays.asList(
                u1
        ));
    }
}

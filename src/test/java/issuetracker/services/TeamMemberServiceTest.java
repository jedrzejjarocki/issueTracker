package issuetracker.services;

import issuetracker.models.Issue;
import issuetracker.models.Project;
import issuetracker.models.TeamMember;
import issuetracker.models.User;
import issuetracker.repositories.*;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.junit4.SpringRunner;

import static org.junit.jupiter.api.Assertions.*;

@RunWith(SpringRunner.class)
@DataJpaTest
public class TeamMemberServiceTest {
    @Autowired private IssueRepository issueRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private TeamMemberRepository repository;
    @Autowired private ProjectRepository projectRepository;
    @Autowired private MailSenderService mailSenderService;
    @Autowired private TeamMemberInvitationRepository invitationRepository;
    private TeamMemberService service;

    @Test
    public void injectedComponentsAreNotNull() {
        assertNotNull(issueRepository);
        assertNotNull(repository);
        assertNotNull(projectRepository);
    }

    @Before
    public void init() {
        service = new TeamMemberService(repository, projectRepository, issueRepository, userRepository, invitationRepository, mailSenderService);
    }

    @Test
    public void deletingMemberWithAssignedIssueIsPossible() {
        Project project = new Project();
        project.setName("name");
        project.setProjectKey("key");
        projectRepository.saveAndFlush(project);

        User user = new User();
        user.setUsername("username");
        user.setPassword("password");
        userRepository.saveAndFlush(user);

        TeamMember member = new TeamMember();
        member.setUser(user);
        member.setRole(TeamMember.ProjectRole.DEVELOPER);
        member.setProject(project);
        TeamMember teamMember = repository.saveAndFlush(member);

        Issue issue = new Issue();
        issue.setSummary("summary");
        issue.setStatus(Issue.IssueStatus.TO_DO);
        issue.setType(Issue.IssueType.TASK);
        issue.setList(project.getBacklog());
        issue.setAssignee(member);
        Issue issueFromDb = issueRepository.saveAndFlush(issue);

        service.deleteMember(teamMember.getId());
        assertTrue(repository.findAll().isEmpty());
        assertNull(issueRepository.getOne(issueFromDb.getId()).getAssignee());
    }
}
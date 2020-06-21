package issuetracker.repositories;

import issuetracker.models.project.Project;
import org.springframework.data.jpa.repository.JpaRepository;


public interface ProjectRepository extends JpaRepository<Project, Integer> { }

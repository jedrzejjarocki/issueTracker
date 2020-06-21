package issuetracker.dtos.issue;

import issuetracker.models.issue.Issue;
import issuetracker.utils.ModelMapperProvider;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class IssueDtoMapper {
    private final ModelMapperProvider modelMapperProvider;

    //@Todo remove if unnecessary
    public Issue toEntity(IssueDto dto) {
        return modelMapperProvider.get().map(dto, Issue.class);
    }

    public IssueDto toDto(Issue entity) {
        ModelMapper mapper = modelMapperProvider.get();
        mapper.getConfiguration().setSkipNullEnabled(true);
        return mapper.map(entity, IssueDto.class);
    }
}

package issuetracker.utils;

import org.modelmapper.ModelMapper;
import org.modelmapper.convention.MatchingStrategies;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class ModelMapperProvider {
    private ModelMapper mapper;

    private ModelMapper instantiate() {
        mapper = new ModelMapper();
        mapper.getConfiguration().setMatchingStrategy(MatchingStrategies.LOOSE);
        return mapper;
    }

    public ModelMapper get() {
        return Optional.ofNullable(mapper).orElse(instantiate());
    }
}

package issuetracker.dtos.common;

import org.modelmapper.ModelMapper;
import org.modelmapper.convention.MatchingStrategies;
import org.springframework.stereotype.Component;

@Component
public class DtoMapperImpl<T, K extends Dto<T>> implements DtoMapper<T, K>{
    private final ModelMapper mapper;

    public DtoMapperImpl() {
        mapper = new ModelMapper();
        mapper.getConfiguration().setMatchingStrategy(MatchingStrategies.LOOSE);
        mapper.getConfiguration().setSkipNullEnabled(true);
    }

    public T toEntity(K dto, T entity) {
        mapper.map(dto, entity);
        return entity;
    }

    public T toEntity(K dto, T entity, boolean skipNull) {
        mapper.getConfiguration().setSkipNullEnabled(true);
        T result = toEntity(dto, entity);
        mapper.getConfiguration().setSkipNullEnabled(false);
        return result;
    }

    public K toDto(T entity, K dto) {
        mapper.map(entity, dto);
        return dto;
    }
}

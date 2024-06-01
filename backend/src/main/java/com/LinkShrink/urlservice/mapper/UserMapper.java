package com.LinkShrink.urlservice.mapper;

import com.LinkShrink.urlservice.dto.UserResponse;
import com.LinkShrink.urlservice.model.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserMapper {

    @Mapping(source = "id", target = "id")
    @Mapping(source = "fullName", target = "fullName")
    @Mapping(source = "email", target = "email")
    @Mapping(source = "active", target = "active")
    UserResponse userToUserResponse(User user);
}

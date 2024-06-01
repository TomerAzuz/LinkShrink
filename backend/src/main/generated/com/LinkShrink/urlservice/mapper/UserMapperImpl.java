package com.LinkShrink.urlservice.mapper;

import com.LinkShrink.urlservice.dto.UserResponse;
import com.LinkShrink.urlservice.model.User;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2024-05-30T15:07:41+0300",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 17.0.8.1 (Amazon.com Inc.)"
)
@Component
public class UserMapperImpl implements UserMapper {

    @Override
    public UserResponse userToUserResponse(User user) {
        if ( user == null ) {
            return null;
        }

        UserResponse userResponse = new UserResponse();

        userResponse.setId( user.getId() );
        userResponse.setFullName( user.getFullName() );
        userResponse.setEmail( user.getEmail() );
        userResponse.setActive( user.isActive() );

        return userResponse;
    }
}

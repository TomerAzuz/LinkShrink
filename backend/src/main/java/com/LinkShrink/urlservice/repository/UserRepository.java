package com.LinkShrink.urlservice.repository;

import com.LinkShrink.urlservice.model.User;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends CrudRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Optional<User> findByResetCode(String code);
    Optional<User> findByActivationCode(String code);
    boolean existsByEmail(String email);
}

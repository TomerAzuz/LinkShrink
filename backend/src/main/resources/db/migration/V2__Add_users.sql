INSERT INTO users (id, full_name, email, password, reset_code, reset_code_verified, is_active, created_at)
VALUES (1, 'Admin User', '${admin_user_email}', '${admin_password}', null, false, true, NOW());

INSERT INTO users (id, full_name, email, password, reset_code, reset_code_verified, is_active, created_at)
VALUES (2, 'user', 'user@example.com', '${admin_password}', null, false, true, NOW());

INSERT INTO user_role (user_id, roles)
VALUES (1, 'ADMIN');

INSERT INTO user_role (user_id, roles)
VALUES (2, 'USER');

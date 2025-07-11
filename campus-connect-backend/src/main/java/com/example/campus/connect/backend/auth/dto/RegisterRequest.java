package com.example.campus.connect.backend.auth.dto;

import com.example.campus.connect.backend.entity.Role;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RegisterRequest {
    private String name;
    private String email;
    private String password;
    private Role role;
}

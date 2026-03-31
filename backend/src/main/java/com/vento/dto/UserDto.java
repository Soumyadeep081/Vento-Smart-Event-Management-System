package com.vento.dto;

import lombok.Data;

@Data
public class UserDto {
    @Data
    public static class UpdateRequest {
        private String name;
        private String phone;
    }
}

package com.klef.soa.docker.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Data;

@Data
public class FarmersCooperativeRequest
{
    @NotBlank(message = "Cooperative Name is Required")
    private String cooperativeName;

    @NotBlank(message = "Village is Required")
    private String village;

    @NotNull(message = "Member Count is Required")
    @PositiveOrZero(message = "Member Count cannot be negative")
    private Integer memberCount;

    @NotNull(message = "Registered status is Required")
    private Boolean registered;
}

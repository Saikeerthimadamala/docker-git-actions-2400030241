package com.klef.soa.docker.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FarmersCooperativeResponse
{
    private Long id;
    private String cooperativeName;
    private String village;
    private Integer memberCount;
    private Boolean registered;
}

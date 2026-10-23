package com.klef.soa.docker.service;

import java.util.List;

import com.klef.soa.docker.dto.FarmersCooperativeRequest;
import com.klef.soa.docker.dto.FarmersCooperativeResponse;

public interface FarmersCooperativeService
{
    FarmersCooperativeResponse addFarmersCooperative(FarmersCooperativeRequest request);

    List<FarmersCooperativeResponse> displayAllFarmersCooperatives();

    FarmersCooperativeResponse displayFarmersCooperativeById(Long id);

    FarmersCooperativeResponse updateFarmersCooperative(Long id, FarmersCooperativeRequest request);

    String deleteFarmersCooperativeById(Long id);
}

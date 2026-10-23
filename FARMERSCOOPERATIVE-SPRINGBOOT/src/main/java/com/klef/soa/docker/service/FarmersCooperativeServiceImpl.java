package com.klef.soa.docker.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.klef.soa.docker.dto.FarmersCooperativeRequest;
import com.klef.soa.docker.dto.FarmersCooperativeResponse;
import com.klef.soa.docker.entity.FarmersCooperative;
import com.klef.soa.docker.repository.FarmersCooperativeRepository;

@Service
public class FarmersCooperativeServiceImpl implements FarmersCooperativeService
{
    @Autowired
    private FarmersCooperativeRepository repo;

    @Override
    public FarmersCooperativeResponse addFarmersCooperative(FarmersCooperativeRequest request)
    {
        FarmersCooperative farmersCooperative = FarmersCooperative.builder()
                .cooperativeName(request.getCooperativeName())
                .village(request.getVillage())
                .memberCount(request.getMemberCount())
                .registered(request.getRegistered())
                .build();

        FarmersCooperative savedCooperative = repo.save(farmersCooperative);

        return mapToResponse(savedCooperative);
    }

    @Override
    public List<FarmersCooperativeResponse> displayAllFarmersCooperatives()
    {
        return repo.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public FarmersCooperativeResponse displayFarmersCooperativeById(Long id)
    {
        Optional<FarmersCooperative> optional = repo.findById(id);

        if(optional.isPresent())
        {
            return mapToResponse(optional.get());
        }
        else
        {
            return null;
        }
    }

    @Override
    public FarmersCooperativeResponse updateFarmersCooperative(Long id, FarmersCooperativeRequest request)
    {
        Optional<FarmersCooperative> optional = repo.findById(id);

        if(optional.isPresent())
        {
            FarmersCooperative farmersCooperative = optional.get();

            farmersCooperative.setCooperativeName(request.getCooperativeName());
            farmersCooperative.setVillage(request.getVillage());
            farmersCooperative.setMemberCount(request.getMemberCount());
            farmersCooperative.setRegistered(request.getRegistered());

            FarmersCooperative updatedCooperative = repo.save(farmersCooperative);

            return mapToResponse(updatedCooperative);
        }
        else
        {
            return null;
        }
    }

    @Override
    public String deleteFarmersCooperativeById(Long id)
    {
        boolean status = repo.existsById(id);

        if(status)
        {
            repo.deleteById(id);
            return "Farmers Cooperative Deleted Successfully";
        }
        else
        {
            return "Farmers Cooperative ID Not Found to Delete";
        }
    }

    private FarmersCooperativeResponse mapToResponse(FarmersCooperative farmersCooperative)
    {
        return FarmersCooperativeResponse.builder()
                .id(farmersCooperative.getId())
                .cooperativeName(farmersCooperative.getCooperativeName())
                .village(farmersCooperative.getVillage())
                .memberCount(farmersCooperative.getMemberCount())
                .registered(farmersCooperative.getRegistered())
                .build();
    }
}

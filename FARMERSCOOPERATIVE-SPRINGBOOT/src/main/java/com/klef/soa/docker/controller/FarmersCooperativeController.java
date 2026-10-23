package com.klef.soa.docker.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.klef.soa.docker.dto.FarmersCooperativeRequest;
import com.klef.soa.docker.dto.FarmersCooperativeResponse;
import com.klef.soa.docker.service.FarmersCooperativeService;

import jakarta.validation.Valid;

@RestController
@CrossOrigin("*")
@RequestMapping("/farmerscooperative")
public class FarmersCooperativeController
{
    @Autowired
    private FarmersCooperativeService service;

    @GetMapping("/")
    public String home()
    {
        return "Farmers Cooperative Service Project";
    }

    @PostMapping("/add")
    public ResponseEntity<FarmersCooperativeResponse> addFarmersCooperative(@Valid @RequestBody FarmersCooperativeRequest request)
    {
        return new ResponseEntity<>(
                service.addFarmersCooperative(request), HttpStatus.CREATED);
    }

    @GetMapping("/displayall")
    public ResponseEntity<List<FarmersCooperativeResponse>> displayAllFarmersCooperatives()
    {
        return ResponseEntity.ok(service.displayAllFarmersCooperatives());
    }

    @GetMapping("/display/id/{id}")
    public ResponseEntity<FarmersCooperativeResponse> displayFarmersCooperativeById(@PathVariable Long id)
    {
        return ResponseEntity.ok(service.displayFarmersCooperativeById(id));
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<FarmersCooperativeResponse> updateFarmersCooperative(@PathVariable Long id, @Valid @RequestBody FarmersCooperativeRequest request)
    {
        return ResponseEntity.ok(service.updateFarmersCooperative(id, request));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteFarmersCooperativeById(@PathVariable Long id)
    {
        return ResponseEntity.ok(service.deleteFarmersCooperativeById(id));
    }
}

package com.example.campus.connect.backend.repository;

import com.example.campus.connect.backend.entity.Application;
import com.example.campus.connect.backend.entity.Job;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ApplicationRepository extends JpaRepository<Application, Long> {
    List<Application> findByJob(Job job);
}

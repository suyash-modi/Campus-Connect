package com.example.campus.connect.backend.repository;

import com.example.campus.connect.backend.entity.Job;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface JobRepository extends JpaRepository<Job, Long> {
    List<Job> findByPostedById(Long userId);
}

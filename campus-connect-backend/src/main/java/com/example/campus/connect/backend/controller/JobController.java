package com.example.campus.connect.backend.controller;

import com.example.campus.connect.backend.auth.JwtUtil;
import com.example.campus.connect.backend.entity.Application;
import com.example.campus.connect.backend.entity.Job;
import com.example.campus.connect.backend.service.JobService;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/jobs")
public class JobController {

    private final JobService jobService;
    private final JwtUtil jwtUtil;

    @PostMapping
    @PreAuthorize("hasRole('COMPANY')")
    public ResponseEntity<Job> postJob(@RequestBody Job job, @RequestHeader("Authorization") String token) {
        String email = jwtUtil.extractUsername(token);
        return ResponseEntity.ok(jobService.postJob(job, email));
    }

    @GetMapping
    public ResponseEntity<List<Job>> getAllJobs() {
        return ResponseEntity.ok(jobService.getAllJobs());
    }

    @GetMapping("/filter")
    public ResponseEntity<List<Job>> getFilteredJobs(
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String companyName
    ) {
        return ResponseEntity.ok(jobService.getFilteredJobs(title, location, companyName));
    }

    @GetMapping("/locations")
    public ResponseEntity<List<String>> getUniqueLocations() {
        return ResponseEntity.ok(jobService.getUniqueLocations());
    }

    @GetMapping("/companies")
    public ResponseEntity<List<String>> getUniqueCompanyNames() {
        return ResponseEntity.ok(jobService.getUniqueCompanyNames());
    }

    @PostMapping("/{id}/apply")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<Application> applyToJob(
            @PathVariable Long id,
            @RequestHeader("Authorization") String token,
            @RequestParam(required = false) String resumeUrl
    ) {
        System.out.println("Token received: " + token);
        String email = jwtUtil.extractUsername(token);
        Application application = jobService.applyToJob(id, email, resumeUrl);
        return ResponseEntity.ok(application);
    }

    @GetMapping("/{id}/applications")
    @PreAuthorize("hasRole('COMPANY')")
    public ResponseEntity<List<Application>> viewApplicants(
            @PathVariable Long id,
            @RequestHeader("Authorization") String token
    ) {
        String email = jwtUtil.extractUsername(token);
        List<Application> applications = jobService.getApplicationsForJob(id, email);
        return ResponseEntity.ok(applications);
    }
}


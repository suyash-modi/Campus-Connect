package com.example.campus.connect.backend.service;

import com.example.campus.connect.backend.entity.Application;
import com.example.campus.connect.backend.entity.Job;
import com.example.campus.connect.backend.entity.User;
import com.example.campus.connect.backend.repository.ApplicationRepository;
import com.example.campus.connect.backend.repository.JobRepository;
import com.example.campus.connect.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class JobService {

    private final JobRepository jobRepository;
    private final UserRepository userRepository;
    private final ApplicationRepository applicationRepository;


    public Job postJob(Job job, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        job.setPostedBy(user);
        return jobRepository.save(job);
    }

    public List<Job> getAllJobs() {
        return jobRepository.findAll();
    }

    public List<Job> getFilteredJobs(String title, String location, String companyName) {
        List<Job> allJobs = jobRepository.findAll();
        
        return allJobs.stream()
                .filter(job -> title == null || title.isEmpty() || 
                        job.getTitle().toLowerCase().contains(title.toLowerCase()))
                .filter(job -> location == null || location.isEmpty() || 
                        job.getLocation().toLowerCase().contains(location.toLowerCase()))
                .filter(job -> companyName == null || companyName.isEmpty() || 
                        job.getCompanyName().toLowerCase().contains(companyName.toLowerCase()))
                .collect(Collectors.toList());
    }

    public List<String> getUniqueLocations() {
        return jobRepository.findAll().stream()
                .map(Job::getLocation)
                .distinct()
                .filter(location -> location != null && !location.isEmpty())
                .collect(Collectors.toList());
    }

    public List<String> getUniqueCompanyNames() {
        return jobRepository.findAll().stream()
                .map(Job::getCompanyName)
                .distinct()
                .filter(company -> company != null && !company.isEmpty())
                .collect(Collectors.toList());
    }

    public Application applyToJob(Long jobId, String email, String resumeUrl) {
        User applicant = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found"));

        // Optional: check if already applied
        Application application = Application.builder()
                .job(job)
                .applicant(applicant)
                .resumeUrl(resumeUrl)
                .build();

        return applicationRepository.save(application);
    }

    public List<Application> getApplicationsForJob(Long jobId, String requesterEmail) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found"));

        // check if the requester is the owner
        if (!job.getPostedBy().getEmail().equals(requesterEmail)) {
            throw new RuntimeException("Not authorized to view applications");
        }

        return applicationRepository.findByJob(job);
    }
}

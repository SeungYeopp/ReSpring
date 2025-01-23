package org.ssafy.respring.domain.story.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.ssafy.respring.domain.story.vo.Story;

import java.util.List;
import java.util.UUID;

public interface StoryRepository extends JpaRepository<Story, Long>, StoryRepositoryQuerydsl {
    List<Story> findByUserId(UUID userId);
}

package org.ssafy.respring.domain.tag.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.ssafy.respring.domain.tag.vo.Tag;

import java.util.Optional;

public interface TagRepository extends JpaRepository<Tag, Long>, TagRepositoryQueryDsl {
    Optional<Tag> findByName(String name);
}

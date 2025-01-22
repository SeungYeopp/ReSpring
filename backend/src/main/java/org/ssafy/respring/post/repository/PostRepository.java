package org.ssafy.respring.post.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.ssafy.respring.post.vo.Post;

import java.util.List;
import java.util.UUID;

public interface PostRepository extends JpaRepository<Post, Long>, PostRepositoryQuerydsl {
    List<Post> findByUser_Id(UUID userId);
}

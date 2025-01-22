package org.ssafy.respring.post.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.ssafy.respring.post.vo.Post;

public interface PostRepository extends JpaRepository<Post, Long> {
}

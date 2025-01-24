package org.ssafy.respring.domain.post.repository;

import org.ssafy.respring.domain.post.vo.Post;

import java.util.List;

public interface PostRepositoryQuerydsl {
    List<Post> searchByTitle(String title);
    List<Post> filterByCategory(String category);
    List<Post> findByCursor(Long lastId, int limit);
}

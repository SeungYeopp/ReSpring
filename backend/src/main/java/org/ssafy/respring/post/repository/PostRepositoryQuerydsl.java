package org.ssafy.respring.post.repository;

import org.ssafy.respring.post.vo.Post;

import java.util.List;

public interface PostRepositoryQuerydsl {
    List<Post> searchByTitle(String title);
    List<Post> filterByCategory(String category);
}

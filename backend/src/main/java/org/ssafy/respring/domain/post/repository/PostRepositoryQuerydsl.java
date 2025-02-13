package org.ssafy.respring.domain.post.repository;

import com.querydsl.core.Tuple;
import org.ssafy.respring.domain.post.dto.response.PostResponseDto;
import org.ssafy.respring.domain.post.vo.Post;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public interface PostRepositoryQuerydsl {
    List<Post> searchByTitle(String title);
    List<Post> filterByCategory(String category);
    List<Post> findByCursor(Long lastId, int limit);
    List<Tuple> findTop3ByLikesInPastWeekWithComments(LocalDateTime oneWeekAgo);
    boolean isPostLikedByUser(Long postId, UUID userId);
    List<Post> findByUserName(String userName);
    Post findPostWithComments(Long postId);
}

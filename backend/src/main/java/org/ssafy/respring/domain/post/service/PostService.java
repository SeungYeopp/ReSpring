package org.ssafy.respring.domain.post.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.ssafy.respring.domain.image.vo.Image;
import org.ssafy.respring.domain.post.dto.request.PostRequestDto;
import org.ssafy.respring.domain.post.dto.response.PostResponseDto;
import org.ssafy.respring.domain.post.repository.PostRepository;
import org.ssafy.respring.domain.post.vo.Post;
import org.ssafy.respring.domain.user.vo.User;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class PostService {
    private final PostRepository postRepository;

    @Transactional
    public Long createPost(PostRequestDto requestDto) {
        Post post = new Post();
        post.setTitle(requestDto.getTitle());
        post.setContent(requestDto.getContent());
        post.setCategory(requestDto.getCategory());
        post.setLikes(0L);

        User user = new User();
        user.setId(requestDto.getUserId());
        post.setUser(user);

        postRepository.save(post);
        return post.getId();
    }

    public PostResponseDto getPost(Long id) {
        return postRepository.findById(id)
                .map(this::toResponseDto)
                .orElseThrow(() -> new IllegalArgumentException("Post not found with id: " + id));
    }

    public List<PostResponseDto> getAllPosts() {
        return postRepository.findAll()
                .stream()
                .map(this::toResponseDto)
                .collect(Collectors.toList());
    }

    public List<PostResponseDto> getMyPosts(UUID userId) {
        return postRepository.findByUser_Id(userId)
                .stream()
                .map(this::toResponseDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public void updatePost(Long id, PostRequestDto requestDto) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Post not found with id: " + id));

        post.setTitle(requestDto.getTitle());
        post.setContent(requestDto.getContent());
        post.setCategory(requestDto.getCategory());
    }

    @Transactional
    public void deletePost(Long id) {
        postRepository.deleteById(id);
    }

    public List<PostResponseDto> searchPostsByTitle(String title) {
        return postRepository.searchByTitle(title)
                .stream()
                .map(this::toResponseDto)
                .collect(Collectors.toList());
    }

    public List<PostResponseDto> filterPostsByCategory(String category) {
        return postRepository.filterByCategory(category)
                .stream()
                .map(this::toResponseDto)
                .collect(Collectors.toList());
    }

    public List<PostResponseDto> getPostsByCursor(Long lastId, int limit) {
        return postRepository.findByCursor(lastId, limit)
                .stream()
                .map(this::toResponseDto)
                .collect(Collectors.toList());
    }

    public List<PostResponseDto> getPopularPosts() {
        LocalDateTime oneWeekAgo = LocalDateTime.now().minusWeeks(1);
        return postRepository.findTop3ByLikesInPastWeek(oneWeekAgo)
                .stream()
                .map(this::toResponseDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public boolean toggleLike(Long postId, UUID userId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("Post not found with id: " + postId));

        boolean isLiked = post.toggleLike(userId); // 좋아요 토글
        post.setLikes((long) post.getLikedUsers().size()); // 좋아요 수 업데이트
        return isLiked;
    }

    private PostResponseDto toResponseDto(Post post) {
        List<Long> imageIds = post.getImages().stream()
                .map(Image::getImageId)
                .collect(Collectors.toList());

        return new PostResponseDto(
                post.getId(),
                post.getTitle(),
                post.getContent(),
                post.getCategory(),
                post.getUser().getId(),
                post.getUser().getUsername(),
                post.getCreatedAt(),
                post.getUpdatedAt(),
                post.getLikes(),
                imageIds
        );
    }
}

package org.ssafy.respring.post.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.ssafy.respring.post.dto.request.PostRequestDto;
import org.ssafy.respring.post.dto.response.PostResponseDto;
import org.ssafy.respring.post.repository.PostRepository;
import org.ssafy.respring.post.vo.Post;
import org.ssafy.respring.user.vo.User;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class PostService {
    private final PostRepository postRepository;

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

    public void updatePost(Long id, PostRequestDto requestDto) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Post not found with id: " + id));

        post.setTitle(requestDto.getTitle());
        post.setContent(requestDto.getContent());
        post.setCategory(requestDto.getCategory());
    }

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

    private PostResponseDto toResponseDto(Post post) {
        return new PostResponseDto(
                post.getId(),
                post.getTitle(),
                post.getContent(),
                post.getCategory(),
                post.getUser().getId(),
                post.getUser().getUsername(),
                post.getCreatedAt(),
                post.getUpdatedAt(),
                post.getLikes()
        );
    }
}

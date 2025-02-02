package org.ssafy.respring.domain.post.service;

import com.querydsl.core.Tuple;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.ssafy.respring.domain.comment.dto.response.CommentResponseDto;
import org.ssafy.respring.domain.comment.vo.Comment;
import org.ssafy.respring.domain.image.dto.response.ImageResponseDTO;
import org.ssafy.respring.domain.image.repository.ImageRepository;
import org.ssafy.respring.domain.image.vo.Image;
import org.ssafy.respring.domain.post.dto.request.PostRequestDto;
import org.ssafy.respring.domain.post.dto.request.PostUpdateRequestDto;
import org.ssafy.respring.domain.post.dto.response.PostResponseDto;
import org.ssafy.respring.domain.post.repository.PostRepository;
import org.ssafy.respring.domain.post.vo.Post;
import org.ssafy.respring.domain.user.vo.User;

import java.io.File;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class PostService {
    private final PostRepository postRepository;
    private final ImageRepository imageRepository;

    @Value("${file.upload-dir}")
    private String uploadDir;

    @Transactional
    public Long createPostWithImages(PostRequestDto requestDto, List<MultipartFile> imageFiles) throws IOException {
        // 1. Post 객체 생성
        Post post = new Post();
        post.setTitle(requestDto.getTitle());
        post.setContent(requestDto.getContent());
        post.setCategory(requestDto.getCategory());
        post.setLikes(0L);

        User user = new User();
        user.setId(requestDto.getUserId());
        post.setUser(user);

        File uploadDirFolder = new File(uploadDir);
        if (!uploadDirFolder.exists()) {
            if (!uploadDirFolder.mkdirs()) {
                throw new RuntimeException("Failed to create upload directory: " + uploadDir);
            }
        }

        // 2. 이미지 저장 및 연결
        if (imageFiles != null && !imageFiles.isEmpty()) {
            List<Image> images = imageFiles.stream().map(file -> {
                try {
                    String originalFileName = file.getOriginalFilename();
                    String extension = originalFileName != null && originalFileName.contains(".") ?
                            originalFileName.substring(originalFileName.lastIndexOf(".")) : "";
                    String uniqueFileName = UUID.randomUUID().toString() + extension;

                    String filePath = uploadDir + File.separator + uniqueFileName;
                    file.transferTo(new File(filePath));

                    Image image = new Image();
                    image.setImageUrl(filePath);
                    image.setPost(post); // Post와 연결
                    return image;
                } catch (IOException e) {
                    throw new RuntimeException("Failed to save file: " + file.getOriginalFilename(), e);
                }
            }).collect(Collectors.toList());
            post.setImages(images); // Post에 이미지 추가
        }

        // 3. Post 저장
        postRepository.save(post);
        return post.getId();
    }

    public PostResponseDto getPost(Long id) {
        Post post = postRepository.findPostWithComments(id); // ✅ QueryDSL에서 Post + 댓글 함께 조회

        if (post == null) {
            throw new IllegalArgumentException("Post not found with id: " + id);
        }

        return toResponseDto(post); // ✅ Post 객체를 DTO로 변환
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
    public void updatePost(Long postId, PostUpdateRequestDto requestDto, List<MultipartFile> imageFiles) throws IOException {
        // 1. Post 가져오기
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("Post not found with id: " + postId));

        // 2. 요청한 사용자와 작성자가 같은지 확인
        if (!post.getUser().getId().equals(requestDto.getUserId())) {
            throw new IllegalArgumentException("You are not authorized to modify this post.");
        }

        // 3. Post 내용 수정 (userId는 수정하지 않음)
        post.setTitle(requestDto.getTitle());
        post.setContent(requestDto.getContent());
        post.setCategory(requestDto.getCategory());

        // 4. 특정 이미지 삭제
        List<Long> deleteImageIds = requestDto.getDeleteImageIds();
        if (deleteImageIds != null && !deleteImageIds.isEmpty()) {
            // ImageRepository를 사용하여 삭제할 이미지 조회
            List<Image> imagesToDelete = imageRepository.findAllById(deleteImageIds);

            // 삭제하려는 이미지 ID가 Post와 연결되지 않은 경우 예외 처리
            for (Image image : imagesToDelete) {
                if (!post.getImages().contains(image)) {
                    throw new IllegalArgumentException("Image ID " + image.getImageId() + " is not associated with this post.");
                }
            }

            // 이미지 파일 및 DB 삭제
            for (Image image : imagesToDelete) {
                File imageFile = new File(image.getImageUrl());
                if (imageFile.exists() && !imageFile.delete()) {
                    throw new RuntimeException("Failed to delete file: " + imageFile.getAbsolutePath());
                }
                imageRepository.delete(image); // DB에서 삭제
            }

            // Post와의 관계 제거
            post.getImages().removeAll(imagesToDelete);
        }

        // 5. 새로운 이미지 추가
        File uploadDirFolder = new File(uploadDir);
        if (!uploadDirFolder.exists()) {
            if (!uploadDirFolder.mkdirs()) {
                throw new RuntimeException("Failed to create upload directory: " + uploadDir);
            }
        }

        if (imageFiles != null && !imageFiles.isEmpty()) {
            List<Image> newImages = imageFiles.stream().map(file -> {
                try {
                    String originalFileName = file.getOriginalFilename();
                    String extension = originalFileName != null && originalFileName.contains(".") ?
                            originalFileName.substring(originalFileName.lastIndexOf(".")) : "";
                    String uniqueFileName = UUID.randomUUID().toString() + extension;

                    String filePath = uploadDir + File.separator + uniqueFileName;
                    file.transferTo(new File(filePath));

                    Image image = new Image();
                    image.setImageUrl(filePath);
                    image.setPost(post); // Post와 연결
                    return image;
                } catch (IOException e) {
                    throw new RuntimeException("Failed to save file: " + file.getOriginalFilename(), e);
                }
            }).collect(Collectors.toList());
            post.getImages().addAll(newImages); // Post에 새로운 이미지 추가
        }
    }

    @Transactional
    public void deletePost(Long postId, UUID requestUserId) {
        // 1. Post 가져오기
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("Post not found with id: " + postId));

        // 2. 요청한 사용자와 작성자가 같은지 확인
        if (!post.getUser().getId().equals(requestUserId)) {
            throw new IllegalArgumentException("You are not authorized to delete this post.");
        }

        // 3. 이미지 파일 및 DB 삭제
        List<Image> images = post.getImages();
        for (Image image : images) {
            File file = new File(image.getImageUrl());
            if (file.exists() && !file.delete()) {
                throw new RuntimeException("Failed to delete file: " + file.getAbsolutePath());
            }
        }

        // DB에서 이미지 삭제
        imageRepository.deleteAll(images);

        // 4. 포스트 삭제
        postRepository.delete(post);
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
        List<Tuple> results = postRepository.findTop3ByLikesInPastWeekWithComments(oneWeekAgo);

        return results.stream()
                .map(tuple -> {
                    Post post = tuple.get(0, Post.class);
                    Long commentCount = tuple.get(1, Long.class);
                    return toResponseDto(post);
                })
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

    public boolean isPostLikedByUser(Long postId, UUID userId) {
        return postRepository.isPostLikedByUser(postId, userId);
    }

    private PostResponseDto toResponseDto(Post post) {

        List<ImageResponseDTO> imageDtos = post.getImages().stream()
                .map(image -> new ImageResponseDTO(image.getImageId(), image.getImageUrl()))
                .collect(Collectors.toList());

        List<CommentResponseDto> commentDtos = post.getComments().stream()
                .map(comment -> new CommentResponseDto(
                        comment.getId(),
                        comment.getContent(),
                        comment.getUser().getUserNickname(), // ✅ username 직접 추출
                        comment.getCreatedAt(),
                        comment.getUpdatedAt(),
                        comment.getParent() != null ? comment.getParent().getId() : null // ✅ 부모 댓글 ID 설정
                ))
                .collect(Collectors.toList());


        int commentCount = post.getComments() != null ? post.getComments().size() : 0;

        return new PostResponseDto(
                post.getId(),
                post.getTitle(),
                post.getContent(),
                post.getCategory(),
                post.getUser().getId(),
                post.getUser().getUserNickname(),
                post.getCreatedAt(),
                post.getUpdatedAt(),
                post.getLikes(),
                imageDtos,
                commentCount,
                commentDtos
        );
    }
}

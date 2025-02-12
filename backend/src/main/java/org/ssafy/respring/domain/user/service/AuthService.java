package org.ssafy.respring.domain.user.service;

import jakarta.mail.AuthenticationFailedException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.ssafy.respring.domain.image.service.ImageService;
import org.ssafy.respring.domain.user.dto.request.LoginRequestDto;
import org.ssafy.respring.domain.user.dto.response.LoginResponseDto;
import org.ssafy.respring.domain.user.mapper.UserMapper;
import org.ssafy.respring.domain.user.repository.SaltRepository;
import org.ssafy.respring.domain.user.repository.UserRepository;
import org.ssafy.respring.domain.user.vo.User;
import org.ssafy.respring.util.OpenCrypt;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final SaltRepository saltRepository;
    private final ImageService imageService;
    private final UserMapper userMapper;

    public LoginResponseDto processOAuthLogin(String provider, OAuth2User oauth2User) {
        String email = extractEmail(provider, oauth2User.getAttributes());

        if (email == null) {
            throw new IllegalArgumentException("OAuth provider did not return an email.");
        }

        User user = userRepository.findByEmail(email).orElseGet(() -> {
            User newUser = new User();
            newUser.setEmail(email);
            newUser.setUserNickname(oauth2User.getAttribute("name"));
            newUser.setProfileImage(oauth2User.getAttribute("picture"));
            newUser.setProvider(provider.toUpperCase()); // 일반 / KAKAO / GOOGLE 구분
            return userRepository.save(newUser);
        });

        // 기존 사용자의 프로필 이미지 업데이트 (새로운 정보가 있을 경우)
        if (oauth2User.getAttribute("picture") != null && !oauth2User.getAttribute("picture").equals(user.getProfileImage())) {
            user.setProfileImage(oauth2User.getAttribute("picture"));
            userRepository.save(user);
        }

        return createResponseDto(user);
    }

    public LoginResponseDto loginUser(LoginRequestDto loginRequestDto) throws AuthenticationFailedException {
        User loginUser = userRepository.findByEmail(loginRequestDto.getEmail())
                .orElseThrow(() -> new NoSuchElementException("EMAIL_NOT_FOUND"));

        String salt = saltRepository.findById(loginUser.getId())
                .orElseThrow(() -> new NoSuchElementException("SALT_NOT_FOUND")).getSalt();

        String encryptPassword = OpenCrypt.byteArrayToHex(OpenCrypt.getSHA256(loginRequestDto.getPassword(), salt));
        if (!loginUser.getPassword().equals(encryptPassword)) {
            throw new AuthenticationFailedException("AUTH_FAILED");
        }

        String s3Key = loginUser.getProfileImage();

        String profileImageUrl = (s3Key != null && !s3Key.isEmpty())
                ? imageService.generatePresignedUrl(s3Key)
                : "https://i.imgur.com/QbLhsD7.png";

        return userMapper.entityToDto(loginUser,profileImageUrl);
    }


    private String extractEmail(String provider, Map<String, Object> attributes) {
        if ("KAKAO".equalsIgnoreCase(provider)) {
            Map<String, Object> kakaoAccount = (Map<String, Object>) attributes.get("kakao_account");
            return (kakaoAccount != null) ? (String) kakaoAccount.get("email") : null;
        } else if ("GOOGLE".equalsIgnoreCase(provider)) {
            return (String) attributes.get("email");
        }
        return null;
    }


    public String getUserProfileImageUrl(UUID userId) {
        Optional<User> userOptional = userRepository.findById(userId);

        if (userOptional.isPresent()) {
            String s3Key = userOptional.get().getProfileImage();
            if (s3Key != null && !s3Key.isEmpty()) {
                return imageService.generatePresignedUrl(s3Key);
            }
        }
        return "https://i.imgur.com/QbLhsD7.png";
    }

    public LoginResponseDto createResponseDto(User user){
        String image = getUserProfileImageUrl(user.getId());
        return userMapper.entityToDto(user,image);
    }
}

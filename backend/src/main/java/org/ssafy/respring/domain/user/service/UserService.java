package org.ssafy.respring.domain.user.service;

import jakarta.mail.AuthenticationFailedException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.ssafy.respring.domain.image.service.ImageService;
import org.ssafy.respring.domain.user.dto.request.LoginRequestDto;
import org.ssafy.respring.domain.user.dto.request.PasswordEncryptionResultDto;
import org.ssafy.respring.domain.user.dto.request.SignUpRequestDto;
import org.ssafy.respring.domain.user.mapper.UserMapper;
import org.ssafy.respring.domain.user.repository.SaltRepository;
import org.ssafy.respring.domain.user.repository.SocialAccountRepository;
import org.ssafy.respring.domain.user.repository.UserRepository;
import org.ssafy.respring.domain.user.vo.Salt;
import org.ssafy.respring.domain.user.vo.SocialAccount;
import org.ssafy.respring.domain.user.vo.User;
import org.ssafy.respring.util.OpenCrypt;
import org.ssafy.respring.domain.user.dto.response.LoginResponseDto;

import java.util.*;

@Service
@Transactional
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final SaltRepository saltRepository;
    private final UserMapper userMapper;
    private final SocialAccountRepository socialAccountRepository;
    private final ImageService imageService;


    public void addUser(SignUpRequestDto signUpRequestDto) {

        User user = userMapper.dtoToEntity(signUpRequestDto);

        PasswordEncryptionResultDto encryptionResult = OpenCrypt.encryptPw(signUpRequestDto.getPassword());
        user.changePassword(encryptionResult.getHashedPassword());

        userRepository.save(user);
        saltRepository.save(new Salt(user.getId(), encryptionResult.getSalt()));
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
    //DB 테스트용 코드입니다
    public List<User> findAllUser(){
        return userRepository.findAll();
    }

    @Transactional
    public User findOrCreateUserBySocialLogin(String provider, String email, String socialId, OAuth2User oauth2User) {
        Optional<User> existingUser = userRepository.findByEmail(email);

        User user;
        if (existingUser.isPresent()) {
            user = existingUser.get();
        } else {
            String nickname = oauth2User.getAttribute("name");

            user = new User();
            user.setEmail(email);
            user.setUserNickname(nickname);
            user.setProfileImage(oauth2User.getAttribute("picture"));
            userRepository.save(user);
        }

        Optional<SocialAccount> existingSocialAccount = socialAccountRepository.findByProviderAndSocialId(provider, socialId);

        if (existingSocialAccount.isEmpty()) {
            SocialAccount socialAccount = new SocialAccount();
            socialAccount.setUser(user);
            socialAccount.setProvider(provider.toUpperCase()); // GOOGLE, KAKAO 등
            socialAccount.setSocialId(socialId);
            socialAccountRepository.save(socialAccount);
        }

        return user;
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

    public User findByNickname(String nickname) {
        return userRepository.findByUserNickname(nickname).get();
    }


    public LoginResponseDto createResponseDto(User user){

        String image = getUserProfileImageUrl(user.getId());
        return userMapper.entityToDto(user,image);
    }
}





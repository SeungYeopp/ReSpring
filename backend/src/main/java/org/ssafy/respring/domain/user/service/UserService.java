package org.ssafy.respring.domain.user.service;

import jakarta.mail.AuthenticationFailedException;
import jakarta.transaction.Transactional;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
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
public class UserService {
    private final UserRepository userRepository;
    private final SaltRepository saltRepository;
    private final UserMapper userMapper;
    private final SocialAccountRepository socialAccountRepository;

    public UserService(UserRepository userRepository, SaltRepository saltRepository, SocialAccountRepository socialAccountRepository, UserMapper userMapper) {
        this.userRepository = userRepository;
        this.saltRepository = saltRepository;
        this.socialAccountRepository = socialAccountRepository;
        this.userMapper = userMapper;
    }

    public void addUser(SignUpRequestDto signUpRequestDto) {

        User user = userMapper.dtoToEntity(signUpRequestDto);

        PasswordEncryptionResultDto encryptionResult = OpenCrypt.encryptPw(signUpRequestDto.getPassword());
        user.changePassword(encryptionResult.getHashedPassword());

        userRepository.save(user);
        saltRepository.save(new Salt(user.getUserId(), encryptionResult.getSalt()));
    }

    public LoginResponseDto loginUser(LoginRequestDto loginRequestDto) throws AuthenticationFailedException {
        User loginUser = userRepository.findByEmail(loginRequestDto.getEmail())
                .orElseThrow(() -> new NoSuchElementException("EMAIL_NOT_FOUND"));

        String salt = saltRepository.findById(loginUser.getUserId())
                .orElseThrow(() -> new NoSuchElementException("SALT_NOT_FOUND")).getSalt();

        String encryptPassword = OpenCrypt.byteArrayToHex(OpenCrypt.getSHA256(loginRequestDto.getPassword(), salt));
        if (!loginUser.getPassword().equals(encryptPassword)) {
            throw new AuthenticationFailedException("AUTH_FAILED");
        }

        return new LoginResponseDto(loginUser.getUserId(),loginUser.getUserNickname());
    }
    //DB 테스트용 코드입니다
    public List<User> findAllUser(){
        return userRepository.findAll();
    }


    @Transactional
    public User findOrCreateUserBySocialLogin(String provider, String email, String socialId, OAuth2User oauth2User) {
        // 1️⃣ User 테이블에서 기존 유저 조회
        Optional<User> existingUser = userRepository.findByEmail(email);

        User user;
        if (existingUser.isPresent()) {
            user = existingUser.get();
        } else {
            // 2️⃣ 새로운 User 생성
            String nickname = oauth2User.getAttribute("name"); // 기본 닉네임
            UUID newUserId = UUID.randomUUID();

            user = new User();
            user.setId(newUserId);
            user.setEmail(email);
            user.setUserNickname(nickname);
            user.setProfileImage(oauth2User.getAttribute("picture")); // 프로필 이미지 저장
            userRepository.save(user);
        }

        // 3️⃣ SocialAccount에 해당 소셜 계정 존재 여부 확인
        Optional<SocialAccount> existingSocialAccount = socialAccountRepository.findBySocialIdAndProvider(socialId, provider);

        if (existingSocialAccount.isEmpty()) {
            // 4️⃣ 새로운 SocialAccount 추가
            SocialAccount socialAccount = new SocialAccount();
            socialAccount.setUser(user);
            socialAccount.setProvider(provider.toUpperCase()); // GOOGLE, KAKAO 등
            socialAccount.setSocialId(socialId);
            socialAccountRepository.save(socialAccount);
        }

        return user;
    }

}




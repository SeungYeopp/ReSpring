package org.ssafy.respring.Exception;

import io.swagger.v3.oas.annotations.Hidden;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@Hidden // 스웨거 오류로 인해 히든 처리
@RestControllerAdvice
public class GlobalExceptionHandler {


    @ExceptionHandler(DuplicateEmailException.class)
    public ResponseEntity<Map<String, String>> duplicateEmailException(Exception ex) {
        Map<String, String> errorResponse = new HashMap<>();
        errorResponse.put("error", "DUPLICATE_EMAIL");
        errorResponse.put("message", ex.getMessage());
        return ResponseEntity.status(HttpStatus.CONFLICT).body(errorResponse);

    }
    @ExceptionHandler(DuplicateUserNicknameException.class)
    public ResponseEntity<Map<String,String>> duplicateUserNicknameException(Exception ex) {
        Map<String, String> errorResponse = new HashMap<>();
        errorResponse.put("error", "DUPLICATE_USERNICKNAME");
        errorResponse.put("message", ex.getMessage());
        return ResponseEntity.status(HttpStatus.CONFLICT).body(errorResponse);
    }

    @ExceptionHandler(ImageSizeUploadException.class)
    public ResponseEntity<Map<String,String>> imageSizeUploadException(Exception ex) {
        Map<String, String> errorResponse = new HashMap<>();
        errorResponse.put("error", "IMAGE_SIZE_UPLOAD");
        errorResponse.put("message", ex.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
    }


    //가장 마지막에 처리
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String,String>> runtimeExceptionHandler(RuntimeException e) {
        Map<String,String> errorResponse = new HashMap<>();
        errorResponse.put("error","RuntimeException");
        errorResponse.put("message", e.getMessage());
        return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
    }

}


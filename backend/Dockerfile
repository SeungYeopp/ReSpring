# 1. OpenJDK 17 기반 이미지 사용
FROM openjdk:17-jdk-slim

# 2. 작업 디렉토리 설정
WORKDIR /app

# 3. 프로젝트 소스 복사
COPY . .

# 4. Gradle Wrapper 실행 권한 추가
RUN chmod +x ./gradlew

# 5. Gradle을 사용해 JAR 파일 빌드
RUN ./gradlew bootJar

# 6. 빌드된 JAR 파일 실행
ENTRYPOINT ["java", "-jar", "build/libs/*.jar"]

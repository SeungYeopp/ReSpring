# Build stage
FROM openjdk:17-jdk-slim AS build

# 작업 디렉토리 설정
WORKDIR /app

# 프로젝트 소스 코드 복사
COPY . .

# Gradle Wrapper를 사용하여 애플리케이션 빌드
RUN ./gradlew bootJar --no-daemon

# 실행 stage
FROM openjdk:17-jdk-slim

# 작업 디렉토리 설정
WORKDIR /app

# 빌드된 JAR 파일 복사
COPY --from=build /app/build/libs/*.jar app.jar

# 애플리케이션 실행
ENTRYPOINT ["java", "-jar", "app.jar"]

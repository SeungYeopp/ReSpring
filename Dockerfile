# Jenkins LTS 이미지를 기반으로 커스텀 이미지 생성
FROM jenkins/jenkins:lts

# 루트 사용자로 전환
USER root

# Docker CLI 설치
RUN curl -fsSL https://get.docker.com | sh

# Docker Compose 설치
RUN curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose && \
    chmod +x /usr/local/bin/docker-compose

# Jenkins 플러그인 설치
RUN jenkins-plugin-cli --plugins "workflow-aggregator docker-workflow"

# Jenkins 사용자로 복귀
USER jenkins

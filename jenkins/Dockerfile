FROM jenkins/jenkins:lts

USER root

# Docker CLI 설치
RUN apt-get update && apt-get install -y docker.io

# Docker Compose 설치
RUN apt-get update && apt-get install -y wget && \
    wget -O /usr/local/bin/docker-compose https://github.com/docker/compose/releases/download/v2.20.2/docker-compose-$(uname -s)-$(uname -m) && \
    chmod +x /usr/local/bin/docker-compose

# Docker 그룹 권한 부여
RUN usermod -aG root jenkins

USER jenkins

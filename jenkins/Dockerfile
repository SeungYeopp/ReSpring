FROM jenkins/jenkins:lts

USER root

# Docker CLI 설치
RUN apt-get update && apt-get install -y docker.io

# Docker 그룹 권한 부여
RUN usermod -aG root jenkins

# Jenkins 사용자로 복귀
USER jenkins
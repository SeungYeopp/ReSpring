FROM jenkins/jenkins:lts

USER root

RUN apt-get update && apt-get install -y docker.io

RUN getent group docker || groupadd -g 122 docker

RUN usermod -aG docker jenkins

USER jenkins

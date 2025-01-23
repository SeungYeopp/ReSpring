pipeline {
    agent any
    environment {
        ENV_FILE = credentials('project-env')
    }
    stages {
        stage('Setup Environment') {
            steps {
                script {
                    // backend 디렉토리에 Secret File 내용 복사
                    sh 'cp $ENV_FILE ./backend/.env'
                }
            }
        }
        stage('Backend Build') {
            steps {
                dir('backend') {
                    script {
                        sh 'chmod +x ./gradlew'
                    }
                    sh './gradlew clean build'
                }
            }
        }
        stage('Frontend Build') {
            tools {
                nodejs "NodeJS-18"
            }
            steps {
                sh 'npm install && npm run build'
            }
        }
        stage('Docker Compose') {
            steps {
                sh 'docker-compose up -d'
            }
        }
    }
}

# 2025.01.15.WED : CI/CD

## CI/CD란?

> CI (Continuous Integration, 지속적 통합)
코드 병합과 테스트 자동화

> CD (Continuous Deployment/Delivery, 지속적 배포)
자동화된 배포 프로세스


### CI/CD 파이프라인 단계
> SW 개발의 다양한 단계 자동화

1. 코드 체크아웃
   - Git을 사용하여 코드를 관리
2. 빌드
   - 코드를 실행 가능한 상태로 컴파일하거나 패키징
   - Maven(Java), Webpack(JS), Gradle
3. 테스트
   - 유닛테스트, 통합테스트, 기능테스트 자동화
   - JUnit(Java), Jest(JavaScript)
4. 배포
   - production 환경에 application 배포
5. 모니터링
   - application 상태와 성능을 추적하고 문제 발생 시 알림
   - 모니터링 도구 예시
     - Prometheus, Grafana, ELK Stack

<br>

### CI/CD 도구: Jenkins
> Jenkins
- SW 개발에서 지속적 통합(CI) 및 지속적 배포(CD)를 지원함
- 역할
  - 소스 코드 변경 감지 -> 빌드 -> 테스트 -> 배포 과정 자동화
  - 코드 품질 관리, 테스트 자동화, 배포 파이프라인 구축

<br>

> Jenkins의 주요 개념과 용어
1. Job/Project
- Jenkins에서 실행 가능한 단위 작업(빌드, 테스트, 배포).
- Freestyle 프로젝트, Pipeline 프로젝트 등이 있음.

2. Node/Agent
- Jenkins 작업이 실행되는 서버.
- Master: 작업 조율 및 관리.
- Agent: 작업 실행 담당(빌드, 테스트 등).

3. Pipeline
- Jenkins 작업의 연속적인 단계.
- Declarative Pipeline(권장): 선언형 구문으로 작성.
- Scripted Pipeline: Groovy 기반의 스크립트.

4. Plugins
- Jenkins의 기능을 확장하기 위한 플러그인.
- Git, Docker, Slack, SonarQube 등 다양한 플러그인 제공.


<br>

> Jenkins에서의 CI/CD 구성
CI/CD 파이프라인을 설정하고 자동화하려면 다음 단계가 필요하다.
1. 코드 변경 감지
   - GitHub, GitLab 등과 **Webhook**을 설정하여 코드 변경 시 자동으로 빌드 트리거
2. 빌드 자동화
   - Maven, Gradle, npm 등 빌드 도구 사용
3. 테스트 자동화
   - JUnit, Pytest, Selenium 등을 사용하여 자동 테스트 실행
4. 배포 자동화
   - Docker, Kubernetes, AWS 등 배포 도구와 연계

<br>

#### ✅ 실제 빌드하면서 만났던 이슈
> BackEnd
`./gradlew clean build` 를 통해 빌드를 진행할 때 Permission denied 오류가 발생했다.

- 해결한 방법
  - `chmod +x ./gradlew` 을 통해 Gradle Wrapper 실행 권한을 추가해줌

```
cd backend
chmod +x ./gradlew  # Gradle Wrapper 실행 권한 추가
./gradlew clean build
```

<br>

> FrontEnd
Jenkins 환경 상의 Node.js의 버전 호환성 문제로 인해 빌드 실패가 계속되었다. 

- 해결한 방법
  - NVM 수동으로 초기화
    - Jenkins는 비로그인 Shell을 사용해서 ~/.bashrc 를 자동으로 로드하지 않음
    - 이를 수동으로 초기화하기 위해 export NVM_DIR와 NVM 초기화 스크립트를 명시적으로 추가
  - NVM 환경 변수 설정

```
cd frontend
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # NVM 초기화
nvm install 18
nvm alias default 18
npm install
npm run build
```

<br>



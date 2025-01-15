# 2025.01.14.TUE : TDD와 BDD

## TDD (Test-Driven Development)

- 테스트 주도 개발은 코드를 작성하기 전에 테스트를 먼저 작성하는 개발 방법론이다.
- 소규모 기능 단위(예: 메서드, 클래스)를 중심으로 테스트를 설계하여 코드의 품질을 높이고, 설계 변경에 대한 리스크를 줄이는 데 중점을 둔다.

1. **Red-Green-Refactor 사이클**
    - **Red**: 실패하는 테스트 작성 (테스트 케이스는 처음에는 실패해야 함).
    - **Green**: 테스트를 통과시키기 위한 최소한의 코드 작성.
    - **Refactor**: 중복 제거 및 코드 개선.
2. **테스트의 초점**
    - 기술적 구현과 개별 기능의 정확성 검증에 초점.
    - 낮은 수준(로우 레벨) 기능 테스트.
3. **도구 및 프레임워크**
    - **Java**: JUnit
    - **Python**: unittest, pytest
    - **JavaScript**: Jest, Mocha

<br>

> 장점
- 빠른 피드백 루프 제공.
- 코드 설계 개선 및 유지보수 용이.
- 기능이 분리되고 독립적이라는 보장.

<br>

> 단점
- 초기 개발 속도 저하.
- 잘못된 테스트 설계로 인해 테스트 코드 유지보수 비용 증가 가능.


## BDD (Behavior-Driven Development)

- BDD는 비즈니스 로직과 사용자 행위(Behavior)에 초점을 맞춘 개발 방법론이다.
- 테스트를 작성할 때 **"기능이 무엇을 해야 하는가?"**에 대한 질문을 중심으로 개발합니다.
- 비즈니스 팀, 개발 팀, QA 팀 간의 협업을 강화하는 데 초점.

1. **Given-When-Then 패턴**
    - 테스트 시나리오는 비즈니스 언어로 작성:
        - **Given**: 특정 상태가 주어진다.
        - **When**: 특정 행동이 수행된다.
        - **Then**: 기대하는 결과가 나타나야 한다.
2. **테스트의 초점**
    - 사용자 관점에서의 시스템 행위 검증.
    - 고수준(하이 레벨) 테스트.
3. **도구 및 프레임워크**
    - **Java**: Cucumber
    - **Python**: Behave
    - **JavaScript**: Cucumber.js

<br>

> 장점

- 비기술자(비즈니스 이해관계자)도 테스트 시나리오를 이해할 수 있음.
- 협업 강화 및 비즈니스 요구사항 충족 보장.
- 사용자 경험 중심의 개발.

<br>

> 단점
- 초기 설정 및 학습 곡선.
- 테스트 시나리오의 비효율적 관리 가능성.


## **TDD와 BDD의 차이점**

| **항목**             | **TDD**                        | **BDD**                                        |
| -------------------- | ------------------------------ | ---------------------------------------------- |
| **목표**             | 코드의 기능적 정확성 검증      | 사용자 행동과 비즈니스 요구사항 검증           |
| **중심 질문**        | "이 코드는 정확히 동작하는가?" | "이 기능은 사용자가 기대하는 대로 동작하는가?" |
| **관심사**           | 기술적 구현                    | 사용자 경험 및 비즈니스 요구사항               |
| **테스트 작성 언어** | 프로그래밍 언어                | 비즈니스 친화적인 자연어 (Given-When-Then)     |
| **적용 범위**        | 개별 유닛 테스트               | 전체 시스템 또는 주요 기능                     |

---

## **TDD와 BDD의 연계**

TDD와 BDD는 배타적인 관계가 아니라 상호 보완적으로 사용될 수 있다.

1. **TDD로 기술적 구현 테스트**를 먼저 수행하여 코드의 안정성을 확보.
2. **BDD로 비즈니스 시나리오 테스트**를 추가하여 전체적인 흐름과 사용자의 기대치를 충족.


=> (예시) TDD를 사용하여 API의 각 메서드를 검증한 후, BDD를 통해 사용자 워크플로우(예: 로그인 및 데이터 검색)를 검증할 수 있다.



> TDD 예제 (Java, JUnit)

```java
@Test
public void testAdd() {
    // Arrange
    Calculator calc = new Calculator();

    // Act
    int result = calc.add(2, 3);

    // Assert
    assertEquals(5, result);
}

```

> BDD 예제 (Cucumber, Java)

**Feature 파일**

```gherkin
Feature: Login functionality
  Scenario: Successful login
    Given a user is on the login page
    When they enter valid credentials
    Then they should see the dashboard

```

> Step Definition 파일 (Java)

```java
@Given("a user is on the login page")
public void userOnLoginPage() {
    // 로그인 페이지 이동하면
}

@When("they enter valid credentials")
public void enterValidCredentials() {
    // 유저 이름과 비밀번호 입력할 때 
}

@Then("they should see the dashboard")
public void verifyDashboard() {
    // 대시보드를 보여줌
}

```

## 왜 굳이 TDD와 BDD를 시도해야 할까?
- 긴 개발 주기에서 이점을 제공
    - 초기에는 속도가 느려 보일 수 있지만, 프로젝트 규모가 커질수록 버그 감소와 유지보수 비용 절감 효과가 큼.
- 코드 품질과 팀 협업 강화
    - TDD는 코드 품질을, BDD는 협업을 강화하여 더 나은 소프트웨어를 개발할 수 있음.
- 안정성과 자신감 확보
    - 테스트가 잘 갖춰져 있으면 코드 변경 시에도 리스크가 줄어듦.

<br>

> 💛 프로젝트 목표: 적어도 핵심 기능에는 TDD와 BDD를 적용해보자!
- 핵심 비즈니스 로직과 주요 기능부터 테스트 적용
- CI/CD 파이프라인과 테스트를 연계하여 테스트 실행을 자동화
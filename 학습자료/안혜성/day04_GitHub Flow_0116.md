# 📘 TIL: 오늘 배운 내용 (TIL) 1

# GitHub Flow 학습

GitHub Flow는 간단하고 효율적인 협업 개발 워크플로우로, 특히 빠른 배포 주기를 가진 프로젝트에 적합합니다. 아래는 GitHub Flow의 기본 개념과 사용 방법에 대한 설명입니다.

---

## 1. GitHub Flow 개요

GitHub Flow는 다음의 단계를 따릅니다:

- **새로운 브랜치 생성:** 기능 추가나 버그 수정 같은 작업을 시작할 때 main(또는 master) 브랜치에서 새로운 브랜치를 만듭니다.
- **커밋:** 작업한 내용을 로컬 저장소에 커밋합니다.
- **푸시:** 변경 사항을 원격 저장소의 새로운 브랜치로 푸시합니다.
- **Pull Request (PR) 생성:** GitHub 웹사이트에서 PR을 생성하여 변경 사항을 팀원들과 공유하고 리뷰를 요청합니다.
- **코드 리뷰:** 팀원들이 코드를 리뷰하고 피드백을 제공합니다.
- **병합:** 리뷰가 완료되면 PR을 main 브랜치에 병합합니다.
- **배포:** main 브랜치의 최신 상태를 배포 환경에 반영합니다.

---

## 2. GitHub Flow 워크플로우 단계

1. **리포지토리 클론**
   ```bash
   git clone https://github.com/username/repository.git

2. **새로운 브랜치 생성**
  ```bash
  git checkout -b feature/새로운-기능

3. **코드 수정 및 커밋**
  ```bash
  # 파일 수정 후
  git add .
  git commit -m "새로운 기능 추가"

4. **원격 브랜치에 푸시**
  ```bash
  git push origin feature/새로운-기능

5. **Pull Request 생성**

- GitHub 웹사이트에서 feature/새로운-기능 브랜치를 기반으로 PR 생성
- 변경 사항에 대한 설명 작성 및 리뷰어 지정

6. **코드 리뷰 및 병합**

- 팀원들이 리뷰를 진행 후, 승인 시 main 브랜치에 PR 병합

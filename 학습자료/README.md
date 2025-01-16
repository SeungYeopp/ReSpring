# 학습자료


## 깃랩 사용 방법

1. 메인브랜치와 같은 새 브랜치를 생성한다 
2. 새 브랜치로 접근해 학습자료 디렉토리 안의 본인 디렉토리에 접근해 파일을 업로드 한다.
3. 파일을 업로드 한 후, 커밋을 하고 푸시한다.
4. Merge Request를 생성한다.
5. Source Branch에는 본인의 브랜치를, Target Branch에는 메인 브랜치를 선택한다.
6. Merge options에 'Delete source branch when merge request is accepted'를 체크한다.
7. Create merge request를 눌러 Merge Request를 생성한다.
8. Ready to merge! 문구를 확인하고 Delete source branch and merge를 눌러 브랜치를 삭제하고 메인 브랜치에 Merge한다. 


## Git Bash 사용방법
1. git init 명령어로 로컬 저장소를 생성한다.
2. git clone https://lab.ssafy.com/s12-webmobile2-sub1/S12P11A307.git 으로 Clone을 받는다.
3. git branch 명령어로 컨벤션의 브랜치를 생성한다. 예시) git branch study_0115_sungwook
4. git checkout study_0115_sungwook 으로 생성한 브랜치로 이동한다.
5. 본인의 학습자료 디렉토리로 이동하고, 파일을 생성한다.
5. git add . 명령어로 변경사항을 스테이징한다.
6. git commit -m "커밋 메시지" 명령어로 커밋한다.
7. git push origin study_0115_sungwook 명령어로 브랜치에 푸시한다.
8. 브라우저에서 깃랩에 접속해 Merge Request를 생성한다.
9. 이하는 깃랩 사용방법과 동일하다.

## 브랜치 생성 컨벤션
- study_날짜_이름 (예시: study_0115_sungwook)

## 커밋 컨벤션
- add: 날짜 file upload

## 파일 컨벤션
- Day00_학습주제_날짜 (예시: Day01_TDD_0114)

## 하는 이유
해당 깃랩 프로젝트는 이번 공통 프로젝트의 메인 브랜치이므로 기존에 사용했던 방법인
각자 브랜치를 생성해서 각 브랜치에 업로드하는 방법은 개발자인 우리입장에서도 번거롭고,
학습자료를 확인하는 컨설턴트님 입장에서도 각 브랜치, 거기에 각 디렉토리에서 내용을 확인하셔야하기 때문에 번거로움이 있다.
그런 번거로움과 깔끔하게 프로젝트를 관리하기 위해 해당 방법을 사용하도록 한다.
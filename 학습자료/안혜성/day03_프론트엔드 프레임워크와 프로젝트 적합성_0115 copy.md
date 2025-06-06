# 📘 TIL: 오늘 배운 내용 (TIL) 2
## React 기반 (Next.js 포함) 프론트엔드 선택 과정

## 🚀 프로젝트 배경
퇴직자를 위한 재취업 및 사회 참여 플랫폼 개발 과정에서, 사용자 친화적인 UI/UX와 효율적인 프론트엔드 구조가 필수적이라는 결론에 도달했습니다. 특히, 다양한 기능(강의, 자서전 작성, 멘토링, 커뮤니티 등)을 제공하면서도 사용자 경험을 최적화하기 위해 React와 Next.js를 선택하게 되었습니다.

---

## 🧠 고민의 시작: 프레임워크와 라이브러리 선택 기준

### 1. **프로젝트 요구사항**
- 중·장년층 사용자 친화적 UI/UX
  - 큰 글씨, 명확한 색상 대비, 직관적인 인터페이스.
- 다양한 기능 통합
  - 강의 제작, 자서전 작성, 멘토링, 커뮤니티 기능 등.
- 확장성과 유지보수성
  - 앞으로 추가될 기능에도 유연하게 대응 가능해야 함.
- SEO 최적화
  - 퇴직자를 위한 정보 및 강의 검색 기능의 가시성 강화.

### 2. **고려했던 옵션**
| 프레임워크 | 장점 | 단점 |
|-------------|----------------|----------------|
| **React** | 컴포넌트 기반 설계, 대규모 생태계 | SEO 최적화를 위해 추가 설정 필요 |
| **Vue.js** | 간단한 문법, 빠른 학습 곡선 | 생태계가 React보다 작음 |
| **Angular** | 올인원 프레임워크, 강력한 구조 | 러닝 커브가 높고 초기 설정이 복잡 |

### 3. **최종 선택: React + Next.js**
- **React**: 유연성과 생태계의 강점으로 프로젝트의 핵심 요구사항을 충족.
- **Next.js**: 서버 사이드 렌더링(SSR)과 정적 사이트 생성(SSG) 지원으로 SEO 최적화 문제 해결.

---

## 🎨 사용 기술 스택

### 1. **프레임워크 및 라이브러리**
- **React**: UI 컴포넌트 설계를 위한 기본 프레임워크.
- **Next.js**: SEO 최적화, 정적/동적 렌더링 지원.
- **TypeScript**: 타입 안정성과 코드 유지보수성을 높이기 위해 사용.

### 2. **디자인 라이브러리**
- **Material-UI**:
  - 시니어 친화적인 디자인 요소 제공(큰 버튼, 접근성 강화).
  - 빠르고 일관된 UI 구현.
- **Chakra UI**:
  - 접근성과 커스터마이징 용이성 강화.

### 3. **상태 관리**
- **React Query**:
  - 비동기 상태 관리에 적합, 데이터 캐싱 및 동기화 간소화.
- **Redux Toolkit**:
  - 중앙 집중식 상태 관리로 복잡한 데이터 흐름 제어.

### 4. **차트 및 데이터 시각화**
- **Recharts**:
  - 사용자 친화적이고 직관적인 데이터 시각화를 위한 선택.

---

## 🛠️ 선택 근거

### **React + Next.js의 장점**
1. **SEO 최적화**:
   - Next.js의 서버 사이드 렌더링과 정적 사이트 생성 기능이 강의와 자서전 검색 가시성을 극대화.
2. **컴포넌트 재사용성**:
   - React 기반 컴포넌트 설계를 통해 다양한 기능을 모듈화.
3. **생태계 확장성**:
   - 다양한 라이브러리(Material-UI, React Query 등)를 쉽게 통합 가능.
4. **SSR과 SSG**:
   - 페이지별로 SSR 또는 SSG를 선택하여 성능 최적화 가능.

### **Material-UI와 Chakra UI**
- 중·장년층 사용자의 접근성을 고려한 디자인 구현.
- 기본 컴포넌트 제공으로 개발 속도 향상.

### **React Query와 Redux Toolkit**
- **React Query**:
  - 강의 목록, 커뮤니티 게시판 등 비동기 데이터 요청에 최적화.
- **Redux Toolkit**:
  - 사용자 프로필, 멘토링 매칭 데이터 등 중앙 상태 관리 필요 시 사용.

---

## 📈 개발 과정 중 배운 점
1. **SEO가 중요한 이유**:
   - 중장년층 사용자가 검색 엔진을 통해 서비스를 발견하는 경우가 많음.
2. **UI/UX에서의 접근성**:
   - 큰 글씨, 명확한 대비, 간결한 레이아웃이 사용자 만족도에 직접적인 영향을 미침.
3. **Next.js의 유연성**:
   - 프로젝트 요구사항에 따라 SSR과 SSG를 유연하게 활용 가능.

---

## 📌 앞으로의 과제
- **강의 업로드 및 자서전 작성 기능의 사용자 테스트**:
  - 시니어 사용자의 피드백을 반영해 UI를 개선.
- **커뮤니티 기능 강화**:
  - 지역 기반 연결 기능 개발.
- **SEO 최적화 지속 개선**:
  - 메타 태그와 사이트맵 설정 강화.

---

## 📂 폴더 구조 예시
```
📦 프로젝트 루트
├── 📂 pages
│   ├── index.tsx
│   ├── about.tsx
│   ├── lecture
│   │   └── [id].tsx
├── 📂 components
│   ├── Header.tsx
│   ├── Footer.tsx
│   └── LectureCard.tsx
├── 📂 styles
│   ├── global.css
│   └── theme.ts
├── 📂 utils
│   ├── api.ts
│   └── constants.ts
├── 📂 hooks
│   └── useFetch.ts
└── 📂 public
    └── assets
```

---

## 💡 결론
React와 Next.js는 퇴직자 대상 플랫폼의 요구사항(접근성, 확장성, SEO 최적화)에 적합한 선택이었습니다. 앞으로도 사용자 피드백을 반영하며 지속적으로 발전시킬 예정입니다.




# 💡 오늘 배운 내용 (TIL) 2

1. **React Query의 장점**:
   - API 요청과 비동기 데이터 관리를 간단히 처리할 수 있어 개발 속도를 높일 수 있음.
   - 캐싱, Window Focus Refetching, Optimistic Update 같은 UX 개선 기능이 강력함.

2. **Redux와 React Query의 비교**:
   - Redux는 복잡한 전역 상태 관리에 적합하지만, 비동기 데이터 관리를 위해서는 더 많은 설정과 코드가 필요.
   - React Query는 API 중심의 데이터 관리에 특화되어 있으며, 간결한 코드와 직관적인 사용법이 초보 개발자에게 유리.

3. **프로젝트에 적합한 기술 선택**:
   - 이 프로젝트는 **React Query**를 사용하여 API 요청과 서버 상태를 관리.
   - 필요 시 Redux를 보완적으로 사용해 전역 상태를 관리할 수도 있음.


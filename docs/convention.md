## 컨벤션

### 1. 커밋 메시지 컨벤션

커밋 메시지는 **프론트엔드 / 백엔드 구분 + 작업 타입 + 간략한 설명** 형식으로 작성한다.

### 형식

```
[BE/FE]{type}: {간략한 설명}

ex.[BE]feat: 로그인 구현
```

### 규칙

- `[BE]`, `[FE]` 중 하나를 반드시 포함한다.
- `{type}`은 아래 정의된 타입만 사용한다.
- 설명은 **명령형**, **간결하게** 작성한다.
- 마침표(`.`)는 사용하지 않는다.

### Type 목록

| 타입     | 설명                                       |
| -------- | ------------------------------------------ |
| feat     | 새로운 기능 추가                           |
| fix      | 버그 수정                                  |
| design   | CSS 등 사용자 UI 디자인 변경               |
| refactor | 코드 리팩토링                              |
| comment  | 주석 추가 및 수정                          |
| style    | 코드 로직에 영향 없는 변경 (포맷, 오타 등) |
| docs     | 문서 수정                                  |
| test     | 테스트 추가 또는 리팩토링                  |
| chore    | 빌드, 설정 파일, 패키지 관리               |
| rename   | 파일 또는 폴더명 변경                      |
| remove   | 파일 삭제                                  |

---

### 2. Git 브랜치 네이밍 컨벤션

브랜치는 작업 유형과 이슈 번호를 기준으로 생성한다.

### 형식

```
<type>/<issue-number>-<아주간략한설명>
```

### 예시

```
feat/12-signup
fix/34-login-error
refactor/56-auth-service
```

- `type`은 커밋 컨벤션의 타입을 따른다.
- 설명은 소문자, 하이픈() 사용을 권장한다.

---

### 3. Git 브랜치 전략 (Git Flow)

본 프로젝트는 **Git Flow** 전략을 따른다.

- `main` : 배포 브랜치
- `develop` : 개발 통합 브랜치
- `feat/*` : 기능 개발
- `fix/*` : 버그 수정

> Git Flow 참고 자료 |
> [https://inpa.tistory.com/entry/GIT-⚡️-github-flow-git-flow-📈-브랜치-전략](https://inpa.tistory.com/entry/GIT-%E2%9A%A1%EF%B8%8F-github-flow-git-flow-%F0%9F%93%88-%EB%B8%8C%EB%9E%9C%EC%B9%98-%EC%A0%84%EB%9E%B5)

---

### 4. 코딩 컨벤션

백엔드(Java) 코딩 컨벤션은

**네이버 캠퍼스 핵데이 Java 코딩 컨벤션**을 따른다.

> https://naver.github.io/hackday-conventions-java/

프론트엔드는 각 프레임워크의 기본 스타일 가이드를 따른다.

---

### 5. 응답 메시지 컨벤션

API 응답 메시지는 **프로젝트 공통 가이드**를 따른다.

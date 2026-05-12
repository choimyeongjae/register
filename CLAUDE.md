# 회원가입 프론트+백엔드

JavaScript 회원가입 서비스. 프론트는 Vanilla JS, 백엔드는 Node.js + Express + SQLite.

## 학습 포커스
- **프론트** — DOM 조작, 이벤트 핸들링, 정규표현식, `input type="password"`
- **백엔드** — Express 라우터/미들웨어, node:sqlite, bcrypt 해싱, CORS

## 파일 구조
```
register-form/
├── index.html                   # 회원가입 화면 + 성공 화면 (두 section)
├── style.css                    # 폼/에러 스타일, .hidden 유틸
├── script.js                    # 검증 로직, 이벤트 핸들러, 화면 전환
├── package.json                 # type: module, 의존성 (express, bcrypt, cors)
├── server/
│   ├── index.js                 # 서버 진입점 (포트 3000 listen)
│   ├── app.js                   # Express 앱 설정 (미들웨어, 라우터 마운트)
│   ├── db.js                    # node:sqlite 연결 + users 테이블 초기화
│   ├── routes/
│   │   └── auth.js              # POST /api/auth/register
│   └── middleware/
│       └── validate.js          # 이메일·비밀번호 형식 검증 미들웨어
└── data/
    └── users.db                 # SQLite DB 파일 (자동 생성)
```

## 회원가입 API 플로우

```
POST /api/auth/register  { email, password }
  │
  ├─ validate.js  →  형식 오류 시 400
  ├─ SELECT email  →  중복 시 409
  ├─ bcrypt.hash(password, 10)
  ├─ INSERT users
  └─ 201 { message: "가입 완료", email }
```

## DB 스키마
```sql
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

## 검증 규칙 (프론트·백 동일 정규식)

| 필드 | 정규표현식 | 에러 메시지 |
|------|-----------|------------|
| 이메일 | `/^[^\s@]+@[^\s@]+\.[^\s@]+$/` | "올바른 이메일 형식이 아닙니다" |
| 비밀번호 | `/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*]{8,}$/` | "비밀번호는 영문+숫자 포함 8자 이상이어야 합니다" |
| 비밀번호 확인 | `pw === pwConfirm` | "비밀번호가 일치하지 않습니다" |

## 실행 방법
```bash
# 백엔드 (포트 3000)
cd ~/register-form && node server/index.js

# 프론트 (포트 8000, 별도 터미널)
cd ~/register-form && python3 -m http.server 8000
```

## API 테스트 (curl)
```bash
# 정상 가입
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"pass1234"}'
# → 201 { "message": "가입 완료", "email": "test@example.com" }

# 이메일 중복
# → 409 { "error": "이미 사용 중인 이메일입니다" }

# 형식 오류
# → 400 { "error": "..." }
```

## 프론트 테스트 케이스
- 빈 값 제출 → 세 필드 모두 에러
- `abc` → 이메일 형식 에러
- `abc12` → 비밀번호 길이/형식 에러
- 비밀번호 ≠ 비밀번호 확인 → 확인 필드 에러
- `test@example.com` / `pass1234` 정상 → 성공 화면 전환
- "처음으로" 클릭 → 폼 리셋 후 복귀

## 기술 메모
- Node.js v26 기준 `better-sqlite3` 미지원 → `node:sqlite` (Node.js 내장) 사용
- ES Module (`"type": "module"`) 사용 중 — `require()` 불가, `import` 사용

## 다음 단계
- 프론트 fetch 연동 — `script.js`의 `showSuccessScreen()` 호출을 `fetch('/api/auth/register')` 응답 기반으로 교체
- 로그인 API — `POST /api/auth/login` + JWT 발급
- 로그인 상태 관리 — JWT 저장 (localStorage) + 보호된 라우트
- 소셜 로그인 (OAuth)

# 회원가입 서비스

Vanilla JS + Node.js/Express + Supabase(Postgres)로 구현한 회원가입 프로젝트.

## 배포 URL

https://register-form-ib11.onrender.com

## 로컬 실행

```bash
# 1. 의존성 설치
npm install

# 2. .env 파일 생성 (.env.example 참고)
cp .env.example .env
# .env 파일을 열어 DATABASE_URL에 Supabase connection string 입력

# 3. 서버 실행
npm start
# → http://localhost:3000 접속
```

## 기술 스택

- **프론트**: Vanilla JS, HTML/CSS
- **백엔드**: Node.js, Express
- **DB**: Supabase (Postgres)
- **보안**: bcrypt 비밀번호 해싱

## 알려진 한계

- **Render 콜드 스타트**: 15분 이상 요청이 없으면 서버가 슬립 상태로 진입합니다. 첫 접속 시 약 30초 대기가 발생할 수 있습니다.
- **Supabase 슬립**: 7일 이상 활동이 없으면 DB 프로젝트가 일시정지됩니다. Supabase 대시보드에서 1클릭으로 재활성화할 수 있습니다.

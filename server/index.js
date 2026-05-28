import express from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { pool } from './db.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(join(__dirname, '..')));

// 검증 정규식 (프론트와 동일)
const USERNAME_REGEX = /^[a-zA-Z0-9_]{4,20}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*]{8,}$/;

// 회원가입
app.post('/api/auth/register', async (req, res) => {
  const { username, email, password } = req.body;

  // 1) 형식 검증
  if (!username || !USERNAME_REGEX.test(username)) {
    return res.status(400).json({ error: '아이디는 영문/숫자/_ 4~20자여야 합니다' });
  }
  if (!email || !EMAIL_REGEX.test(email)) {
    return res.status(400).json({ error: '올바른 이메일 형식이 아닙니다' });
  }
  if (!password || !PASSWORD_REGEX.test(password)) {
    return res.status(400).json({ error: '비밀번호는 영문+숫자 포함 8자 이상이어야 합니다' });
  }

  // 2) 아이디 중복 체크
  const { rows: usernameRows } = await pool.query(
    'SELECT id FROM users WHERE username = $1', [username]
  );
  if (usernameRows[0]) {
    return res.status(409).json({ error: '이미 사용 중인 아이디입니다', field: 'username' });
  }

  // 3) 이메일 중복 체크
  const { rows: emailRows } = await pool.query(
    'SELECT id FROM users WHERE email = $1', [email]
  );
  if (emailRows[0]) {
    return res.status(409).json({ error: '이미 사용 중인 이메일입니다', field: 'email' });
  }

  // 4) 비밀번호 해싱 + DB 저장
  const hashed = await bcrypt.hash(password, 10);
  await pool.query(
    'INSERT INTO users (username, email, password) VALUES ($1, $2, $3)',
    [username, email, hashed]
  );

  res.status(201).json({ message: '가입 완료', username, email });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`서버 실행 중: http://localhost:${PORT}`);
});

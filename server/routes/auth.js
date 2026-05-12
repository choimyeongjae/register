import { Router } from 'express';
import bcrypt from 'bcrypt';
import { pool } from '../db.js';
import { validateRegister } from '../middleware/validate.js';

const router = Router();

router.post('/register', validateRegister, async (req, res) => {
  const { username, email, password } = req.body;

  const { rows: usernameRows } = await pool.query(
    'SELECT id FROM users WHERE username = $1', [username]
  );
  if (usernameRows[0]) {
    return res.status(409).json({ error: '이미 사용 중인 아이디입니다', field: 'username' });
  }

  const { rows: emailRows } = await pool.query(
    'SELECT id FROM users WHERE email = $1', [email]
  );
  if (emailRows[0]) {
    return res.status(409).json({ error: '이미 사용 중인 이메일입니다', field: 'email' });
  }

  const hashed = await bcrypt.hash(password, 10);
  await pool.query(
    'INSERT INTO users (username, email, password) VALUES ($1, $2, $3)',
    [username, email, hashed]
  );

  res.status(201).json({ message: '가입 완료', username, email });
});

export default router;

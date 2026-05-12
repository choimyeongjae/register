const USERNAME_REGEX = /^[a-zA-Z0-9_]{4,20}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*]{8,}$/;

export function validateRegister(req, res, next) {
  const { username, email, password } = req.body;

  if (!username || !USERNAME_REGEX.test(username)) {
    return res.status(400).json({ error: '아이디는 영문/숫자/_ 4~20자여야 합니다' });
  }

  if (!email || !EMAIL_REGEX.test(email)) {
    return res.status(400).json({ error: '올바른 이메일 형식이 아닙니다' });
  }

  if (!password || !PASSWORD_REGEX.test(password)) {
    return res.status(400).json({ error: '비밀번호는 영문+숫자 포함 8자 이상이어야 합니다' });
  }

  next();
}

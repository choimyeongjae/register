const form = document.querySelector('#register-form');
const usernameInput = document.querySelector('#username');
const emailInput = document.querySelector('#email');
const pwInput = document.querySelector('#password');
const pwConfirmInput = document.querySelector('#password-confirm');

const registerSection = document.querySelector('#register-section');
const successSection = document.querySelector('#success-section');
const registeredUsername = document.querySelector('#registered-username');
const registeredEmail = document.querySelector('#registered-email');
const backBtn = document.querySelector('#back-btn');

const USERNAME_REGEX = /^[a-zA-Z0-9_]{4,20}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*]{8,}$/;

function validateUsername(value) {
  if (!value) return { valid: false, message: '아이디를 입력해주세요' };
  if (!USERNAME_REGEX.test(value)) return { valid: false, message: '아이디는 영문/숫자/_ 4~20자여야 합니다' };
  return { valid: true, message: '' };
}

function validateEmail(value) {
  if (!value) return { valid: false, message: '이메일을 입력해주세요' };
  if (!EMAIL_REGEX.test(value)) return { valid: false, message: '올바른 이메일 형식이 아닙니다' };
  return { valid: true, message: '' };
}

function validatePassword(value) {
  if (!value) return { valid: false, message: '비밀번호를 입력해주세요' };
  if (!PASSWORD_REGEX.test(value)) {
    return { valid: false, message: '비밀번호는 영문+숫자 포함 8자 이상이어야 합니다' };
  }
  return { valid: true, message: '' };
}

function validatePasswordConfirm(pw, pwConfirm) {
  if (!pwConfirm) return { valid: false, message: '비밀번호 확인을 입력해주세요' };
  if (pw !== pwConfirm) return { valid: false, message: '비밀번호가 일치하지 않습니다' };
  return { valid: true, message: '' };
}

function showError(input, message) {
  const errorEl = document.querySelector(`.error-msg[data-for="${input.id}"]`);
  errorEl.textContent = message;
  if (message) {
    input.classList.add('invalid');
  } else {
    input.classList.remove('invalid');
  }
}

usernameInput.addEventListener('input', () => {
  const { message } = validateUsername(usernameInput.value.trim());
  showError(usernameInput, message);
});

emailInput.addEventListener('input', () => {
  const { message } = validateEmail(emailInput.value.trim());
  showError(emailInput, message);
});

pwInput.addEventListener('input', () => {
  const { message } = validatePassword(pwInput.value);
  showError(pwInput, message);
  if (pwConfirmInput.value) {
    const { message: confirmMsg } = validatePasswordConfirm(pwInput.value, pwConfirmInput.value);
    showError(pwConfirmInput, confirmMsg);
  }
});

pwConfirmInput.addEventListener('input', () => {
  const { message } = validatePasswordConfirm(pwInput.value, pwConfirmInput.value);
  showError(pwConfirmInput, message);
});

const submitBtn = form.querySelector('.submit-btn');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const username = usernameInput.value.trim();
  const email = emailInput.value.trim();
  const pw = pwInput.value;
  const pwConfirm = pwConfirmInput.value;

  const usernameResult = validateUsername(username);
  const emailResult = validateEmail(email);
  const pwResult = validatePassword(pw);
  const pwConfirmResult = validatePasswordConfirm(pw, pwConfirm);

  showError(usernameInput, usernameResult.message);
  showError(emailInput, emailResult.message);
  showError(pwInput, pwResult.message);
  showError(pwConfirmInput, pwConfirmResult.message);

  if (!usernameResult.valid || !emailResult.valid || !pwResult.valid || !pwConfirmResult.valid) return;

  submitBtn.disabled = true;
  submitBtn.textContent = '처리 중...';

  try {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password: pw }),
    });

    const data = await res.json();

    if (res.ok) {
      showSuccessScreen(username, email);
    } else if (res.status === 409) {
      const target = data.field === 'username' ? usernameInput : emailInput;
      showError(target, data.error);
    } else {
      showError(emailInput, data.error || '서버 오류가 발생했습니다');
    }
  } catch {
    showError(emailInput, '서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요');
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = '가입하기';
  }
});

function showSuccessScreen(username, email) {
  registeredUsername.textContent = username;
  registeredEmail.textContent = email;
  registerSection.classList.add('hidden');
  successSection.classList.remove('hidden');
}

backBtn.addEventListener('click', () => {
  form.reset();
  [usernameInput, emailInput, pwInput, pwConfirmInput].forEach((input) => {
    showError(input, '');
  });
  successSection.classList.add('hidden');
  registerSection.classList.remove('hidden');
});

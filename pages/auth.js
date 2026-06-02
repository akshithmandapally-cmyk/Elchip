/* ─── pages/auth.js — Authentication Page ─────────────────────────────────
   Security: 
   - No innerHTML for user data
   - Simple, robust math CAPTCHA
   - LocalStorage for account storage and login status
   - Password strength validation: >= 6 characters, at least 1 special char
   ────────────────────────────────────────────────────────────────────────── */

window.renderAuth = function(container) {
  const frag = document.createDocumentFragment();

  // Root wrapper
  const wrapper = document.createElement('main');
  wrapper.style.cssText = 'min-height:90vh; display:flex; align-items:center; justify-content:center; padding:4rem 1.5rem;';

  const card = document.createElement('div');
  card.className = 'glass-card auth-card';
  card.style.cssText = 'width:100%; max-width:440px; border-radius:24px; padding:2.5rem 2rem; position:relative;';

  // Toggle Tabs Header
  const tabHeader = document.createElement('div');
  tabHeader.style.cssText = 'display:flex; border-bottom:1px solid rgba(255,255,255,0.08); margin-bottom:2rem; gap:1.5rem;';

  const tabSignIn = document.createElement('button');
  tabSignIn.className = 'auth-tab active';
  tabSignIn.style.cssText = 'background:none; border:none; color:#fff; font-family:var(--mono); font-size:0.85rem; letter-spacing:0.1em; text-transform:uppercase; padding-bottom:0.75rem; cursor:pointer; border-bottom:2px solid #fff; font-weight:700; transition:all 0.3s ease;';
  tabSignIn.textContent = 'Sign In';

  const tabSignUp = document.createElement('button');
  tabSignUp.className = 'auth-tab';
  tabSignUp.style.cssText = 'background:none; border:none; color:rgba(255,255,255,0.4); font-family:var(--mono); font-size:0.85rem; letter-spacing:0.1em; text-transform:uppercase; padding-bottom:0.75rem; cursor:pointer; border-bottom:2px solid transparent; font-weight:700; transition:all 0.3s ease;';
  tabSignUp.textContent = 'Sign Up';

  tabHeader.append(tabSignIn, tabSignUp);
  card.appendChild(tabHeader);

  // Status/Toast notification inside the card
  const toast = document.createElement('div');
  toast.style.cssText = 'margin-bottom:1.5rem; padding:0.75rem 1rem; border-radius:8px; font-size:0.82rem; display:none; line-height:1.5;';
  card.appendChild(toast);

  function showMessage(msg, isSuccess = false) {
    toast.textContent = msg;
    toast.style.display = 'block';
    if (isSuccess) {
      toast.style.background = 'rgba(34,197,94,0.1)';
      toast.style.border = '1px solid rgba(34,197,94,0.2)';
      toast.style.color = '#86efac';
    } else {
      toast.style.background = 'rgba(239,68,68,0.1)';
      toast.style.border = '1px solid rgba(239,68,68,0.2)';
      toast.style.color = '#fca5a5';
    }
  }

  function hideMessage() {
    toast.style.display = 'none';
  }

  // ─── CAPTCHA STATE ───────────────────────────────────────────────────
  let currentCaptcha = { num1: 0, num2: 0, sum: 0 };

  function generateCaptcha(labelEl) {
    currentCaptcha.num1 = Math.floor(Math.random() * 9) + 1;
    currentCaptcha.num2 = Math.floor(Math.random() * 9) + 1;
    currentCaptcha.sum = currentCaptcha.num1 + currentCaptcha.num2;
    labelEl.textContent = `Security check: ${currentCaptcha.num1} + ${currentCaptcha.num2} = ?`;
  }

  // ─── SIGN IN CONTAINER ───────────────────────────────────────────────
  const signInForm = document.createElement('div');
  signInForm.style.display = 'flex';
  signInForm.style.flexDirection = 'column';
  signInForm.style.gap = '1.25rem';

  // Email Field
  const siEmailGroup = document.createElement('div');
  siEmailGroup.style.cssText = 'display:flex; flex-direction:column; gap:0.5rem;';
  const siEmailLabel = document.createElement('label');
  siEmailLabel.style.cssText = 'font-size:0.75rem; color:rgba(255,255,255,0.4); text-transform:uppercase; font-family:var(--mono); letter-spacing:0.05em;';
  siEmailLabel.textContent = 'Email Address';
  const siEmailInput = document.createElement('input');
  siEmailInput.type = 'email';
  siEmailInput.placeholder = 'yourname@example.com';
  siEmailInput.style.cssText = 'background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.12); border-radius:8px; padding:0.75rem 1rem; color:#fff; font-size:0.85rem; outline:none; transition:border 0.3s;';
  siEmailInput.addEventListener('focus', () => siEmailInput.style.borderColor = 'rgba(255,255,255,0.4)');
  siEmailInput.addEventListener('blur', () => siEmailInput.style.borderColor = 'rgba(255,255,255,0.12)');
  siEmailGroup.append(siEmailLabel, siEmailInput);

  // Password Field
  const siPassGroup = document.createElement('div');
  siPassGroup.style.cssText = 'display:flex; flex-direction:column; gap:0.5rem;';
  const siPassLabel = document.createElement('label');
  siPassLabel.style.cssText = 'font-size:0.75rem; color:rgba(255,255,255,0.4); text-transform:uppercase; font-family:var(--mono); letter-spacing:0.05em;';
  siPassLabel.textContent = 'Password';
  const siPassInput = document.createElement('input');
  siPassInput.type = 'password';
  siPassInput.placeholder = '••••••••';
  siPassInput.style.cssText = 'background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.12); border-radius:8px; padding:0.75rem 1rem; color:#fff; font-size:0.85rem; outline:none; transition:border 0.3s;';
  siPassInput.addEventListener('focus', () => siPassInput.style.borderColor = 'rgba(255,255,255,0.4)');
  siPassInput.addEventListener('blur', () => siPassInput.style.borderColor = 'rgba(255,255,255,0.12)');
  siPassGroup.append(siPassLabel, siPassInput);

  // Captcha Field
  const siCapGroup = document.createElement('div');
  siCapGroup.style.cssText = 'display:flex; flex-direction:column; gap:0.5rem;';
  const siCapLabel = document.createElement('label');
  siCapLabel.style.cssText = 'font-size:0.75rem; color:rgba(255,255,255,0.4); text-transform:uppercase; font-family:var(--mono); letter-spacing:0.05em;';
  const siCapRow = document.createElement('div');
  siCapRow.style.cssText = 'display:flex; gap:0.75rem; align-items:center;';
  const siCapInput = document.createElement('input');
  siCapInput.type = 'text';
  siCapInput.placeholder = 'Answer';
  siCapInput.style.cssText = 'background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.12); border-radius:8px; padding:0.75rem 1rem; color:#fff; font-size:0.85rem; outline:none; width:120px; text-align:center;';
  const siCapRefresh = document.createElement('button');
  siCapRefresh.style.cssText = 'background:none; border:none; color:rgba(255,255,255,0.4); font-size:1.1rem; cursor:pointer;';
  siCapRefresh.textContent = '🔄';
  siCapRefresh.title = 'Refresh Captcha';
  siCapRefresh.addEventListener('click', () => generateCaptcha(siCapLabel));
  siCapRow.append(siCapInput, siCapRefresh);
  siCapGroup.append(siCapLabel, siCapRow);

  // Submit Button
  const siSubmit = document.createElement('button');
  siSubmit.className = 'btn btn-primary';
  siSubmit.style.cssText = 'justify-content:center; padding:0.85rem; font-family:var(--mono); text-transform:uppercase; letter-spacing:0.05em; font-size:0.82rem; margin-top:0.5rem;';
  siSubmit.textContent = 'Sign In';

  siSubmit.addEventListener('click', () => {
    hideMessage();
    const email = siEmailInput.value.trim();
    const password = siPassInput.value;
    const capAns = siCapInput.value.trim();

    if (!email) {
      showMessage('Please enter your email.');
      return;
    }
    if (!password) {
      showMessage('Please enter your password.');
      return;
    }
    if (!capAns || parseInt(capAns, 10) !== currentCaptcha.sum) {
      showMessage('Incorrect CAPTCHA answer. Try again.');
      generateCaptcha(siCapLabel);
      siCapInput.value = '';
      return;
    }

    // Verify user in registered storage
    const users = JSON.parse(localStorage.getItem('elchip_registered_users') || '[]');
    const matchedUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!matchedUser) {
      showMessage('No account found with this email. Please Sign Up first.');
      return;
    }

    if (matchedUser.password !== password) {
      showMessage('Incorrect password. Please try again.');
      return;
    }

    // Log user in
    localStorage.setItem('elchip_user', JSON.stringify({
      email: matchedUser.email,
      firstName: matchedUser.firstName
    }));
    
    showMessage(`Welcome back, ${matchedUser.firstName}! Logging in...`, true);
    
    // Update navbar immediately and redirect
    if (typeof window.rebuildNavUI === 'function') {
      window.rebuildNavUI();
    }
    
    setTimeout(() => {
      window.location.hash = '#/companies';
    }, 1000);
  });

  signInForm.append(siEmailGroup, siPassGroup, siCapGroup, siSubmit);
  card.appendChild(signInForm);

  // ─── SIGN UP CONTAINER (Initially Hidden) ───────────────────────────
  const signUpForm = document.createElement('div');
  signUpForm.style.display = 'none';
  signUpForm.style.flexDirection = 'column';
  signUpForm.style.gap = '1.25rem';

  // First Name Field
  const suNameGroup = document.createElement('div');
  suNameGroup.style.cssText = 'display:flex; flex-direction:column; gap:0.5rem;';
  const suNameLabel = document.createElement('label');
  suNameLabel.style.cssText = 'font-size:0.75rem; color:rgba(255,255,255,0.4); text-transform:uppercase; font-family:var(--mono); letter-spacing:0.05em;';
  suNameLabel.textContent = 'First Name';
  const suNameInput = document.createElement('input');
  suNameInput.type = 'text';
  suNameInput.placeholder = 'Alex';
  suNameInput.style.cssText = 'background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.12); border-radius:8px; padding:0.75rem 1rem; color:#fff; font-size:0.85rem; outline:none; transition:border 0.3s;';
  suNameInput.addEventListener('focus', () => suNameInput.style.borderColor = 'rgba(255,255,255,0.4)');
  suNameInput.addEventListener('blur', () => suNameInput.style.borderColor = 'rgba(255,255,255,0.12)');
  suNameGroup.append(suNameLabel, suNameInput);

  // Email Field
  const suEmailGroup = document.createElement('div');
  suEmailGroup.style.cssText = 'display:flex; flex-direction:column; gap:0.5rem;';
  const suEmailLabel = document.createElement('label');
  suEmailLabel.style.cssText = 'font-size:0.75rem; color:rgba(255,255,255,0.4); text-transform:uppercase; font-family:var(--mono); letter-spacing:0.05em;';
  suEmailLabel.textContent = 'Email Address';
  const suEmailInput = document.createElement('input');
  suEmailInput.type = 'email';
  suEmailInput.placeholder = 'yourname@example.com';
  suEmailInput.style.cssText = 'background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.12); border-radius:8px; padding:0.75rem 1rem; color:#fff; font-size:0.85rem; outline:none; transition:border 0.3s;';
  suEmailInput.addEventListener('focus', () => suEmailInput.style.borderColor = 'rgba(255,255,255,0.4)');
  suEmailInput.addEventListener('blur', () => suEmailInput.style.borderColor = 'rgba(255,255,255,0.12)');
  suEmailGroup.append(suEmailLabel, suEmailInput);

  // Password Field
  const suPassGroup = document.createElement('div');
  suPassGroup.style.cssText = 'display:flex; flex-direction:column; gap:0.5rem;';
  const suPassLabel = document.createElement('label');
  suPassLabel.style.cssText = 'font-size:0.75rem; color:rgba(255,255,255,0.4); text-transform:uppercase; font-family:var(--mono); letter-spacing:0.05em;';
  suPassLabel.textContent = 'Password';
  const suPassInput = document.createElement('input');
  suPassInput.type = 'password';
  suPassInput.placeholder = 'At least 6 characters & 1 special character';
  suPassInput.style.cssText = 'background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.12); border-radius:8px; padding:0.75rem 1rem; color:#fff; font-size:0.85rem; outline:none; transition:border 0.3s;';
  suPassInput.addEventListener('focus', () => suPassInput.style.borderColor = 'rgba(255,255,255,0.4)');
  suPassInput.addEventListener('blur', () => suPassInput.style.borderColor = 'rgba(255,255,255,0.12)');
  suPassGroup.append(suPassLabel, suPassInput);

  // Confirm Password Field
  const suConfGroup = document.createElement('div');
  suConfGroup.style.cssText = 'display:flex; flex-direction:column; gap:0.5rem;';
  const suConfLabel = document.createElement('label');
  suConfLabel.style.cssText = 'font-size:0.75rem; color:rgba(255,255,255,0.4); text-transform:uppercase; font-family:var(--mono); letter-spacing:0.05em;';
  suConfLabel.textContent = 'Confirm Password';
  const suConfInput = document.createElement('input');
  suConfInput.type = 'password';
  suConfInput.placeholder = 'Confirm your password';
  suConfInput.style.cssText = 'background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.12); border-radius:8px; padding:0.75rem 1rem; color:#fff; font-size:0.85rem; outline:none; transition:border 0.3s;';
  suConfInput.addEventListener('focus', () => suConfInput.style.borderColor = 'rgba(255,255,255,0.4)');
  suConfInput.addEventListener('blur', () => suConfInput.style.borderColor = 'rgba(255,255,255,0.12)');
  suConfGroup.append(suConfLabel, suConfInput);

  // Captcha Field
  const suCapGroup = document.createElement('div');
  suCapGroup.style.cssText = 'display:flex; flex-direction:column; gap:0.5rem;';
  const suCapLabel = document.createElement('label');
  suCapLabel.style.cssText = 'font-size:0.75rem; color:rgba(255,255,255,0.4); text-transform:uppercase; font-family:var(--mono); letter-spacing:0.05em;';
  const suCapRow = document.createElement('div');
  suCapRow.style.cssText = 'display:flex; gap:0.75rem; align-items:center;';
  const suCapInput = document.createElement('input');
  suCapInput.type = 'text';
  suCapInput.placeholder = 'Answer';
  suCapInput.style.cssText = 'background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.12); border-radius:8px; padding:0.75rem 1rem; color:#fff; font-size:0.85rem; outline:none; width:120px; text-align:center;';
  const suCapRefresh = document.createElement('button');
  suCapRefresh.style.cssText = 'background:none; border:none; color:rgba(255,255,255,0.4); font-size:1.1rem; cursor:pointer;';
  suCapRefresh.textContent = '🔄';
  suCapRefresh.title = 'Refresh Captcha';
  suCapRefresh.addEventListener('click', () => generateCaptcha(suCapLabel));
  suCapRow.append(suCapInput, suCapRefresh);
  suCapGroup.append(suCapLabel, suCapRow);

  // Send OTP Action
  const suSendBtn = document.createElement('button');
  suSendBtn.className = 'btn btn-primary';
  suSendBtn.style.cssText = 'justify-content:center; padding:0.85rem; font-family:var(--mono); text-transform:uppercase; letter-spacing:0.05em; font-size:0.82rem; margin-top:0.5rem;';
  suSendBtn.textContent = 'Send OTP';

  // OTP Validation Section (Initially Hidden)
  const otpContainer = document.createElement('div');
  otpContainer.style.cssText = 'display:none; flex-direction:column; gap:1rem; border-top:1px solid rgba(255,255,255,0.08); padding-top:1.25rem; margin-top:0.5rem;';

  const otpGroup = document.createElement('div');
  otpGroup.style.cssText = 'display:flex; flex-direction:column; gap:0.5rem;';
  const otpLabel = document.createElement('label');
  otpLabel.style.cssText = 'font-size:0.75rem; color:rgba(255,255,255,0.4); text-transform:uppercase; font-family:var(--mono); letter-spacing:0.05em;';
  otpLabel.textContent = 'Enter Verification OTP';
  const otpInput = document.createElement('input');
  otpInput.type = 'text';
  otpInput.placeholder = '6-Digit Code';
  otpInput.maxLength = 6;
  otpInput.style.cssText = 'background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.12); border-radius:8px; padding:0.75rem 1rem; color:#fff; font-size:1.1rem; font-weight:700; outline:none; text-align:center; letter-spacing:0.25em;';
  otpGroup.append(otpLabel, otpInput);

  const otpVerifyBtn = document.createElement('button');
  otpVerifyBtn.className = 'btn btn-ghost';
  otpVerifyBtn.style.cssText = 'justify-content:center; padding:0.85rem; font-family:var(--mono); text-transform:uppercase; letter-spacing:0.05em; font-size:0.82rem;';
  otpVerifyBtn.textContent = 'Verify & Create Account';

  otpContainer.append(otpGroup, otpVerifyBtn);

  // States
  let generatedOtp = '';
  let tempUserData = {};

  // Action Send OTP
  suSendBtn.addEventListener('click', async () => {
    hideMessage();
    const name = suNameInput.value.trim();
    const email = suEmailInput.value.trim();
    const password = suPassInput.value;
    const confirmPassword = suConfInput.value;
    const capAns = suCapInput.value.trim();

    if (!name) {
      showMessage('Please enter your first name.');
      return;
    }
    if (!email) {
      showMessage('Please enter your email.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showMessage('Please enter a valid email address.');
      return;
    }
    
    // Password strength rules: length >= 6, contains at least one special character
    const specialCharRegex = /[^A-Za-z0-9]/;
    if (password.length < 6) {
      showMessage('Password must be at least 6 characters long.');
      return;
    }
    if (!specialCharRegex.test(password)) {
      showMessage('Password must contain at least one special character (e.g. @, $, !, %, etc.).');
      return;
    }
    if (password !== confirmPassword) {
      showMessage('Passwords do not match.');
      return;
    }

    if (!capAns || parseInt(capAns, 10) !== currentCaptcha.sum) {
      showMessage('Incorrect CAPTCHA answer. Try again.');
      generateCaptcha(suCapLabel);
      suCapInput.value = '';
      return;
    }

    // Generate random 6-digit OTP
    generatedOtp = String(Math.floor(100000 + Math.random() * 900000));
    tempUserData = { email, firstName: name, password };

    suSendBtn.disabled = true;
    suSendBtn.textContent = 'Sending OTP...';

    try {
      const response = await fetch('/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, firstName: name, otp: generatedOtp })
      });

      suSendBtn.style.display = 'none';
      otpContainer.style.display = 'flex';

      if (response.ok) {
        showMessage('Verification OTP sent successfully! Please check your email inbox.', true);
      } else {
        // Fallback info message
        showMessage('Registration verification OTP generated. Please check your inbox.', true);
      }
    } catch (e) {
      suSendBtn.style.display = 'none';
      otpContainer.style.display = 'flex';
      showMessage('OTP generated. Verify connection to receive email, or check locally.', true);
    }
  });

  // Verify and complete signup
  otpVerifyBtn.addEventListener('click', () => {
    hideMessage();
    const entered = otpInput.value.trim();

    if (!entered) {
      showMessage('Please enter the 6-digit OTP code.');
      return;
    }
    if (entered !== generatedOtp) {
      showMessage('Invalid OTP code. Please check and try again.');
      return;
    }

    // Save user to registered users array in localStorage
    const users = JSON.parse(localStorage.getItem('elchip_registered_users') || '[]');
    if (users.some(u => u.email.toLowerCase() === tempUserData.email.toLowerCase())) {
      showMessage('An account with this email already exists. Switching to Sign In...');
      setTimeout(() => switchToTab('signin'), 1500);
      return;
    }

    users.push(tempUserData);
    localStorage.setItem('elchip_registered_users', JSON.stringify(users));

    showMessage('Account created successfully! Redirecting you to Sign In...', true);
    
    // Clear registration fields
    suNameInput.value = '';
    suEmailInput.value = '';
    suPassInput.value = '';
    suConfInput.value = '';
    suCapInput.value = '';
    otpInput.value = '';

    setTimeout(() => {
      switchToTab('signin');
      siEmailInput.value = tempUserData.email;
      siPassInput.focus();
    }, 1500);
  });

  signUpForm.append(suNameGroup, suEmailGroup, suPassGroup, suConfGroup, suCapGroup, suSendBtn, otpContainer);
  card.appendChild(signUpForm);

  // ─── TABS SWITCHING LOGIC ───────────────────────────────────────────
  function switchToTab(tab) {
    hideMessage();
    if (tab === 'signin') {
      tabSignIn.style.color = '#fff';
      tabSignIn.style.borderBottomColor = '#fff';
      tabSignUp.style.color = 'rgba(255,255,255,0.4)';
      tabSignUp.style.borderBottomColor = 'transparent';
      signInForm.style.display = 'flex';
      signUpForm.style.display = 'none';
      generateCaptcha(siCapLabel);
      siCapInput.value = '';
      siPassInput.value = '';
    } else {
      tabSignUp.style.color = '#fff';
      tabSignUp.style.borderBottomColor = '#fff';
      tabSignIn.style.color = 'rgba(255,255,255,0.4)';
      tabSignIn.style.borderBottomColor = 'transparent';
      signUpForm.style.display = 'flex';
      signInForm.style.display = 'none';
      
      // Reset Sign Up OTP elements
      suSendBtn.style.display = 'inline-flex';
      suSendBtn.disabled = false;
      suSendBtn.textContent = 'Send OTP';
      otpContainer.style.display = 'none';
      generateCaptcha(suCapLabel);
      suCapInput.value = '';
      suPassInput.value = '';
      suConfInput.value = '';
    }
  }

  tabSignIn.addEventListener('click', () => switchToTab('signin'));
  tabSignUp.addEventListener('click', () => switchToTab('signup'));

  // Init CAPTCHA on start
  generateCaptcha(siCapLabel);

  wrapper.appendChild(card);
  frag.appendChild(wrapper);
  frag.appendChild(window._buildFooter());
  container.appendChild(frag);
};

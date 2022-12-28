'use strict'

const settingsArray = [
  { settingName: 'upperCaseAllowed', value: false },
  { settingName: 'numbersAllowed', value: false },
  { settingName: 'symbolsAllowed', value: false }];

const slider = document.querySelector('.password-length-slider');
const passwordLengthIndicator = document.querySelector('.password-length-indicator');
const clipboardIcon = document.querySelector('.clipboard-icon');
const checkboxButtons = document.querySelectorAll('.settings-checkbox');

for (let i = 0; i < checkboxButtons.length; i++) {
  checkboxButtons[i].addEventListener('change', () => {
    settingsArray[i].value = !settingsArray[i].value;
  });
};

slider.addEventListener('change', () => {
  passwordLengthIndicator.innerHTML = slider.value;
});

function createRegex() {
  let settings = settingsArray.map(item => item.value);
  let result = [];
  let regExp = '[a-z';

  for (let i = 0; i < settings.length; i++) {
    if (settings[i] === true) {
      result.push(i);
    }
  };

  for (let j = 0; j < result.length; j++) {
    if (result[j] === 0) {
      regExp += 'A-Z'
    }
    else if (result[j] === 1) {
      regExp += '0-9'
    }
    else if (result[j] === 2) {
      regExp += '#$@_'
    }
  }
  return regExp + '\]*';
};

function setPasswordStrength() {
  const checkboxs = document.querySelectorAll('.settings-checkbox:checked');
  const strengthIndicators = document.querySelectorAll('.strength-indicator');

  for (let indicator of strengthIndicators) {
    indicator.style.backgroundColor = 'transparent';
  }

  if (slider.value >= 12 && checkboxs.length >= 3) {
    for (let indicator of strengthIndicators) {
      indicator.style.backgroundColor = 'var(--neon-green)';
    }
  }
  else if (slider.value <= 12 && slider.value >= 9 && checkboxs.length >= 2) {
    for (let i = 0; i < 2; i++) {
      strengthIndicators[i].style.backgroundColor = 'var(--neon-green)';
    }
  }
  else if (slider.value >= 6 && slider.value <= 9 && checkboxs.length >= 1) {
    for (let i = 0; i < 1; i++) {
      strengthIndicators[i].style.backgroundColor = 'var(--neon-green)';
    }
  }
  else if (slider.value < 6 || !checkboxs.length) {
    strengthIndicators[0].style.backgroundColor = 'var(--neon-green)';
  }
};

function makePassword(event) {
  document.querySelector('.tooltip').innerHTML = 'Copy to clipboard';
  event.preventDefault();
  const regularExpression = new RegExp(createRegex(), "g");

  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789#$@_'.match(regularExpression).filter(item => item).join('');

  let resultPassword = '';
  const length = slider.value;

  for (let i = 0; i < length; i++) {
    resultPassword += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  document.querySelector('.password-input').value = resultPassword;
  setPasswordStrength();
  clipboardIcon.src = 'svg/clipboard.svg';
  return resultPassword;
};

clipboardIcon.addEventListener('click', async () => {
  await navigator.clipboard.writeText(document.querySelector('.password-input').value);
  clipboardIcon.src = 'svg/clipboard-check.svg';
  document.querySelector('.tooltip').innerHTML = 'Copied!';
});
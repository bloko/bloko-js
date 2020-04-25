export const isRequired = v => Boolean(v);
export const isMoreThan = (length, v) => v.length >= length;
export const isEmail = v => v.includes('@') && v.includes('.');

// 9 will be to first digit verification
// 10 will be to second digit verification
const FIRST_DIGIT = 9;
const SECOND_DIGIT = 10;

function hasValidFirstDigit(cpf) {
  return hasValidDigit(cpf, FIRST_DIGIT);
}

function hasValidSecondDigit(cpf) {
  return hasValidDigit(cpf, SECOND_DIGIT);
}

function hasValidDigit(cpf, untilNumber) {
  if ([FIRST_DIGIT, SECOND_DIGIT].indexOf(untilNumber) === -1) {
    throw new Error('Second argument of hasValidDigit must be 9 or 10');
  }

  const leftover = calculateLeftover(cpf, untilNumber);

  // substring to get first digit or second digit from CPF string
  const refDigit = parseInt(cpf.substring(untilNumber, untilNumber + 1), 10);

  if (leftover !== refDigit) {
    throw new Error(
      `${untilNumber === 9 ? 'First' : 'Second'} digit is not valid`
    );
  }

  return true;
}

function calculateLeftover(cpf, untilNumber) {
  let sum = 0;

  for (let i = 0; i < untilNumber; i++) {
    const number = parseInt(cpf[i], 10);

    sum += number * (untilNumber + 1 - i);
  }

  // Get leftover of the division of sum mutiply by 10
  let leftover = (sum * 10) % 11;

  // 10 or 11 are set to 0 based on the CPF algorithm
  if (leftover === 10 || leftover === 11) {
    leftover = 0;
  }

  return leftover;
}

function hasNonZeroInput(cpf) {
  // CPF isn't valid when all numbers are zero
  if (cpf === '0'.repeat(11)) {
    throw new Error('A sequence of zero numbers represent an invalid CPF');
  }

  return true;
}

// Inspired by http://www.receita.fazenda.gov.br/aplicacoes/atcta/cpf/funcoes.js
export function isCPF(str) {
  try {
    // Remove dots and dashs
    const cpf = str.replace(/[.-]/g, '');

    hasValidSecondDigit(cpf);
    hasValidFirstDigit(cpf);
    hasNonZeroInput(cpf);

    return true;
  } catch (error) {
    return false;
  }
}

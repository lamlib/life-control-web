export function setError(input, message) {
  input.classList.remove('border-zinc-300');
  input.classList.add('border-red-300');
  input.nextElementSibling.textContent = message;
}

export function clearError(input) {
  input.classList.remove('border-red-300');
  input.classList.add('border-zinc-300');
  input.nextElementSibling.innerHTML = '&nbsp;';
}
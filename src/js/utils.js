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

/**
 * @param {string} str name of params you wanna get.
 * @returns {string}
 */
export function getSearchParams(str) {
  const urlSearchParams = new URLSearchParams(window.location.search);
  if (urlSearchParams.has(str)) {
    return urlSearchParams.get(str);
  } else {
    throw new TypeError(`${str} is not exits on URL search params`);
  }
}

/**
 * @param {string} selector Selector like id, class to query unique Element
 * @returns {Element}
 */
export function getOneElementOrFail(selector) { 
  const element = document.querySelector(selector);
  if (!element) {
    throw new TypeError(`Can not get element from ${selector} selector`);
  }
  return element;
}

/**
 * @param {string} selector Selector like class, tag to query list Element
 * @returns {NodeListOf<Element>}
 */
export function getListElementOrFail(selector) {
  const listElement = document.querySelectorAll(selector);
  if(!listElement.length) {
    throw new TypeError(`Can not get list element from ${selector} selector`);
  }
  return listElement;
}

export function handleAsyncErr(fn, onError) {
  return async (...args) => {
    try {
      return await fn(...args);
    } catch (error) {
      console.error('Error: ', error);
      if (typeof onError === 'function') {
        onError(error);
      }
    }
  }
}

export function handleErr(fn, onError) {
  return (...args) => {
    try {
      return fn(...args);
    } catch (error) {
      console.error('Error: ', error);
      if (typeof onError === 'function') {
        onError(error);
      }
    }
  }
}
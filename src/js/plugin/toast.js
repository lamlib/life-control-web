class ToastifyContainer {
    container;
    position;
    constructor(position, customClasses) {
        this.container = document.createElement('div');
        const addedClass = customClasses ? `${customClasses} ` : '';
        this.container.className = `${addedClass}noap-toastify-container noap-toastify-${position}`;
        // apply the position as an attribute
        this.position = position;
        document.body.appendChild(this.container);
    }
    /**
     * Get the container element where the toast will be appended.
     * @returns The container HTMLElement.
     * @memberof ToastifyContainer
     * @author Andreas Nicolaou
     */
    get element() {
        return this.container;
    }
    /**
     * Get the position of the toast container.
     * @returns The position of the toast container.
     * @memberof ToastifyContainer
     * @author Andreas Nicolaou
     */
    get containerPosition() {
        return this.position;
    }
}

class ToastifyIcons {
    static getCloseIcon() {
        return `<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"></path></svg>`;
    }
    static getToastIcon(type) {
        const icons = {
            success: `<svg aria-hidden="true" width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="16" cy="16" r="16" fill="#22c55e"/><path d="M10 17l4 4 8-8" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
            error: `<svg aria-hidden="true" width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="16" cy="16" r="16" fill="#ef4444"/><path d="M20 12L12 20M12 12l8 8" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
            info: `<svg aria-hidden="true" width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="16" cy="16" r="16" fill="#3b82f6"/><path d="M16 10v2m0 4v6" stroke="#fff" stroke-width="2.5" stroke-linecap="round"/><circle cx="16" cy="8" r="1.5" fill="#fff"/></svg>`,
            warning: `<svg aria-hidden="true" width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="16" cy="16" r="16" fill="#f59e42"/><path d="M16 10v8" stroke="#fff" stroke-width="2.5" stroke-linecap="round"/><circle cx="16" cy="22" r="1.5" fill="#fff"/></svg>`,
            default: `<svg aria-hidden="true" width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="16" cy="16" r="16" fill="#a3a3a3"/><path d="M16 8a6 6 0 0 1 6 6v3.764c0 .414.168.812.468 1.104l1.064 1.03A2 2 0 0 1 23 23H9a2 2 0 0 1-1.532-3.102l1.064-1.03A1.5 1.5 0 0 0 9 17.764V14a6 6 0 0 1 6-6Zm0 18a3 3 0 0 0 3-3h-6a3 3 0 0 0 3 3Z" fill="#fff"/></svg>`,
            light: `<svg aria-hidden="true" width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="16" cy="16" r="16" fill="#fff"/><path d="M16 8a6 6 0 0 1 6 6v3.764c0 .414.168.812.468 1.104l1.064 1.03A2 2 0 0 1 23 23H9a2 2 0 0 1-1.532-3.102l1.064-1.03A1.5 1.5 0 0 0 9 17.764V14a6 6 0 0 1 6-6Zm0 18a3 3 0 0 0 3-3h-6a3 3 0 0 0 3 3Z" fill="#222"/></svg>`,
        };
        /* istanbul ignore next */
        return icons[type] ?? '';
    }
}

class Toastify {
    /**
     * Creates and displays a toastify notification.
     * @memberof Toastify
     * @author Andreas Nicolaou
     */
    static create(container, maxToasts, newestOnTop, toast, options, onComplete) {
        const { title, message, type } = toast;
        const htmlContainer = container.element;
        const positionContainer = container.containerPosition;
        const toastifyElement = document.createElement('div');
        const animationType = options.animationType || 'fade';
        const from = Toastify.getAnimationSuffix(animationType, positionContainer);
        toastifyElement.className = `noap-toastify-toast noap-toastify-${options.direction} noap-toastify-anim-${animationType}${from}`;
        toastifyElement.classList.add(`noap-toastify-${type}`);
        if (options.tapToDismiss) {
            toastifyElement.classList.add('noap-toastify-tap-hover');
            toastifyElement.addEventListener('click', () => {
                toastifyElement.classList.add(`noap-toastify-anim-${animationType}-out${from}`);
                setTimeout(() => {
                    if (htmlContainer.contains(toastifyElement)) {
                        htmlContainer.removeChild(toastifyElement);
                        onComplete();
                    }
                }, 500);
            });
        }
        const parentElement = document.createElement('div');
        parentElement.className = 'noap-toastify-wrapper';
        const titleElement = document.createElement('div');
        titleElement.className = 'noap-toastify-title';
        titleElement.innerText = title;
        const messageElement = document.createElement('div');
        messageElement.className = 'noap-toastify-message';
        if (options.isHtml) {
            messageElement.innerHTML = message;
        }
        else {
            messageElement.innerText = message;
        }
        const icon = ToastifyIcons.getToastIcon(type);
        if (options.showIcons && icon) {
            const iconElement = document.createElement('div');
            iconElement.className = `noap-toastify-icon ${type}`;
            iconElement.innerHTML = icon;
            toastifyElement.appendChild(iconElement);
        }
        let progressBar = null;
        let progressInterval = null;
        let autoCloseTimeout = null;
        const progressBarDuration = options.progressBarDuration ? options.progressBarDuration : 100;
        const direction = options.progressBarDirection || 'decrease';
        let progress = direction === 'increase' ? 0 : 100;
        if (options.withProgressBar) {
            progressBar = document.createElement('div');
            progressBar.className = 'noap-toastify-progress-bar';
            progressBar.style.width = `${direction === 'increase' ? 0 : 100}%`;
            toastifyElement.appendChild(progressBar);
            progressInterval = window.setInterval(() => {
                if (direction === 'increase') {
                    progress += 1;
                }
                else {
                    progress -= 1;
                }
                progressBar.style.width = `${progress}%`;
                if ((direction === 'increase' && progress >= 100) || (direction === 'decrease' && progress <= 0)) {
                    clearInterval(progressInterval);
                    toastifyElement.classList.add(`noap-toastify-anim-${animationType}-out${from}`);
                    setTimeout(() => {
                        if (htmlContainer.contains(toastifyElement)) {
                            htmlContainer.removeChild(toastifyElement);
                            onComplete();
                        }
                    }, 500);
                }
            }, progressBarDuration === 0 ? 100 : progressBarDuration);
            toastifyElement.addEventListener('mouseenter', () => {
                if (progressInterval) {
                    toastifyElement.classList.add('noap-toastify-hovering');
                    clearInterval(progressInterval);
                    progressInterval = null;
                }
            });
            toastifyElement.addEventListener('mouseleave', () => {
                toastifyElement.classList.remove('noap-toastify-hovering');
                if (!progressInterval) {
                    progressInterval = window.setInterval(() => {
                        /* istanbul ignore next */
                        if (direction === 'increase') {
                            progress += 1;
                        }
                        else {
                            progress -= 1;
                        }
                        progressBar.style.width = `${progress}%`;
                        if ((direction === 'increase' && progress >= 100) || (direction === 'decrease' && progress <= 0)) {
                            clearInterval(progressInterval);
                            toastifyElement.classList.add(`noap-toastify-anim-${animationType}-out${from}`);
                            setTimeout(() => {
                                if (htmlContainer.contains(toastifyElement)) {
                                    htmlContainer.removeChild(toastifyElement);
                                    onComplete();
                                }
                            }, 500);
                        }
                    }, progressBarDuration === 0 ? 100 : progressBarDuration);
                }
            });
        }
        if (!options.withProgressBar && options.duration > 0) {
            const startAutoClose = () => {
                autoCloseTimeout = window.setTimeout(() => {
                    toastifyElement.classList.add(`noap-toastify-anim-${animationType}-out${from}`);
                    setTimeout(() => {
                        if (htmlContainer.contains(toastifyElement)) {
                            htmlContainer.removeChild(toastifyElement);
                            onComplete();
                        }
                    }, 500);
                }, options.duration);
            };
            const clearAutoClose = () => {
                if (autoCloseTimeout) {
                    clearTimeout(autoCloseTimeout);
                    autoCloseTimeout = null;
                }
            };
            toastifyElement.addEventListener('mouseenter', () => {
                clearAutoClose();
            });
            toastifyElement.addEventListener('mouseleave', () => {
                startAutoClose();
            });
            startAutoClose();
        }
        if (title) {
            parentElement.appendChild(titleElement);
        }
        parentElement.appendChild(messageElement);
        toastifyElement.appendChild(parentElement);
        if (options.closeButton) {
            const closeBtn = document.createElement('button');
            closeBtn.className = 'noap-toastify-close';
            closeBtn.innerHTML = ToastifyIcons.getCloseIcon();
            closeBtn.onclick = () => {
                toastifyElement.classList.add(`noap-toastify-anim-${animationType}-out${from}`);
                setTimeout(() => {
                    if (htmlContainer.contains(toastifyElement)) {
                        htmlContainer.removeChild(toastifyElement);
                        onComplete();
                    }
                }, 200);
            };
            toastifyElement.appendChild(closeBtn);
        }
        if (newestOnTop) {
            /* istanbul ignore next */
            htmlContainer.insertBefore(toastifyElement, htmlContainer.firstChild);
        }
        else {
            htmlContainer.appendChild(toastifyElement);
        }
        // Check if the number of toasts exceeds the maximum allowed
        if (htmlContainer.children.length > maxToasts) {
            for (const element of Array.from(htmlContainer.children)) {
                const oldestToast = element;
                if (!oldestToast.classList.contains('noap-toastify-hovering')) {
                    oldestToast.classList.add(`noap-toastify-anim-${animationType}-out${from}`);
                    setTimeout(() => {
                        if (htmlContainer.contains(oldestToast)) {
                            htmlContainer.removeChild(oldestToast);
                        }
                    }, 500);
                    break;
                }
            }
        }
    }
    static getAnimationSuffix(animationType, position) {
        if (animationType !== 'slide')
            return '';
        switch (position) {
            case 'top-left':
            case 'bottom-left':
                return '-left';
            case 'bottom-center':
            case 'bottom-center-full':
                return '-bottom';
            case 'top-center':
            case 'top-center-full':
                return '-top';
            case 'center':
                return '-center';
            default:
                return '';
        }
    }
}

class ToastifyQueue {
    activeToasts = 0;
    container;
    maxToasts;
    newestOnTop;
    queue = [];
    constructor(container, maxToasts, newestOnTop) {
        this.container = container;
        this.maxToasts = maxToasts;
        this.newestOnTop = newestOnTop;
    }
    /**
     * Adds a toast to the queue or displays it immediately if there is space.
     * @param title - The title of the toast.
     * @param message - The message content of the toast.
     * @param type - The type of the toast (e.g., success, error, etc.).
     * @param options - Customization options for the toast (optional).
     * @memberof ToastifyQueue
     * @author Andreas Nicolaou
     */
    enqueue(title, message, type, options = Object.create(Object.prototype)) {
        // If there is space, display the toast immediately
        if (this.activeToasts < this.maxToasts) {
            Toastify.create(this.container, this.maxToasts, this.newestOnTop, { title, message, type }, options, () => {
                this.activeToasts--; // Decrement active toasts when the toast is removed
                this.processQueue(); // Check the queue for the next toast
            });
            this.activeToasts++; // Increment active toasts
        }
        else {
            // Otherwise, add the toast to the queue
            this.queue.push({
                title,
                message,
                type,
                options,
                create: (onComplete) => {
                    Toastify.create(this.container, this.maxToasts, this.newestOnTop, { title, message, type }, options, onComplete);
                },
            });
        }
    }
    /**
     * Processes the queue to display the next toast when space becomes available.
     * @memberof ToastifyQueue
     * @author Andreas Nicolaou
     */
    processQueue() {
        // If there is space and the queue is not empty, display the next toast
        if (this.activeToasts < this.maxToasts && this.queue.length > 0) {
            const nextToast = this.queue.shift();
            nextToast.create(() => {
                this.activeToasts--; // Decrement active toasts when the toast is removed
                this.processQueue(); // Check the queue for the next toast
            });
            this.activeToasts++; // Increment active toasts
        }
    }
}

/**
 * Initializes a new ToastifyManager instance to manage toast notifications.
 * @param position - The position where the toast container should be displayed (e.g., top-right, bottom-left).
 * @param options - Configuration options for the toast manager:
 *   - maxToasts (optional): Maximum number of toasts that can be displayed simultaneously (default is 5).
 *   - customClasses (optional): Custom CSS classes to apply to the toast container.
 *   - duration (optional): Duration (in milliseconds) for the toast notification to remain visible (default is 3000).
 *   - isHtml (optional): Whether the toast message should be interpreted as HTML (default is false).
 *   - withProgressBar (optional): Whether to show a progress bar on the toast (default is false).
 *   - progressBarDuration (optional): Duration for the progress bar animation (default is 100 milliseconds).
 *   - closeButton (optional): Whether to show a close button on the toast (default is false).
 *   - showIcons (optional): Whether to display icons next to the toast message (default is true).
 *   - direction (optional): The direction of the text within the toast (default is 'ltr', left-to-right).
 *   - animationType (optional): The type of animation for the toast (default is 'fade', use 'none' for no animation).
 *   - progressBarDirection (optional): The direction of the progress bar animation (default is 'decrease').
 * @throws Error if called in a non-browser environment.
 * @returns A new instance of ToastifyManager.
 * @memberof ToastifyManager
 * @author Andreas Nicolaou
 */
class ToastFactory {
    options;
    toastifyQueue;
    constructor(position, 
    /* istanbul ignore next */ { maxToasts, customClasses, newestOnTop, ...options } = Object.create(Object.prototype)) {
        /* istanbul ignore next */
        if (typeof document === 'undefined') {
            throw new Error('document is not available. Toastify can only be used in a browser environment.');
        }
        this.options = {
            duration: 3000,
            isHtml: false,
            withProgressBar: false,
            progressBarDuration: 100,
            closeButton: false,
            showIcons: true,
            direction: 'ltr',
            animationType: 'fade',
            tapToDismiss: false,
            progressBarDirection: 'decrease',
            ...options,
        };
        const toastifyContainer = new ToastifyContainer(position, customClasses);
        /* istanbul ignore next */
        this.toastifyQueue = new ToastifyQueue(toastifyContainer, maxToasts ?? 5, newestOnTop);
    }
    /**
     * Displays a default toast notification.
     * @param title - The title of the toast.
     * @param message - The message content of the toast.
     * @param options - Customization for this individual toast. These options are merged with the defaults
     *                  set on ToastifyManager, and can be overriden individually
     * @memberof ToastifyManager
     * @author Andreas Nicolaou
     */
    default(title, message, options = Object.create(Object.prototype)) {
        this.toastifyQueue.enqueue(title, message, 'default', { ...this.options, ...options });
    }
    /**
     * Displays an error toast notification.
     * @param title - The title of the toast.
     * @param message - The message content of the toast.
     * @param options - Customization for this individual toast. These options are merged with the defaults
     *                  set on ToastifyManager, and can be overriden individually
     * @memberof ToastifyManager
     * @author Andreas Nicolaou
     */
    error(title, message, options = Object.create(Object.prototype)) {
        this.toastifyQueue.enqueue(title, message, 'error', { ...this.options, ...options });
    }
    /**
     * Displays an informational toast notification.
     * @param title - The title of the toast.
     * @param message - The message content of the toast.
     * @param options - Customization for this individual toast. These options are merged with the defaults
     *                  set on ToastifyManager, and can be overriden individually
     * @memberof ToastifyManager
     * @author Andreas Nicolaou
     */
    info(title, message, options = Object.create(Object.prototype)) {
        this.toastifyQueue.enqueue(title, message, 'info', { ...this.options, ...options });
    }
    /**
     * Displays a light toast notification.
     * @param title - The title of the toast.
     * @param message - The message content of the toast.
     * @param options - Customization for this individual toast. These options are merged with the defaults
     *                  set on ToastifyManager, and can be overriden individually
     * @memberof ToastifyManager
     * @author Andreas Nicolaou
     */
    light(title, message, options = Object.create(Object.prototype)) {
        this.toastifyQueue.enqueue(title, message, 'light', { ...this.options, ...options });
    }
    /**
     * Displays a success toast notification.
     * @param title - The title of the toast.
     * @param message - The message content of the toast.
     * @param options - Customization for this individual toast. These options are merged with the defaults
     *                  set on ToastifyManager, and can be overriden individually.
     * @memberof ToastifyManager
     * @author Andreas Nicolaou
     */
    success(title, message, options = Object.create(Object.prototype)) {
        this.toastifyQueue.enqueue(title, message, 'success', { ...this.options, ...options });
    }
    /**
     * Displays a warning toast notification.
     * @param title - The title of the toast.
     * @param message - The message content of the toast.
     * @param options - Customization for this individual toast. These options are merged with the defaults
     *                  set on ToastifyManager, and can be overriden individually.
     * @memberof ToastifyManager
     */
    warning(title, message, options = Object.create(Object.prototype)) {
        this.toastifyQueue.enqueue(title, message, 'warning', { ...this.options, ...options });
    }
}

const toast = new ToastFactory('top-center', {
    animationType: 'slide',
    closeButton: true,
    showIcons: false,
});

export { toast };

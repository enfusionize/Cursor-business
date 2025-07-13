
// AI Guidance Tooltips
document.addEventListener('DOMContentLoaded', function() {
    const tooltips = document.querySelectorAll('[data-ai-level]');
    tooltips.forEach(tooltip => {
        const level = tooltip.getAttribute('data-ai-level');
        const icon = document.createElement('span');
        icon.innerHTML = '🤖';
        icon.className = 'ai-tooltip-icon';
        icon.title = window.t ? window.t(`guidance.tooltip_${level}`) : 'AI Guidance';
        tooltip.appendChild(icon);
    });
});

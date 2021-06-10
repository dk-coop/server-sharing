function openURlPathInNewTab(urlPath) {
    const win = window.open(urlPath, '_blank');
    win.focus();
}

export {
    openURlPathInNewTab
};
function hookImg() {
  const observer = new MutationObserver((mutationsList) => {
    for (let mutation of mutationsList) {
      if (mutation.type === 'attributes' && mutation.target instanceof Image) {
        const img = mutation.target;
        const src = img.src;
        const tempImage = new Image();
        tempImage.src = src;
        tempImage.onerror = () => {
          throw new Error({
            code: -1,
            message: '图片加载失败',
            data: src
          });
        }
      }
    }
  });
  // 设置观察目标（页面中的所有 <img> 标签）
  const imgElements = document.querySelectorAll('img');
  imgElements.forEach((img) => {
    observer.observe(img, {
      attributes: true // 观察属性变化
    });
  });

  // 如果新添加的 img 标签还需要监听，可以通过 MutationObserver 观察 DOM 的变化
  const bodyObserver = new MutationObserver(() => {
    const imgElements = document.querySelectorAll('img');
    imgElements.forEach((img) => {
      if (!img.hasAttribute('data-observed')) {
        observer.observe(img, { attributes: true });
        img.setAttribute('data-observed', 'true');
      }
    });
  });
  bodyObserver.observe(document.body, { childList: true, subtree: true });
}

hookImg();
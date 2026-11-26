(() => {
  const dialog = document.createElement("dialog");
  dialog.id = "lightbox";
  dialog.setAttribute("aria-label", "图表放大视图");
  dialog.innerHTML = '<button class="lightbox-close" type="button" autofocus>关闭</button>'
    + '<img alt=""><p class="cap"><strong class="lightbox-number"></strong><span class="lightbox-caption"></span></p>';
  document.body.append(dialog);
  let trigger = null;
  const enlarged = dialog.querySelector("img");
  dialog.querySelector("button").addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", event => {
    if (event.target === dialog || event.target === enlarged) dialog.close();
  });
  dialog.addEventListener("close", () => {
    dialog.classList.remove("on");
    if (trigger) trigger.focus({ preventScroll: true });
  });
  document.addEventListener("click", event => {
    const link = event.target.closest(".figure-zoom");
    if (!link || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const img = link.querySelector("img");
    const fig = link.closest("figure");
    trigger = link;
    event.preventDefault();
    enlarged.src = (img.currentSrc || img.src).replace("/svg/", "/png/").replace(/\.svg$/, ".png");
    enlarged.alt = img.alt;
    dialog.querySelector(".lightbox-number").textContent = fig.querySelector(".figure-number").textContent;
    dialog.querySelector(".lightbox-caption").innerText = fig.querySelector(".figure-caption-text").innerText;
    dialog.showModal();
    dialog.classList.add("on");
  });

  const interactive = document.querySelector(".interactive-saddle");
  if (!interactive) return;
  function load(url) {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = url;
      script.addEventListener("load", resolve, { once: true });
      script.addEventListener("error", reject, { once: true });
      document.head.append(script);
    });
  }
  let loading = false;
  let ready = false;
  interactive.addEventListener("toggle", async () => {
    if (!interactive.open || loading || ready) return;
    loading = true;
    const status = interactive.querySelector(".plot-status");
    status.textContent = "正在载入交互视图。";
    try {
      await Promise.all(["vendor/plotly-gl3d.min.js", "assets/saddle-data.js", "assets/saddle3d.js"].map(load));
      await window.renderSaddle3D("saddle3d");
      ready = true;
      status.remove();
    } catch (error) {
      status.textContent = "载入超时或失败。可查看上方静态截面，或收起此项后重新展开重试。";
    } finally {
      loading = false;
    }
  });
})();


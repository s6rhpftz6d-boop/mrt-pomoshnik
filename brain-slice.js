(() => {
  const canvas = document.createElement("canvas");
  canvas.width = 320;
  canvas.height = 260;
  canvas.style.cssText = "display:block;width:100%;max-width:420px;margin:12px auto;border-radius:12px;background:#06131e";

  const panel = document.createElement("section");
  panel.className = "panel";
  panel.innerHTML = `
    <h2>Визуализация МРТ-среза</h2>
    <p class="sub">Учебная модель аксиального среза головного мозга</p>
  `;
  panel.appendChild(canvas);

  const main = document.querySelector("main");
  main.prepend(panel);

  const ctx = canvas.getContext("2d");

  function draw() {
    const tr = +document.querySelector("#tr").value;
    const te = +document.querySelector("#te").value;
    const mat = +document.querySelector("#mat").value;
    const nex = +document.querySelector("#nex").value;
    const th = +document.querySelector("#th").value;

    const t1 = tr < 900;
    const t2 = te > 60;
    const noise = Math.max(0, 1 - nex / 5 + (mat - 256) / 1000 + (4 - th) / 15);

    ctx.fillStyle = "#06131e";
    ctx.fillRect(0, 0, 320, 260);

    ctx.save();
    ctx.translate(160, 130);

    ctx.beginPath();
    ctx.ellipse(0, 0, 105, 116, 0, 0, Math.PI * 2);
    ctx.fillStyle = t2 ? "#aebbc7" : t1 ? "#687987" : "#8999a6";
    ctx.fill();
    ctx.strokeStyle = "#e0e8ed";
    ctx.lineWidth = 4;
    ctx.stroke();

    ctx.beginPath();
    ctx.ellipse(0, 0, 82, 91, 0, 0, Math.PI * 2);
    ctx.fillStyle = t2 ? "#647b8b" : t1 ? "#c1ccd3" : "#9eabb5";
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(0, -12);
    ctx.bezierCurveTo(-45, -70, -75, -20, -40, 22);
    ctx.bezierCurveTo(-15, 45, -12, 20, 0, 12);
    ctx.bezierCurveTo(12, 20, 15, 45, 40, 22);
    ctx.bezierCurveTo(75, -20, 45, -70, 0, -12);
    ctx.fillStyle = t1 ? "#344e60" : t2 ? "#d5dfe5" : "#748b9a";
    ctx.fill();

    ctx.restore();

    let seed = 123;
    const amount = Math.max(0, Math.min(1800, noise * 1800));

    for (let i = 0; i < amount; i++) {
      seed = (seed * 16807) % 2147483647;
      const x = seed % 320;
      seed = (seed * 16807) % 2147483647;
      const y = seed % 260;

      ctx.fillStyle = i % 2
        ? "rgba(255,255,255,.25)"
        : "rgba(0,0,0,.25)";
      ctx.fillRect(x, y, 1.5, 1.5);
    }
  }

  ["tr", "te", "mat", "nex", "th", "fov"].forEach(id => {
    document.querySelector("#" + id).addEventListener("input", draw);
  });

  draw();
})();

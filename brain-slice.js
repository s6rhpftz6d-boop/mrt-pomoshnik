(() => {
  const canvas = document.createElement("canvas");
  canvas.width = 420;
  canvas.height = 340;
  canvas.style.cssText =
    "display:block;width:100%;max-width:420px;margin:12px auto;border-radius:12px;background:#06131e";

  const panel = document.createElement("section");
  panel.className = "panel";
  panel.innerHTML = `
    <h2>Визуализация МРТ-среза</h2>
    <p class="sub">Учебная модель аксиального среза головного мозга</p>
    <p><b>Выбери контраст:</b></p>
    <div id="contrastModes" style="display:flex;gap:8px;flex-wrap:wrap;margin:10px 0">
      <button type="button" data-mode="T1">T1</button>
      <button type="button" data-mode="T2">T2</button>
      <button type="button" data-mode="PD">PD</button>
    </div>
    <p id="modeInfo" class="sub">T1 — ликвор тёмный, белое вещество светлее серого.</p>
  `;
  panel.appendChild(canvas);
  document.querySelector("main").prepend(panel);

  const ctx = canvas.getContext("2d");
  let mode = "T1";

  const descriptions = {
    T1: "T1 — ликвор тёмный, белое вещество светлее серого.",
    T2: "T2 — ликвор светлый, жидкость имеет высокий сигнал.",
    PD: "PD — контраст преимущественно зависит от плотности протонов."
  };

  function draw() {
    const tr = +document.querySelector("#tr").value;
    const te = +document.querySelector("#te").value;
    const mat = +document.querySelector("#mat").value;
    const nex = +document.querySelector("#nex").value;
    const th = +document.querySelector("#th").value;

    let cortex, white, deep, fluid;

    if (mode === "T1") {
      cortex = "#8999a5";
      white = "#d5dfe6";
      deep = "#8295a3";
      fluid = "#354c5d";
    } else if (mode === "T2") {
      cortex = "#aebdca";
      white = "#687f90";
      deep = "#8299a8";
      fluid = "#e5edf3";
    } else {
      cortex = "#a0adb7";
      white = "#bac7d0";
      deep = "#9baab5";
      fluid = "#71899a";
    }

    ctx.fillStyle = "#06131e";
    ctx.fillRect(0, 0, 420, 340);

    ctx.save();
    ctx.translate(210, 170);

    // Контур головы
    ctx.beginPath();
    ctx.ellipse(0, 0, 142, 155, 0, 0, Math.PI * 2);
    ctx.fillStyle = "#273b4b";
    ctx.fill();

    // Контур мозга
    ctx.beginPath();
    ctx.ellipse(0, -4, 126, 139, 0, 0, Math.PI * 2);
    ctx.fillStyle = cortex;
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#dce6ed";
    ctx.stroke();

    // Белое вещество левого полушария
    ctx.beginPath();
    ctx.moveTo(-5, -116);
    ctx.bezierCurveTo(-65, -125, -108, -78, -105, -15);
    ctx.bezierCurveTo(-110, 55, -66, 111, -8, 116);
    ctx.bezierCurveTo(-25, 60, -24, -55, -5, -116);
    ctx.fillStyle = white;
    ctx.fill();

    // Белое вещество правого полушария
    ctx.beginPath();
    ctx.moveTo(5, -116);
    ctx.bezierCurveTo(65, -125, 108, -78, 105, -15);
    ctx.bezierCurveTo(110, 55, 66, 111, 8, 116);
    ctx.bezierCurveTo(25, 60, 24, -55, 5, -116);
    ctx.fill();

    // Глубокие структуры
    ctx.fillStyle = deep;
    ctx.beginPath();
    ctx.ellipse(-37, -4, 23, 39, -0.15, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.ellipse(37, -4, 23, 39, 0.15, 0, Math.PI * 2);
    ctx.fill();

    // Мозолистое тело
    ctx.beginPath();
    ctx.ellipse(0, -40, 39, 13, 0, Math.PI, Math.PI * 2);
    ctx.strokeStyle = cortex;
    ctx.lineWidth = 7;
    ctx.stroke();

    // Боковые желудочки
    ctx.fillStyle = fluid;
    ctx.beginPath();
    ctx.moveTo(-5, -19);
    ctx.bezierCurveTo(-19, -47, -62, -49, -62, -22);
    ctx.bezierCurveTo(-62, -3, -35, 5, -9, 17);
    ctx.bezierCurveTo(-17, -1, -12, -10, -5, -19);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(5, -19);
    ctx.bezierCurveTo(19, -47, 62, -49, 62, -22);
    ctx.bezierCurveTo(62, -3, 35, 5, 9, 17);
    ctx.bezierCurveTo(17, -1, 12, -10, 5, -19);
    ctx.fill();

    // Третий желудочек
    ctx.beginPath();
    ctx.ellipse(0, 14, 5, 19, 0, 0, Math.PI * 2);
    ctx.fill();

    // Мозжечок
    ctx.beginPath();
    ctx.ellipse(0, 103, 48, 27, 0, 0, Math.PI * 2);
    ctx.fillStyle = deep;
    ctx.fill();

    // Условные борозды коры
    ctx.strokeStyle = "rgba(35,55,70,.55)";
    ctx.lineWidth = 2;

    for (let side of [-1, 1]) {
      for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.moveTo(side * (75 + i * 5), -85 + i * 25);
        ctx.quadraticCurveTo(
          side * (112 + i * 2),
          -65 + i * 27,
          side * (92 + i * 3),
          -42 + i * 25
        );
        ctx.stroke();
      }
    }

    ctx.restore();

    // Условный шум: зависит от NEX, матрицы и толщины
    const noise = Math.max(
      0,
      Math.min(1, 0.7 - nex / 8 + (mat - 256) / 1200 + (4 - th) / 20)
    );

    let seed = 123;
    const amount = Math.round(noise * 1400);

    for (let i = 0; i < amount; i++) {
      seed = (seed * 16807) % 2147483647;
      const x = seed % 420;
      seed = (seed * 16807) % 2147483647;
      const y = seed % 340;

      ctx.fillStyle = i % 2
        ? "rgba(255,255,255,.18)"
        : "rgba(0,0,0,.18)";
      ctx.fillRect(x, y, 1.5, 1.5);
    }
  }

  document.querySelectorAll("#contrastModes button").forEach(button => {
    button.style.background = "#1b3a4e";
    button.style.color = "#e8f2f7";
    button.style.border = "1px solid #24465d";

    button.addEventListener("click", () => {
      mode = button.dataset.mode;

      document.querySelector("#modeInfo").textContent =
        descriptions[mode];

      document.querySelectorAll("#contrastModes button").forEach(b => {
        b.style.background =
          b.dataset.mode === mode ? "#54d4e8" : "#1b3a4e";
        b.style.color =
          b.dataset.mode === mode ? "#06202c" : "#e8f2f7";
      });

      draw();
    });
  });

  ["tr", "te", "mat", "nex", "th", "fov"].forEach(id => {
    const control = document.querySelector("#" + id);
    if (control) control.addEventListener("input", draw);
  });

  draw();
})();


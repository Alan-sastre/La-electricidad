class MinijuegoScene extends Phaser.Scene {
  constructor() {
    super({ key: "MinijuegoScene" });
  }

  preload() {
    // Load all SVG assets
    this.load.svg("battery", "assets/images/battery.svg");
    this.load.svg("bulb_off", "assets/images/bulb_off.svg");
    this.load.svg("bulb_on", "assets/images/bulb_on.svg");
    this.load.svg("table", "assets/images/table.svg");

    this.load.svg("fan_stand", "assets/images/fan_stand.svg");
    this.load.svg("fan_blades", "assets/images/fan_blades.svg");
    this.load.svg("switch_base", "assets/images/switch_base.svg");
    this.load.svg("switch_lever", "assets/images/switch_lever.svg");

    this.load.svg("house_body", "assets/images/house_body.svg");
    this.load.svg("window", "assets/images/window.svg");
    this.load.svg("solar_panel", "assets/images/solar_panel.svg");
    this.load.svg("dirt", "assets/images/dirt.svg");
    this.load.svg("sun", "assets/images/sun.svg");
    this.load.svg("landscape", "assets/images/landscape.svg");
    this.load.svg("cloud", "assets/images/cloud.svg");
    this.load.svg("bird", "assets/images/bird.svg");
    this.load.svg("wall", "assets/images/wall.svg");
    this.load.svg("shadow", "assets/images/shadow.svg"); // Generic shadow

    // Level 4 Assets
    this.load.svg("radio", "assets/images/radio.svg");
    this.load.svg("splitter", "assets/images/splitter.svg");

    // Level 5 Assets (Solar Power)
    this.load.svg("sun", "assets/images/sun.svg");
    this.load.svg("cloud", "assets/images/cloud.svg");
    this.load.svg("solar_panel", "assets/images/solar_panel.svg");
    this.load.svg("house_off", "assets/images/house_off.svg");
    this.load.svg("house_on", "assets/images/house_on.svg");

    // Audio
    this.load.audio("bg_music", "components/musica1.mp3");
  }

  create() {
    this.level = 1;
    this.totalLevels = 5;

    // Create Spark Texture for Particles
    const graphics = this.make.graphics({ x: 0, y: 0, add: false });
    graphics.fillStyle(0xffff00, 1);
    graphics.fillCircle(5, 5, 5);
    graphics.generateTexture("spark", 10, 10);

    // Create Dust Texture for Particles
    const dustGraphics = this.make.graphics({ x: 0, y: 0, add: false });
    dustGraphics.fillStyle(0x8d6e63, 1);
    dustGraphics.fillCircle(4, 4, 4);
    dustGraphics.generateTexture("dust_particle", 8, 8);

    // Create Ambient Particle Texture
    const ambientGraphics = this.make.graphics({ x: 0, y: 0, add: false });
    ambientGraphics.fillStyle(0xffffff, 0.5);
    ambientGraphics.fillCircle(2, 2, 2);
    ambientGraphics.generateTexture("ambient_particle", 4, 4);

    // Create Confetti Texture
    const confettiGraphics = this.make.graphics({ x: 0, y: 0, add: false });
    confettiGraphics.fillStyle(0xffffff, 1);
    confettiGraphics.fillRect(0, 0, 10, 10);
    confettiGraphics.generateTexture("confetti", 10, 10);

    this.startLevel();
  }

  createConfetti() {
    const particles = this.add.particles("confetti");
    const emitter = particles.createEmitter({
      x: this.cameras.main.width / 2,
      y: this.cameras.main.height / 2,
      speed: { min: 200, max: 600 },
      angle: { min: 0, max: 360 },
      scale: { start: 1, end: 0 },
      alpha: { start: 1, end: 0 },
      lifespan: 3000,
      gravityY: 300,
      rotate: { min: 0, max: 360 },
      quantity: 100,
      on: false,
    });

    // Custom particle tinting
    particles.setDepth(100);
    emitter.explode(100);

    // Tint particles with random colors
    particles.active = true; // Ensure active to iterate
    // Note: Phaser 3 particle tinting is usually done via emitCallback or pre-generating textures.
    // However, simpler approach: use emitCallback to set tint on particle?
    // Actually, Phaser 3 Particles Manager has 'tint' property but it applies to all.
    // To have multi-colored confetti, it's better to create multiple emitters or use a custom particle class.
    // OR, simpler: create a few emitters with different tints.

    particles.destroy(); // Destroy the initial one to replace with multi-colored approach below

    const colors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff, 0x00ffff];
    colors.forEach((color) => {
      const p = this.add.particles("confetti");
      p.setDepth(100);
      const e = p.createEmitter({
        x: this.cameras.main.width / 2,
        y: this.cameras.main.height / 2,
        speed: { min: 200, max: 600 },
        angle: { min: 0, max: 360 },
        scale: { start: 1, end: 0 },
        lifespan: 3000,
        gravityY: 300,
        rotate: { min: 0, max: 360 },
        tint: color,
        on: false,
      });
      e.explode(20);

      // Cleanup
      this.time.delayedCall(3000, () => {
        p.destroy();
      });
    });
  }

  startLevel() {
    this.time.removeAllEvents(); // Clear any timers
    this.children.removeAll();
    this.tweens.killAll();
    this.input.removeAllListeners();

    // Initialize Audio Manager (Re-create UI, music continues playing)
    if (typeof AudioManager !== "undefined") {
      this.audioManager = new AudioManager(this, "bg_music", {
        defaultVolume: 0.3,
        loop: true,
        x: this.cameras.main.width - 220,
        y: 30,
      });
    }

    // Background Color
    this.cameras.main.setBackgroundColor("#87CEEB");

    // Level Indicator
    const graphics = this.add.graphics().setDepth(100); // UI on top
    for (let i = 1; i <= this.totalLevels; i++) {
      if (i <= this.level) {
        graphics.fillStyle(0xffff00, 1);
      } else {
        graphics.fillStyle(0xffffff, 0.5);
      }
      graphics.fillCircle(30 + i * 40, 40, 15);
    }

    if (this.level === 1) {
      this.createLevel1();
    } else if (this.level === 2) {
      this.createLevel2();
    } else if (this.level === 3) {
      this.createLevel3();
    } else if (this.level === 4) {
      this.createLevel4();
    } else if (this.level === 5) {
      this.createLevel5();
    } else {
      this.createWinScreen();
    }
  }

  // ================= HELPER FUNCTIONS =================
  addShadow(x, y, scaleX = 1, scaleY = 1) {
    const shadow = this.add
      .image(x, y, "shadow")
      .setScale(scaleX, scaleY)
      .setAlpha(0.6)
      .setDepth(0);
    return shadow;
  }

  popIn(target, delay = 0, finalScale = 1) {
    if (!target) return;
    target.setScale(0);
    this.tweens.add({
      targets: target,
      scale: finalScale,
      ease: "Back.out",
      duration: 600,
      delay: delay,
    });
  }

  addInteractionFeedback(target) {
    if (!target) return;
    target.on("pointerdown", () => {
      this.tweens.add({
        targets: target,
        scale: target.scale * 0.9,
        duration: 100,
        yoyo: true,
      });
    });
  }

  // ================= LEVEL 1 =================
  createLevel1() {
    const centerX = this.cameras.main.width / 2;
    const centerY = this.cameras.main.height / 2;

    // Wall Background
    this.add
      .tileSprite(
        0,
        0,
        this.cameras.main.width,
        this.cameras.main.height,
        "wall",
      )
      .setOrigin(0)
      .setDepth(-10);

    // Ambient Particles
    this.createAmbientParticles();

    // Table
    const tableY = centerY + 250;
    this.addShadow(centerX, tableY + 150, 6, 2);
    const table = this.add
      .image(centerX, tableY, "table")
      .setDisplaySize(1200, 400)
      .setDepth(1);
    this.popIn(table, 0, table.scale); // PopIn uses current scale logic if simplified, but here passing explicit

    // Particle Manager
    this.particles = this.add.particles("spark").setDepth(10);
    this.emitter = this.particles.createEmitter({
      speed: 100,
      scale: { start: 1, end: 0 },
      blendMode: "ADD",
      lifespan: 500,
      on: false,
    });

    // Battery (Left)
    const battX = centerX - 250;
    const battY = centerY;
    this.addShadow(battX, battY + 110, 1.2, 0.5);
    const battery = this.add
      .image(battX, battY, "battery")
      .setScale(0.8)
      .setDepth(2);
    this.popIn(battery, 200, 0.8);

    // Bulb (Right)
    const bulbX = centerX + 250;
    const bulbY = centerY;
    this.addShadow(bulbX, bulbY + 110, 1.2, 0.5);
    this.bulbSprite = this.add
      .image(bulbX, bulbY, "bulb_off")
      .setScale(0.8)
      .setDepth(2);
    this.popIn(this.bulbSprite, 400, 0.8);

    // Fixed Wire (Battery Bottom to Bulb Base Side)
    const wireGraphics = this.add.graphics().setDepth(1);
    wireGraphics.lineStyle(8, 0x000000);
    wireGraphics.beginPath();
    wireGraphics.moveTo(battX, battY + 100);
    wireGraphics.lineTo(battX, battY + 180);
    wireGraphics.lineTo(bulbX, battY + 180);
    wireGraphics.lineTo(bulbX, bulbY + 80);
    wireGraphics.strokePath();

    // Loose Wire
    this.wireStart = { x: bulbX, y: bulbY + 80 };
    this.wireEnd = { x: bulbX - 100, y: bulbY + 150 };

    this.looseWireGraphics = this.add.graphics().setDepth(2);
    this.updateWire(this.wireEnd.x, this.wireEnd.y);

    // Drag Handle
    const handle = this.add
      .circle(this.wireEnd.x, this.wireEnd.y, 25, 0xff0000)
      .setInteractive({ draggable: true, useHandCursor: true })
      .setDepth(5);
    this.addInteractionFeedback(handle);
    this.popIn(handle, 600, 1);

    // Target Zone
    const targetX = battX;
    const targetY = battY - 110;
    const targetZone = this.add
      .circle(targetX, targetY, 40, 0x00ff00, 0.3)
      .setVisible(false)
      .setDepth(1);

    // Hand Animation
    this.hand = this.add
      .text(this.wireEnd.x, this.wireEnd.y, "👆🏻", {
        fontSize: "64px",
        padding: { x: 20, y: 20 },
      })
      .setDepth(20);
    this.tweens.add({
      targets: this.hand,
      x: targetX,
      y: targetY,
      duration: 1500,
      yoyo: true,
      repeat: -1,
      hold: 500,
    });

    handle.on("dragstart", () => {
      this.hand.setVisible(false);
      targetZone.setVisible(true);
    });

    handle.on("drag", (pointer, dragX, dragY) => {
      handle.x = dragX;
      handle.y = dragY;
      this.updateWire(dragX, dragY);
    });

    handle.on("dragend", () => {
      targetZone.setVisible(false);
      const dist = Phaser.Math.Distance.Between(
        handle.x,
        handle.y,
        targetX,
        targetY,
      );

      if (dist < 60) {
        handle.x = targetX;
        handle.y = targetY;
        this.updateWire(targetX, targetY);
        handle.disableInteractive();

        // Success
        this.bulbSprite.setTexture("bulb_on");
        this.tweens.add({
          targets: this.bulbSprite,
          scale: 0.9,
          yoyo: true,
          duration: 100,
          repeat: 3,
        });

        // Spark Effect
        this.emitter.setPosition(targetX, targetY);
        this.emitter.explode(20);
        this.emitter.setPosition(bulbX, bulbY + 80);
        this.emitter.explode(20);

        this.time.delayedCall(500, () => {
          this.createConfetti();
        });

        this.time.delayedCall(2000, () => {
          this.level++;
          this.startLevel();
        });
      } else {
        handle.x = this.wireEnd.x;
        handle.y = this.wireEnd.y;
        this.updateWire(this.wireEnd.x, this.wireEnd.y);
        this.hand.setVisible(true);
      }
    });
  }

  updateWire(x, y) {
    this.looseWireGraphics.clear();
    this.looseWireGraphics.lineStyle(8, 0xff0000);

    const startPoint = new Phaser.Math.Vector2(
      this.wireStart.x,
      this.wireStart.y,
    );
    const endPoint = new Phaser.Math.Vector2(x, y);
    const controlPoint = new Phaser.Math.Vector2(
      (this.wireStart.x + x) / 2,
      Math.max(this.wireStart.y, y) + 50,
    );

    const curve = new Phaser.Curves.QuadraticBezier(
      startPoint,
      controlPoint,
      endPoint,
    );
    curve.draw(this.looseWireGraphics);
  }

  // ================= LEVEL 2 =================
  createLevel2() {
    const centerX = this.cameras.main.width / 2;
    const centerY = this.cameras.main.height / 2;

    // Wall Background
    this.add
      .tileSprite(
        0,
        0,
        this.cameras.main.width,
        this.cameras.main.height,
        "wall",
      )
      .setOrigin(0)
      .setDepth(-10);

    // Ambient Particles
    this.createAmbientParticles();

    // Table
    const tableY = centerY + 250;
    this.addShadow(centerX, tableY + 150, 6, 2);
    this.add
      .image(centerX, tableY, "table")
      .setDisplaySize(1200, 400)
      .setDepth(1);

    // DEPTH LAYERS:
    // 0: Shadows
    // 1: Wires
    // 2: Base Objects
    // 3: Interactive/Moving Parts

    const switchX = centerX;
    const switchY = centerY + 150;
    const fanX = centerX + 300;
    const fanY = centerY;
    const battX = centerX - 300;
    const battY = centerY;

    // 0: Shadows
    this.addShadow(battX, battY + 100, 1.2, 0.5);
    this.addShadow(fanX, fanY + 100, 1.2, 0.5);
    this.addShadow(switchX, switchY + 50, 1.5, 0.6);

    // 1: Wires (Draw first so they are behind objects)
    const graphics = this.add.graphics().setDepth(1);
    graphics.lineStyle(6, 0x000000);

    // Batt(+) -> Switch
    graphics.beginPath();
    graphics.moveTo(battX, battY - 110); // Batt top
    graphics.lineTo(battX, battY - 150);
    graphics.lineTo(switchX - 50, battY - 150);
    graphics.lineTo(switchX - 50, switchY); // Switch left
    graphics.strokePath();

    // Switch -> Fan
    graphics.beginPath();
    graphics.moveTo(switchX + 50, switchY); // Switch right
    graphics.lineTo(switchX + 50, fanY - 150);
    graphics.lineTo(fanX, fanY - 150);
    graphics.lineTo(fanX, fanY + 50); // Fan motor
    graphics.strokePath();

    // Fan -> Batt(-)
    graphics.beginPath();
    graphics.moveTo(fanX, fanY + 100); // Fan base
    graphics.lineTo(fanX, fanY + 200);
    graphics.lineTo(battX, fanY + 200);
    graphics.lineTo(battX, battY + 100); // Batt bottom
    graphics.strokePath();

    // 2: Base Objects
    const battery = this.add
      .image(battX, battY, "battery")
      .setScale(0.8)
      .setDepth(2);
    const fanStand = this.add
      .image(fanX, fanY, "fan_stand")
      .setScale(0.8)
      .setDepth(2);
    const switchBase = this.add
      .image(switchX, switchY, "switch_base")
      .setScale(1)
      .setDepth(2);

    this.popIn(battery, 0, 0.8);
    this.popIn(fanStand, 100, 0.8);
    this.popIn(switchBase, 200, 1);

    // 3: Moving Parts
    // Fan Stand Center: 128, 150. Motor Center: 128, 130. Diff: -20px.
    // Scaled 0.8: -16px.
    this.fanBlades = this.add
      .image(fanX, fanY - 16, "fan_blades")
      .setScale(0.8)
      .setDepth(3);
    this.popIn(this.fanBlades, 300, 0.8);
    this.isFanOn = false;

    this.lever = this.add
      .image(switchX - 40, switchY, "switch_lever")
      .setOrigin(0.1, 0.5)
      .setDepth(3);
    this.lever.angle = -30;
    this.lever.setInteractive({ useHandCursor: true });
    this.popIn(this.lever, 400, 1);
    this.addInteractionFeedback(this.lever);

    // Particles
    this.particles = this.add.particles("spark").setDepth(10);
    this.emitter = this.particles.createEmitter({
      speed: 100,
      scale: { start: 1, end: 0 },
      blendMode: "ADD",
      lifespan: 500,
      on: false,
    });

    // Hand Hint
    this.hand = this.add
      .text(switchX, switchY - 50, "👆🏻", {
        fontSize: "64px",
        padding: { x: 20, y: 20 },
      })
      .setDepth(20);
    this.tweens.add({
      targets: this.hand,
      y: switchY + 20,
      angle: -10,
      duration: 800,
      yoyo: true,
      repeat: -1,
    });

    this.lever.on("pointerdown", () => {
      if (!this.isFanOn) {
        this.tweens.add({
          targets: this.lever,
          angle: 0,
          duration: 200,
          ease: "Power2",
        });

        this.isFanOn = true;
        this.hand.destroy();

        // Spark Effect at Switch
        this.emitter.setPosition(switchX - 50, switchY);
        this.emitter.explode(15);
        this.emitter.setPosition(switchX + 50, switchY);
        this.emitter.explode(15);

        this.time.delayedCall(2000, () => {
          this.createConfetti();
          this.time.delayedCall(2000, () => {
            this.level++;
            this.startLevel();
          });
        });
      }
    });
  }

  // ================= LEVEL 3 =================
  createLevel3() {
    const centerX = this.cameras.main.width / 2;
    const centerY = this.cameras.main.height / 2;

    // Background
    this.cameras.main.setBackgroundColor("#6BB0E6"); // A slightly richer blue

    // Landscape (Back) - Adjusted position and size for better integration
    this.add
      .image(centerX, centerY + 250, "landscape") // Moved down slightly
      .setDisplaySize(this.cameras.main.width * 1.3, 450) // Slightly larger
      .setDepth(0);

    // Subtle atmospheric overlay
    this.add
      .rectangle(
        centerX,
        centerY,
        this.cameras.main.width,
        this.cameras.main.height,
        0x000000,
        0.1,
      )
      .setDepth(1); // Placed above background elements

    // Animated Clouds
    this.createClouds(); // Depth handled in method

    // Flying Birds
    this.createBirds(); // Depth handled in method

    // Sun
    this.sun = this.add.image(150, 100, "sun").setScale(0.8).setDepth(0);
    this.tweens.add({
      targets: this.sun,
      angle: 360,
      duration: 20000,
      repeat: -1,
    });

    // House
    const houseX = centerX;
    const houseY = centerY + 150; // Lowered to ground it more
    this.addShadow(houseX, houseY + 120, 2.5, 0.7); // Ground Shadow

    const house = this.add
      .image(houseX, houseY, "house_body")
      .setScale(1.1) // Larger house
      .setDepth(2);
    this.popIn(house, 0, 1.1);

    // Windows (Positions adjusted for new House SVG and scale)
    this.windows = [
      this.add
        .image(houseX - 45, houseY + 20, "window") // Corrected position to align with house body
        .setScale(0.65) // Slightly smaller to fit better
        .setDepth(3),
      this.add
        .image(houseX + 45, houseY + 20, "window") // Corrected position to align with house body
        .setScale(0.65) // Slightly smaller to fit better
        .setDepth(3),
    ];
    this.windows.forEach((w, i) => this.popIn(w, 200 + i * 100, 0.65));

    // Solar Panel on Roof
    const panelX = houseX;
    const panelY = houseY - 180; // Adjusted for larger size and roof position

    // Panel Shadow on Roof
    this.addShadow(panelX, panelY + 80, 1.2, 0.3).setDepth(2);

    const panel = this.add
      .image(panelX, panelY, "solar_panel")
      .setScale(1.3) // Much bigger panel
      .setDepth(3);
    this.popIn(panel, 400, 1.3);

    // Particle Manager for Dust
    this.dustParticles = this.add.particles("dust_particle").setDepth(10);
    this.dustEmitter = this.dustParticles.createEmitter({
      speed: 50,
      scale: { start: 0.5, end: 0 },
      alpha: { start: 1, end: 0 },
      lifespan: 500,
      on: false,
    });

    // Dirt
    this.dirtGroup = [];
    for (let i = 0; i < 6; i++) {
      // Spread dirt over the larger panel area
      const dx = Phaser.Math.Between(-80, 80);
      const dy = Phaser.Math.Between(-40, 40);
      const d = this.add
        .image(panelX + dx, panelY + dy, "dirt")
        .setScale(0.6) // Slightly larger dirt
        .setInteractive({ useHandCursor: true })
        .setDepth(4);
      this.dirtGroup.push(d);
      this.popIn(d, 600 + i * 50, 0.6);

      d.on("pointerover", () => {
        this.cleanDirt(d);
      });
    }

    // Ambient Particles
    this.createAmbientParticles();

    // Hand Hint (Dynamic)
    this.hand = this.add
      .text(0, 0, "👆🏻", {
        fontSize: "64px",
        padding: { x: 20, y: 20 },
      })
      .setDepth(20)
      .setVisible(false);

    this.updateHandTarget();
  }

  updateHandTarget() {
    // Find the first active dirt
    const activeDirt = this.dirtGroup.find((d) => d.active);

    if (activeDirt) {
      this.hand.setVisible(true);
      this.hand.setPosition(activeDirt.x + 20, activeDirt.y + 20); // Offset slightly

      // Gentle bobbing animation
      this.tweens.killTweensOf(this.hand);
      this.tweens.add({
        targets: this.hand,
        y: activeDirt.y + 40,
        duration: 500,
        yoyo: true,
        repeat: -1,
      });
    } else {
      this.hand.setVisible(false);
    }
  }

  cleanDirt(dirtParticle) {
    if (!dirtParticle.active) return;

    // Emit Dust
    this.dustEmitter.setPosition(dirtParticle.x, dirtParticle.y);
    this.dustEmitter.explode(8);

    dirtParticle.disableInteractive();
    dirtParticle.active = false; // Mark as inactive immediately for logic

    this.tweens.add({
      targets: dirtParticle,
      scale: 0,
      alpha: 0,
      duration: 200,
      onComplete: () => {
        dirtParticle.destroy();
        this.checkLevel3Completion();
        this.updateHandTarget(); // Update hand to next dirt
      },
    });
  }

  checkLevel3Completion() {
    const remaining = this.dirtGroup.filter((d) => d.active).length; // Check active property or existence
    // Since we destroy in onComplete, but mark active=false immediately, filter by active check we added
    // But dirtParticle.destroy() removes it from scene, not necessarily from array if we don't splice.
    // Better to filter by scene existence or just use the count we track?
    // Let's rely on the array filter. But we need to ensure destroyed objects are handled.
    // Actually, just checking active property is safer if we set it.

    // Re-calculating remaining based on internal active flag or scene active
    const reallyRemaining = this.dirtGroup.filter(
      (d) => d.scene && d.visible,
    ).length;

    if (reallyRemaining === 0) {
      this.hand.destroy();
      // Light up windows - Tint them yellow and add a glow effect
      this.windows.forEach((w) => {
        w.setTint(0xffff00);
        this.tweens.add({
          targets: w,
          alpha: { from: 0.8, to: 1 }, // Subtle pulsing glow
          scale: { from: w.scale, to: w.scale * 1.05 },
          duration: 800,
          yoyo: true,
          repeat: -1,
          ease: "Sine.easeInOut",
        });
      });

      this.time.delayedCall(1000, () => {
        this.createConfetti();
        this.time.delayedCall(2000, () => {
          this.level++;
          this.startLevel();
        });
      });
    }
  }

  // ================= LEVEL 4 =================
  createLevel4() {
    const centerX = this.cameras.main.width / 2;
    const centerY = this.cameras.main.height / 2;

    // Instructions removed

    // Background
    this.cameras.main.setBackgroundColor("#E0E0E0");
    this.add
      .tileSprite(
        0,
        0,
        this.cameras.main.width,
        this.cameras.main.height,
        "wall",
      )
      .setOrigin(0)
      .setDepth(-10)
      .setTint(0xcccccc); // Slightly darker wall

    // Table
    const tableY = centerY + 250;
    this.addShadow(centerX, tableY + 150, 6, 2);
    this.add
      .image(centerX, tableY, "table")
      .setDisplaySize(1200, 400)
      .setDepth(1);

    // Objects
    const battX = centerX - 300;
    const battY = centerY;
    const splitterX = centerX;
    const splitterY = centerY;
    const radioX = centerX + 250;
    const radioY = centerY - 120;
    const bulbX = centerX + 250;
    const bulbY = centerY + 120;

    // Shadows
    this.addShadow(battX, battY + 100, 1.2, 0.5);
    this.addShadow(splitterX, splitterY + 30, 0.8, 0.4);
    this.addShadow(radioX, radioY + 50, 1.0, 0.5);
    this.addShadow(bulbX, bulbY + 100, 1.2, 0.5);

    // Battery
    const battery = this.add
      .image(battX, battY, "battery")
      .setScale(0.8)
      .setDepth(2);
    this.popIn(battery, 0, 0.8);

    // Splitter
    const splitter = this.add
      .image(splitterX, splitterY, "splitter")
      .setScale(1.2)
      .setDepth(2);
    this.popIn(splitter, 200, 1.2);

    // Radio
    this.radio = this.add
      .image(radioX, radioY, "radio")
      .setScale(1)
      .setDepth(2);
    this.popIn(this.radio, 400, 1);

    // Bulb
    this.bulb4 = this.add
      .image(bulbX, bulbY, "bulb_off")
      .setScale(0.8)
      .setDepth(2);
    this.popIn(this.bulb4, 600, 0.8);

    // Fixed Wires: Battery -> Splitter
    const graphics = this.add.graphics().setDepth(1);
    graphics.lineStyle(6, 0x000000);
    // Batt Top -> Splitter Top
    graphics.beginPath();
    graphics.moveTo(battX, battY - 110);
    graphics.lineTo(battX, battY - 160);
    graphics.lineTo(splitterX, battY - 160);
    graphics.lineTo(splitterX, splitterY - 30);
    graphics.strokePath();
    // Batt Bottom -> Splitter Bottom
    graphics.beginPath();
    graphics.moveTo(battX, battY + 100);
    graphics.lineTo(battX, battY + 160);
    graphics.lineTo(splitterX, battY + 160);
    graphics.lineTo(splitterX, splitterY + 30);
    graphics.strokePath();

    // Interactive Wires
    this.wire4_1_connected = false;
    this.wire4_2_connected = false;

    // Pulsing hints
    this.time.delayedCall(1000, () => {
      this.tweens.add({
        targets: [this.radio, this.bulb4],
        scale: 1.1,
        yoyo: true,
        duration: 800,
        repeat: -1,
      });
    });

    // Wire 1: Splitter -> Radio
    this.createDraggableWire(
      splitterX + 30,
      splitterY - 15, // From Splitter Right Top
      radioX - 50,
      radioY + 30, // To Radio Left
      () => {
        this.wire4_1_connected = true;
        // Stop pulsing hint
        this.tweens.killTweensOf(this.radio);
        this.radio.setScale(1);

        // Activate Radio
        this.tweens.add({
          targets: this.radio,
          scale: 1.2,
          yoyo: true,
          duration: 200,
          repeat: -1,
        });
        const note = this.add.text(this.radio.x, this.radio.y - 50, "🎵", {
          fontSize: "40px",
        });
        this.tweens.add({
          targets: note,
          y: note.y - 100,
          alpha: 0,
          duration: 1000,
          onComplete: () => note.destroy(),
        });

        // Spark
        this.emitter.setPosition(this.radio.x - 50, this.radio.y + 30);
        this.emitter.explode(10);

        this.checkLevel4Completion();
      },
    );

    // Wire 2: Splitter -> Bulb
    this.createDraggableWire(
      splitterX + 30,
      splitterY + 15, // From Splitter Right Bottom
      bulbX - 40,
      bulbY + 80, // To Bulb Base
      () => {
        this.wire4_2_connected = true;
        // Stop pulsing hint
        this.tweens.killTweensOf(this.bulb4);
        this.bulb4.setScale(0.8);

        // Activate Bulb
        this.bulb4.setTexture("bulb_on");
        this.tweens.add({
          targets: this.bulb4,
          alpha: { from: 0.8, to: 1 },
          yoyo: true,
          duration: 500,
          repeat: -1,
        });

        // Spark
        this.emitter.setPosition(this.bulb4.x - 40, this.bulb4.y + 80);
        this.emitter.explode(10);

        this.checkLevel4Completion();
      },
    );

    // Particles
    this.particles = this.add.particles("spark").setDepth(10);
    this.emitter = this.particles.createEmitter({
      speed: 100,
      scale: { start: 1, end: 0 },
      blendMode: "ADD",
      lifespan: 500,
      on: false,
    });
  }

  createDraggableWire(startX, startY, targetX, targetY, onSuccess) {
    // Initial Wire Graphics
    const wireGraphics = this.add.graphics().setDepth(1);
    const updateWire = (x, y) => {
      wireGraphics.clear();
      wireGraphics.lineStyle(6, 0xff0000); // Red for positive/hot

      const startPoint = new Phaser.Math.Vector2(startX, startY);
      const endPoint = new Phaser.Math.Vector2(x, y);
      const cp1 = new Phaser.Math.Vector2((startX + x) / 2, startY);
      const cp2 = new Phaser.Math.Vector2((startX + x) / 2, y);

      const curve = new Phaser.Curves.CubicBezier(
        startPoint,
        cp1,
        cp2,
        endPoint,
      );
      curve.draw(wireGraphics);
    };

    // Loose End (Handle)
    // Start near the source but dangling a bit
    const handleX = startX + 50;
    const handleY = startY + 50;
    updateWire(handleX, handleY);

    const handle = this.add
      .circle(handleX, handleY, 20, 0xff0000)
      .setInteractive({ draggable: true, useHandCursor: true })
      .setDepth(5);
    this.addInteractionFeedback(handle);
    this.popIn(handle, 800, 1);

    // Target Zone
    const targetZone = this.add
      .circle(targetX, targetY, 30, 0x00ff00, 0.3)
      .setVisible(false)
      .setDepth(1);

    // Hand Hint
    const hand = this.add
      .text(handleX, handleY, "👆🏻", {
        fontSize: "48px",
        padding: { x: 20, y: 20 },
      })
      .setDepth(20);
    this.tweens.add({
      targets: hand,
      x: targetX,
      y: targetY,
      duration: 1500,
      yoyo: true,
      repeat: -1,
    });

    handle.on("dragstart", () => {
      hand.setVisible(false);
      targetZone.setVisible(true);
    });

    handle.on("drag", (pointer, dragX, dragY) => {
      handle.x = dragX;
      handle.y = dragY;
      updateWire(dragX, dragY);
    });

    handle.on("dragend", () => {
      targetZone.setVisible(false);
      const dist = Phaser.Math.Distance.Between(
        handle.x,
        handle.y,
        targetX,
        targetY,
      );

      if (dist < 50) {
        handle.x = targetX;
        handle.y = targetY;
        updateWire(targetX, targetY);
        handle.disableInteractive();
        onSuccess();
      } else {
        // Reset
        handle.x = handleX;
        handle.y = handleY;
        updateWire(handleX, handleY);
        hand.setVisible(true);
      }
    });
  }

  checkLevel4Completion() {
    if (this.wire4_1_connected && this.wire4_2_connected) {
      this.time.delayedCall(1500, () => {
        this.createConfetti();
        this.time.delayedCall(2000, () => {
          this.level++;
          this.startLevel();
        });
      });
    }
  }

  // ================= LEVEL 5 (Solar Power) =================
  createLevel5() {
    const centerX = this.cameras.main.width / 2;
    const centerY = this.cameras.main.height / 2;

    // Background
    this.cameras.main.setBackgroundColor("#87CEEB"); // Sky Blue

    // Instructions removed

    // Sun (Top Right)
    this.sun = this.add
      .image(this.cameras.main.width - 150, 150, "sun")
      .setScale(0.8);
    this.tweens.add({
      targets: this.sun,
      angle: 360,
      duration: 20000,
      repeat: -1,
    });

    // Ground
    this.add
      .rectangle(
        centerX,
        this.cameras.main.height,
        this.cameras.main.width,
        200,
        0x4caf50,
      )
      .setOrigin(0.5, 1);

    // House (Bottom Left)
    this.house = this.add
      .image(200, this.cameras.main.height - 100, "house_off")
      .setScale(1.0)
      .setOrigin(0.5, 1);

    // Solar Panel (Bottom Rightish)
    this.solarPanel = this.add
      .image(centerX + 200, this.cameras.main.height - 100, "solar_panel")
      .setScale(1.2)
      .setOrigin(0.5, 1);

    // Wire: Panel -> House
    const graphics = this.add.graphics();
    graphics.lineStyle(6, 0x000000);
    graphics.beginPath();
    // From Panel base to House base
    graphics.moveTo(this.solarPanel.x - 40, this.solarPanel.y - 10);
    graphics.lineTo(this.house.x + 60, this.house.y - 10);
    graphics.strokePath();

    // Battery Indicator (Above House)
    this.add
      .rectangle(this.house.x, this.house.y - 250, 104, 24, 0x000000)
      .setOrigin(0.5); // Border
    this.add
      .rectangle(this.house.x, this.house.y - 250, 100, 20, 0xffffff)
      .setOrigin(0.5); // Bg
    this.batteryBar = this.add
      .rectangle(this.house.x - 50, this.house.y - 250, 0, 20, 0x00ff00)
      .setOrigin(0, 0.5);
    this.batteryCharge = 0;

    // Label for battery
    this.add
      .text(this.house.x, this.house.y - 280, "ENERGÍA", {
        fontSize: "20px",
        color: "#000",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    // Clouds (Obstacles)
    this.clouds = [];
    // Place clouds covering the sun initially
    for (let i = 0; i < 3; i++) {
      const cloud = this.add
        .image(
          this.sun.x + Phaser.Math.Between(-80, 80),
          this.sun.y + Phaser.Math.Between(-50, 80),
          "cloud",
        )
        .setInteractive({ draggable: true, useHandCursor: true })
        .setDepth(20); // Above sun

      this.addInteractionFeedback(cloud);

      cloud.on("drag", (pointer, dragX, dragY) => {
        cloud.x = dragX;
        cloud.y = dragY;
      });

      this.clouds.push(cloud);
      this.popIn(cloud, i * 200, 1);
    }

    // Hand Hint (Dynamic Management)
    this.handHint = this.add
      .text(0, 0, "👆🏻", {
        fontSize: "60px",
        padding: { x: 20, y: 20 },
      })
      .setDepth(100)
      .setOrigin(0.5)
      .setVisible(false);

    this.currentBlockingCloud = null;

    // Ray Visualization (Hidden initially)
    this.sunRays = this.add.graphics().setDepth(5);

    // Update Timer for Charging Logic
    this.time.addEvent({
      delay: 100,
      callback: this.updateSolarCharge,
      callbackScope: this,
      loop: true,
    });
  }

  updateHandHint() {
    if (this.level !== 5) return;

    // Find first blocking cloud
    let blockingCloud = null;
    for (const cloud of this.clouds) {
      if (
        Phaser.Math.Distance.Between(cloud.x, cloud.y, this.sun.x, this.sun.y) <
        180
      ) {
        blockingCloud = cloud;
        break; // Point to the first one found
      }
    }

    if (blockingCloud && this.batteryCharge < 100) {
      this.handHint.setVisible(true);

      // Only update tween if target cloud changed or no tween running
      if (this.currentBlockingCloud !== blockingCloud) {
        this.currentBlockingCloud = blockingCloud;

        this.handHint.setPosition(blockingCloud.x, blockingCloud.y);
        this.tweens.killTweensOf(this.handHint);

        this.tweens.add({
          targets: this.handHint,
          x: blockingCloud.x + 100, // Move right
          y: blockingCloud.y + 50, // Move down a bit
          duration: 1500,
          yoyo: true,
          repeat: -1,
        });
      }
    } else {
      this.handHint.setVisible(false);
      this.tweens.killTweensOf(this.handHint);
      this.currentBlockingCloud = null;
    }
  }

  updateSolarCharge() {
    if (this.level !== 5) return; // Safety check
    if (this.batteryCharge >= 100) {
      this.handHint.destroy();
      return;
    }

    this.updateHandHint(); // Update hand hint logic

    // Check if sun is blocked
    let blocked = false;

    this.clouds.forEach((cloud) => {
      // Distance check: if cloud is close to sun
      if (
        Phaser.Math.Distance.Between(cloud.x, cloud.y, this.sun.x, this.sun.y) <
        180
      ) {
        blocked = true;
      }
    });

    this.sunRays.clear();

    if (!blocked) {
      // Charging
      this.batteryCharge += 1; // Charge up speed
      if (this.batteryCharge > 100) this.batteryCharge = 100;

      // Draw Rays
      this.sunRays.lineStyle(4, 0xffff00, 0.6);
      this.sunRays.beginPath();
      // Multiple rays from Sun to Panel
      for (let i = 0; i < 5; i++) {
        this.sunRays.moveTo(this.sun.x, this.sun.y);
        this.sunRays.lineTo(
          this.solarPanel.x + Phaser.Math.Between(-40, 40),
          this.solarPanel.y - 60 + Phaser.Math.Between(-30, 30),
        );
      }
      this.sunRays.strokePath();

      // Update Bar
      this.batteryBar.width = this.batteryCharge;

      if (this.batteryCharge >= 100) {
        this.winLevel5();
      }
    } else {
      // Not charging
      this.sunRays.clear();
    }
  }

  winLevel5() {
    this.house.setTexture("house_on");
    this.sunRays.clear();
    this.time.removeAllEvents(); // Stop update loop

    // Light up effect
    this.tweens.add({
      targets: this.house,
      scale: 1.2,
      yoyo: true,
      duration: 300,
    });

    this.createConfetti();
    this.time.delayedCall(2000, () => {
      this.createWinScreen();
    });
  }

  // ================= WIN SCREEN =================
  createWinScreen() {
    this.children.removeAll(); // Clear everything
    this.cameras.main.setBackgroundColor("#4FC3F7"); // Nice blue

    const centerX = this.cameras.main.width / 2;
    const centerY = this.cameras.main.height / 2;

    // Confetti Loop
    this.createConfetti();
    this.time.addEvent({
      delay: 800,
      callback: () => this.createConfetti(),
      loop: true,
    });

    // Trophy/Icon
    const trophy = this.add
      .text(centerX, centerY - 180, "🏆", { fontSize: "150px" })
      .setOrigin(0.5)
      .setScale(0);

    this.tweens.add({
      targets: trophy,
      scale: 1,
      ease: "Back.out",
      duration: 800,
    });

    // Title
    const title = this.add
      .text(centerX, centerY - 20, "¡FELICITACIONES!", {
        fontSize: "64px",
        fontFamily: "Arial",
        color: "#FFFFFF",
        stroke: "#000000",
        strokeThickness: 8,
        fontStyle: "bold",
      })
      .setOrigin(0.5)
      .setAlpha(0);

    this.tweens.add({
      targets: title,
      alpha: 1,
      y: centerY,
      duration: 800,
      delay: 500,
      ease: "Power2",
    });

    // Subtitle
    const subtitle = this.add
      .text(centerX, centerY + 60, "¡Has completado todos los puzzles!", {
        fontSize: "32px",
        fontFamily: "Arial",
        color: "#FFFFFF",
        stroke: "#000000",
        strokeThickness: 4,
      })
      .setOrigin(0.5)
      .setAlpha(0);

    this.tweens.add({
      targets: subtitle,
      alpha: 1,
      duration: 800,
      delay: 1000,
    });

    // Replay Button
    const btn = this.add.container(centerX, centerY + 180).setAlpha(0);

    const bg = this.add
      .rectangle(0, 0, 320, 80, 0xffeb3b)
      .setStrokeStyle(4, 0xfbc02d)
      .setInteractive({ useHandCursor: true });

    const icon = this.add
      .text(0, 0, "VOLVER A JUGAR", {
        fontSize: "28px",
        color: "#000",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    btn.add([bg, icon]);

    this.tweens.add({
      targets: btn,
      alpha: 1,
      y: centerY + 160,
      duration: 800,
      delay: 1500,
      ease: "Back.out",
    });

    this.addInteractionFeedback(bg);

    bg.on("pointerover", () => {
      bg.setFillStyle(0xfff176);
    });

    bg.on("pointerout", () => {
      bg.setFillStyle(0xffeb3b);
    });

    bg.on("pointerdown", () => {
      this.level = 1;
      this.startLevel();
    });
  }

  createAmbientParticles() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    const particles = this.add.particles("ambient_particle").setDepth(5);
    particles.createEmitter({
      x: { min: 0, max: width },
      y: { min: 0, max: height },
      lifespan: 5000,
      speedY: { min: -10, max: 10 },
      speedX: { min: -10, max: 10 },
      scale: { start: 0.5, end: 0 },
      alpha: { start: 0.5, end: 0 },
      frequency: 200,
      blendMode: "NORMAL",
    });
  }

  createClouds() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    for (let i = 0; i < 4; i++) {
      const x = Phaser.Math.Between(0, width);
      const y = Phaser.Math.Between(20, height / 2);
      const scale = Phaser.Math.FloatBetween(0.5, 1.2);
      const duration = Phaser.Math.Between(30000, 60000);

      const cloud = this.add
        .image(x, y, "cloud")
        .setScale(scale)
        .setAlpha(0.8)
        .setDepth(0.5); // Depth 0.5 (behind house)

      // Initial tween to move off screen
      this.tweens.add({
        targets: cloud,
        x: width + 200,
        duration: (width + 200 - x) / ((width + 400) / duration),
        onComplete: () => {
          cloud.x = -200;
          this.tweens.add({
            targets: cloud,
            x: width + 200,
            duration: duration,
            repeat: -1,
            onRepeat: () => {
              cloud.y = Phaser.Math.Between(20, height / 2);
            },
          });
        },
      });
    }
  }

  createBirds() {
    const width = this.cameras.main.width;

    const bird = this.add.image(-50, 100, "bird").setScale(0.5).setDepth(1);

    this.tweens.add({
      targets: bird,
      x: width + 50,
      y: { from: 100, to: 200, duration: 2000, yoyo: true, repeat: -1 },
      duration: 10000,
      repeat: -1,
      delay: 5000,
      onRepeat: () => {
        bird.y = Phaser.Math.Between(50, 200);
      },
    });
  }

  update() {
    if (this.isFanOn && this.fanBlades) {
      this.fanBlades.rotation += 0.3;
    }
  }
}

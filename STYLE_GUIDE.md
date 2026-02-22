# Guía de Estilo Visual - La Electricidad

## 1. Introducción

Esta guía define los estándares visuales y de diseño para el juego educativo "La Electricidad". El objetivo es asegurar una experiencia coherente, accesible y visualmente atractiva para el público infantil, cumpliendo con los estándares de accesibilidad WCAG 2.1 AA.

## 2. Paleta de Colores

### Colores Principales

La paleta principal se centra en tonos vibrantes pero amigables a la vista, con alto contraste para asegurar la legibilidad.

- **Azul Eléctrico (Fondo/UI):** `#2196F3`
  - Uso: Elementos interactivos, botones primarios.
- **Amarillo Energía (Luz/Activo):** `#FFD700` (`#f1c40f` a `#f39c12` en gradientes)
  - Uso: Bombillas encendidas, rayos, indicadores de éxito, partículas.
- **Gris Neutro (Estructura):** `#424242` (`#7f8c8d` a `#2c3e50` en metales)
  - Uso: Cables, bases de componentes, textos secundarios.
- **Verde Éxito (Feedback):** `#4CAF50`
  - Uso: Indicadores de conexión correcta, validación positiva.
- **Rojo Alerta (Error):** `#F44336` (`#e74c3c` en componentes)
  - Uso: Indicadores de desconexión, validación negativa, filamentos calientes.

### Modo Oscuro (Compatibilidad)

Los assets vectoriales están diseñados para funcionar sobre fondos oscuros sin perder legibilidad.

- **Fondo Oscuro Recomendado:** `#121212`
- **Texto en Modo Oscuro:** `#E0E0E0`

## 3. Tipografía

Se utilizan fuentes redondeadas y legibles para mantener un tono amigable e infantil.

- **Títulos:** `Fredoka One` (Google Fonts)
  - Carácter: Divertido, grueso, impactante.
- **Cuerpo de Texto:** `Quicksand` o `Nunito` (Google Fonts)
  - Carácter: Limpio, legible, moderno.

## 4. Ilustraciones y Assets

### Estilo Gráfico Refinado

- **Material Design Avanzado:** Uso de gradientes sutiles y sombras suaves para dar volumen y realismo sin perder la estética amigable.
- **Iluminación y Brillo:** Efectos de "glow" (resplandor) en elementos activos (bombillas, sol) para feedback visual inmediato.
- **Texturas Vectoriales:** Patrones sutiles (madera, ladrillo, rejillas) aplicados mediante SVG patterns para enriquecer las superficies.

### Especificaciones Técnicas

- **Formato Vectorial:** SVG (Scalable Vector Graphics) para todos los elementos principales.
- **Efectos en SVG:** Uso de `linearGradient`, `radialGradient`, y filtros como `feGaussianBlur` para sombras y resplandores.
- **Optimización:** Código SVG limpio y minificado donde sea posible.

### Organización de Archivos

Los archivos se organizan semánticamente en la carpeta `assets/`:

```
assets/
├── images/
│   ├── battery.svg      # Batería con gradiente metálico
│   ├── bulb_off.svg     # Bombilla cristalina apagada
│   ├── bulb_on.svg      # Bombilla encendida con glow
│   ├── switch_base.svg  # Base industrial
│   ├── switch_lever.svg # Palanca con grip
│   ├── fan_stand.svg    # Soporte ventilador
│   ├── fan_blades.svg   # Aspas con motion blur
│   ├── house_body.svg   # Casa con textura
│   ├── solar_panel.svg  # Panel con reflejos
│   ├── sun.svg          # Sol con cara y rayos
│   ├── landscape.svg    # Fondo con profundidad
│   ├── table.svg        # Mesa con textura de madera
│   ├── dirt.svg         # Mancha de suciedad
│   ├── window.svg       # Ventana con reflejo
│   ├── energy_flow.svg  # Patrón de flujo de energía para fondo animado
│   ├── geometric_pattern.svg # Patrón geométrico para fondo animado
│   └── nature_rhythm.svg # Elementos de naturaleza para fondo animado
├── audio/               # Efectos de sonido
└── fonts/               # Fuentes locales
```

## 5. Diseño por Niveles

### Nivel 1: Circuito Básico

- **Ambiente:** Taller de reparaciones. Pared con panel perforado (`pegboard` pattern) y riel inferior para dar profundidad. Mesa de trabajo de madera.
- **Efectos:**
  - **Ambiente:** Partículas flotantes sutiles.
  - **Partículas:** Chispas (`spark` texture) al conectar.

### Nivel 2: Interruptores y Motores

- **Elementos:** Batería, Interruptor Industrial, Ventilador de Mesa.
- **Fan Rediseñado:**
  - **Estilo:** Industrial/Retro (Azul metálico y gris).
  - **Detalles:** Base con botones de control, cuello articulado, motor trasero visible.
  - **Aspas:** Diseño curvado distintivo con tinte azul para contrastar con la pared.
- **Feedback:** Chispas al activar. Animación de rotación suave.

### Nivel 3: Energía Renovable

- **Ambiente:** Exterior con profundidad multicapa (`landscape.svg`).
  - **Capas:** Montañas distantes (con turbinas eólicas), colinas medias, colinas cercanas.
  - **Cielo:** Gradiente suave integrado.
- **Efectos:**
  - **Animación:** Nubes (`cloud.svg`) desplazándose, pájaros (`bird.svg`), Sol rotando.
  - **Partículas:** Polvo (`dust_particle`) al limpiar.
  - **Iluminación:** Ventanas se iluminan (resplandor amarillo) al completar.

## 6. Animaciones y Feedback

- **Transiciones:** Suaves (tweens) para elementos que aparecen/desaparecen.
- **Partículas:** Uso del sistema de partículas de Phaser para eventos de alto impacto (éxito, limpieza).
- **Indicadores:** Manita animada (`👆🏻`) para guiar al usuario.

## 7. Accesibilidad (WCAG 2.1 AA)

- **Contraste:** Ratio de contraste mínimo de 4.5:1 en elementos esenciales.
- **Independencia del Color:** Feedback reforzado con animaciones y cambios de forma/icono.
- **Áreas Táctiles:** Elementos interactivos grandes (>44px) para fácil manipulación.

---

_Documento actualizado para la versión 2.0 - "La Electricidad"_

const WIDTH = 800;
const HEIGHT = 800;

// UI Labels
const LABELS = {
  NUM_RINGS: "rings: ",
  INNER_RING_RADIUS: "inner ring radius: ",
  OUTER_RING_RADIUS: "outer ring radius: ",
  NUM_CIRCLES: "circles per ring: ",
  LARGE_CIRCLE_RADIUS: "greater circle radius: ",
  SMALL_CIRCLE_RADIUS: "lesser circle radius: ",
  ANIMATE_SPIRAL_DRIFT: "spiral drift",
  ENABLE_BLUR_EFFECT: "radial blur",
  RANDOMIZE_COLORS: "randomize colors",
  ALPHA: "alpha: ",
  ADD_COLOR: "add color"
};

// Slider configuration variables
const NUM_RINGS_CONFIG = { min: 1, max: 32, step: 1 };
const INNER_RING_RADIUS_CONFIG = { min: 0, max: 300, step: 1 };
const OUTER_RING_RADIUS_CONFIG = { min: 0, max: 300, step: 1 };
const NUM_CIRCLES_CONFIG = { min: 1, max: 32, step: 1 };
const SMALL_CIRCLE_RADIUS_CONFIG = { min: 1, max: 60, step: 1 };
const LARGE_CIRCLE_RADIUS_CONFIG = { min: 1, max: 60, step: 1 };
const SPIRAL_DRIFT_CONFIG = { min: 0.0, max: 20 * 3.14159265, step: 3.14159265 / 200.0 }; // error when using p5 PI here
const COLOR_ALPHA_CONFIG = { min: 0, max: 255, step: 1 };

// Slider bracket symbols
const SLIDER_LEFT_BRACKET = "[";
const SLIDER_RIGHT_BRACKET = "]";

// Slider instances
let num_rings_slider;
let inner_ring_radius_slider;
let outer_ring_radius_slider;
let num_circles_slider;
let small_circle_radius_slider;
let large_circle_radius_slider;
let spiral_drift_slider;

// Slider labels
let num_rings_slider_label;
let inner_ring_radius_slider_label;
let outer_ring_radius_slider_label;
let num_circles_slider_label;
let small_circle_radius_slider_label;
let large_circle_radius_slider_label;
let spiral_drift_slider_label;

let randomize_colors_button;
let color_picker;
let add_color_button;
let color_alpha_slider;
let color_alpha_slider_label;
let colors_picked = false;

// Spiral drift animation
let play_sprial_drift = true;
let spiral_drift_enabled_checkbox;

// Radial blur effect
let radial_blur_enabled_checkbox;
let radial_blur_enabled_label;

let colors = [];

// Helper function to generate random value within range with step
function randomInRange(min, max, step) {
  const numSteps = Math.floor((max - min) / step);
  return min + (Math.floor(Math.random() * numSteps) * step);
}

function setup() {
  const canvas = createCanvas(WIDTH, HEIGHT);
  canvas.parent('canvas-container');
  
  // Get controls container
  const controlsContainer = document.getElementById('controls-container');
  
  // Num Rings
  num_rings_slider_label = createP("");
  num_rings_slider_label.parent(controlsContainer);
  const num_rings_wrapper = createDiv();
  num_rings_wrapper.parent(controlsContainer);
  num_rings_wrapper.class('slider-wrapper');
  createP(SLIDER_LEFT_BRACKET).parent(num_rings_wrapper);
  num_rings_slider = createSlider(
    NUM_RINGS_CONFIG.min,
    NUM_RINGS_CONFIG.max,
    // 16 for better performance
    randomInRange(NUM_RINGS_CONFIG.min, 16, NUM_RINGS_CONFIG.step),
    NUM_RINGS_CONFIG.step
  );
  num_rings_slider.parent(num_rings_wrapper);
  createP(SLIDER_RIGHT_BRACKET).parent(num_rings_wrapper);
  
  // Inner Ring Radius
  inner_ring_radius_slider_label = createP("");
  inner_ring_radius_slider_label.parent(controlsContainer);
  const inner_ring_radius_wrapper = createDiv();
  inner_ring_radius_wrapper.parent(controlsContainer);
  inner_ring_radius_wrapper.class('slider-wrapper');
  createP(SLIDER_LEFT_BRACKET).parent(inner_ring_radius_wrapper);
  inner_ring_radius_slider = createSlider(
    INNER_RING_RADIUS_CONFIG.min,
    INNER_RING_RADIUS_CONFIG.max,
    randomInRange(INNER_RING_RADIUS_CONFIG.min, INNER_RING_RADIUS_CONFIG.max, INNER_RING_RADIUS_CONFIG.step),
    INNER_RING_RADIUS_CONFIG.step
  );
  inner_ring_radius_slider.parent(inner_ring_radius_wrapper);
  createP(SLIDER_RIGHT_BRACKET).parent(inner_ring_radius_wrapper);

  // Outer Ring Radius
  outer_ring_radius_slider_label = createP("");
  outer_ring_radius_slider_label.parent(controlsContainer);
  const outer_ring_radius_wrapper = createDiv();
  outer_ring_radius_wrapper.parent(controlsContainer);
  outer_ring_radius_wrapper.class('slider-wrapper');
  createP(SLIDER_LEFT_BRACKET).parent(outer_ring_radius_wrapper);
  outer_ring_radius_slider = createSlider(
    OUTER_RING_RADIUS_CONFIG.min,
    OUTER_RING_RADIUS_CONFIG.max,
    randomInRange(OUTER_RING_RADIUS_CONFIG.min, OUTER_RING_RADIUS_CONFIG.max, OUTER_RING_RADIUS_CONFIG.step),
    OUTER_RING_RADIUS_CONFIG.step
  );
  outer_ring_radius_slider.parent(outer_ring_radius_wrapper);
  createP(SLIDER_RIGHT_BRACKET).parent(outer_ring_radius_wrapper);

  // Num Circles
  num_circles_slider_label = createP("");
  num_circles_slider_label.parent(controlsContainer);
  const num_circles_wrapper = createDiv();
  num_circles_wrapper.parent(controlsContainer);
  num_circles_wrapper.class('slider-wrapper');
  createP(SLIDER_LEFT_BRACKET).parent(num_circles_wrapper);
  num_circles_slider = createSlider(
    NUM_CIRCLES_CONFIG.min,
    NUM_CIRCLES_CONFIG.max,
    // 8 for better performance and it just looks better
    randomInRange(NUM_CIRCLES_CONFIG.min, 8, NUM_CIRCLES_CONFIG.step),
    NUM_CIRCLES_CONFIG.step
  );
  num_circles_slider.parent(num_circles_wrapper);
  createP(SLIDER_RIGHT_BRACKET).parent(num_circles_wrapper);

  // Small Circle Radius
  small_circle_radius_slider_label = createP("");
  small_circle_radius_slider_label.parent(controlsContainer);
  const small_circle_radius_wrapper = createDiv();
  small_circle_radius_wrapper.parent(controlsContainer);
  small_circle_radius_wrapper.class('slider-wrapper');
  createP(SLIDER_LEFT_BRACKET).parent(small_circle_radius_wrapper);
  small_circle_radius_slider = createSlider(
    SMALL_CIRCLE_RADIUS_CONFIG.min,
    SMALL_CIRCLE_RADIUS_CONFIG.max,
    randomInRange(SMALL_CIRCLE_RADIUS_CONFIG.min, SMALL_CIRCLE_RADIUS_CONFIG.max, SMALL_CIRCLE_RADIUS_CONFIG.step),
    SMALL_CIRCLE_RADIUS_CONFIG.step
  );
  small_circle_radius_slider.parent(small_circle_radius_wrapper);
  createP(SLIDER_RIGHT_BRACKET).parent(small_circle_radius_wrapper);

  // Large Circle Radius
  large_circle_radius_slider_label = createP("");
  large_circle_radius_slider_label.parent(controlsContainer);
  const large_circle_radius_wrapper = createDiv();
  large_circle_radius_wrapper.parent(controlsContainer);
  large_circle_radius_wrapper.class('slider-wrapper');
  createP(SLIDER_LEFT_BRACKET).parent(large_circle_radius_wrapper);
  large_circle_radius_slider = createSlider(
    LARGE_CIRCLE_RADIUS_CONFIG.min,
    LARGE_CIRCLE_RADIUS_CONFIG.max,
    randomInRange(LARGE_CIRCLE_RADIUS_CONFIG.min, LARGE_CIRCLE_RADIUS_CONFIG.max, LARGE_CIRCLE_RADIUS_CONFIG.step),
    LARGE_CIRCLE_RADIUS_CONFIG.step
  );
  large_circle_radius_slider.parent(large_circle_radius_wrapper);
  createP(SLIDER_RIGHT_BRACKET).parent(large_circle_radius_wrapper);

  // Spiral Drift
  spiral_drift_slider_label = createP(LABELS.ANIMATE_SPIRAL_DRIFT);
  spiral_drift_slider_label.parent(controlsContainer);
  
  // Create a wrapper for spiral drift checkbox and slider
  const spiralDriftWrapper = createDiv();
  spiralDriftWrapper.parent(controlsContainer);
  spiralDriftWrapper.class('spiral-drift-wrapper');
  
  spiral_drift_enabled_checkbox = createCheckbox("", true);
  spiral_drift_enabled_checkbox.parent(spiralDriftWrapper);
  
  const spiral_drift_slider_bracket_wrapper = createDiv();
  spiral_drift_slider_bracket_wrapper.parent(spiralDriftWrapper);
  spiral_drift_slider_bracket_wrapper.class('slider-wrapper');
  createP(SLIDER_LEFT_BRACKET).parent(spiral_drift_slider_bracket_wrapper);
  spiral_drift_slider = createSlider(
    SPIRAL_DRIFT_CONFIG.min,
    SPIRAL_DRIFT_CONFIG.max,
    0.0,
    SPIRAL_DRIFT_CONFIG.step
  );
  spiral_drift_slider.parent(spiral_drift_slider_bracket_wrapper);
  createP(SLIDER_RIGHT_BRACKET).parent(spiral_drift_slider_bracket_wrapper);

  // Blur effect checkbox
  radial_blur_enabled_checkbox = createCheckbox(LABELS.ENABLE_BLUR_EFFECT, false);
  radial_blur_enabled_checkbox.parent(controlsContainer);

  // 3 layers per circle, so 3 colors per circle
  generate_random_colors(NUM_CIRCLES_CONFIG.max * NUM_RINGS_CONFIG.max * 3);

  // Randomize Colors Button
  randomize_colors_button = createButton(LABELS.RANDOMIZE_COLORS);
  randomize_colors_button.parent(controlsContainer);
  randomize_colors_button.mousePressed(randomizeColorsButtonPressed);

  // Create a wrapper for color picker controls
  const colorControlsWrapper = createDiv();
  colorControlsWrapper.parent(controlsContainer);
  colorControlsWrapper.class('color-controls-wrapper');

  // Color Picker
  color_picker = createColorPicker('#ffffff');
  color_picker.parent(colorControlsWrapper);

  // Color Alpha Slider
  color_alpha_slider_label = createP(LABELS.ALPHA + "200");
  color_alpha_slider_label.parent(colorControlsWrapper);
  const color_alpha_wrapper = createDiv();
  color_alpha_wrapper.parent(colorControlsWrapper);
  color_alpha_wrapper.class('slider-wrapper');
  createP(SLIDER_LEFT_BRACKET).parent(color_alpha_wrapper);
  color_alpha_slider = createSlider(0, 255, 200, 1);
  color_alpha_slider.parent(color_alpha_wrapper);
  createP(SLIDER_RIGHT_BRACKET).parent(color_alpha_wrapper);

  // Add Color Button
  add_color_button = createButton(LABELS.ADD_COLOR);
  add_color_button.parent(controlsContainer);
  add_color_button.mousePressed(addColorButtonPressed);
}

function generate_random_colors(num_colors) {
    colors_picked = false;
    colors = [];
    for (let i = 0; i < num_colors; i++) {
        colors.push(color(random(255), random(255), random(255), random(50, 200)));
    }
}

function randomizeColorsButtonPressed() {
    generate_random_colors(NUM_CIRCLES_CONFIG.max * NUM_RINGS_CONFIG.max * 3);
}

function addColorButtonPressed() {
    if (!colors_picked) {
        colors = [];
        colors_picked = true;
    }

    // Get the selected color from the color picker and add it
    let selectedColor = color_picker.value();
    let selectedAlpha = color_alpha_slider.value();

    let c = color(red(selectedColor), green(selectedColor), blue(selectedColor), selectedAlpha);

    colors.push(c);
}

function random_fill() {
    fill(random(255), random(255), random(255), random(50, 200));
}

function draw_ring_of_circles(
  ring_radius, 
  num_circles, 
  circle_radius,
  spiral_drift = 1.0
) {
  for(let i = 0; i < num_circles; i++) 
  {
    // calculate angle for current circle
    let circle_position_theta = (TWO_PI / num_circles) * i
    
    // add spiral drift
    circle_position_theta += spiral_drift;
    
    // calculate circle position based on ring radius and angle
    let circle_position_x = WIDTH/2 + (ring_radius * cos(circle_position_theta));
    let circle_position_y = HEIGHT/2 + (ring_radius * sin(circle_position_theta));   
    
    noStroke();

    // draw 3 circles with different radii and colors to create a glow effect

    //fill(100, 200, 255, 50); // Transparent blue
    fill(colors[(i * 3) % colors.length]);
    circle(circle_position_x, circle_position_y, circle_radius * 1.0); // Outer glow
    
    //fill(100, 200, 255, 150);
    fill(colors[(i * 3 + 1) % colors.length]);
    circle(circle_position_x, circle_position_y, circle_radius * .75); // Mid glow

    //fill(255, 255, 255, 255);
    fill(colors[(i * 3 + 2) % colors.length]);
    circle(circle_position_x, circle_position_y, circle_radius * 0.5); // Core 
  }
}

function draw_rings_of_circles(
  num_rings,
  inner_ring_radius, 
  outer_ring_radius,
  num_circles,
  small_circle_radius, 
  large_circle_radius,
  spiral_drift = 1.0
) {

    let circle_radius_step = (large_circle_radius - small_circle_radius) / num_circles;
    let ring_radius_step = (outer_ring_radius - inner_ring_radius) / num_rings;
  
    for(let i = 0; i < num_rings; i++)
    {
        let ring_radius = inner_ring_radius + ring_radius_step * i;
        let circle_radius = small_circle_radius + circle_radius_step * i;
    
    draw_ring_of_circles(
        ring_radius, 
        num_circles, 
        circle_radius, 
        spiral_drift * (1.0 + i/num_rings)
    );  
    
    // adds a slight blur after drawing each ring to create a more dramatic glow effect that radiates outward from the center
    if (radial_blur_enabled_checkbox.checked()) {
      filter(BLUR, 3); // Soften everything
    }
  }
}

function draw() 
{
  background(20);
  
  let num_rings = num_rings_slider.value();
  num_rings_slider_label.html(LABELS.NUM_RINGS + num_rings_slider.value())
  
  let inner_ring_radius = inner_ring_radius_slider.value();
  inner_ring_radius_slider_label.html(LABELS.INNER_RING_RADIUS + inner_ring_radius_slider.value())
  
  let outer_ring_radius = outer_ring_radius_slider.value();
  outer_ring_radius_slider_label.html(LABELS.OUTER_RING_RADIUS + outer_ring_radius_slider.value())
    
  let num_circles = num_circles_slider.value();
  num_circles_slider_label.html(LABELS.NUM_CIRCLES + num_circles_slider.value())
  
  let small_circle_radius = small_circle_radius_slider.value();
  small_circle_radius_slider_label.html(LABELS.SMALL_CIRCLE_RADIUS + small_circle_radius_slider.value())
  
  let large_circle_radius = large_circle_radius_slider.value();
  large_circle_radius_slider_label.html(LABELS.LARGE_CIRCLE_RADIUS + large_circle_radius_slider.value())
  
  // Update alpha slider label
  color_alpha_slider_label.html(LABELS.ALPHA + color_alpha_slider.value())
  
//   let spiral_drift = spiral_drift_slider.value();
//   spiral_drift_slider_label.html('spiral drift: ' + spiral_drift_slider.value())

  if (spiral_drift_enabled_checkbox.checked()) {
    spiral_drift_slider.value(spiral_drift_slider.value() + SPIRAL_DRIFT_CONFIG.step);

    if (spiral_drift_slider.value() >= SPIRAL_DRIFT_CONFIG.max - SPIRAL_DRIFT_CONFIG.step) {
        spiral_drift_slider.value(SPIRAL_DRIFT_CONFIG.min);
    }
  }

  let spiral_drift = spiral_drift_slider.value();


  // animated spiral drift
//   let spiral_drift = PI/400 * frameCount;

  draw_rings_of_circles(
    num_rings,
    inner_ring_radius, 
    outer_ring_radius,
    num_circles,
    small_circle_radius, 
    large_circle_radius,
    spiral_drift
  );
  
  filter(BLUR, 5); // Soften everything
}
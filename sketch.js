const WIDTH = 800;
const HEIGHT = 800;

// Slider configuration variables
const NUM_RINGS_CONFIG = { min: 1, max: 16, step: 1 };
const INNER_RING_RADIUS_CONFIG = { min: 0, max: 300, step: 1 };
const OUTER_RING_RADIUS_CONFIG = { min: 0, max: 300, step: 1 };
const NUM_CIRCLES_CONFIG = { min: 1, max: 32, step: 1 };
const SMALL_CIRCLE_RADIUS_CONFIG = { min: 1, max: 60, step: 1 };
const LARGE_CIRCLE_RADIUS_CONFIG = { min: 1, max: 60, step: 1 };
const SPIRAL_DRIFT_CONFIG = { min: 0.0, max: 20 * 3.14159265, step: 3.14159265 / 200.0 }; // error when using p5 PI here

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
  createCanvas(WIDTH, HEIGHT);
  
  // Num Rings
  num_rings_slider_label = createP("");
  num_rings_slider = createSlider(
    NUM_RINGS_CONFIG.min,
    NUM_RINGS_CONFIG.max,
    randomInRange(NUM_RINGS_CONFIG.min, NUM_RINGS_CONFIG.max, NUM_RINGS_CONFIG.step),
    NUM_RINGS_CONFIG.step
  );
  
  // Inner Ring Radius
  inner_ring_radius_slider_label = createP("");
  inner_ring_radius_slider = createSlider(
    INNER_RING_RADIUS_CONFIG.min,
    INNER_RING_RADIUS_CONFIG.max,
    randomInRange(INNER_RING_RADIUS_CONFIG.min, INNER_RING_RADIUS_CONFIG.max, INNER_RING_RADIUS_CONFIG.step),
    INNER_RING_RADIUS_CONFIG.step
  );

  // Outer Ring Radius
  outer_ring_radius_slider_label = createP("");
  outer_ring_radius_slider = createSlider(
    OUTER_RING_RADIUS_CONFIG.min,
    OUTER_RING_RADIUS_CONFIG.max,
    randomInRange(OUTER_RING_RADIUS_CONFIG.min, OUTER_RING_RADIUS_CONFIG.max, OUTER_RING_RADIUS_CONFIG.step),
    OUTER_RING_RADIUS_CONFIG.step
  );

  // Num Circles
  num_circles_slider_label = createP("");
  num_circles_slider = createSlider(
    NUM_CIRCLES_CONFIG.min,
    NUM_CIRCLES_CONFIG.max,
    randomInRange(NUM_CIRCLES_CONFIG.min, NUM_CIRCLES_CONFIG.max, NUM_CIRCLES_CONFIG.step),
    NUM_CIRCLES_CONFIG.step
  );

  // Small Circle Radius
  small_circle_radius_slider_label = createP("");
  small_circle_radius_slider = createSlider(
    SMALL_CIRCLE_RADIUS_CONFIG.min,
    SMALL_CIRCLE_RADIUS_CONFIG.max,
    randomInRange(SMALL_CIRCLE_RADIUS_CONFIG.min, SMALL_CIRCLE_RADIUS_CONFIG.max, SMALL_CIRCLE_RADIUS_CONFIG.step),
    SMALL_CIRCLE_RADIUS_CONFIG.step
  );

  // Large Circle Radius
  large_circle_radius_slider_label = createP("");
  large_circle_radius_slider = createSlider(
    LARGE_CIRCLE_RADIUS_CONFIG.min,
    LARGE_CIRCLE_RADIUS_CONFIG.max,
    randomInRange(LARGE_CIRCLE_RADIUS_CONFIG.min, LARGE_CIRCLE_RADIUS_CONFIG.max, LARGE_CIRCLE_RADIUS_CONFIG.step),
    LARGE_CIRCLE_RADIUS_CONFIG.step
  );

  // Spiral Drift
  spiral_drift_slider_label = createP("");
  spiral_drift_slider = createSlider(
    SPIRAL_DRIFT_CONFIG.min,
    SPIRAL_DRIFT_CONFIG.max,
    0.0,
    SPIRAL_DRIFT_CONFIG.step
  );
  spiral_drift_enabled_checkbox = createCheckbox('Animate Spiral Drift', true);

  // Blur effect checkbox
  radial_blur_enabled_checkbox = createCheckbox('Enable Blur Effect', false);

  // 3 layers per circle, so 3 colors per circle
  generate_random_colors(NUM_CIRCLES_CONFIG.max * NUM_RINGS_CONFIG.max * 3);

  // Randomize Colors Button
  randomize_colors_button = createButton('Randomize Colors');
  randomize_colors_button.mousePressed(randomizeColorsButtonPressed);
}

function generate_random_colors(num_colors) {
    colors = [];
    for (let i = 0; i < num_colors; i++) {
        colors.push(color(random(255), random(255), random(255), random(50, 200)));
    }
}

function randomizeColorsButtonPressed() {
    generate_random_colors(NUM_CIRCLES_CONFIG.max * NUM_RINGS_CONFIG.max * 3);
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
    fill(colors[i * 3]);
    circle(circle_position_x, circle_position_y, circle_radius * 1.0); // Outer glow
    
    //fill(100, 200, 255, 150);
    fill(colors[i * 3 + 1]);
    circle(circle_position_x, circle_position_y, circle_radius * .75); // Mid glow

    //fill(255, 255, 255, 255);
    fill(colors[i * 3 + 2]);
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
  num_rings_slider_label.html('# rings: ' + num_rings_slider.value())
  
  let inner_ring_radius = inner_ring_radius_slider.value();
  inner_ring_radius_slider_label.html('inner ring radius: ' + inner_ring_radius_slider.value())
  
  let outer_ring_radius = outer_ring_radius_slider.value();
  outer_ring_radius_slider_label.html('outer ring radius: ' + outer_ring_radius_slider.value())
    
  let num_circles = num_circles_slider.value();
  num_circles_slider_label.html('# circles per ring: ' + num_circles_slider.value())
  
  let small_circle_radius = small_circle_radius_slider.value();
  small_circle_radius_slider_label.html('small circle radius: ' + small_circle_radius_slider.value())
  
  let large_circle_radius = large_circle_radius_slider.value();
  large_circle_radius_slider_label.html('large circle radius: ' + large_circle_radius_slider.value())
  
  
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
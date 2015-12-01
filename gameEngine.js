// settings
var width = 512;
var height = 480;
var frame_rate = 1 / 40; // Seconds
var frame_delay = frame_rate * 1000; // ms
var loop_timer = 0;
var bird_size = 60;
var seed_size = 30;
var ay = 0.2;  // m / s^2
var ax = 0.1; // m / s^2
var total_seed = 0;
//

var canvas = document.createElement("canvas");
var context = canvas.getContext("2d");


canvas.width = width;
canvas.height = height;
document.body.appendChild(canvas);

// keyboard controls
var keys_down = {};

addEventListener("keydown", function (e) {
    keys_down[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
    delete keys_down[e.keyCode];
}, false);

// backgrpund
var back_ready = false;
var back_img = new Image();
back_img.onload = function () {
    back_ready = true;
};
back_img.src = "back.jpg";

// bird
var bird_img = new Image();
bird_img.src = "bird.png";

// bird
var bird = {
    position: {x: width / 2, y: height / 2},
    speed: 128,
    velocity: {x: 0, y: 0},
    mass: 0.1,
    restitution: -0.3
};

var seeds = [];
function seed() {
    this.id = Math.floor((Math.random() * 2) + 1);
    this.position = {x: width + seed_size, y: Math.floor(Math.random() * (height - seed_size))};
    this.speed = Math.random() * 60 + 20;
};

function reindex_array(array) {
    var result = [];
    for (var key in array)
        result.push(array[key]);
    return result;
};

// rendering everything
var render = function () {
    if (back_ready) {
        context.drawImage(back_img, 0, 0, back_img.width, back_img.height, 0, 0, width, height); // stretching the image to the canvas size
        context.drawImage(bird_img, bird.position.x, bird.position.y, bird_size, bird_size);
        for (var i = 0; i < seeds.length; i++) {
            // seeds 
            var current_seed = seeds[i];
            var seed_img = new Image();
            seed_img.src = "seed0" + current_seed.id + ".png";
            context.drawImage(seed_img, current_seed.position.x, current_seed.position.y, seed_size, seed_size);
        }
    }
    // score
    context.fillStyle = "rgb(250, 250, 250)";
    context.font = "24px Helvetica";
    context.textAlign = "left";
    context.textBaseline = "top";
    context.fillText("Total Score: " + total_seed, 10, 10);
};

var main = function () {
    var now = Date.now();
    var delta = now - then;
    update(delta / 1000);
    render();
    var create_new_seed = Math.random() * 10;

    if ((now - time) > 1000) {
        time = now;
        if (create_new_seed > 6) {
            seeds[seeds.length] = new seed();
        }
    }
    then = now;
    requestAnimationFrame(main);
};

function gePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

function update(delay) {
    var modifier = bird.speed * delay;
    bird.velocity.y += ay * frame_rate;
    bird.velocity.x += ax * frame_rate;

    bird.position.y += bird.velocity.y * frame_rate * 100;
    bird.position.x += bird.velocity.x * frame_rate * 100;

    for (var i = 0; i < seeds.length; i++) {
        var current_seed = seeds[i];
        current_seed.position.x -= current_seed.speed * frame_rate;
        var touched = false;
        if (bird.position.x <= (current_seed.position.x + bird_size)
                && current_seed.position.x <= (bird.position.x + bird_size)
                && bird.position.y <= (current_seed.position.y + bird_size)
                && current_seed.position.y <= (bird.position.y + +bird_size)
                ) {
            total_seed++;
            console.log(total_seed);
            touched = true;
        }
        if (current_seed.position.x < -seed_size / 2 || touched) {
            delete seeds[i];
            seeds = reindex_array(seeds);
        }
    }

    if (keys_down[38]) { // up
        bird.velocity.y -= ay * frame_rate;
        bird.position.y -= (bird.velocity.y * frame_rate * 100 + modifier);
    }
    if (keys_down[40]) { // down
        bird.position.y += modifier;
    }
    if (keys_down[37]) { // left
        if (ax > 0)
            ax = -ax;
        bird.velocity.x = ax;
        bird.position.x -= (bird.velocity.x * frame_rate * 100 + modifier);
    }
    if (keys_down[39]) { // right
        if (ax < 0)
            ax = -ax;
        bird.velocity.x = ax;
        bird.position.x += modifier;
    }

    if (bird.position.y > height - bird_size) {
        bird.velocity.y *= bird.restitution;
        bird.position.y = height - bird_size;
    }
    if (bird.position.y < 0) {
        bird.velocity.y *= bird.restitution;
        bird.position.y = 0;
    }
    if (bird.position.x > width - bird_size) {
        bird.velocity.x *= bird.restitution;
        bird.position.x = width - bird_size;
    }
    if (bird.position.x < 0) {
        bird.velocity.x *= bird.restitution;
        bird.position.x = 0;
    }
};

var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;
var then = Date.now();
var time = Date.now();
main();
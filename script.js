const canvas = document.getElementById("radar");
const ctx = canvas.getContext("2d");

let x = 0;
let y = 30;
const planes = [];
let posPool = [];
const fullWidth = document.documentElement.scrollWidth;
const fullHeight = document.documentElement.scrollHeight;
const info = document.querySelector(".info");
let totalPlanes = 40;
let maxAltitude = 4;

const alt = document.querySelector(".alt");

// alt.addEventListener("input",(e)=>{
//   maxAltitude = e.target.value
// })

canvas.width = fullWidth;
canvas.height = fullHeight;

function getRandomNumber(max) {
  return Math.floor(Math.random() * max) + 1;
}

function getRandomAircraftName() {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  let apNumber = [];
  for (let i = 0; i < 3; i++) {
    let choice = alphabet[getRandomNumber(alphabet.length)];
    while (!apNumber.includes(choice)) {
      choice = alphabet[getRandomNumber(alphabet.length)];
      apNumber.push(choice);
    }
  }
  return apNumber.join("");
}

function checkExist(arr) {
  [x, y] = arr;
  posPool.forEach(([xC, yC]) => {
    if (x == xC && y == yC) {
      return true;
    }
  });
  return false;
}

const generateUniqueCoordinates = () => {
  let coordinates = [getRandomNumber(fullWidth), getRandomNumber(fullHeight)];

  while (checkExist(coordinates)) {
    coordinates = [getRandomNumber(fullWidth), getRandomNumber(fullHeight)];
  }

  return coordinates;
};

for (let i = 0; i < totalPlanes; i++) {
  const planeObj = {
    name: `${getRandomAircraftName()}${getRandomNumber(100)}`,
    pos: generateUniqueCoordinates(),
    altitude: getRandomNumber(maxAltitude),
    aircraft: "Airbus",
    speed: getRandomNumber(5),
    angle: getRandomNumber(100),
    color: "lime",
  };
  planes.push(planeObj);
}

function updatePos() {
  posPool = [];
  planes.forEach((el) => {
    [x, y] = el.pos;

    if (x > fullWidth) {
      let newCoordinates = generateUniqueCoordinates(3);
      el.pos = [0, 0];
    }
    if (y > fullHeight) {
      let newCoordinates = generateUniqueCoordinates(3);
      el.pos = [0, 0];
    }
    x += Math.cos(el.angle) * el.speed;
    y += Math.sin(el.angle) * el.speed;
    let pos = [x, y];
    el.pos = pos;
    posPool.push(pos);
  });
}
function checkCollision(coordinates, altitude) {
  let [x, y] = coordinates;

  let plane = planes.find((plane) => {
    if (plane.altitude !== altitude) return false;

    const [cX, cY] = plane.pos;
    const size = 40; // rectangle size

    // Check bounding box collision
    return x < cX + size && x + size > cX && y < cY + size && y + size > cY;
  });

  return plane; // returns the first colliding plane or undefined
}

function draw() {
  info.innerHTML = "";
  info.insertAdjacentHTML(
    "beforeend",
    `

    <p>Total aircrafts -> ${totalPlanes} <input type="range" id="totalAircrafts" value=${totalPlanes} max="100"></input></p>
    <p>Maximum Altitude -> ${maxAltitude} <input type="range" id="alt" value=${maxAltitude} max="400"></input></p>
    <section id="simulator-description">
  <h2>Aircraft Radar Simulator</h2>
  <p>
    This interactive simulator displays multiple aircraft moving in real time across a dynamic radar screen. 
    Each plane has unique properties, including position, speed, altitude, trajectory, and identification.
  </p>
  <ul>
    <li><strong>Realistic radar display:</strong> Planes are represented as rectangles with outlines and labels showing their call sign, altitude, and speed.</li>
    <li><strong>Dynamic trajectories:</strong> Each aircraft moves along a unique path, allowing for complex interactions and realistic flight patterns.</li>
    <li><strong>Collision detection:</strong> The system detects overlaps between aircraft at the same altitude, highlighting potential conflicts.</li>
    <li><strong>Responsive design:</strong> The radar canvas dynamically adjusts to the screen size for seamless display on any device.</li>
    <li><strong>Randomized aircraft generation:</strong> Each plane is assigned a unique call sign and flight parameters to simulate real-world air traffic variability.</li>
  </ul>
  <p>
    This simulator is a learning and visualization tool for aviation enthusiasts, providing hands-on experience with aircraft positioning, movement, and radar operations.
  </p>
</section>
    `,
  );

  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, fullWidth, fullHeight);
  planes.forEach((el) => (el.color = "lime")); // reset all colors first

  planes.forEach((el) => {
    let [x, y] = el.pos;

    planes.forEach((el) => {
      let collision = checkCollision(el.pos, el.altitude);
      if (collision && collision !== el) {
        // avoid self-collision
        el.color = "red";
        collision.color = "red";
      }
    });
    ctx.strokeStyle = el.color; // outline color
    ctx.lineWidth = 1; // thickness of the outline

    // Draw rectangle outline at (x, y) with width and height
    ctx.strokeRect(x, y, 10, 10);
    ctx.fillStyle = "white";
    ctx.font = "10px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(el.name, x + 40, y + 10);
    ctx.fillText(`Alt ${el.altitude}ft`, x + 40, y + 20);
    ctx.fillText(`${el.speed}knots`, x + 40, y + 30);
    ctx.beginPath();
    ctx.moveTo(x + 20, y + 20); // start point
    ctx.lineTo(x + 10, y + 10); // end point
    ctx.strokeStyle = "white"; // line color
    ctx.lineWidth = 1; // line thickness
    ctx.stroke();
  });

  updatePos();

  setTimeout(() => {
    requestAnimationFrame(draw);
  }, 500);
}

draw();

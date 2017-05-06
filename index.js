// let a = 13
// let b = 29
// let c = 9.0 / 3.0
// for ( i = 0; i < 200000; i ++ ) {
//   let dx = (a * (y-x)) * dt;
//   let dy = (x * (b-z) - y) * dt;
//   let dz = (x * y - c * z) * dt;
//   x += dx
//   y += dy
//   z += dz
// 	var vertex = new THREE.Vector3();
// 	vertex.x = x * 10
// 	vertex.y = y * 10
// 	vertex.z = z * 10
// 	geometry.vertices.push( vertex )
// }
const gd = require('node-gd')
const chroma = require('chroma-js')
const Chance = require('chance'),
    chance = new Chance();
const burntOrange = '#892513'
const orangeBrown = '#AC4315'
const yellowOrange = '#F0BB64'
const lightTeal = '#EFFCFD'
const deepBlue = '#0C277E'
const deepOcean = '#001B5B'
const lightBlue = '#B7D7F0'
const chocolate = '#D2691E'
const gold = '#F8DC57'
const black = 'black'
const white = 'white'
//const colors = [deepBlue,gold,burntOrange,gold,deepBlue]
//const C_SCALE = chroma.scale('Spectral').domain([1,0])
//const C_SCALE = chroma.bezier(colors);
//const C_SCALE = chroma.scale(colors.reverse())
const colors = [chocolate,yellowOrange,lightTeal,deepOcean]
const C_SCALE = chroma.scale(colors.reverse())

//[-0.8, -0.1, 0.7, -0.7, 0.1, -0.6, 1.2, -0.5, -1.1, 0.7, 0.7, -0.3]
//[-1.1, 1.1, 0.7, 0.8, 0.3, 0.8, -0.9, 0.8, -0.2, 0.9, -0.9, -0.3]
//[-0.3, -1, -0.6, -0.5, 0, 0.2, 0.7, -1.2, 0.2, -0.7, -0.1, -0.9]
    //let [nx, ny] = quibicMapNext(x,y, [0, 0, -0.5, -0.6, -0.4, 0.1, -1.1, 0.2, 0.1, -0.8, 0.9, 0.5])
const LETTER_MAP = new Map
LETTER_MAP.set('A', -1.2)
LETTER_MAP.set('B', -1.1)
LETTER_MAP.set('C', -1.0)
LETTER_MAP.set('D', -0.9)
LETTER_MAP.set('E', -0.8)
LETTER_MAP.set('F', -0.7)
LETTER_MAP.set('G', -0.6)
LETTER_MAP.set('H', -0.5)
LETTER_MAP.set('I', -0.4)
LETTER_MAP.set('J', -0.3)
LETTER_MAP.set('K', -0.2)
LETTER_MAP.set('L', -0.1)
LETTER_MAP.set('M', 0.0)
LETTER_MAP.set('N', 0.1)
LETTER_MAP.set('O', 0.2)
LETTER_MAP.set('P', 0.3)
LETTER_MAP.set('Q', 0.4)
LETTER_MAP.set('R', 0.5)
LETTER_MAP.set('S', 0.6)
LETTER_MAP.set('T', 0.7)
LETTER_MAP.set('U', 0.8)
LETTER_MAP.set('V', 0.9)
LETTER_MAP.set('W', 1.0)
LETTER_MAP.set('X', 1.1)
LETTER_MAP.set('Y', 1.2)

const LETTER_ARRAY = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y']

function randInt(min,max) {
  return Math.floor(Math.random() * max) + min
}

function randLetterArray () {
  let a = []
  let fileName = ''
  for(let i =0; i < 12; i++) {
    const letter = chance.pickone(LETTER_ARRAY)
    fileName += letter
    const v = LETTER_MAP.get(letter)
    a.push(v)
  }
  return [fileName,a]
}

function quibicMapNext (x, y, a) {
  const x2 = pow(x,2)
  const y2 = pow(y,2)
  const nextX = a[0] + a[1] * x + a[2] * x2 + a[3] * x * y + a[4] * y + a[5] * y2
  const nextY = a[6] + a[7] * x + a[8] * x2 + a[9] * x * y + a[10] * y + a[11] * y2
  return [nextX, nextY]
}

function pow(x, n) {
  return Math.pow(x,n)
}

function makeImage(letterArray, fileName) {
  return new Promise(resolve => {
    let x = 0.1
    let y = 0.1
    let maxX = 1
    let maxY = 1
    let minX = 1
    let minY = 1
    const ZOOM = 300
    let points = []
  	for ( i = 0; i < 50000; i ++ ) {
      //let [nx, ny] = quibicMapNext(x,y, [G,I,I,E,T,P,I,Q,R,R,U,L])
      let [nx, ny] = quibicMapNext(x,y, letterArray)
      x = nx
      y = ny
      xZoom = x * ZOOM
      yZoom = y * ZOOM
  		points.push([Math.floor(x * ZOOM),Math.floor(y * ZOOM)])
      if(yZoom > maxY) maxY = Math.floor(yZoom)
      if(xZoom > maxX) maxX = Math.floor(xZoom)
      if(yZoom < minY) minY = Math.floor(yZoom)
      if(xZoom < minX) minX = Math.floor(xZoom)
      if(maxX > 1e3 || maxY > 1e3) break;
      if(minX < 1e3 || minY < 1e3) break;
  	}
    console.log('maxX', maxX)
    console.log('maxY', maxY)
    gd.createTrueColor(maxX+ Math.abs(minX) + 100, maxY+ Math.abs(minY) + 100, function(error, image) {
      if(maxX > 1e4 || maxY > 1e4) return
      if (error) {
        console.log(error)
        throw error;
      }
    //  for (let i = 0; i < histoedData.length; i ++) {
    //    const iters = temps[i]
    //    const temp = histoedData[i]
    //    let rgb = C_SCALE(temp).rgb()
    //    if (iters === MAX_ITERS) rgb = [0, 0, 0]
    //    const col = i % CANVAS_WIDTH
    //    const row = Math.floor(i / CANVAS_WIDTH)
    //
    //  }
      image.fill(0, 0, 0xffffff);
      for (let i = 0; i < points.length; i++) {
        image.setPixel(
          points[i][0] + Math.abs(minX) + 50,
          points[i][1] + Math.abs(minY) + 50,
          gd.trueColor(50,50,50)
        )
      }
      image.savePng(`./images/${fileName}.png`, 0, function(error) {
        if (error) throw error;
        image.destroy();
        resolve()
      })
   });
  })
}

// for (let i = 0; i < 100; i++) {
//   const [fileName, letterArray] = randLetterArray()
//   makeImage(letterArray, fileName)
// }

makeImage([-0.8, -0.1, 0.7, -0.7, 0.1, -0.6, 1.2, -0.5, -1.1, 0.7, 0.7, -0.3], 'a')

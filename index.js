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
const listFiles = require('list-files')
const Chance = require('chance')
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

// PALETTE A
const limegreen2 = '#DAF7A6'
const gold2 = '#FFC300'
const orange2 = '#FF5733'
const red2 = '#C70039'
const burntRed2 = '#900C3F'
const darkRed = '#581845'

//const colors = [deepBlue,gold,burntOrange,gold,deepBlue]
//const C_SCALE = chroma.scale('Spectral').domain([1,0])
//const C_SCALE = chroma.bezier(colors);
//const C_SCALE = chroma.scale(colors.reverse())
//const colors = [yellowOrange,deepOcean]
const colors = [limegreen2, gold2, orange2, red2, burntRed2, darkRed]
const C_SCALE = chroma.scale(colors)

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

const A =-1.2
const B =-1.1
const C =-1.0
const D =-0.9
const E =-0.8
const F =-0.7
const G =-0.6
const H =-0.5
const I =-0.4
const J =-0.3
const K =-0.2
const L =-0.1
const M = 0.0
const N = 0.1
const O = 0.2
const P = 0.3
const Q = 0.4
const R = 0.5
const S = 0.6
const T = 0.7
const U = 0.8
const V = 0.9
const W = 1.0
const X = 1.1
const Y = 1.2

const PI = Math.PI

process.on('unhandledRejection', error => {
  // Will print "unhandledRejection err is not defined"
  console.log('unhandledRejection', error);
});

function getLetterArrays () {
  return new Promise((resolve, reject) => {
    listFiles(list => {
      try {
        const files = list.map(i => {
          const parts = i.split('/')
          const filename = parts[parts.length -1]
          const letterString = filename.split('.')[0]
          return letterString.split('')
        })
        resolve(files)
      } catch (e) {
        reject(e)
      }
    }, {dir:'./inputs', name:'png'})
  })
}

function lettersToNumbers(l) {
  const numbers = l.map(i => LETTER_MAP.get(i))
  const name = l.join('')
  return [numbers, name]
}

function angles (x1,y1,x2,y2) {
  const a2b = (360 - Math.atan2(y2 - y1, x2 - x1) * 180 / PI) % 360
  const b2a = (a2b + 180) % 360
  return [Math.floor(a2b),Math.floor(b2a)]
}

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

function quibicBezier (x0,y0,x1,y1,x2,y2) {
  let p = []
  for(let t = 0; t<=1; t+=0.02) {
    let mt = 1 - t
    let x = (mt * ((mt * x0) + (t*x1))) + (t * ((mt * x1) + (t*x2)))
    let y = (mt * ((mt * y0) + (t*y1))) + (t * ((mt * y1) + (t*y2)))
    p.push([Math.floor(x),Math.floor(y)])
  }
  return p
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

async function makeImage(letterArray, fileName, idx) {
  console.log(fileName)
  let x = 0.01
  let y = 0.01
  let maxX = 1
  let maxY = 1
  let minX = 1
  let minY = 1
  const ZOOM = 300
  let MAX_RADIUS = 0
  let points = []
	for ( i = 0; i < 10 * 1000; i ++ ) {
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
    if(maxX > 1e5 || maxY > 1e5) {
      return
    }
    if(minX < -1e5 || minY < -1e5) {
      return
    }
	}

  const WIDTH_X = Math.floor(maxX+ Math.abs(minX) + 100)
  const HEIGHT_Y = Math.floor(maxY+ Math.abs(minY) + 100)
  //console.log(WIDTH_X, HEIGHT_Y)
  let image = await createImage(gd, WIDTH_X, HEIGHT_Y)
  // if(maxX > 1e4 || maxY > 1e4) resolve()
  // if(maxX < 2e2 || maxY < 2e2) resolve()
  // if(points.length < 200) resolve()
  image.alphaBlending(1)
  image.saveAlpha(1)
  const MAX_DISTANCE_SQUARED = WIDTH_X * WIDTH_X + HEIGHT_Y * HEIGHT_Y

  let antiColor = gd.trueColorAlpha(255,255,255,10)
  //let color = gd.trueColorAlpha(0,0,0,10)
  let color = gd.trueColorAlpha(255,255,255,10)
  image.setAntiAliased(antiColor)

  //image.fill(0, 0, 0xffffff);
  image.fill(0, 0, 0x000000);
  const length = points.length
  let distance = 0
  for (let i = 1; i < length; i+=1) {
    const a = points[i-1][0]
    const b = points[i][0]
    distance += Math.abs(b-a)
    const x0 = points[i-1][0] + Math.abs(minX) + 50
    const y0 = points[i-1][1] + Math.abs(minY) + 50
    // const x0 = points[i-2][0] + Math.abs(minX) + 50
    // const y0 = points[i-2][1] + Math.abs(minY) + 50
    const x1 = points[i-0][0] + Math.abs(minX) + 50
    const y1 = points[i-0][1] + Math.abs(minY) + 50
    // const x2 = points[i][0] + Math.abs(minX) + 50
    // const y2 = points[i][1] + Math.abs(minY) + 50
    const width = x1 - x0
    const height = y1 - y0
    // const cx = x0 + Math.floor(width / 2)
    // const cy = y0 + Math.floor(height / 2)
    const B_A = [width, height]
    let B_A_MAG_SQUARED = Math.floor(B_A[0] * B_A[0] + B_A[1] * B_A[1])
    if(B_A_MAG_SQUARED > MAX_DISTANCE_SQUARED) B_A_MAG_SQUARED = MAX_DISTANCE_SQUARED
    //const [startAngle, endAngle] = angles(x1,y1,x2,y2)
    //let radius = Math.abs(width)
    //let rgb = C_SCALE(B_A_MAG_SQUARED/MAX_DISTANCE_SQUARED).rgb()
    //color = gd.trueColorAlpha(rgb[0],rgb[1],rgb[2],1)
    //image.line(x0,y0,x1,y1,color)
    image.setPixel(x0,y0,color)
    //image.arc(cx, cy, width, height, 0, 360, color)
  }
  // ARCS
  // let Qpoints = quibicBezier(x0,y0,x1,y1,x2,y2)
  // for(let j = 1; j < Qpoints.length; j += 1) {
  //   const jx1 = Qpoints[j-1][0]
  //   const jy1 = Qpoints[j-1][1]
  //   const jx2 = Qpoints[j][0]
  //   const jy2 = Qpoints[j][1]
  //   image.line(jx1,jy1,jx2,jy2,color)
  // }
  // if(distance < 1e4) {
  //   image.destroy();
  //   resolve()
  //   return
  // }
  //image.gaussianBlur()
  //console.log('#', idx, distance)
  await savePng(image, `./images/${fileName}.png`)
}

function createImage (ctx, width, height) {
  return new Promise((resolve, reject) => {
    ctx.createTrueColor(width, height, function(error, image) {
        if(error) reject(error)
        resolve(image)
    })
  })
}
function savePng (ctx, filename) {
  return new Promise((resolve, reject) => {
    ctx.savePng(filename, 1, function(error) {
      if (error) throw error;
      ctx.destroy();
      resolve()
    })
  })
}

async function main () {
  try {
    const letters = await getLetterArrays()
    let counter = 1
    for(let i = 0; i < letters.length; i++) {
      const [numbers, name] = lettersToNumbers(letters[i])
      await makeImage(numbers, name, i)
    }
  } catch (e) {
    console.log(e)
  }
}

main()

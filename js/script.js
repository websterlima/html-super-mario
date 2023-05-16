const mario = document.querySelector('.mario')
const clouds = document.querySelector('.clouds')
const pipes = []
const pipesTimeouts = []

let points = 0

const jump = () => {
  if (mario.classList.contains('jump')) return

  mario.classList.add('jump')

  setTimeout(() => {
    mario.classList.remove('jump')
  }, 500);
}

const loopNewPipe = setInterval(() => {
  const canCreatePipe = Math.random() > 0.3

  if (canCreatePipe) {
    const newPipe = document.createElement('img')

    newPipe.src = './sprites/pipe.png'
    newPipe.classList.add('pipe')

    document.querySelector('.game-board').appendChild(newPipe)

    pipes.push(newPipe)

    const pipeTimeout = setTimeout(() => {
      points += 1
      document.querySelector('.points').innerHTML = `${points}`

      newPipe.remove()
      pipes.shift()
      pipesTimeouts.shift()
    }, 1500)

    pipesTimeouts.push(pipeTimeout)
  }
}, 750);

const isMarioCollided = (pipePosition, marioPosition) => {
  return pipePosition <= 120 && pipePosition > 0 && marioPosition < 80
}

const killMario = (marioPosition) => {
  mario.style.animation = 'none'
  mario.style.bottom = `${marioPosition}px`

  mario.src = './sprites/game-over.png'
  mario.style.width = '75px'
  mario.style.marginLeft = '50px'
}

const stopClouds = (cloudsPosition) => {
  clouds.style.animation = 'none'
  clouds.style.left = `${cloudsPosition}px`
}

const stopPipe = (pipe, pipePosition) => {
  pipe.style.animation = 'none'
  pipe.style.left = `${pipePosition}px`
}

const loop = setInterval(() => {
  const pipe = pipes[0]

  if (!pipe) return

  const cloudsPosition = clouds.offsetLeft

  const pipePosition = pipe.offsetLeft
  const marioPosition = +window.getComputedStyle(mario).bottom.replace('px', '')
  
  if (isMarioCollided(pipePosition, marioPosition)) {
    killMario(marioPosition)
    stopClouds(cloudsPosition)
  
    clearInterval(loop)
    clearInterval(loopNewPipe)

    for (let index = 0; index < pipes.length; index++) {
      const currentPipe = pipes[index];
      const currentPipePosition = currentPipe.offsetLeft 
      
      stopPipe(currentPipe, currentPipePosition)

      clearTimeout(pipesTimeouts[index])
    }
  }
}, 10);

document.addEventListener('keydown', jump)


function calcDailyRolls (level) {
  return level + 10
}

function calcStreakBonus (days) {
  return (
    (days % 7 === 0 ? 2 : 1) *
    (days % 14 === 0 ? 2.5 : 1) *
    (days % 28 === 0 ? 5 : 1)
  )
}

function oneRoll () {
  let number = Math.floor(Math.random() * 1000000)
  let roll = `00000${number}`.slice(-6)
  let dubs = 0
  for (let c = 5; c > 0; c--) {
    if (roll[c] === roll[c - 1]) dubs += 1
    else break
  }
  let reward = [1, 22, 333, 5555, 77777, 999999][dubs]
  return reward
}

function calcDabsFromRollsAverage (runs) {
  let total = 0
  for (let i = 0; i < runs; i++) {
    total += oneRoll()
  }
  let average = total / runs
  return average
}

function calcLevelCost (from, to) {
  let fSum = Math.floor((1/60) * from * (from + 1) * (2 * from + 1))
  let tSum = Math.floor((1/60) * to * (to + 1) * (2 * to + 1))
  return tSum - fSum
}

function calcMaxLevel (level, dabs) {
  let n = 1
  while (calcLevelCost(level, level + n) <= dabs) {
    n++
  }
  return n - 1
}

// let averageRoll = calcDabsFromRollsAverage(50000000)
// console.log('Average dabs from one roll:', averageRoll)

function simulateLevels (days) {
  let dabs = 0
  let level = 0
  for (let i = 0; i < days; i++) {
    let rolls = calcDailyRolls(level)
    let bonus = calcStreakBonus(i)
    for (let j = 0; j < rolls; j++) {
      dabs += oneRoll() * bonus
    }
    let max = calcMaxLevel(level, dabs)
    let cost = calcLevelCost(level, level + max)
    dabs -= cost
    level += max
  }
  return level
}

function simulateDabs (days, level) {
  let dabs = 0
  for (let i = 0; i < days; i++) {
    let rolls = calcDailyRolls(level)
    let bonus = calcStreakBonus(i)
    for (let j = 0; j < rolls; j++) {
      dabs += oneRoll() * bonus
    }
  }
  return dabs
}

function simulateAverage (days, runs) {
  let levelTotal = 0
  for (let i = 0; i < runs; i++) {
    levelTotal += simulateLevels(days)
  }
  let levelAverage = levelTotal / runs
  let dabTotal = 0
  for (let i = 0; i < runs; i++) {
    dabTotal += simulateDabs(7, Math.floor(levelAverage))
  }
  let dabAverage = dabTotal / runs
  console.log(`Average level after ${days} days of rolling: ${levelAverage}`)
  console.log(`Average dabs after 7 days of rolls at this level: ${dabAverage}`)
}

for (let days of [6, 7, 8, 9, 10, 20, 30, 40, 50, 60]) {
  simulateAverage(days, 1000)
}
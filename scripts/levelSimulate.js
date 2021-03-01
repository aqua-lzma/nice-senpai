function calcDailyRolls (level) {
  return level + 10
}

function calcStreakBonus (days) {
  return ((
    (days % 7 === 0 ? 2 : 1) *
    (days % 14 === 0 ? 2.5 : 1) *
    (days % 28 === 0 ? 5 : 1)
  ) + (
    days > 28 ? (days - 28) / 10 : 0
  ))
}

function oneRoll () {
  const number = Math.floor(Math.random() * 1000000)
  const roll = `00000${number}`.slice(-6)
  let dubs = 0
  for (let c = 5; c > 0; c--) {
    if (roll[c] === roll[c - 1]) dubs += 1
    else break
  }
  const reward = [1, 22, 333, 5555, 77777, 999999][dubs]
  return reward
}

function calcDabsFromRollsAverage (runs) {
  let total = 0
  for (let i = 0; i < runs; i++) {
    total += oneRoll()
  }
  const average = total / runs
  return average
}

function calcLevelCost (from, to) {
  const fSum = Math.floor((1 / 60) * from * (from + 1) * (2 * from + 1))
  const tSum = Math.floor((1 / 60) * to * (to + 1) * (2 * to + 1))
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
    const rolls = calcDailyRolls(level)
    const bonus = calcStreakBonus(i)
    for (let j = 0; j < rolls; j++) {
      dabs += oneRoll() * bonus
    }
    const max = calcMaxLevel(level, dabs)
    const cost = calcLevelCost(level, level + max)
    dabs -= cost
    level += max
  }
  return level
}

function simulateDabs (days, level) {
  let dabs = 0
  for (let i = 0; i < days; i++) {
    const rolls = calcDailyRolls(level)
    const bonus = calcStreakBonus(i)
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
  const levelAverage = levelTotal / runs
  let dabTotal = 0
  for (let i = 0; i < runs; i++) {
    dabTotal += simulateDabs(7, Math.floor(levelAverage))
  }
  const dabAverage = dabTotal / runs
  console.log(`Average level after ${days} days of rolling: ${levelAverage}`)
  console.log(`Average dabs after 7 days of rolls at this level: ${dabAverage}`)
}

calcDabsFromRollsAverage(10000)
for (const days of [6, 7, 8, 9, 10, 20, 30, 40, 50, 60]) {
  simulateAverage(days, 1000)
}

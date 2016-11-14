/** Devides the stage width over the number of years */
function calculateTimelineYearWidthNoPadding(stageWidth, numberOfYears){
  return stageWidth/numberOfYears
}

/**Given the width of a single year this function will return what mode the timeline should be in, months or quarters */
function findTimelineMode(yearWidth){
  let mode
  if(yearWidth < 400){
    mode = "Quarters"
  }
  else{
    mode = "Months"
  }
  return mode
}
/**based on the timeline mode and width of the year blocks it will return the padding amount*/
function calculateTimelinePadding(yearWidth, mode){
  let divider = mode === "Quarters" ? 40 : 100
  return yearWidth / divider
}

function calculateIndicatorWidth(numberOfIndicators, padding, yearWidth){
  return (yearWidth + padding) / numberOfIndicators - padding
}

function calculateYearWidthModePadding(stageWidth, numberOfYears){
  let yearWidthNoPadding = calculateTimelineYearWidthNoPadding(stageWidth, numberOfYears);
  let mode = findTimelineMode(yearWidthNoPadding)
  let padding = calculateTimelinePadding(yearWidthNoPadding, mode)
  let totalPadding = padding * (numberOfYears-1)
  let yearWidth = yearWidthNoPadding - (totalPadding / numberOfYears)
  return ({yearWidth, mode, padding})
}

function yearsBetween(start, end){
  let startYear = start.getFullYear()
  let endYear = end.getFullYear()
  return(endYear - startYear)
}

function dateToQuarter(date){
  let month = date.getMonth() + 1
  let quarterPreCeil = month / 3
  let quarter = Math.ceil(quarterPreCeil)
  return (quarter);
}

function indicatorWidthFromMode(mode,padding,yearWidth){
  let indicatorWidth;
  switch (mode) {
    case "Months":
      indicatorWidth = calculateIndicatorWidth(12, padding, yearWidth)
      break;
    case "Quarters":
      indicatorWidth = calculateIndicatorWidth(4, padding, yearWidth)
      break;
    default:
      console.error(`Incorrect mode: ${mode} not defined`)
  }
  return indicatorWidth
}

function amountOfYearsFromTimelineStartYear(date, timelineStartYear){
  let year = date.getFullYear()
  return(year - timelineStartYear)
}

function numberOfMonthsChanged(date1,date2){
  let month1 = date1.getMonth()
  let month2 = date2.getMonth()
  return month1 - month2
}

function numberOfYearsChanged(date1,date2){
  let year1 = date1.getFullYear()
  let year2 = date2.getFullYear()
  return year1 - year2
}

export function unitsBetween(startDate, endDate, mode){
  let years = yearsBetween(startDate, endDate)
  let startOffset
  let totalTimeUnits
  switch (mode) {
    case "Months":
      startOffset = startDate.getMonth()
      totalTimeUnits = (years * 12) - startOffset
      totalTimeUnits += endDate.getMonth() + 1
      break;
    case "Quarters":
      startOffset = dateToQuarter(startDate) - 1
      totalTimeUnits = (years * 4) - startOffset
      totalTimeUnits += dateToQuarter(endDate)
      break;
    default:
      console.error(`Incorrect mode: ${mode} not defined`)
  }
  return totalTimeUnits
}

function findXFromStartDate({startDate, stageWidth, numberOfYears, timelineStartYear}){
  let {yearWidth, mode, padding} = calculateYearWidthModePadding(stageWidth, numberOfYears)
  let yearsFromStartYear = amountOfYearsFromTimelineStartYear(startDate, timelineStartYear)
  let yearOffset = (yearWidth * yearsFromStartYear) + (padding * yearsFromStartYear)
  let indicatorWidth = indicatorWidthFromMode(mode,padding,yearWidth)
  let time = mode === 'Months' ? startDate.getMonth() : dateToQuarter(startDate) - 1
  let indicatorOffset = (indicatorWidth * time) + (padding * time)
  let x = yearOffset + indicatorOffset
  return x;
}

function findNumberClosestInidactorForYear(x, stageWidth, numberOfYears){
  let {yearWidth, mode, padding} = calculateYearWidthModePadding(stageWidth, numberOfYears)
  let indicatorWidth = indicatorWidthFromMode(mode,padding,yearWidth)    
  let numberOfYearsFromStart = Math.floor(x / yearWidth)
  let yearOffset = (yearWidth + padding) * numberOfYearsFromStart
  let indicatorPosition = x - yearOffset
  return(Math.floor(indicatorPosition / (indicatorWidth + padding)))
}

function calculateWidth({startDate, endDate, stageWidth, numberOfYears}){
  let {yearWidth, mode, padding} = calculateYearWidthModePadding(stageWidth, numberOfYears)
  let timeUnits = unitsBetween(startDate, endDate, mode)
  let indicatorWidth = indicatorWidthFromMode(mode,padding,yearWidth)
  let monthPadding = padding * timeUnits - padding
  let width = (indicatorWidth * timeUnits) + (monthPadding)
  return width
}

function calculateWidthAndX({startDate, endDate, stageWidth, numberOfYears, timelineStartYear}){
  let x = findXFromStartDate({startDate, stageWidth, numberOfYears, timelineStartYear})
  let width = calculateWidth({startDate, endDate, stageWidth, numberOfYears})
  return {x, width}
}

function calculateMonthOffset(startingMonthOfQuarter, date){
  let month = date.getMonth()
  let monthOffset = month - startingMonthOfQuarter
  return monthOffset
}

function calculateQuarterStartingMonth(quarter){
  return ((quarter * 3)-3)
}

function findDateFromPosition({x, timelineStartYear, oldDate, stageWidth, numberOfYears}){
  let {yearWidth, mode} = calculateYearWidthModePadding(stageWidth, numberOfYears)
  let closestIndicator = findNumberClosestInidactorForYear(x, stageWidth, numberOfYears)
  let numberOfYearsFromStart = Math.floor(x / yearWidth)
  let year = timelineStartYear + numberOfYearsFromStart
  if(mode === "Months"){
    let month = closestIndicator
    return (new Date(year, month))
  }
  let oldQuarter = dateToQuarter(oldDate)    
  let startingMonthOfOldQuarter = calculateQuarterStartingMonth(oldQuarter)
  let monthOffset = calculateMonthOffset(startingMonthOfOldQuarter,oldDate)
  let startingMonthOfNewQuarter =  calculateQuarterStartingMonth(closestIndicator+1)
  return (new Date(year, startingMonthOfNewQuarter + monthOffset))
}

function relativePosition(pos, myPos){
  return {x: pos.x - myPos.x, y: pos.y - myPos.y}
}

function calculateNewDisplayState(evt,oldState){
  const minWidth = 30
  let newState = {}
  let relPos = relativePosition({x: evt.x, y: evt.y}, {x:oldState.x, y:oldState.y})
  switch (oldState.scaleDirection) {
    case 'right':
      newState.width = evt.x - oldState.x
      break;
    case 'left':{
      newState.width = oldState.width + (relPos.x * -1)
      //draggable doesn't seem update position when we change width, poos :(
      newState.x = oldState.x + relPos.x
      break;
    }
    default:{
      let offset = evt.x - oldState.offsetX - oldState.x
      newState.x = oldState.x + offset
    }
  }
  return newState
}

function getNewDateState({width, x, oldState, timelineStartYear, stageWidth, numberOfYears}){
  let newState = {}
  let scaleDirection =  oldState.scaleDirection
  let endDate = oldState.endDate
  let startDate = oldState.startDate
  switch (scaleDirection) {
    case 'right':
      endDate = findDateFromPosition({x: x + width, timelineStartYear, oldDate: endDate, stageWidth, numberOfYears})
      break; 
    case 'left':
      startDate = findDateFromPosition({x, timelineStartYear, oldDate:startDate, stageWidth, numberOfYears})
      break;
    default:{
      startDate = findDateFromPosition({x, timelineStartYear, oldDate:startDate, stageWidth, numberOfYears})
      let monthChange = numberOfMonthsChanged(startDate, oldState.startDate)
      let yearChange = numberOfYearsChanged(startDate, oldState.startDate)
      let oldEndMonth = endDate.getMonth()
      let oldEndYear = endDate.getFullYear()
      endDate = new Date(oldEndYear+yearChange,oldEndMonth+monthChange)
    }
  }
  if(startDate !== oldState.startDate){
    newState.startDate = startDate
  }
  if(endDate !== oldState.endDate){
    newState.endDate = endDate
  }
  return newState
}

export {
  calculateYearWidthModePadding,
  calculateTimelineYearWidthNoPadding,
  findTimelineMode,
  calculateTimelinePadding,
  yearsBetween,
  dateToQuarter,
  calculateIndicatorWidth,
  indicatorWidthFromMode,
  numberOfMonthsChanged,
  numberOfYearsChanged,
  amountOfYearsFromTimelineStartYear,
  findXFromStartDate,
  calculateWidth,
  findNumberClosestInidactorForYear,
  calculateWidthAndX,
  calculateMonthOffset,
  calculateQuarterStartingMonth,
  findDateFromPosition,
  relativePosition,
  calculateNewDisplayState,
  getNewDateState
}